'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
// ...

import {
  LayoutDashboard,
  Users,
  Tag,
  ShieldAlert,
  CreditCard,
  Settings,
  FolderTree,
  AlertTriangle,
  MessageSquare,
  User,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

/* OLX brand: #002F34 (teal-dark), #23E5DB (turquoise), #FFCE32 (yellow) */

const SECTIONS = [
  {
    label: "Asosiy menyu",
    items: [
      { name: "Bosh sahifa", href: '/', icon: LayoutDashboard, pattern: /^\/($|dashboard)/ },
      { name: "Foydalanuvchilar", href: '/foydalanuvchilar', icon: Users, pattern: /^\/foydalanuvchilar/ },
      { name: "E'lonlar", href: '/elonlar', icon: Tag, pattern: /^\/elonlar/ },
      { name: "Kategoriyalar", href: '/kategoriyalar', icon: FolderTree, pattern: /^\/kategoriyalar/ },
    ],
  },
  {
    label: "Nazorat",
    items: [
      { name: "Moderatsiya", href: '/moderatsiya', icon: ShieldAlert, badge: '12', pattern: /^\/moderatsiya/ },
      { name: "Shikoyatlar", href: '/shikoyatlar', icon: AlertTriangle, badge: '5', pattern: /^\/shikoyatlar/ },
      { name: "Xabarlar", href: '/xabarlar', icon: MessageSquare, pattern: /^\/xabarlar/ },
      { name: "To'lovlar", href: '/tolovlar', icon: CreditCard, pattern: /^\/tolovlar/ },
    ],
  },
  {
    label: "Tizim",
    items: [
      { name: "Sozlamalar", href: '/sozlamalar', icon: Settings, pattern: /^\/sozlamalar/ },
      { name: "Profil", href: '/profil', icon: User, pattern: /^\/profil/ },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { adminUser, showToast } = useApp();

  return (
    <aside className="w-64 min-w-[256px] bg-[#002F34] text-[#cfe9ea] flex flex-col justify-between h-screen sticky top-0 border-r-2 border-[#0a4a52] z-30 select-none">
      <div className="min-h-0 flex flex-col">
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b-2 border-[#0a4a52]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-[28px] leading-none font-black tracking-tight text-white">olx</span>
            <span className="bg-[#23E5DB] text-[#002F34] font-black text-[10px] tracking-wider px-2.5 py-1 rounded-lg border-2 border-[#23E5DB] group-hover:bg-[#FFCE32] group-hover:border-[#FFCE32] transition-colors">
              NEO ADMIN
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-5 overflow-y-auto" aria-label="Main">
          {SECTIONS.map((sec) => (
            <div key={sec.label}>
              <p className="px-3 pb-2 text-[11px] font-extrabold tracking-wider text-[#5fa3a8] uppercase">
                {sec.label}
              </p>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const active = item.pattern.test(pathname);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`group flex items-center justify-between gap-2 pl-2 pr-3 py-2 rounded-xl border-2 text-sm transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#23E5DB]/40 ${
                        active
                          ? 'bg-[#23E5DB] border-[#23E5DB] text-[#002F34] font-extrabold shadow-[0_8px_20px_-8px_rgba(35,229,219,0.7)]'
                          : 'border-transparent text-[#cfe9ea] font-semibold hover:bg-[#073d44] hover:border-[#0f5760] hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            active
                              ? 'bg-[#002F34] text-[#23E5DB]'
                              : 'bg-[#073d44] text-[#7fc9cc] group-hover:bg-[#0a4a52] group-hover:text-[#23E5DB]'
                          }`}
                        >
                          <Icon className="w-[17px] h-[17px]" />
                        </span>
                        <span className="truncate">{item.name}</span>
                      </span>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full border-2 ${
                            active
                              ? 'bg-[#002F34] border-[#002F34] text-[#FFCE32]'
                              : 'bg-[#FFCE32] border-[#FFCE32] text-[#002F34]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-3 space-y-2.5 border-t-2 border-[#0a4a52]">
        <a
          href="https://www.olx.uz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 border-[#0f5760] text-xs font-extrabold text-[#23E5DB] hover:bg-[#23E5DB] hover:border-[#23E5DB] hover:text-[#002F34] transition-colors"
        >
          <span>OLX saytiga o'tish</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        <div className="p-2.5 bg-[#00252a] rounded-2xl border-2 border-[#0a4a52] flex items-center justify-between gap-2">
          <Link href="/profil" className="flex items-center gap-3 group flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#073d44] border-2 border-[#23E5DB]/60 flex items-center justify-center font-black text-xs text-[#23E5DB] group-hover:border-[#23E5DB] shrink-0 transition-colors">
              {adminUser.avatarImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={adminUser.avatarImage} alt="" className="w-full h-full object-cover" />
              ) : (
                adminUser.avatar
              )}
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-extrabold text-white group-hover:text-[#23E5DB] transition-colors leading-tight truncate">
                {adminUser.name}
              </span>
              <span className="text-[11px] text-[#7fc9cc] leading-tight truncate">{adminUser.role}</span>
            </div>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}