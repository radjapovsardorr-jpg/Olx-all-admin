'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Calendar,
  Bell,
  Plus,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Header({ customTitle, showAddAdmin = true, onSearch = () => {} }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { notifications, markAllNotificationsRead, adminUser, showToast } = useApp();

  const [dateRange, setDateRange] = useState('Shu oy');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [newAdminData, setNewAdminData] = useState({ name: '', email: '', phone: '', role: 'Moderator' });

  // Generate dynamic breadcrumb
  const getBreadcrumbs = () => {
    if (pathname.includes('/moderatsiya')) {
      return (
        <>
          <Link href="/" className="hover:text-slate-800 transition-colors">OLX O&apos;zbekiston</Link>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-800">Boshqaruv Paneli</span>
        </>
      );
    }
    if (pathname.includes('/foydalanuvchilar')) {
      return (
        <>
          <Link href="/" className="hover:text-slate-800 transition-colors">OLX O&apos;zbekiston</Link>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-800">Boshqaruv Paneli</span>
        </>
      );
    }
    if (pathname.includes('/shikoyatlar')) {
      return (
        <>
          <Link href="/" className="hover:text-slate-800 transition-colors">OLX O&apos;zbekiston</Link>
          <span className="text-slate-400">/</span>
          <Link href="/" className="hover:text-slate-800 transition-colors">Neo Admin</Link>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-[#00bfa5] uppercase text-xs tracking-wider">OKTYABR 2026</span>
        </>
      );
    }
    if (pathname.includes('/tolovlar')) {
      return (
        <>
          <Link href="/" className="hover:text-slate-800 transition-colors">OLX O&apos;zbekiston</Link>
          <span className="text-slate-400">/</span>
          <Link href="/" className="hover:text-slate-800 transition-colors">Neo Admin</Link>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-[#00bfa5] uppercase text-xs tracking-wider">OKTYABR 2026</span>
        </>
      );
    }
    if (pathname.includes('/kategoriyalar')) {
      return (
        <>
          <Link href="/" className="hover:text-slate-800 transition-colors">OLX O&apos;zbekiston</Link>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-800">Boshqaruv Paneli</span>
        </>
      );
    }
    if (pathname.includes('/sozlamalar')) {
      return (
        <>
          <Link href="/" className="hover:text-slate-800 transition-colors">OLX O&apos;zbekiston</Link>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-800">Boshqaruv Paneli</span>
        </>
      );
    }
    if (pathname.includes('/profil')) {
      return (
        <>
          <Link href="/" className="hover:text-slate-800 transition-colors">OLX O&apos;zbekiston</Link>
          <span className="text-slate-400">/</span>
          <Link href="/" className="hover:text-slate-800 transition-colors">Boshqaruv Paneli</Link>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-[#00bfa5]">Administrator Profili</span>
        </>
      );
    }

    return (
      <>
        <Link href="/" className="hover:text-slate-800 transition-colors">OLX O&apos;zbekiston</Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-800">Boshqaruv Paneli</span>
      </>
    );
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!newAdminData.name || !newAdminData.email) {
      showToast('Iltimos, ism va emailni to\'ldiring', 'error');
      return;
    }
    showToast(`Yangi admin (${newAdminData.name}) muvaffaqiyatli qo'shildi!`, 'success');
    setShowAddAdminModal(false);
    setNewAdminData({ name: '', email: '', phone: '', role: 'Moderator' });
  };

  return (
    <>
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-8 flex items-center justify-between shadow-sm">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
        <svg
          className="w-4 h-4 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        {getBreadcrumbs()}
      </div>

      {/* Right: Search, Date Filter, Admin Button, Lang, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="ID yoki telefon raqam..."
            className="w-64 pl-9 pr-4 py-2 bg-slate-50/80 hover:bg-slate-100/80 focus:bg-white text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00DF81]/40 focus:border-[#00DF81] transition-all"
          />
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDateDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-fade-in text-xs font-medium">
              {['Bugun', 'Kecha', 'Shu hafta', 'Shu oy', 'Shu yil'].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    setShowDateDropdown(false);
                    showToast(`Sana filtri: "${range}" tanlandi`);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors ${
                    dateRange === range ? 'text-[#00bfa5] font-bold bg-[#00bfa5]/5' : 'text-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* "+ Yangi admin qo'shish" button */}
        {showAddAdmin && (
          <button
            onClick={() => setShowAddAdminModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00e396] hover:bg-[#00c984] text-[#05372d] text-xs font-bold rounded-xl shadow-[0_2px_10px_rgba(0,227,150,0.3)] transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi admin qo&apos;shish</span>
          </button>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowBellDropdown(!showBellDropdown)}
            className="relative p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {showBellDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Bildirishnomalar</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#00bfa5] hover:underline font-semibold"
                  >
                    Barchasini o&apos;qilgan qilish
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs hover:bg-slate-50 transition-colors flex items-start gap-2.5 ${
                      n.unread ? 'bg-[#00DF81]/5' : ''
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.unread ? 'bg-[#00DF81]' : 'bg-slate-300'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {n.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 text-center">
                <Link
                  href="/shikoyatlar"
                  onClick={() => setShowBellDropdown(false)}
                  className="text-[11px] text-[#00bfa5] font-bold hover:underline"
                >
                  Barcha xabarlarni ko&apos;rish &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Circle */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="w-9 h-9 rounded-full bg-[#0a231d] text-[#00DF81] font-bold text-xs flex items-center justify-center border-2 border-[#00DF81]/30 hover:border-[#00DF81] shadow-sm transition-all"
          >
            {adminUser.avatar}
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{adminUser.name}</p>
                <p className="text-[11px] text-slate-400">{adminUser.email}</p>
              </div>
              <div className="py-1 space-y-0.5">
                <Link
                  href="/profil"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mening profilim</span>
                </Link>
                <Link
                  href="/sozlamalar"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tizim sozlamalari</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => {
                    setShowUserDropdown(false);
                    showToast('Tizimdan chiqildi');
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Chiqish</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>

      {/* Modal alohida turadi: header backdrop-blur modal joylashuviga ta’sir qilmaydi */}
      {/* New Admin Modal */}
      {showAddAdminModal && mounted ? createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowAddAdminModal(false);
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-slide-up border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00DF81]/20 flex items-center justify-center text-[#05372d]">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Yangi administrator qo&apos;shish</h3>
              </div>
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">To&apos;liq ism (F.I.SH)</label>
                <input
                  type="text"
                  required
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                  placeholder="Masalan: Aziz Rahimov"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00DF81]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Elektron pochta</label>
                <input
                  type="email"
                  required
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  placeholder="aziz.rahimov@olxneo.uz"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00DF81]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Telefon raqam</label>
                <input
                  type="text"
                  value={newAdminData.phone}
                  onChange={(e) => setNewAdminData({ ...newAdminData, phone: e.target.value })}
                  placeholder="+998 90 000 00 00"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00DF81]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Ruxsat darajasi (Rol)</label>
                <select
                  value={newAdminData.role}
                  onChange={(e) => setNewAdminData({ ...newAdminData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00DF81]"
                >
                  <option value="Super Admin">Super Admin (Barcha huquqlar)</option>
                  <option value="Katta Moderator">Katta Moderator (E&apos;lonlar va Shikoyatlar)</option>
                  <option value="Moderator">Moderator (Oddiy tekshirish)</option>
                  <option value="Qo'llab-quvvatlash">Qo&apos;llab-quvvatlash (Faqat ko&apos;rish)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-[#05372d] bg-[#00e396] hover:bg-[#00c984] rounded-xl shadow-md transition-all"
                >
                  Adminni yaratish
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  );
}