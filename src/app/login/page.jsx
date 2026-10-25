'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DEMO_ADMIN, getKnownAccounts, loginUser, registerUser } from '@/lib/auth';

const inputCls =
  'w-full pl-9 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs focus:outline-none focus:border-[#00DF81] transition-all';

export default function LoginPage() {
  const router = useRouter();
  const { lang, setLang, showToast } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Saqlangan hisoblar ro'yxati
  const [accounts, setAccounts] = useState([]);
  const [showAccounts, setShowAccounts] = useState(false);
  const emailBoxRef = useRef(null);
  const passwordRef = useRef(null);

  const isRegister = mode === 'register';

  // Tashqariga bosilsa ro'yxat yopiladi
  useEffect(() => {
    const onDown = (e) => {
      if (emailBoxRef.current && !emailBoxRef.current.contains(e.target)) {
        setShowAccounts(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const q = email.trim().toLowerCase();
  const suggestions = accounts.filter((a) => a.email.includes(q) && a.email !== q);

  const pickAccount = (acc) => {
    setEmail(acc.email);
    setShowAccounts(false);
    setError('');
    passwordRef.current?.focus();
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setPassword('');
    setConfirm('');
    setShowAccounts(false);
  };

  const fillDemo = () => {
    setMode('login');
    setEmail(DEMO_ADMIN.email);
    setPassword(DEMO_ADMIN.password);
    setError('');
    setShowAccounts(false);
  };

  const validate = () => {
    if (isRegister) {
      if (name.trim().length < 2) return 'Ismingizni kiriting (kamida 2 ta belgi).';
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Email manzilini to'g'ri kiriting.";
      if (password.length < 6) return "Parol kamida 6 ta belgidan iborat bo'lishi kerak.";
      if (password !== confirm) return 'Parollar bir-biriga mos kelmadi.';
    } else {
      if (!email.trim()) return 'Email yoki foydalanuvchi nomini kiriting.';
      if (!password) return 'Parolni kiriting.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Kichik kechikish: haqiqiy so'rov kabi ko'rinadi
      await new Promise((r) => setTimeout(r, 500));

      const user = isRegister
        ? await registerUser({ name, email, password, remember: rememberMe })
        : await loginUser({ email, password, remember: rememberMe });

      showToast(
        isRegister
          ? `Hisob ochildi. Xush kelibsiz, ${user.name}!`
          : `Xush kelibsiz, ${user.name}! Boshqaruv paneli yuklandi.`,
        'success'
      );
      router.replace('/');
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f8faf9] flex flex-col justify-between items-center p-6 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00e396]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#f5b324]/15 blur-[120px] pointer-events-none" />

      {/* Language switch */}
      <div className="w-full max-w-5xl flex justify-end z-10 pt-2">
        <div className="flex items-center bg-white p-1 rounded-full border border-slate-200/80 shadow-xs text-xs font-bold">
          {[
            { code: 'uz', label: "O'zbekcha", toast: "Til: O'zbekcha" },
            { code: 'ru', label: 'Русский', toast: 'Язык: Русский' },
          ].map((l) => (
            <button
              type="button"
              key={l.code}
              onClick={() => {
                setLang(l.code);
                showToast(l.toast);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                lang === l.code
                  ? 'bg-[#08201a] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang === l.code && <span className="w-1.5 h-1.5 rounded-full bg-[#00DF81]" />}
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] p-8 sm:p-10 z-10 text-center animate-slide-up">
        <div className="inline-flex items-center gap-2 bg-[#09221d] px-4 py-2 rounded-2xl shadow-md mx-auto">
          <span className="text-xl font-black text-white tracking-tight">olx</span>
          <span className="bg-[#00DF81] text-[#05372d] text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase">
            NEO ADMIN
          </span>
        </div>

        {/* Kirish / Hisob ochish */}
        <div className="mt-6 flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {[
            { id: 'login', label: 'Kirish' },
            { id: 'register', label: 'Hisob ochish' },
          ].map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => switchMode(t.id)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === t.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <h1 className="text-2xl font-black text-slate-900 mt-6 tracking-tight">
          {isRegister ? 'Yangi hisob ochish' : 'Admin panelga kirish'}
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1.5 max-w-xs mx-auto">
          {isRegister
            ? "Hisob ochgandan so'ng boshqaruv paneliga avtomatik kirasiz"
            : "Boshqaruv tizimiga kirish uchun ma'lumotlaringizni kiriting"}
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4 text-left text-xs">
          {/* Name (faqat hisob ochishda) */}
          {isRegister && (
            <div>
              <label htmlFor="name" className="block font-bold text-slate-700 mb-1.5">
                Ism va familiya
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Sardor Aliyev"
                  className={inputCls}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div ref={emailBoxRef} className="relative">
            <label htmlFor="email" className="block font-bold text-slate-700 mb-1.5">
              {isRegister ? 'Email' : 'Foydalanuvchi nomi yoki email'}
            </label>
            <div className="relative">
              <div className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center font-bold">
                @
              </div>
              <input
                id="email"
                type="text"
                autoComplete="off"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setShowAccounts(true);
                }}
                onFocus={() => {
                  if (!isRegister) {
                    setAccounts(getKnownAccounts());
                    setShowAccounts(true);
                  }
                }}
                placeholder="admin@olxneo.uz"
                className={inputCls}
              />
            </div>

            {/* Saqlangan hisoblar */}
            {!isRegister && showAccounts && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 max-h-56 overflow-y-auto">
                <p className="px-3.5 pt-1 pb-1.5 text-[10px] font-bold text-slate-400">
                  Saqlangan hisoblar
                </p>
                {suggestions.map((acc) => (
                  <button
                    type="button"
                    key={acc.email}
                    onClick={() => pickAccount(acc)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 text-left transition-colors"
                  >
                    <span className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                      {acc.name
                        .split(' ')
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-slate-800 truncate">
                        {acc.name}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate">
                        {acc.email}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-bold text-slate-700 mb-1.5">
              Parol
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'Kamida 6 ta belgi' : 'Parolingiz'}
                className={`${inputCls} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm (faqat hisob ochishda) */}
          {isRegister && (
            <div>
              <label htmlFor="confirm" className="block font-bold text-slate-700 mb-1.5">
                Parolni takrorlang
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Parolni qayta kiriting"
                  className={inputCls}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 font-semibold"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          {/* Remember + forgot */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#07241d] focus:ring-[#00DF81] border-slate-300"
              />
              <span className="font-semibold text-slate-600">Eslab qolish</span>
            </label>

            {!isRegister && (
              <button
                type="button"
                onClick={() => showToast('Parolni tiklash havolasi yuborildi')}
                className="font-bold text-slate-600 hover:text-slate-900 hover:underline"
              >
                Parolni unutdingizmi?
              </button>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#f5b324] hover:bg-[#e0a11c] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-[#07241d] font-black rounded-xl text-sm shadow-[0_4px_14px_rgba(245,179,36,0.4)] flex items-center justify-center gap-2 transition-all mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-[#07241d]/30 border-t-[#07241d] animate-spin" />
                <span>{isRegister ? 'Hisob ochilmoqda...' : 'Tekshirilmoqda...'}</span>
              </>
            ) : (
              <>
                <span>{isRegister ? 'Hisob ochish' : 'Kirish'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Demo hisob */}
          {!isRegister && (
            <button
              type="button"
              onClick={fillDemo}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-[11px] font-bold text-slate-500 hover:border-[#00DF81] hover:text-[#05372d] hover:bg-[#00DF81]/5 transition-all"
            >
              Demo hisob bilan to&apos;ldirish ({DEMO_ADMIN.email})
            </button>
          )}

          <div className="pt-1 text-center">
            <span className="text-[11px] font-semibold text-slate-500 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00cbb4]" />
              Markaziy Toshkent Klasteri (UZ-TAS-01)
            </span>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2 z-10 pb-2 text-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-xs text-[11px] font-bold text-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00bfa5]" />
          <span>Xavfsiz 256-bit SSL & 2FA faollashtirilgan</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Tizim qat&apos;iy nazorat ostida • Faqat vakolatli xodimlar uchun
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          © 2026 OLX GROUP UZBEKISTAN
        </p>
      </div>
    </div>
  );
}