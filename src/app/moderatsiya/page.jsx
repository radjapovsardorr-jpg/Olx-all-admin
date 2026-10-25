'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Phone,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Edit3,
  Check,
  X,
  AlertCircle,
  Flame,
  Camera,
  Layers,
  ChevronDown
} from 'lucide-react';
import { initialModerationQueue } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function ModeratsiyaPage() {
  const { showToast } = useApp();

  const [queueTab, setQueueTab] = useState('Kutilmoqda'); // 'Kutilmoqda' | 'Tasdiqlangan' | 'Rad etilgan'
  const [items, setItems] = useState(initialModerationQueue);
  const [selectedId, setSelectedId] = useState(initialModerationQueue[0]?.id);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [rejectReason, setRejectReason] = useState('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Active selected item
  const selectedItem = items.find((i) => i.id === selectedId) || items[0];

  const handleApprove = () => {
    if (!selectedItem) return;
    showToast(`"${selectedItem.title}" muvaffaqiyatli tasdiqlandi va saytda e'lon qilindi!`, 'success');
    // Remove from queue or update status
    setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
    if (items.length > 1) {
      const nextItem = items.find((i) => i.id !== selectedItem.id);
      setSelectedId(nextItem?.id);
      setActivePhotoIdx(0);
    }
  };

  const handleReject = () => {
    if (!selectedItem) return;
    if (!rejectReason.trim()) {
      showToast('Iltimos, rad etish sababini kiriting!', 'error');
      return;
    }
    showToast(`"${selectedItem.title}" rad etildi. Sabab: ${rejectReason}`, 'error');
    setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
    setRejectReason('');
    if (items.length > 1) {
      const nextItem = items.find((i) => i.id !== selectedItem.id);
      setSelectedId(nextItem?.id);
      setActivePhotoIdx(0);
    }
  };

  const handleRequestEdit = () => {
    if (!selectedItem) return;
    showToast(`Sotuvchiga (${selectedItem.seller.name}) e'lonni tahrirlash so'rovi yuborildi!`, 'success');
  };

  const quickReasonPresets = [
    "Noto'g'ri narx ko'rsatilgan",
    "Fotosurat sifatsiz yoki suv belgisi bor",
    "Taqiqlangan mahsulot / xizmat",
    "Dublikat e'lon",
    "Tavsifda kontakt qoldirilgan"
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#f6f9f8] min-h-screen">
      <Header onSearch={setSearchQuery} />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Control Bar: Tabs and Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Main Status Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setQueueTab('Kutilmoqda')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                queueTab === 'Kutilmoqda'
                  ? 'bg-[#00DF81] text-[#05372d] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Kutilmoqda</span>
              <span className="bg-slate-900/15 px-2 py-0.5 rounded-full text-[11px] font-extrabold">
                12
              </span>
            </button>

            <button
              onClick={() => {
                setQueueTab('Tasdiqlangan');
                showToast('Tasdiqlangan e\'lonlar arxivi yuklanmoqda');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                queueTab === 'Tasdiqlangan'
                  ? 'bg-[#00DF81] text-[#05372d]'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Tasdiqlangan</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[11px] text-slate-500">
                489
              </span>
            </button>

            <button
              onClick={() => {
                setQueueTab('Rad etilgan');
                showToast('Rad etilgan e\'lonlar ro\'yxati');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                queueTab === 'Rad etilgan'
                  ? 'bg-[#00DF81] text-[#05372d]'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Rad etilgan</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[11px] text-slate-500">
                34
              </span>
            </button>
          </div>

          {/* Filters Right */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Kategoriya: {categoryFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showCategoryDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-30 text-xs">
                  {['Barchasi', 'Avtotransport', 'Elektronika', "Ko'chmas mulk"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Tag */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Sana: Bugun</span>
            </div>

            {/* Fast search by ID or Seller */}
            <div className="relative flex-1 md:w-48">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ID yoki sotuvchi..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00DF81]"
              />
            </div>
          </div>
        </div>

        {/* Main Content Layout: Split Panel (Left Queue + Right Detail) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Queue List (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-soft p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-extrabold text-slate-800">
                  Kutilayotgan e&apos;lonlar navbati
                </h3>
                <span className="px-1.5 py-0.5 rounded-md bg-[#00e396]/15 text-[#05372d] text-[10px] font-bold">
                  {items.length} ta
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#00bfa5]">
                <span className="w-2 h-2 rounded-full bg-[#00bfa5] animate-pulse" />
                <span>Jonli oqim</span>
              </div>
            </div>

            {/* Cards List */}
            <div className="space-y-3">
              {items.map((item) => {
                const isSelected = item.id === selectedItem?.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setActivePhotoIdx(0);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 relative ${
                      isSelected
                        ? 'border-[#00DF81] bg-[#00DF81]/5 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail with photo count badge */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden relative flex-shrink-0 bg-slate-100">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white rounded text-[9px] font-semibold flex items-center gap-0.5">
                          <Camera className="w-2.5 h-2.5" />
                          {item.photoCount} foto
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-semibold text-slate-400 truncate">
                            {item.category}
                          </span>
                          {item.urgent && (
                            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 text-[9px] font-bold flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5" />
                              Shoshilinch
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">
                          {item.title}
                        </h4>

                        <p className="text-xs font-extrabold text-[#05372d] mt-1">
                          {item.price}
                        </p>

                        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                          <span className="truncate flex items-center gap-1 font-medium">
                            <span className="w-3.5 h-3.5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] text-slate-700 font-bold">
                              {item.seller.initials}
                            </span>
                            {item.seller.name}
                          </span>
                          <span className="flex-shrink-0">{item.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Single Item Detail View (8 cols) */}
          {selectedItem && (
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 space-y-6">
              {/* Header inside detail */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black tracking-wide">
                    • {selectedItem.status} {selectedItem.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Bugun, 14:22
                  </span>
                </div>

                {/* Seller Quick Card */}
                <div className="flex items-center gap-3 p-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center">
                    {selectedItem.seller.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800">
                        {selectedItem.seller.name}
                      </span>
                      {selectedItem.seller.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5]" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {selectedItem.seller.phone}
                    </span>
                  </div>
                  <button
                    onClick={() => showToast(`Sotuvchi ${selectedItem.seller.name} sahifasiga o'tilmoqda`)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                    title="Profilni ko'rish"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title and Price */}
              <div>
                <span className="text-xs font-bold text-[#00bfa5] tracking-wider uppercase">
                  {selectedItem.category}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-1">
                  <h2 className="text-xl font-black text-slate-900">
                    {selectedItem.title}
                  </h2>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#05372d]">
                      {selectedItem.price}
                    </span>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {selectedItem.usdPrice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Photos Carousel matching screenshot */}
              <div className="space-y-3">
                {/* Main Image View */}
                <div className="relative rounded-2xl overflow-hidden h-80 bg-slate-900 group">
                  <img
                    src={selectedItem.images[activePhotoIdx]}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {/* Photo Index Tag */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-xs text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Asosiy rasm ({activePhotoIdx + 1} / {selectedItem.images.length})</span>
                  </div>

                  {/* Zoom button */}
                  <button
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-xl backdrop-blur-xs transition-colors"
                    title="Kattalashtirish"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  {/* Carousel Prev/Next Buttons */}
                  <button
                    onClick={() =>
                      setActivePhotoIdx((prev) =>
                        prev === 0 ? selectedItem.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActivePhotoIdx((prev) =>
                        prev === selectedItem.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Thumbnails strip */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {selectedItem.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activePhotoIdx === idx
                          ? 'border-[#00DF81] shadow-sm scale-102'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Specs Grid matching screenshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Ishlab chiqarilgan yili
                  </span>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                    {selectedItem.specs.year}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Yurgan masofasi
                  </span>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                    {selectedItem.specs.mileage}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Yoqilg&apos;i turi
                  </span>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                    {selectedItem.specs.fuel}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Joylashuv
                  </span>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0" />
                    <span>{selectedItem.specs.location}</span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tavsif</span>
                </h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  {selectedItem.description}
                </div>
              </div>

              {/* Rejection / Revision Reason Input Box */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-800">
                    Rad etish yoki tuzatish sababi
                  </label>
                  <span className="text-slate-400 text-[11px]">
                    Ixtiyoriy (rad etilganda majburiy)
                  </span>
                </div>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Rad etish sababi... (masalan: noto'g'ri narx, fotosurat sifatsiz yoki taqiqlangan mahsulot)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00DF81] transition-all"
                />

                {/* Quick Presets Pills */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {quickReasonPresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setRejectReason(preset)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-semibold transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handleRequestEdit}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-slate-500" />
                  <span>Tahrirlashni so&apos;rash</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleReject}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#d92d20] hover:bg-[#b92318] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Rad etish</span>
                  </button>

                  <button
                    onClick={handleApprove}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#0e3a32] hover:bg-[#144d43] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Check className="w-4 h-4 text-[#00DF81]" />
                    <span>Tasdiqlash</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Zoom Modal */}
      {isZoomOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-[#00DF81] p-2"
            >
              <X className="w-7 h-7" />
            </button>
            <img
              src={selectedItem.images[activePhotoIdx]}
              alt={selectedItem.title}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white text-xs mt-3 font-semibold">
              {selectedItem.title} ({activePhotoIdx + 1} / {selectedItem.images.length})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
