'use client';

import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState('uz'); // 'uz' | 'ru'
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Yangi shikoyat kelib tushdi (#SH-4812)', time: '5 daqiqa oldin', unread: true },
    { id: 2, title: 'Chevrolet Malibu 2 moderatsiyaga yuborildi', time: '10 daqiqa oldin', unread: true },
    { id: 3, title: 'Payme orqali 45,000 UZS qabul qilindi', time: '25 daqiqa oldin', unread: false },
    { id: 4, title: 'Yangi admin muvaffaqiyatli qo\'shildi', time: '1 soat oldin', unread: false },
  ]);
  const [toasts, setToasts] = useState([]);
  const [adminUser, setAdminUser] = useState({
    name: 'Sardor Alimov',
    role: 'Super Admin',
    roleBadge: 'BOSH ADMINISTRATOR (SUPER ADMIN)',
    email: 'admin@olxneo.uz',
    phone: '+998 90 123 45 67',
    region: 'Toshkent, O\'zbekiston',
    avatar: 'SA',
    twoFactor: true,
  });

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('Barcha bildirishnomalar o\'qildi deb belgilandi');
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        notifications,
        setNotifications,
        markAllNotificationsRead,
        toasts,
        showToast,
        removeToast,
        adminUser,
        setAdminUser,
      }}
    >
      {children}
      {/* Global Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border text-sm font-medium animate-slide-up transition-all ${
              toast.type === 'success'
                ? 'bg-[#0b2620] text-white border-[#00DF81]/40 shadow-[#00DF81]/10'
                : toast.type === 'error'
                ? 'bg-red-950 text-white border-red-500/40 shadow-red-500/10'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  toast.type === 'success'
                    ? 'bg-[#00DF81] shadow-[0_0_8px_#00DF81]'
                    : toast.type === 'error'
                    ? 'bg-red-400'
                    : 'bg-yellow-400'
                }`}
              />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
