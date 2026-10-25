'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import {
  User,
  Shield,
  Phone,
  Mail,
  MapPin,
  Laptop,
  Smartphone,
  Key,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  Camera,
  LogOut,
  Save,
  Trash2,
  ShieldCheck,
  Activity,
  Monitor,
  Upload,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { logout, updateProfile } from '@/lib/auth';
import { getInitials, useAuthUser } from '@/lib/useAuthUser';

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const BTN =
  'inline-flex items-center justify-center gap-2 font-extrabold text-xs rounded-xl border-2 transition-all duration-150 ' +
  'focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00DF81]/40 disabled:opacity-40 disabled:pointer-events-none active:translate-y-[1px]';
const BTN_PRIMARY = `${BTN} px-6 py-2.5 bg-[#00e396] border-[#00c984] text-[#05372d] shadow-[0_6px_16px_-4px_rgba(0,223,129,0.6)] hover:bg-[#00f0a0]`;
const BTN_AMBER = `${BTN} px-6 py-2.5 bg-[#f5b324] border-[#d99a12] text-[#07241d] shadow-[0_6px_16px_-4px_rgba(245,179,36,0.6)] hover:bg-[#ffbf33]`;
const BTN_OUTLINE = `${BTN} px-4 py-2.5 bg-white border-slate-200 text-slate-700 hover:border-[#00DF81] hover:bg-[#f2fdf7] hover:text-[#05372d]`;
const BTN_DANGER = `${BTN} px-4 py-2.5 bg-white border-red-200 text-red-600 hover:border-red-500 hover:bg-red-50`;
const CARD = 'bg-white rounded-3xl border-2 border-slate-200 shadow-[0_8px_24px_-12px_rgba(5,55,45,0.18)]';
const INPUT =
  'w-full pl-10 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 ' +
  'focus:outline-none focus:bg-white focus:border-[#00DF81] focus:ring-4 focus:ring-[#00DF81]/25 transition-all';

const TABS = [
  { key: 'profil', label: 'Profil', Icon: User },
  { key: 'xavfsizlik', label: 'Xavfsizlik', Icon: Shield },
  { key: 'faollik', label: 'Faollik', Icon: Activity },
];

const INITIAL_DEVICES = [
  { id: 1, name: 'MacBook Pro (M2)', place: 'Toshkent', ip: '178.218.201.55', last: 'Hozirda faol', current: true, type: 'laptop' },
  { id: 2, name: 'iPhone 15 Pro', place: 'Safari', ip: '85.113.40.12', last: '3 soat oldin', current: false, type: 'phone' },
  { id: 3, name: 'Windows PC', place: 'Chrome, Samarqand', ip: '91.204.17.9', last: 'Kecha, 22:10', current: false, type: 'pc' },
];

const ACTIVITY = [
  { id: 1, text: "Yangi e'lon tasdiqlandi (#1087)", time: 'Bugun, 14:32', tone: 'bg-emerald-500' },
  { id: 2, text: 'Foydalanuvchi bloklandi (Timur S.)', time: 'Bugun, 11:05', tone: 'bg-red-500' },
  { id: 3, text: 'Kategoriyalar tartibi yangilandi', time: 'Kecha, 18:40', tone: 'bg-cyan-500' },
  { id: 4, text: "Parol oxirgi marta o'zgartirildi", time: '12 kun oldin', tone: 'bg-amber-500' },
  { id: 5, text: 'Tizimga yangi qurilmadan kirildi', time: '3 kun oldin', tone: 'bg-slate-400' },
];

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function Field({ label, Icon, type = 'text', value, onChange, placeholder, readOnly = false, hint }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-600 mb-1.5">{label}</span>
      <span className="relative block">
        <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`${INPUT} ${readOnly ? '!bg-slate-100 !text-slate-500 cursor-not-allowed' : ''}`}
        />
      </span>
      {hint && <span className="block text-[11px] text-slate-400 mt-1.5">{hint}</span>}
    </label>
  );
}

function PasswordField({ label, Icon, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-600 mb-1.5">{label}</span>
      <span className="relative block">
        <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${INPUT} pr-11 ${error ? '!border-red-400 focus:!ring-red-200' : ''}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Yashirish' : "Ko'rsatish"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </span>
    </label>
  );
}

function SectionHead({ Icon, tone, title, desc, right }) {
  return (
    <div className="flex items-center justify-between gap-3 pb-4 border-b-2 border-slate-100">
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center ${tone}`}>
          <Icon className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-sm font-black text-slate-900">{title}</h3>
          <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
        </div>
      </div>
      {right}
    </div>
  );
}

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full border-2 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00DF81]/40 ${
        checked ? 'bg-[#00e396] border-[#00c984]' : 'bg-slate-100 border-slate-300'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white border-2 transition-all ${
          checked ? 'left-[22px] border-[#00c984]' : 'left-0.5 border-slate-300'
        }`}
      />
    </button>
  );
}

function Avatar({ src, initials, size = 'w-28 h-28', text = 'text-3xl' }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Profil rasmi" className={`${size} rounded-full object-cover border-4 border-white ring-4 ring-[#00DF81]/50 shadow-xl`} />
  ) : (
    <div
      className={`${size} rounded-full border-4 border-white ring-4 ring-[#00DF81]/50 bg-[#d9fbe9] text-[#05372d] ${text} font-black flex items-center justify-center shadow-xl`}
    >
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ProfilPage() {
  const router = useRouter();
  const { adminUser, setAdminUser, showToast } = useApp();
  const user = useAuthUser(); // kirgan hisob: { name, email }
  const fileRef = useRef(null);

  const [tab, setTab] = useState('profil');
  const [avatarUrl, setAvatarUrl] = useState(adminUser?.avatarImage || '');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState(adminUser?.phone || '+998 90 123 45 67');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [twoFA, setTwoFA] = useState(true);
  const [notifyLogin, setNotifyLogin] = useState(true);
  const [devices, setDevices] = useState(INITIAL_DEVICES);

  /* Kirgan hisobdagi ism kelganda (yoki o'zgarganda) maydonlarni to'ldiradi */
  useEffect(() => {
    if (!user?.name) return;
    const parts = user.name.trim().split(/\s+/);
    setFirstName(parts[0] || '');
    setLastName(parts.slice(1).join(' '));
  }, [user?.name]);

  /* revoke object URL when replaced / unmounted */
  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith('blob:')) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  /* ---------- password rules ---------- */
  const rules = useMemo(
    () => [
      { ok: newPassword.length >= 8, text: 'Kamida 8 ta belgi' },
      { ok: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword), text: 'Katta va kichik harflar' },
      { ok: /\d/.test(newPassword), text: 'Kamida bitta raqam' },
      { ok: /[^A-Za-z0-9]/.test(newPassword), text: 'Maxsus belgi (!, @, #...)' },
    ],
    [newPassword]
  );
  const score = rules.filter((r) => r.ok).length;
  const strength = [
    { label: 'Parol kiritilmagan', color: 'text-slate-400', bar: 'bg-slate-200' },
    { label: 'Juda zaif', color: 'text-red-600', bar: 'bg-red-500' },
    { label: 'Zaif', color: 'text-orange-600', bar: 'bg-orange-500' },
    { label: "O'rtacha", color: 'text-amber-600', bar: 'bg-amber-500' },
    { label: 'Kuchli parol', color: 'text-emerald-600', bar: 'bg-emerald-500' },
  ][newPassword ? Math.max(score, 1) : 0];
  const mismatch = confirmPassword && newPassword !== confirmPassword;

  /* ---------- handlers ---------- */
  const handlePickPhoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Faqat rasm fayli yuklash mumkin (JPG, PNG, WEBP)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Rasm hajmi 5 MB dan oshmasligi kerak', 'error');
      return;
    }
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    setAdminUser((prev) => ({ ...prev, avatarImage: url }));
    showToast('Profil rasmi yangilandi!', 'success');
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    setAdminUser((prev) => ({ ...prev, avatarImage: '' }));
    showToast("Profil rasmi o'chirildi");
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      showToast('Ism va familiyani kiriting', 'error');
      return;
    }
    const name = `${firstName.trim()} ${lastName.trim()}`;
    try {
      // Hisobga saqlaydi: sessiya, hisob va saqlangan hisoblar ro'yxati
      updateProfile({ name });
      // Sidebar va boshqa joylar uchun umumiy holat
      setAdminUser((prev) => ({ ...prev, name, avatar: getInitials(name), phone }));
      showToast("Shaxsiy ma'lumotlar muvaffaqiyatli yangilandi!", 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) return showToast('Joriy parolni kiriting', 'error');
    if (score < 4) return showToast('Yangi parol barcha talablarga javob bermaydi', 'error');
    if (newPassword !== confirmPassword) return showToast('Yangi parollar mos kelmadi!', 'error');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Parol muvaffaqiyatli yangilandi!', 'success');
  };

  const handleLogout = () => {
    logout();
    showToast('Hisobdan chiqdingiz');
    router.replace('/login');
  };

  const endSession = (id) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    showToast('Qurilma seansi tugatildi');
  };

  const endOtherSessions = () => {
    setDevices((prev) => prev.filter((d) => d.current));
    showToast('Boshqa barcha seanslar tugatildi');
  };

  const DeviceIcon = ({ type }) =>
    type === 'phone' ? <Smartphone className="w-5 h-5" /> : type === 'pc' ? <Monitor className="w-5 h-5" /> : <Laptop className="w-5 h-5" />;

  const fullName = user?.name || '';
  const email = user?.email || '';
  const initials = user ? getInitials(user.name) : '..';

  /* ---------- render ---------- */
  return (
    <div className="flex-1 flex flex-col bg-[#f3f7f5] min-h-screen">
      <Header />

      <main className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* ---------- Hero ---------- */}
        <section className={`${CARD} overflow-hidden`}>
          <div className="h-32 sm:h-36 bg-[#d9fbe9] relative">
            <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(#00DF81 1.2px, transparent 1.2px)', backgroundSize: '18px 18px' }} />
            <span className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-white border-2 border-[#bff3d9] text-[#05372d] text-xs font-extrabold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00DF81]" />
              Super Admin &bull; Barcha huquqlar faol
            </span>
          </div>

          <div className="px-6 sm:px-8 pb-6 -mt-14 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative w-fit">
                <Avatar src={avatarUrl} initials={initials} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2.5 bg-[#00e396] text-[#05372d] rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00DF81]/50"
                  aria-label="Rasmni o'zgartirish"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePickPhoto} className="hidden" />
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {fullName || adminUser?.name || 'Foydalanuvchi'}
                  </h1>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-mono font-bold">ID: #ADM-0091</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {adminUser?.roleBadge || 'Super Administrator'} &bull; {adminUser?.region || 'Toshkent'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => fileRef.current?.click()} className={BTN_OUTLINE}>
                <Upload className="w-4 h-4" />
                Rasm yuklash
              </button>
              {avatarUrl && (
                <button onClick={handleRemovePhoto} className={BTN_DANGER}>
                  <Trash2 className="w-4 h-4" />
                  O&apos;chirish
                </button>
              )}
              <button onClick={handleLogout} className={BTN_DANGER}>
                <LogOut className="w-4 h-4" />
                Chiqish
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t-2 border-slate-100">
            {[
              { label: 'Tizimga kirishlar', value: '1,420' },
              { label: 'Oxirgi faollik', value: 'Bugun, 14:32' },
              { label: '2FA holati', value: twoFA ? 'Yoqilgan' : "O'chirilgan" },
              { label: "Profil to'liqligi", value: avatarUrl ? '100%' : '94%' },
            ].map((s, i) => (
              <div key={s.label} className={`px-6 py-4 ${i > 0 ? 'md:border-l-2 border-slate-100' : ''} ${i === 2 || i === 3 ? 'border-t-2 md:border-t-0 border-slate-100' : ''} ${i === 1 || i === 3 ? 'border-l-2 md:border-l-2 border-slate-100' : ''}`}>
                <p className="text-[11px] font-bold text-slate-400">{s.label}</p>
                <p className="text-base font-black text-slate-900 mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Tabs ---------- */}
        <nav className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl border-2 border-slate-200 bg-white" role="tablist">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`${BTN} px-4 py-2 ${
                tab === key
                  ? 'bg-[#00e396] border-[#00c984] text-[#05372d] shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* ---------- TAB: Profil ---------- */}
        {tab === 'profil' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <aside className={`${CARD} lg:col-span-4 p-6 space-y-3`}>
              <h3 className="text-sm font-black text-slate-900">Aloqa ma&apos;lumotlari</h3>
              {[
                { Icon: Mail, label: 'Pochta', value: email || '...', verified: true },
                { Icon: Phone, label: 'Telefon', value: adminUser?.phone || phone },
                { Icon: MapPin, label: 'Hudud', value: adminUser?.region || 'Toshkent' },
              ].map(({ Icon, label, value, verified }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-2xl border-2 border-slate-100 bg-slate-50/60">
                  <span className="w-9 h-9 rounded-xl border-2 border-slate-200 bg-white flex items-center justify-center text-slate-500">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-400">{label}</p>
                    <p className="text-xs font-extrabold text-slate-800 truncate flex items-center gap-1">
                      {value}
                      {verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#00bfa5] shrink-0" />}
                    </p>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-2xl border-2 border-[#bff3d9] bg-[#e8fbf1] flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-[#00a86b] shrink-0" />
                <div>
                  <p className="text-xs font-black text-[#05372d]">Akkaunt himoyalangan</p>
                  <p className="text-[11px] text-[#05372d]/70 font-medium leading-snug">
                    Barcha tasdiqlashlar yakunlangan.
                  </p>
                </div>
              </div>
            </aside>

            <form onSubmit={handleUpdateProfile} className={`${CARD} lg:col-span-8 p-6 sm:p-8 space-y-5`}>
              <SectionHead
                Icon={User}
                tone="border-cyan-200 bg-cyan-50 text-cyan-700"
                title="Shaxsiy ma'lumotlarni tahrirlash"
                desc="Asosiy akkaunt va aloqa parametrlarini o'zgartirish"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Ism" Icon={User} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ismingiz" />
                <Field label="Familiya" Icon={User} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Familiyangiz" />
                <Field
                  label="Elektron pochta"
                  Icon={Mail}
                  type="email"
                  value={email}
                  readOnly
                  hint="Email kirish uchun ishlatiladi, uni o'zgartirib bo'lmaydi."
                />
                <Field label="Telefon raqami" Icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-600">Admin roli</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Faqat tizim egasi o&apos;zgartira oladi
                  </span>
                </div>
                <div className="p-3.5 bg-slate-100 rounded-xl border-2 border-slate-200 text-xs text-slate-600 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Super Administrator &ndash; barcha bo&apos;limlarga to&apos;liq kirish huquqi
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" disabled={!user} className={BTN_PRIMARY}>
                  <Save className="w-4 h-4" />
                  Ma&apos;lumotlarni yangilash
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ---------- TAB: Xavfsizlik ---------- */}
        {tab === 'xavfsizlik' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form onSubmit={handleUpdatePassword} className={`${CARD} lg:col-span-7 p-6 sm:p-8 space-y-5`}>
              <SectionHead
                Icon={Key}
                tone="border-amber-200 bg-amber-50 text-amber-700"
                title="Parolni o'zgartirish"
                desc="Xavfsizlik uchun parolni har 90 kunda yangilang"
              />

              <PasswordField label="Joriy parol" Icon={Lock} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Joriy parolingiz" />
              <PasswordField label="Yangi parol" Icon={Key} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Yangi parol kiriting" />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Parol quvvati</span>
                  <span className={`font-extrabold ${strength.color}`}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-2">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className={`rounded-full transition-colors ${newPassword && score >= n ? strength.bar : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>

              <PasswordField
                label="Yangi parolni takrorlang"
                Icon={Key}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Parolni qayta kiriting"
                error={mismatch}
              />
              {mismatch && <p className="text-[11px] font-bold text-red-600 -mt-3">Parollar mos kelmayapti</p>}

              <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rules.map((r) => (
                  <span key={r.text} className={`flex items-center gap-2 text-[11px] font-bold ${r.ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {r.ok ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    {r.text}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => showToast("Parolni tiklash yo'riqnomasi pochtangizga yuborildi")}
                  className="text-slate-400 hover:text-slate-800 font-bold text-[11px] underline-offset-4 hover:underline"
                >
                  Parolni unutdim
                </button>
                <button type="submit" className={BTN_AMBER}>
                  <Save className="w-4 h-4" />
                  Yangi parolni saqlash
                </button>
              </div>
            </form>

            <div className="lg:col-span-5 space-y-6">
              <section className={`${CARD} p-6 space-y-4`}>
                <h3 className="text-sm font-black text-slate-900">Himoya sozlamalari</h3>
                {[
                  { label: 'Ikki bosqichli tasdiqlash (2FA)', desc: 'SMS va Authy orqali kirishni tasdiqlash', value: twoFA, set: () => { setTwoFA((v) => !v); showToast(twoFA ? "2FA o'chirildi" : '2FA yoqildi'); } },
                  { label: 'Yangi kirish haqida xabar', desc: 'Notanish qurilmadan kirilsa pochtaga xabar yuboriladi', value: notifyLogin, set: () => setNotifyLogin((v) => !v) },
                ].map((o) => (
                  <div key={o.label} className="flex items-center justify-between gap-4 p-4 rounded-2xl border-2 border-slate-100">
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">{o.label}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{o.desc}</p>
                    </div>
                    <Switch checked={o.value} onChange={o.set} label={o.label} />
                  </div>
                ))}
              </section>

              <section className={`${CARD} p-6 space-y-3`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">Faol qurilmalar</h3>
                  <span className="px-2.5 py-1 rounded-lg border-2 border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold">
                    {devices.length} ta faol
                  </span>
                </div>

                {devices.map((d) => (
                  <div key={d.id} className="p-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-xl border-2 border-slate-200 bg-white flex items-center justify-center text-slate-600 shrink-0">
                        <DeviceIcon type={d.type} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-800 truncate">
                          {d.name} &bull; {d.place}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {d.last} ({d.ip})
                        </p>
                      </div>
                    </div>
                    {d.current ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Shu qurilma
                      </span>
                    ) : (
                      <button onClick={() => endSession(d.id)} className={`${BTN_DANGER} !px-3 !py-1.5`}>
                        Chiqarish
                      </button>
                    )}
                  </div>
                ))}

                {devices.length > 1 && (
                  <button onClick={endOtherSessions} className={`${BTN_DANGER} w-full`}>
                    <LogOut className="w-4 h-4" />
                    Boshqa barcha seanslarni tugatish
                  </button>
                )}
              </section>
            </div>
          </div>
        )}

        {/* ---------- TAB: Faollik ---------- */}
        {tab === 'faollik' && (
          <section className={`${CARD} p-6 sm:p-8 max-w-3xl`}>
            <SectionHead
              Icon={Activity}
              tone="border-emerald-200 bg-emerald-50 text-emerald-700"
              title="So'nggi faollik"
              desc="Akkauntingizda bajarilgan oxirgi amallar"
            />
            <ol className="mt-5 space-y-1">
              {ACTIVITY.map((a, i) => (
                <li key={a.id} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < ACTIVITY.length - 1 && <span className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-slate-100" />}
                  <span className={`relative mt-1 w-4 h-4 rounded-full border-4 border-white ring-2 ring-slate-200 ${a.tone}`} />
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">{a.text}</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{a.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
    </div>
  );
}