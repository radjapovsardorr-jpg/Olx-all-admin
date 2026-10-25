'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  User,
  ExternalLink,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ZoomIn,
  X,
  Send,
  Ban,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import { initialComplaints } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function ShikoyatlarPage() {
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState('Barchasi');
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selectedId, setSelectedId] = useState(initialComplaints[0]?.id);
  const [priorityFilter, setPriorityFilter] = useState('Barchasi');
  const [searchVal, setSearchVal] = useState('');
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedComplaint = complaints.find((c) => c.id === selectedId) || complaints[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Jonli shikoyatlar oqimi yangilandi!', 'success');
    }, 600);
  };

  const handleSendWarning = () => {
    if (!selectedComplaint) return;
    showToast(`Sotuvchiga (${selectedComplaint.sellerName}) rasmiy tizim ogohlantirishi yuborildi!`, 'warning');
  };

  const handleBlockListingAndAccount = () => {
    if (!selectedComplaint) return;
    showToast(
      `E'lon zudlik bilan bloklandi va sotuvchi (${selectedComplaint.sellerName}) akkaunti to'xtatildi!`,
      'error'
    );
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint.id ? { ...c, status: 'Hal qilindi' } : c
      )
    );
  };

  const handleDismissComplaint = () => {
    if (!selectedComplaint) return;
    showToast(`Shikoyat (#${selectedComplaint.rawId}) asossiz deb topildi va yopildi.`, 'info');
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint.id ? { ...c, status: 'Hal qilindi' } : c
      )
    );
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchVal.toLowerCase()) ||
      c.complainant.toLowerCase().includes(searchVal.toLowerCase()) ||
      c.targetItem.toLowerCase().includes(searchVal.toLowerCase());
    if (!matchesSearch) return false;
    if (priorityFilter !== 'Barchasi') {
      if (priorityFilter === 'Yuqori' && c.priorityLevel !== 'high') return false;
      if (priorityFilter === 'O\'rta' && c.priorityLevel !== 'medium') return false;
      if (priorityFilter === 'Past' && c.priorityLevel !== 'low') return false;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f6f9f8] min-h-screen">
      <Header onSearch={setSearchVal} />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">
                XAVFSIZLIK VA NAZORAT MARKAZI • JONLI OQIM
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Foydalanuvchilar shikoyatlari
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Xavfsizlik qoidalarining buzilishi, firibgarlik va noo&apos;rin e&apos;lonlar nazorati
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Jonli navbat: 12 moderator faol</span>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-[#09221d] hover:bg-[#123931] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Yangilash</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft flex items-center justify-between border-l-4 border-l-red-500">
            <div>
              <div className="flex items-center gap-1.5 text-red-500 text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>YANGI SHIKOYATLAR</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-2xl font-black text-slate-900">24 ta</h3>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px]">
                <span className="text-red-600 font-bold">Tezkor ko&apos;rib chiqish talab etiladi</span>
                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 font-bold rounded">
                  Shoshilinch
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-amber-600 text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>KO&apos;RIB CHIQILMOQDA</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-2xl font-black text-slate-900">18 ta</h3>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                <span>Moderatorlar tekshirmoqda</span>
                <span>•</span>
                <span>O&apos;rtacha vaqt: 18 min</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>HAL QILINGAN / YOPILGAN</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-2xl font-black text-slate-900">342 ta</h3>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                <span>Oxirgi 30 kunda</span>
                <span className="text-emerald-600 font-bold">+14.2% samaradorlik</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {[
              { label: 'Barchasi', count: 384 },
              { label: "E'lonlar bo'yicha", count: 240 },
              { label: "Foydalanuvchilar bo'yicha", count: 96 },
              { label: "Xabarlar bo'yicha", count: 48 },
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === tab.label
                    ? 'bg-[#00DF81] text-[#05372d] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-bold opacity-80">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Saralash:</span>
            <span className="font-bold text-slate-800">Oxirgi kelganlar (Yangi)</span>
          </div>
        </div>

        {/* Filters and Priority Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="ID, sabab yoki foydalanuvchi qidirish..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00DF81]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-bold">Prioritet:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00DF81]"
              >
                <option value="Barchasi">Barchasi</option>
                <option value="Yuqori">Yuqori Xavf</option>
                <option value="O'rta">O&apos;rta</option>
                <option value="Past">Past</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => showToast('Shikoyatlar hisoboti CSV formatida yuklandi')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Eksport (CSV)</span>
          </button>
        </div>

        {/* Split View: Left List (5 cols) + Right Detail (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Complaints List */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-soft p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-800">
                Shikoyatlar ro&apos;yxati
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Jami 384 tadan {filteredComplaints.length} tasi
              </span>
            </div>

            <div className="space-y-3">
              {filteredComplaints.map((item) => {
                const isSelected = item.id === selectedComplaint?.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#00DF81] bg-[#00DF81]/5 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-extrabold text-slate-800 text-xs">
                        {item.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.priorityLevel === 'high'
                            ? 'bg-red-100 text-red-700'
                            : item.priorityLevel === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">
                      {item.targetItem}
                    </h4>

                    <p className="text-[11px] text-red-600 font-medium mt-0.5 truncate">
                      {item.reasonTitle}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <span>{item.complainant}</span>
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Investigation Pane */}
          {selectedComplaint && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">
                      {selectedComplaint.id}
                    </h2>
                    <span className="px-2.5 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                      {selectedComplaint.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedComplaint.date} da kelib tushgan
                  </p>
                </div>
              </div>

              {/* Reason Title */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  SHIKOYAT SABABI
                </span>
                <h3 className="text-base font-extrabold text-red-600 mt-0.5">
                  {selectedComplaint.reasonTitle}
                </h3>
              </div>

              {/* Statement from Complainant */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Shikoyat matni (Ariza beruvchidan):</span>
                </span>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;{selectedComplaint.text}&rdquo;
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-medium">
                    Ariza beruvchi: <strong className="text-slate-800">{selectedComplaint.complainant}</strong>
                  </span>
                  <span className="text-[#00bfa5] font-bold text-[11px]">
                    {selectedComplaint.complainantNote}
                  </span>
                </div>
              </div>

              {/* Target Object Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    OBYEKT MA&apos;LUMOTLARI
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: 210948
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
                    <img
                      src={selectedComplaint.evidenceImages[0] || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=200&q=80'}
                      alt="target"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {selectedComplaint.targetItem}
                    </h4>
                    <p className="text-xs font-extrabold text-red-600 mt-0.5">
                      {selectedComplaint.targetPrice}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Sotuvchi: <strong>{selectedComplaint.sellerName}</strong> ({selectedComplaint.sellerDays} ro&apos;yxatdan o&apos;tgan, 1 ta e&apos;lon)
                    </p>
                  </div>
                </div>
              </div>

              {/* Evidence Images */}
              {selectedComplaint.evidenceImages && selectedComplaint.evidenceImages.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Ilova qilingan dalillar ({selectedComplaint.evidenceImages.length} ta skrinshot):
                  </span>
                  <div className="flex items-center gap-3">
                    {selectedComplaint.evidenceImages.map((imgUrl, i) => (
                      <div
                        key={i}
                        onClick={() => setZoomedImage(imgUrl)}
                        className="w-28 h-20 rounded-xl overflow-hidden border border-slate-200 cursor-pointer relative group flex-shrink-0 bg-slate-100"
                      >
                        <img src={imgUrl} alt="evidence" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                          <ZoomIn className="w-4 h-4 mr-1" />
                          Ko&apos;rish
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Automatic Recommendation Box */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Avtomatik tizim tavsiyasi
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    {selectedComplaint.aiRecommendation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSendWarning}
                  className="w-full py-2.5 bg-[#f5b324] hover:bg-[#e0a11c] text-[#07241d] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Ogohlantirish yuborish</span>
                </button>

                <button
                  onClick={handleBlockListingAndAccount}
                  className="w-full py-2.5 bg-[#d92d20] hover:bg-[#b92318] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Ban className="w-4 h-4" />
                  <span>E&apos;lon va akkauntni bloklash</span>
                </button>

                <button
                  onClick={handleDismissComplaint}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Asossiz deb rad etish</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Banner */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00bfa5]" />
            <span>
              <strong>Eslatma:</strong> Qasddan soxta shikoyat jo&apos;natgan foydalanuvchilar reytingi pasaytiriladi va 3 ta asossiz shikoyatdan keyin cheklanadi.
            </span>
          </div>
          <button
            onClick={() => showToast('Moderatsiya nizomi ochildi')}
            className="text-[#00bfa5] font-bold hover:underline flex items-center gap-1"
          >
            <span>Moderatsiya nizomi</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full flex flex-col items-center">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#00DF81] p-2"
            >
              <X className="w-7 h-7" />
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed evidence"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
