'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import {
  Settings,
  Shield,
  CreditCard,
  Bell,
  FileCheck,
  Users,
  CheckCircle2,
  Clock,
  Laptop,
  Smartphone,
  Save,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  Upload,
  Lock,
  Globe,
  Radio,
  Sliders,
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react';
import { platformRoles } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function SozlamalarPage() {
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState('umumiy'); // 'umumiy' | 'tolov' | 'xavfsizlik' | 'xabarnoma' | 'qoidalar' | 'rollar'

  // General settings state
  const [platformName, setPlatformName] = useState('OLX Neo');
  const [contactEmail, setContactEmail] = useState('admin@olxneo.uz');
  const [supportPhone, setSupportPhone] = useState('+998 71 200 00 00');
  const [freeListingPrice, setFreeListingPrice] = useState('0');
  const [vipListingPrice, setVipListingPrice] = useState('15 000');
  const [topListingPrice, setTopListingPrice] = useState('45 000');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isAiModerationActive, setIsAiModerationActive] = useState(true);
  const [is2FaRequired, setIs2FaRequired] = useState(true);

  // Roles state
  const [roles, setRoles] = useState(platformRoles);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    showToast('Platforma umumiy sozlamalari va tariflar muvaffaqiyatli saqlandi!', 'success');
  };

  const handleToggleMaintenance = () => {
    const nextVal = !isMaintenanceMode;
    setIsMaintenanceMode(nextVal);
    if (nextVal) {
      showToast('Texnik xizmat rejimi (MAINTENANCE) yoqildi!', 'warning');
    } else {
      showToast('Texnik xizmat rejimi o\'chirildi. Sayt to\'liq ochiq.', 'success');
    }
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    showToast('Xavfsizlik protokollari va ruxsatnomalar yangilandi!', 'success');
  };

  const handleTerminateAllSessions = () => {
    showToast('Barcha boshqa seanslar (IP manzillar) majburiy yopildi!', 'error');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f6f9f8] min-h-screen">
      <Header />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Title Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00DF81]" />
              <span className="text-[11px] font-bold text-[#00bfa5] uppercase tracking-wider">
                KONFIGURATSIYA MARKAZI
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Tizim sozlamalari va xavfsizlik
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Platformaning global parametrlari, administrator rollari va xavfsizlik protokollari.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Oxirgi sinxronizatsiya: Bugun, 14:32 (UZT)</span>
          </div>
        </div>

        {/* Global Live Status Banner from Screenshot 13 */}
        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-emerald-950">
                Tizim holati: Barqaror
              </span>
              <span className="px-2 py-0.5 ml-2 bg-emerald-200/60 rounded text-[10px] font-bold text-emerald-800 uppercase">
                FAOL/OPTIMAL
              </span>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Barcha xavfsizlik protokollari himoyalangan rejimda ishlamoqda. Tizim yuklanmasi 14% ni tashkil qiladi.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Jonli monitoring faol
          </span>
        </div>

        {/* Grid: Left Navigation Sub-Menu (4 cols) + Right Content Pane (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sub-Navigation */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-soft p-4 space-y-4">
            <nav className="space-y-1">
              {[
                { id: 'umumiy', label: 'Umumiy sozlamalar', sub: 'Asosiy platforma va narxlar', icon: Settings },
                { id: 'rollar', label: 'Administrator rollari', sub: 'Ruxsatlar va darajalar (3 ta rol)', icon: Users },
                { id: 'xavfsizlik', label: 'Xavfsizlik & Kirish', sub: '2FA, Seanslar, IP nazorat', icon: Shield },
                { id: 'xabarnoma', label: 'Xabarnomalar', sub: 'Eskiz SMS, Firebase Push', icon: Bell },
                { id: 'tolov', label: "To'lov tizimlari", sub: 'Payme, Click, Uzum Bank', icon: CreditCard },
                { id: 'qoidalar', label: "E'lonlar qoidalari", sub: 'Cheklovlar va moderatsiya', icon: FileCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      showToast(`Bo'lim tanlandi: "${tab.label}"`);
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-[#00DF81]/15 text-[#05372d] border border-[#00DF81]/30 font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-[#05372d]' : 'text-slate-400'}`} />
                    <div className="flex-1">
                      <p className="text-xs font-bold leading-tight">{tab.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{tab.sub}</p>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* System Status Footnote */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-500">TIZIM HOLATI</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Barqaror
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Uptime: 99.98%</span>
                <span>v2.8.4-neo</span>
              </div>
            </div>
          </div>

          {/* Right Content Pane */}
          <div className="lg:col-span-8 space-y-6">
            {/* TAB 1: UMUMIY SOZLAMALAR (Screenshot 6) */}
            {activeTab === 'umumiy' && (
              <form onSubmit={handleSaveGeneral} className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 space-y-6 text-xs">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Umumiy sozlamalar
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Asosiy platforma ma&apos;lumotlari, valyuta va e&apos;lonlar bo&apos;yicha amaldagi narxlar
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 bg-cyan-50 text-cyan-800 font-bold rounded text-[10px]">
                    Hudud: O&apos;zbekiston (UZS)
                  </span>
                </div>

                {/* Section 1: Corporate Details */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#00bfa5]" />
                    <span>PLATFORMANING KORPORATIV MA&apos;LUMOTLARI</span>
                  </h3>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Platforma nomi</label>
                    <input
                      type="text"
                      value={platformName}
                      onChange={(e) => setPlatformName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#00DF81]"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Sayt sarlavhasi, brauzer sarlavhalari va barcha avtomatik bildirishnomalarda ko&apos;rsatiladi
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Aloqa uchun email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#00DF81]"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Rasmiy xatlar va tizim hisobotlari jo&apos;natiladi
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Qo&apos;llab-quvvatlash telefoni</label>
                      <input
                        type="text"
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#00DF81]"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Call-markaz va footer aloqa bo&apos;limi uchun
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Tariffs and Listing Prices */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                      <span>TARIFLAR VA E&apos;LON NARXLARI</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Valyuta: O&apos;zbekiston so&apos;mi (UZS)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Price 1 */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-700">Bitta oddiy e&apos;lon</span>
                      <div className="flex items-baseline gap-1">
                        <input
                          type="text"
                          value={freeListingPrice}
                          onChange={(e) => setFreeListingPrice(e.target.value)}
                          className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg font-black text-slate-900 text-base"
                        />
                        <span className="text-xs font-bold text-slate-500">so&apos;m</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        Bepul limitdan oshgandagi bitta e&apos;lon uchun bazaviy narx
                      </p>
                    </div>

                    {/* Price 2 */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">VIP e&apos;lon narxi</span>
                        <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-800 text-[9px] font-bold rounded">
                          1 KUN
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input
                          type="text"
                          value={vipListingPrice}
                          onChange={(e) => setVipListingPrice(e.target.value)}
                          className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg font-black text-slate-900 text-base"
                        />
                        <span className="text-xs font-bold text-slate-500">so&apos;m</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        Qidiruvda birinchi o&apos;rinlarda chiqarish xizmati
                      </p>
                    </div>

                    {/* Price 3 */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">TOP e&apos;lon narxi</span>
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                          7 KUN
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input
                          type="text"
                          value={topListingPrice}
                          onChange={(e) => setTopListingPrice(e.target.value)}
                          className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg font-black text-slate-900 text-base"
                        />
                        <span className="text-xs font-bold text-slate-500">so&apos;m</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        Katalog bo&apos;limlarining yuqori blokida fiksatsiya
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Maintenance Mode Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800">
                          Texnik xizmat ko&apos;rsatish rejimi
                        </h4>
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-extrabold rounded uppercase">
                          MAINTENANCE
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 max-w-lg leading-relaxed">
                        Yoqilganda, foydalanuvchilarga sayt vaqtincha ishlamayotgani haqida sahifa ko&apos;rsatiladi. Administratorlar panelga to&apos;siqsiz kirishda davom etadi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">
                      {isMaintenanceMode ? 'Yoqilgan' : "O'chirilgan"}
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleMaintenance}
                      className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                        isMaintenanceMode ? 'bg-red-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          isMaintenanceMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <Info className="w-3.5 h-3.5" />
                    <span>O&apos;zgarishlar darhol kesh xotirada yangilanadi</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => showToast('O\'zgarishlar bekor qilindi')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#f5b324] hover:bg-[#e0a11c] text-[#07241d] font-black rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>O&apos;zgarishlarni saqlash</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: ADMINISTRATOR ROLLARI (Screenshot 13 Section 2) */}
            {activeTab === 'rollar' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 space-y-6 text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Administrator rollari va ruxsatnomalar
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Platformadagi boshqaruv modullari bo&apos;yicha kirish ruxsatnomalari
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddRoleModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#00e396] hover:bg-[#00c984] text-[#05372d] text-xs font-bold rounded-xl shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yangi rol qo&apos;shish</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                      <tr>
                        <th className="p-3">Rol nomi va ta&apos;rif</th>
                        <th className="p-3">Faol foydalanuvchilar</th>
                        <th className="p-3">Ruxsat etilgan modullar</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {roles.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/70">
                          <td className="p-3">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {r.name}
                            </span>
                            <p className="text-[11px] text-slate-400 mt-0.5">{r.desc}</p>
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            {r.userCount}
                          </td>
                          <td className="p-3">
                            {r.modules ? (
                              <span className="px-2 py-0.5 bg-[#00e396]/20 text-[#05372d] text-[10px] font-bold rounded">
                                {r.modules}
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {r.modulesList?.map((m, j) => (
                                  <span key={j} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {r.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {r.editable ? (
                              <button
                                onClick={() => showToast(`"${r.name}" rolini tahrirlash ochildi`)}
                                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-slate-300 text-xs">Tizim</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: XAVFSIZLIK & KIRISH NAZORATI (Screenshot 13 Section 3) */}
            {activeTab === 'xavfsizlik' && (
              <form onSubmit={handleSaveSecurity} className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 space-y-6 text-xs">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Xavfsizlik va kirish nazorati
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Avtorizatsiya xavfsizligi, ikki bosqichli tekshiruv va apparat seanslari
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-cyan-50 text-cyan-800 text-[10px] font-bold rounded">
                    2FA Majburiy
                  </span>
                </div>

                {/* 2FA Toggle */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#00bfa5]" />
                    <div>
                      <span className="font-bold text-slate-800">
                        2 bosqichli autentifikatsiya (2FA)
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Barcha administratorlar uchun SMS yoki Google Authenticator majburiy
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIs2FaRequired(!is2FaRequired)}
                    className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                      is2FaRequired ? 'bg-[#00cbb4]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        is2FaRequired ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Active Sessions and IP Restrictions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800">
                      Faol seanslar va IP cheklovlari
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Barcha faoliyat qayd etilmoqda
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Laptop className="w-5 h-5 text-slate-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            Toshkent, Chrome Windows 11
                          </span>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                            Joriy seans
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          IP: 191.195.1.1 • Oxirgi kirish: 28.10.2026, 09:12
                        </p>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-bold text-xs">
                      • Faol
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleTerminateAllSessions}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs"
                  >
                    Barcha boshqa seanslarni yopish
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#f5b324] hover:bg-[#e0a11c] text-[#07241d] font-black rounded-xl shadow-md text-xs"
                  >
                    Xavfsizlik parametrlarini saqlash
                  </button>
                </div>
              </form>
            )}

            {/* TAB 4: XABARNOMALAR & TO'LOV TIZIMLARI QUICK PANE */}
            {(activeTab === 'xabarnoma' || activeTab === 'tolov' || activeTab === 'qoidalar') && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 space-y-4 text-xs">
                <h3 className="text-base font-extrabold text-slate-800">
                  Integratsiya va API sozlamalari
                </h3>
                <p className="text-slate-400">
                  Ushbu modul bo&apos;yicha barcha integratsiyalar (SMS shlyuzi, to&apos;lov agregatorlari va limitlar) to&apos;liq sinxron holatda ishlamoqda.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800">SMS Gateway (Eskiz.uz)</span>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">Ulanish faol (Balans: 840,000 UZS)</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800">To&apos;lov Aggregatori (Payme / Click)</span>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">Webhook sinxroni 100%</p>
                  </div>
                </div>
                <div className="pt-3 text-right">
                  <button
                    onClick={() => showToast('API sozlamalari yangilandi!')}
                    className="px-5 py-2 bg-[#00e396] text-[#05372d] font-bold rounded-xl"
                  >
                    API holatini tekshirish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-slide-up border border-slate-100 text-xs">
            <h3 className="text-base font-extrabold text-slate-800 mb-3">Yangi administrator roli qo&apos;shish</h3>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Rol nomi</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Masalan: Moliya Nazoratchisi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Tavsif va ruxsatlar</label>
                <input
                  type="text"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Faqat to'lovlar va hisobotlar moduli"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowAddRoleModal(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-600"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => {
                  if (newRoleName) {
                    setRoles([
                      ...roles,
                      {
                        name: newRoleName,
                        desc: newRoleDesc || 'Qo\'shimcha xodim roli',
                        userCount: '1 ta foydalanuvchi',
                        modules: 'Maxsus ruxsatlar',
                        status: 'Faol',
                        editable: true,
                      },
                    ]);
                    showToast(`"${newRoleName}" yangi roli yaratildi!`, 'success');
                    setShowAddRoleModal(false);
                    setNewRoleName('');
                    setNewRoleDesc('');
                  }
                }}
                className="px-5 py-2 bg-[#00e396] text-[#05372d] font-bold rounded-xl"
              >
                Rolni yaratish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
