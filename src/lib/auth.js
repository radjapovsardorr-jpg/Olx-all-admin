// Oddiy front-end autentifikatsiya (demo uchun).
// Haqiqiy loyihada bu qismni backend (JWT / httpOnly cookie) bilan almashtiring.

const USERS_KEY = 'olx_neo_users';
const SESSION_KEY = 'olx_neo_session';
const SAVED_KEY = 'olx_neo_saved'; // "Eslab qolish" bilan saqlangan hisoblar (demo)
const NAMES_KEY = 'olx_neo_names'; // profilda o'zgartirilgan ismlar { email: ism }
const AUTH_EVENT = 'olx-auth-change';

// Tayyor demo admin hisobi
export const DEMO_ADMIN = {
  name: 'Super Admin',
  email: 'admin@olxneo.uz',
  password: 'admin123',
};

const isBrowser = () => typeof window !== 'undefined';

async function hashText(text) {
  try {
    if (globalThis.crypto?.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch (_) {}
  return `plain:${text}`; // http (localhost bo'lmagan) muhitda zaxira
}

function readJson(key, fallback) {
  if (!isBrowser()) return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_) {
    return fallback;
  }
}

const readUsers = () => readJson(USERS_KEY, []);
const readSaved = () => readJson(SAVED_KEY, []);
const readNames = () => readJson(NAMES_KEY, {});

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Profilda o'zgartirilgan ism bo'lsa o'shani, bo'lmasa asl ismni qaytaradi
function nameFor(email, fallback) {
  return readNames()[email] || fallback;
}

function notify() {
  if (isBrowser()) window.dispatchEvent(new Event(AUTH_EVENT));
}

/* ---------- Saqlangan hisoblar (email + parol) ---------- */

function saveCredentials({ name, email, password }) {
  const list = readSaved().filter((s) => s.email !== email);
  list.unshift({ name, email, password });
  localStorage.setItem(SAVED_KEY, JSON.stringify(list.slice(0, 5)));
}

export function forgetCredentials(email) {
  if (!isBrowser()) return;
  const list = readSaved().filter((s) => s.email !== email.trim().toLowerCase());
  localStorage.setItem(SAVED_KEY, JSON.stringify(list));
}

// Login sahifasidagi ro'yxat uchun: avval parol saqlanganlar, keyin qolganlar
export function getKnownAccounts() {
  const saved = readSaved().map((s) => ({
    name: nameFor(s.email, s.name),
    email: s.email,
    password: s.password,
  }));
  const savedEmails = new Set(saved.map((s) => s.email));

  const others = [
    { name: nameFor(DEMO_ADMIN.email, DEMO_ADMIN.name), email: DEMO_ADMIN.email },
    ...readUsers().map((u) => ({ name: nameFor(u.email, u.name), email: u.email })),
  ].filter((a) => !savedEmails.has(a.email));

  return [...saved, ...others];
}

/* ---------- Sessiya ---------- */

function saveSession(user, remember) {
  const payload = JSON.stringify({ name: user.name, email: user.email, at: Date.now() });
  // Eslab qolish yoqilgan bo'lsa localStorage, bo'lmasa brauzer yopilguncha sessionStorage
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, payload);
  notify();
}

export function getSession() {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function isAuthed() {
  return !!getSession();
}

export function logout() {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  notify();
}

/* ---------- Profilni yangilash ---------- */

// Ismni sessiyada, hisobda va saqlangan hisoblarda birdan yangilaydi
export function updateProfile({ name }) {
  if (!isBrowser()) return null;
  const session = getSession();
  if (!session) return null;

  const clean = String(name || '').trim();
  if (clean.length < 2) {
    throw new Error("Ism kamida 2 ta belgidan iborat bo'lishi kerak.");
  }

  const email = session.email;

  // 1) ism xaritasi (demo admin ham shu orqali o'zgaradi)
  localStorage.setItem(NAMES_KEY, JSON.stringify({ ...readNames(), [email]: clean }));

  // 2) ro'yxatdan o'tgan foydalanuvchilar
  writeUsers(readUsers().map((u) => (u.email === email ? { ...u, name: clean } : u)));

  // 3) saqlangan hisoblar
  localStorage.setItem(
    SAVED_KEY,
    JSON.stringify(readSaved().map((s) => (s.email === email ? { ...s, name: clean } : s)))
  );

  // 4) joriy sessiya (qaysi storage'da bo'lsa o'sha yerda)
  const updated = JSON.stringify({ ...session, name: clean });
  if (localStorage.getItem(SESSION_KEY)) localStorage.setItem(SESSION_KEY, updated);
  else sessionStorage.setItem(SESSION_KEY, updated);

  notify();
  return { ...session, name: clean };
}

/* ---------- Hisob ochish va kirish ---------- */

export async function registerUser({ name, email, password, remember = true }) {
  const mail = email.trim().toLowerCase();
  const users = readUsers();

  if (mail === DEMO_ADMIN.email || users.some((u) => u.email === mail)) {
    throw new Error("Bu email bilan hisob allaqachon ochilgan. Kirish bo'limidan foydalaning.");
  }

  const user = { name: name.trim(), email: mail, passwordHash: await hashText(password) };
  writeUsers([...users, user]);

  if (remember) saveCredentials({ name: user.name, email: mail, password });
  saveSession(user, remember);
  return user;
}

export async function loginUser({ email, password, remember = true }) {
  const mail = email.trim().toLowerCase();

  // 1) Tayyor demo admin ("admin" yoki to'liq email)
  if ((mail === DEMO_ADMIN.email || mail === 'admin') && password === DEMO_ADMIN.password) {
    const admin = { ...DEMO_ADMIN, name: nameFor(DEMO_ADMIN.email, DEMO_ADMIN.name) };
    if (remember) {
      saveCredentials({ name: admin.name, email: admin.email, password });
    } else {
      forgetCredentials(admin.email);
    }
    saveSession(admin, remember);
    return admin;
  }

  // 2) Ro'yxatdan o'tgan foydalanuvchilar
  const found = readUsers().find((u) => u.email === mail);
  if (!found) {
    throw new Error('Bunday hisob topilmadi. Avval hisob oching.');
  }
  if (found.passwordHash !== (await hashText(password))) {
    throw new Error("Parol noto'g'ri. Qaytadan urinib ko'ring.");
  }

  const user = { ...found, name: nameFor(found.email, found.name) };
  if (remember) {
    saveCredentials({ name: user.name, email: user.email, password });
  } else {
    forgetCredentials(user.email);
  }
  saveSession(user, remember);
  return user;
}

export const AUTH_CHANGE_EVENT = AUTH_EVENT;