'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { logout } from '@/lib/auth';

export default function LogoutButton({ className = '' }) {
  const router = useRouter();
  const { showToast } = useApp();

  const handleLogout = () => {
    logout();
    showToast('Hisobdan chiqdingiz');
    router.replace('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4" />
      <span>Hisobdan chiqish</span>
    </button>
  );
}