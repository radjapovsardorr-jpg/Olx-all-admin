'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AUTH_CHANGE_EVENT, getSession, isAuthed } from '@/lib/auth';
import { getInitials } from '@/lib/useAuthUser';
import { useApp } from '@/context/AppContext';

// Kirmasdan ochiq turadigan sahifalar
const PUBLIC_PATHS = ['/login'];

function Loader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faf9]">
      <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
        <span className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-[#00DF81] animate-spin" />
        Yuklanmoqda...
      </div>
    </div>
  );
}

export default function AuthGuard({ children, sidebar = null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setAdminUser } = useApp();
  const [status, setStatus] = useState('checking'); // checking | authed | guest

  // setAdminUser barqaror bo'lmasligi mumkin, shuning uchun ref orqali ishlatamiz
  const setAdminUserRef = useRef(setAdminUser);
  setAdminUserRef.current = setAdminUser;

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    const check = () => {
      const ok = isAuthed();
      setStatus(ok ? 'authed' : 'guest');

      // Kirgan hisob ma'lumotini umumiy holatga (sidebar, header) yozadi
      if (ok) {
        const session = getSession();
        if (session?.name && typeof setAdminUserRef.current === 'function') {
          setAdminUserRef.current((prev) => ({
            ...prev,
            name: session.name,
            email: session.email,
            avatar: getInitials(session.name),
          }));
        }
      }

      if (!ok && !PUBLIC_PATHS.includes(pathname)) router.replace('/login');
      if (ok && PUBLIC_PATHS.includes(pathname)) router.replace('/');
    };

    check();

    // Boshqa tabda chiqib ketilsa yoki kirilsa ham sinxron bo'ladi
    window.addEventListener(AUTH_CHANGE_EVENT, check);
    window.addEventListener('storage', check);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, check);
      window.removeEventListener('storage', check);
    };
  }, [pathname, router]);

  if (status === 'checking') return <Loader />;

  // /login: faqat mehmon uchun
  if (isPublic) return status === 'guest' ? <>{children}</> : <Loader />;

  // Panel sahifalari: faqat kirgan foydalanuvchi uchun
  if (status === 'authed') {
    // sidebar berilmasa (masalan, AppLayoutWrapper o'zi chizsa) qo'shimcha o'ramasiz
    if (!sidebar) return <>{children}</>;
    return (
      <div className="flex min-h-screen">
        {sidebar}
        {children}
      </div>
    );
  }

  return <Loader />;
}