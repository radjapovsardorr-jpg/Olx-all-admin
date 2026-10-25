'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  Download,
  History,
  Plus,
  Lock,
  Unlock,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  CheckCircle,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { initialUsersList } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function FoydalanuvchilarPage() {
  const { showToast } = useApp();

  const [users, setUsers] = useState(initialUsersList);
  const [searchVal, setSearchVal] = useState('');
  const [roleFilter, setRoleFilter] = useState('Barchasi');
  const [statusFilter, setStatusFilter] = useState('Barchasi');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      u.phone.includes(searchVal) ||
      u.id.toLowerCase().includes(searchVal.toLowerCase());

    if (!matchesSearch) return false;
    if (roleFilter !== 'Barchasi' && u.role !== roleFilter) return false;
    if (statusFilter !== 'Barchasi' && u.status !== statusFilter) return false;
    return true;
  });

  const toggleBlockStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextBlocked = !u.isBlocked;
          const nextStatus = nextBlocked ? 'Bloklangan' : 'Faol';
          showToast(
            `${u.name} ${nextBlocked ? 'bloklandi' : 'blokdan chiqarildi'}!`,
            nextBlocked ? 'error' : 'success'
          );
          return {
            ...u,
            isBlocked: nextBlocked,
            status: nextStatus,
            subNote: nextBlocked ? 'Qoidabuzarlik: Spam' : undefined,
          };
        }
        return u;
      })
    );
  };

  const handleExportExcel = () => {
    showToast('Foydalanuvchilar ro\'yxati Excel (XLSX) formatida yuklab olinmoqda...', 'success');
  };

  const handleSaveUserEdit = (e) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUserForEdit.id ? selectedUserForEdit : u))
    );
    showToast(`${selectedUserForEdit.name} ma'lumotlari yangilandi!`, 'success');
    setSelectedUserForEdit(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f6f9f8] min-h-screen">
      <Header onSearch={setSearchVal} />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Title & Action Buttons Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00DF81]" />
              <span className="text-[11px] font-bold text-[#00bfa5] uppercase tracking-wider">
                FOYDALANUVCHILAR BOSHQARUVI
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Foydalanuvchilar ro&apos;yxati
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              O&apos;zbekiston hududi bo&apos;ylab ro&apos;yxatga olingan barcha faol, xavfsiz va bloklangan hisoblar nazorati.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>Amallar tarixi</span>
            </button>

            <button
              onClick={() => {
                showToast('Yangi admin yaratish oynasi ochildi');
                setSelectedUserForEdit({
                  id: `#U-${Math.floor(10000 + Math.random() * 90000)}`,
                  name: '',
                  region: 'Toshkent',
                  phone: '+998 ',
                  role: 'Admin',
                  status: 'Faol',
                  registeredDate: '22.10.2026',
                  initials: 'AD',
                  email: '',
                });
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00e396] hover:bg-[#00c984] text-[#05372d] text-xs font-bold rounded-xl shadow-[0_2px_10px_rgba(0,227,150,0.3)] transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi admin qo&apos;shish</span>
            </button>
          </div>
        </div>

        {/* 3 Summary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Stat 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Jami Foydalanuvchilar
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-2xl font-black text-slate-900">124,500</h3>
                <span className="text-[11px] font-bold text-emerald-600">↗ +8.4%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                O&apos;tgan oyga nisbatan
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Faol Mijozlar
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-2xl font-black text-slate-900">118,920</h3>
                <span className="text-[11px] font-bold text-[#00bfa5]">95.5%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                Tasdiqlangan hisoblar
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#00e396]/15 flex items-center justify-center text-[#05372d]">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft flex items-center justify-between border-l-4 border-l-red-400">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Bloklanganlar
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-2xl font-black text-red-500">842</h3>
                <span className="text-[11px] font-bold text-red-500">0.6%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                Spam & firibgarlik filtri
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
              <UserX className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
            {/* Search input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Ism yoki telefon qidirish..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00DF81]"
              />
            </div>

            {/* Role filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <span>Rol: {roleFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-30 text-xs">
                  {['Barchasi', 'Admin', 'Moderator', 'Biznes profil', 'Foydalanuvchi'].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRoleFilter(r);
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <span>Status: {statusFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showStatusDropdown && (
                <div className="absolute left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-30 text-xs">
                  {['Barchasi', 'Faol', 'Bloklangan'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date filter pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              <span>Ro&apos;yxatdan o&apos;tgan: Hammasi</span>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors w-full md:w-auto justify-center"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Eksport (Excel)</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">F.I.SH</th>
                  <th className="py-3.5 px-6">TELEFON</th>
                  <th className="py-3.5 px-6">ROL</th>
                  <th className="py-3.5 px-6">STATUS</th>
                  <th className="py-3.5 px-6">RO&apos;YXATDAN O&apos;TGAN SANA</th>
                  <th className="py-3.5 px-6 text-right">AMALLAR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-4 px-6 font-semibold text-slate-400">
                      {u.id}
                    </td>

                    {/* F.I.SH */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full font-extrabold text-xs flex items-center justify-center flex-shrink-0 ${
                            u.role === 'Admin'
                              ? 'bg-[#00DF81]/20 text-[#05372d]'
                              : u.role === 'Biznes profil'
                              ? 'bg-amber-100 text-amber-800'
                              : u.role === 'Moderator'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {u.initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                            {u.region}
                          </p>
                          {u.subNote && (
                            <p className="text-[10px] font-bold text-red-500 mt-0.5">
                              {u.subNote}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Telefon */}
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {u.phone}
                    </td>

                    {/* Rol */}
                    <td className="py-4 px-6">
                      {u.role === 'Admin' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[#00e396]/15 text-[#05372d] border border-[#00e396]/30">
                          Admin
                        </span>
                      )}
                      {u.role === 'Biznes profil' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Biznes profil
                        </span>
                      )}
                      {u.role === 'Moderator' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          Moderator
                        </span>
                      )}
                      {u.role === 'Foydalanuvchi' && (
                        <span className="text-slate-600 font-medium">
                          Foydalanuvchi
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {u.status === 'Faol' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Faol
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          Bloklangan
                        </span>
                      )}
                    </td>

                    {/* Sana */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {u.registeredDate}
                    </td>

                    {/* Amallar */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.isBlocked ? (
                          <>
                            <button
                              onClick={() => toggleBlockStatus(u.id)}
                              className="px-3 py-1 rounded-lg border border-[#00DF81] text-[#05372d] hover:bg-[#00DF81]/10 text-xs font-bold transition-colors"
                            >
                              Blokdan chiqarish
                            </button>
                            <button
                              onClick={() => setSelectedUserForEdit(u)}
                              className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                            >
                              Tafsilotlar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setSelectedUserForEdit(u)}
                              className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5 text-slate-400" />
                              <span>Tahrirlash</span>
                            </button>
                            <button
                              onClick={() => toggleBlockStatus(u.id)}
                              title="Bloklash"
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>1 – 10 / 124 500 ko&apos;rsatilmoqda</span>

            <div className="flex items-center gap-1.5 font-semibold">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Oldingi</span>
              </button>

              <button
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 rounded-xl font-bold transition-all ${
                  currentPage === 1
                    ? 'bg-[#0b2620] text-white shadow-sm'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                1
              </button>

              <button
                onClick={() => setCurrentPage(2)}
                className={`w-8 h-8 rounded-xl font-bold transition-all ${
                  currentPage === 2
                    ? 'bg-[#0b2620] text-white shadow-sm'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                2
              </button>

              <button
                onClick={() => setCurrentPage(3)}
                className={`w-8 h-8 rounded-xl font-bold transition-all ${
                  currentPage === 3
                    ? 'bg-[#0b2620] text-white shadow-sm'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                3
              </button>

              <span className="px-1 text-slate-400">...</span>

              <button
                onClick={() => setCurrentPage(12450)}
                className="w-12 h-8 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                12450
              </button>

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <span>Keyingi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit User Modal */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-slide-up border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-400">{selectedUserForEdit.id}</span>
                <h3 className="text-base font-extrabold text-slate-800">
                  {selectedUserForEdit.name ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUserForEdit(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">To&apos;liq ism (F.I.SH)</label>
                <input
                  type="text"
                  required
                  value={selectedUserForEdit.name}
                  onChange={(e) =>
                    setSelectedUserForEdit({ ...selectedUserForEdit, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#00DF81]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Telefon raqam</label>
                <input
                  type="text"
                  required
                  value={selectedUserForEdit.phone}
                  onChange={(e) =>
                    setSelectedUserForEdit({ ...selectedUserForEdit, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#00DF81]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Hudud / Filial</label>
                <input
                  type="text"
                  value={selectedUserForEdit.region}
                  onChange={(e) =>
                    setSelectedUserForEdit({ ...selectedUserForEdit, region: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#00DF81]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Rol</label>
                <select
                  value={selectedUserForEdit.role}
                  onChange={(e) =>
                    setSelectedUserForEdit({ ...selectedUserForEdit, role: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-[#00DF81]"
                >
                  <option value="Foydalanuvchi">Foydalanuvchi</option>
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Biznes profil">Biznes profil</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Status</label>
                <select
                  value={selectedUserForEdit.status}
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      status: e.target.value,
                      isBlocked: e.target.value === 'Bloklangan',
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-[#00DF81]"
                >
                  <option value="Faol">Faol</option>
                  <option value="Bloklangan">Bloklangan</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-[#05372d] bg-[#00e396] hover:bg-[#00c984] rounded-xl shadow-md"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-slide-up border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#00bfa5]" />
                <h3 className="text-base font-extrabold text-slate-800">Amallar tarixi (Audit Log)</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-80 overflow-y-auto text-xs">
              {[
                { admin: 'Sardor Admin', action: '#U-84922 Alisher T. akkauntini blokladi', time: '10 daqiqa oldin' },
                { admin: 'Rustam Qodirov', action: '#U-84923 Dilnoza K. biznes profilini tasdiqladi', time: '1 soat oldin' },
                { admin: 'Sardor Admin', action: 'Tizimga yangi admin qo\'shildi', time: 'Kecha, 16:30' },
                { admin: 'Avtomatik Tizim', action: 'Spam sababli 12 ta soxta akkaunt filtrlangan', time: 'Kecha, 12:00' },
              ].map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{log.admin}</span>
                    <p className="text-slate-600 mt-0.5">{log.action}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{log.time}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
