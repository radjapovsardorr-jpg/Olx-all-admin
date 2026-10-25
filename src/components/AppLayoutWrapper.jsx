'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AppLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthOrSplash = pathname === '/login' || pathname === '/splash';

  if (isAuthOrSplash) {
    return <main className="min-h-screen w-full bg-[#f6f9f8]">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-[#f6f9f8] text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
