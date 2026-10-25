
'use client';

import React, { useMemo, useState } from 'react';
import Header from '@/components/Header';
import {
  Tag,
  Search,
  Download,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  Building,
  Car,
  Smartphone,
  Gamepad,
  X,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { initialRecentListings } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

const PAGE_SIZE = 6;

const STATUSES = [
  'Barchasi',
  'Faol',
  'Moderatsiyada',
  'Rad etilgan',
];

const SORTS = [
  { key: 'new', label: 'Eng yangilari' },
  { key: 'price-desc', label: 'Narx: yuqoridan' },
  { key: 'price-asc', label: 'Narx: pastdan' },
];

const TYPE_ICONS = {
  car: Car,
  phone: Smartphone,
  home: Building,
  game: Gamepad,
};

const STATUS_STYLE = {
  Faol: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-600',
    dot: 'bg-emerald-500',
    Icon: CheckCircle,
  },
  Moderatsiyada: {
    badge: 'bg-amber-50 text-amber-800 border-amber-600',
    dot: 'bg-amber-500',
    Icon: Clock,
  },
  'Rad etilgan': {
    badge: 'bg-red-50 text-red-700 border-red-500',
    dot: 'bg-red-500',
    Icon: XCircle,
  },
};

const BTN_BASE =
  'inline-flex items-center justify-center gap-2 font-extrabold text-xs rounded-xl border-2 transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00DF81]/40 disabled:opacity-40 disabled:pointer-events-none active:translate-y-[1px]';

const BTN_PRIMARY =
  BTN_BASE +
  ' px-5 py-2.5 bg-[#00e396] border-[#00c984] text-[#05372d] shadow-[0_6px_16px_-4px_rgba(0,223,129,0.6)] hover:bg-[#00f0a0]';

const BTN_OUTLINE =
  BTN_BASE +
  ' px-4 py-2.5 bg-white border-slate-300 text-slate-700 hover:border-[#00DF81] hover:text-[#05372d]';

const BTN_SMALL =
  BTN_BASE +
  ' px-3 py-1.5 bg-white border-slate-200 text-slate-700 hover:border-[#00DF81] hover:bg-[#f2fdf7]';

const BTN_DANGER =
  BTN_BASE +
  ' px-3 py-1.5 bg-white border-red-300 text-red-600 hover:border-red-500 hover:bg-red-50';

const BTN_OK =
  BTN_BASE +
  ' px-3 py-1.5 bg-white border-emerald-300 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50';

const priceToNumber = (price) =>
  Number(String(price ?? '').replace(/[^\d]/g, '')) || 0;

function getInitialListings() {
  return [
    ...(initialRecentListings || []),
    {
      id: '#1087',
      title: 'Nexia 3 Avtomat 2021',
      category: 'Transport / Yengil avtomobillar',
      type: 'car',
      user: 'Jaloliddin B.',
      userAvatar: 'JB',
      price: "115 000 000 so'm",
      status: 'Faol',
      date: 'Bugun, 10:15',
      isVip: true,
    },
    {
      id: '#1088',
      title: 'Samsung Galaxy S24 Ultra',
      category: 'Elektronika / Telefonlar',
      type: 'phone',
      user: 'Timur S.',
      userAvatar: 'TS',
      price: "13 800 000 so'm",
      status: 'Faol',
      date: 'Kecha, 20:00',
      isVip: false,
    },
  ];
}

function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.Moderatsiyada;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 text-[11px] font-extrabold ${style.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  Icon,
  tone,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border-2 bg-white transition-all ${
        active
          ? 'border-[#00DF81] shadow-md'
          : 'border-slate-200 hover:border-[#00DF81] hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-500">
          {label}
        </span>

        <span
          className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${tone}`}
        >
          <Icon className="w-4 h-4" />
        </span>
      </div>

      <p className="mt-3 text-3xl font-black text-slate-900 tabular-nums">
        {value}
      </p>

      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
        {hint}
      </p>
    </button>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label
      className="inline-flex items-center cursor-pointer"
      aria-label={label}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />

      <span className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white flex items-center justify-center transition-colors peer-checked:bg-[#00e396] peer-checked:border-[#00c984] peer-focus-visible:ring-4 peer-focus-visible:ring-[#00DF81]/40">
        {checked && (
          <svg
            viewBox="0 0 12 12"
            className="w-3 h-3 text-slate-900"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M2 6.5l2.5 2.5L10 3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </label>
  );
}

function Avatar({ text }) {
  return (
    <span className="w-8 h-8 rounded-lg border-2 border-[#bff3d9] bg-[#e8fbf1] text-[#05372d] text-[10px] font-black flex items-center justify-center shrink-0">
      {text || '??'}
    </span>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="py-16 px-6 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center">
        <Search className="w-6 h-6 text-slate-400" />
      </div>

      <h3 className="mt-4 text-sm font-extrabold text-slate-800">
        E&apos;lon topilmadi
      </h3>

      <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
        Qidiruv yoki filtrni o&apos;zgartirib ko&apos;ring.
      </p>

      <button
        type="button"
        onClick={onReset}
        className={`${BTN_OUTLINE} mt-5`}
      >
        <RotateCcw className="w-4 h-4" />
        Filtrlarni tozalash
      </button>
    </div>
  );
}

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-[#00DF81] focus:ring-4 focus:ring-[#00DF81]/20';

export default function ElonlarPage() {
  const { showToast } = useApp();

  const [listings, setListings] = useState(getInitialListings);

  const [statusFilter, setStatusFilter] = useState('Barchasi');
  const [searchVal, setSearchVal] = useState('');
  const [sortKey, setSortKey] = useState('new');
  const [onlyVip, setOnlyVip] = useState(false);

  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const [newListing, setNewListing] = useState({
    title: '',
    category: '',
    type: 'phone',
    user: '',
    price: '',
    isVip: false,
  });

  const counts = useMemo(() => {
    const result = {
      Barchasi: listings.length,
      Faol: 0,
      Moderatsiyada: 0,
      'Rad etilgan': 0,
    };

    listings.forEach((item) => {
      if (result[item.status] !== undefined) {
        result[item.status] += 1;
      }
    });

    return result;
  }, [listings]);

  const vipCount = useMemo(
    () => listings.filter((item) => item.isVip).length,
    [listings]
  );

  const filtered = useMemo(() => {
    const query = searchVal.trim().toLowerCase();

    let result = listings.filter((item) => {
      const title = String(item.title || '').toLowerCase();
      const user = String(item.user || '').toLowerCase();
      const id = String(item.id || '').toLowerCase();
      const category = String(item.category || '').toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        user.includes(query) ||
        id.includes(query) ||
        category.includes(query);

      const matchesStatus =
        statusFilter === 'Barchasi' ||
        item.status === statusFilter;

      const matchesVip = !onlyVip || item.isVip;

      return matchesSearch && matchesStatus && matchesVip;
    });

    if (sortKey === 'price-desc') {
      result = [...result].sort(
        (a, b) => priceToNumber(b.price) - priceToNumber(a.price)
      );
    }

    if (sortKey === 'price-asc') {
      result = [...result].sort(
        (a, b) => priceToNumber(a.price) - priceToNumber(b.price)
      );
    }

    return result;
  }, [listings, searchVal, statusFilter, onlyVip, sortKey]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const page = Math.min(currentPage, totalPages);

  const pageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const allOnPageSelected =
    pageItems.length > 0 &&
    pageItems.every((item) => selectedIds.includes(item.id));

  const activeSortLabel =
    SORTS.find((item) => item.key === sortKey)?.label ||
    'Eng yangilari';

  const resetFilters = () => {
    setSearchVal('');
    setStatusFilter('Barchasi');
    setOnlyVip(false);
    setSortKey('new');
    setCurrentPage(1);
    setSortOpen(false);
  };

  const updateStatus = (ids, status) => {
    if (!ids.length) return;

    setListings((previous) =>
      previous.map((item) =>
        ids.includes(item.id)
          ? { ...item, status }
          : item
      )
    );

    setSelectedListing((previous) =>
      previous && ids.includes(previous.id)
        ? { ...previous, status }
        : previous
    );

    showToast(
      ids.length === 1
        ? `${ids[0]} e'lon statusi: ${status}`
        : `${ids.length} ta e'lon statusi: ${status}`
    );
  };

  const removeListings = (ids) => {
    if (!ids.length) return;

    const confirmed = window.confirm(
      `${ids.length} ta e'lonni o'chirmoqchimisiz?`
    );

    if (!confirmed) return;

    setListings((previous) =>
      previous.filter((item) => !ids.includes(item.id))
    );

    setSelectedIds((previous) =>
      previous.filter((id) => !ids.includes(id))
    );

    setSelectedListing((previous) =>
      previous && ids.includes(previous.id) ? null : previous
    );

    showToast(`${ids.length} ta e'lon o'chirildi`);
  };

  const toggleOne = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id]
    );
  };

  const toggleAllOnPage = (checked) => {
    const ids = pageItems.map((item) => item.id);

    setSelectedIds((previous) =>
      checked
        ? Array.from(new Set([...previous, ...ids]))
        : previous.filter((id) => !ids.includes(id))
    );
  };

  const openAddModal = () => {
    setNewListing({
      title: '',
      category: '',
      type: 'phone',
      user: '',
      price: '',
      isVip: false,
    });

    setShowAddModal(true);
  };

  const handleAddListing = (event) => {
    event.preventDefault();

    const title = newListing.title.trim();
    const category = newListing.category.trim();
    const user = newListing.user.trim();
    const price = newListing.price.trim();

    if (!title || !category || !user || !price) {
      showToast("Barcha maydonlarni to'ldiring!");
      return;
    }

    const numericPrice = priceToNumber(price);

    if (numericPrice <= 0) {
      showToast("Narx 0 dan katta bo'lishi kerak!");
      return;
    }

    const maxId = listings.reduce((max, item) => {
      const number =
        Number(String(item.id).replace(/\D/g, '')) || 0;

      return Math.max(max, number);
    }, 1000);

    const avatar = user
      .split(/\s+/)
      .map((part) => part[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const listing = {
      id: `#${maxId + 1}`,
      title,
      category,
      type: newListing.type,
      user,
      userAvatar: avatar,
      price: `${numericPrice.toLocaleString('ru-RU')} so'm`,
      status: 'Moderatsiyada',
      date: new Date().toLocaleString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      isVip: newListing.isVip,
    };

    setListings((previous) => [listing, ...previous]);

    setStatusFilter('Barchasi');
    setSearchVal('');
    setOnlyVip(false);
    setSortKey('new');
    setCurrentPage(1);
    setSelectedIds([]);

    setShowAddModal(false);

    setNewListing({
      title: '',
      category: '',
      type: 'phone',
      user: '',
      price: '',
      isVip: false,
    });

    showToast("Yangi e'lon muvaffaqiyatli qo'shildi!");
  };

  const exportListingsCSV = () => {
    if (listings.length === 0) {
      showToast("Eksport qilish uchun e'lon mavjud emas!");
      return;
    }

    const columns = [
      ['ID', 'id'],
      ['Sarlavha', 'title'],
      ['Kategoriya', 'category'],
      ['Turi', 'type'],
      ['Sotuvchi', 'user'],
      ['Narx', 'price'],
      ['Status', 'status'],
      ['Sana', 'date'],
      ['VIP', 'isVip'],
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    const csv = [
      columns.map(([label]) => escapeCSV(label)).join(';'),
      ...filtered.map((item) =>
        columns
          .map(([, key]) =>
            escapeCSV(
              key === 'isVip'
                ? item[key]
                  ? 'Ha'
                  : "Yo'q"
                : item[key]
            )
          )
          .join(';')
      ),
    ].join('\r\n');

    const blob = new Blob(['\uFEFF', csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'elonlar.csv';

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast("Ko'rsatilayotgan e'lonlar CSV faylga eksport qilindi!");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f3f7f5] min-h-screen">
      <Header
        onSearch={(value) => {
          setSearchVal(value);
          setCurrentPage(1);
        }}
      />

      <main className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Title and actions */}
        <section className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border-2 border-[#bff3d9] bg-[#e8fbf1]">
              <span className="w-2 h-2 rounded-full bg-[#00DF81]" />
              <span className="text-[11px] font-extrabold text-[#05372d]">
                E&apos;lonlar boshqaruvi
              </span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mt-3 tracking-tight">
              Barcha e&apos;lonlar bazasi
            </h1>

            <p className="text-sm text-slate-500 font-medium mt-1 max-w-xl">
              Saytdagi e&apos;lonlarni tekshiring, tasdiqlang yoki rad eting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={exportListingsCSV}
              className={BTN_OUTLINE}
            >
              <Download className="w-4 h-4" />
              Eksport (CSV)
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className={BTN_PRIMARY}
            >
              <Plus className="w-4 h-4" />
              E&apos;lon joylashtirish
            </button>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Jami e'lonlar"
            value={counts.Barchasi}
            hint="Bazadagi barcha e'lonlar"
            Icon={Layers}
            tone="border-slate-200 bg-slate-100 text-slate-700"
            active={statusFilter === 'Barchasi'}
            onClick={() => {
              setStatusFilter('Barchasi');
              setCurrentPage(1);
            }}
          />

          <StatCard
            label="Faol"
            value={counts.Faol}
            hint="Saytda ko'rinib turibdi"
            Icon={CheckCircle}
            tone="border-emerald-600 bg-emerald-50 text-emerald-700"
            active={statusFilter === 'Faol'}
            onClick={() => {
              setStatusFilter('Faol');
              setCurrentPage(1);
            }}
          />

          <StatCard
            label="Moderatsiyada"
            value={counts.Moderatsiyada}
            hint="Tekshiruvni kutmoqda"
            Icon={Clock}
            tone="border-amber-600 bg-amber-50 text-amber-700"
            active={statusFilter === 'Moderatsiyada'}
            onClick={() => {
              setStatusFilter('Moderatsiyada');
              setCurrentPage(1);
            }}
          />

          <StatCard
            label="Rad etilgan"
            value={counts['Rad etilgan']}
            hint="Qoidalarga mos kelmagan"
            Icon={XCircle}
            tone="border-red-500 bg-red-50 text-red-600"
            active={statusFilter === 'Rad etilgan'}
            onClick={() => {
              setStatusFilter('Rad etilgan');
              setCurrentPage(1);
            }}
          />
        </section>

        {/* Filters */}
        <section className="bg-white p-4 rounded-2xl border-2 border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                value={searchVal}
                onChange={(event) => {
                  setSearchVal(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="ID, sarlavha yoki sotuvchi..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00DF81] focus:bg-white"
              />

              {searchVal && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchVal('');
                    setCurrentPage(1);
                  }}
                  aria-label="Qidiruvni tozalash"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border-2 border-slate-200 bg-slate-50">
              {STATUSES.map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-extrabold transition-all ${
                    statusFilter === status
                      ? 'bg-white border-[#00DF81] text-slate-900 shadow-sm'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {status}

                  <span
                    className={`min-w-[18px] px-1 rounded-md text-[10px] font-black ${
                      statusFilter === status
                        ? 'bg-[#00e396] text-[#05372d]'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {counts[status]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setOnlyVip((previous) => !previous);
                setCurrentPage(1);
              }}
              aria-pressed={onlyVip}
              className={`${BTN_BASE} px-3.5 py-2.5 ${
                onlyVip
                  ? 'bg-amber-50 border-amber-400 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-[#00DF81]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              VIP ({vipCount})
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((previous) => !previous)}
                className={BTN_OUTLINE}
                aria-expanded={sortOpen}
              >
                {activeSortLabel}

                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    sortOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {sortOpen && (
                <div className="absolute right-0 mt-2 w-48 z-20 bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden">
                  {SORTS.map((sort) => (
                    <button
                      type="button"
                      key={sort.key}
                      onClick={() => {
                        setSortKey(sort.key);
                        setSortOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 ${
                        sortKey === sort.key
                          ? 'bg-[#d9fbe9] text-[#05372d]'
                          : 'text-slate-700'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3 rounded-2xl border-2 border-[#00DF81] bg-[#e8fbf1] text-[#05372d]">
            <p className="text-xs font-bold">
              <span className="text-[#00a86b] font-black">
                {selectedIds.length} ta
              </span>{' '}
              e&apos;lon tanlandi
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  updateStatus(selectedIds, 'Faol');
                  setSelectedIds([]);
                }}
                className={`${BTN_BASE} px-3 py-1.5 bg-[#00e396] border-[#00e396] text-[#05372d]`}
              >
                <CheckCircle className="w-4 h-4" />
                Tasdiqlash
              </button>

              <button
                type="button"
                onClick={() => {
                  updateStatus(selectedIds, 'Rad etilgan');
                  setSelectedIds([]);
                }}
                className={`${BTN_BASE} px-3 py-1.5 bg-white border-slate-200 text-slate-700`}
              >
                <XCircle className="w-4 h-4" />
                Rad etish
              </button>

              <button
                type="button"
                onClick={() => removeListings(selectedIds)}
                className={`${BTN_BASE} px-3 py-1.5 bg-white border-red-200 text-red-600`}
              >
                <Trash2 className="w-4 h-4" />
                O'chirish
              </button>

              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2 py-1.5 text-xs font-bold text-slate-500"
              >
                Bekor qilish
              </button>
            </div>
          </section>
        )}

        {/* Listings table */}
        <section className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[880px]">
              <thead className="bg-slate-50 border-b-2 border-slate-100 text-[11px] font-bold text-slate-400">
                <tr>
                  <th className="py-3.5 pl-6 pr-2 w-10">
                    <Checkbox
                      checked={allOnPageSelected}
                      onChange={toggleAllOnPage}
                      label="Sahifadagi hammasini tanlash"
                    />
                  </th>

                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Sarlavha va kategoriya</th>
                  <th className="py-3.5 px-4">Foydalanuvchi</th>
                  <th className="py-3.5 px-4">Narx</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Amallar</th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-slate-100">
                {pageItems.map((item) => {
                  const TypeIcon = TYPE_ICONS[item.type] || Tag;
                  const checked = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        checked ? 'bg-[#effdf6]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-4 pl-6 pr-2">
                        <Checkbox
                          checked={checked}
                          onChange={() => toggleOne(item.id)}
                          label={`${item.id} ni tanlash`}
                        />
                      </td>

                      <td className="py-4 px-4 font-black text-slate-400">
                        {item.id}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                            <TypeIcon className="w-4 h-4 text-slate-800" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-extrabold text-slate-900 text-sm truncate">
                                {item.title}
                              </p>

                              {item.isVip && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border-2 border-amber-500 bg-amber-50 text-amber-800 text-[10px] font-black shrink-0">
                                  <Sparkles className="w-3 h-3" />
                                  VIP
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-400 truncate">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar text={item.userAvatar} />

                          <div>
                            <p className="font-bold text-slate-800">
                              {item.user}
                            </p>

                            <p className="text-[11px] text-slate-400">
                              {item.date}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-black text-slate-900 text-sm whitespace-nowrap">
                        {item.price}
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          {item.status === 'Moderatsiyada' && (
                            <>
                              <button
                                type="button"
                                onClick={() => updateStatus([item.id], 'Faol')}
                                className={BTN_OK}
                                aria-label="Tasdiqlash"
                                title="Tasdiqlash"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus([item.id], 'Rad etilgan')
                                }
                                className={BTN_DANGER}
                                aria-label="Rad etish"
                                title="Rad etish"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedListing(item)}
                            className={BTN_SMALL}
                          >
                            <Eye className="w-4 h-4" />
                            Batafsil
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <EmptyState onReset={resetFilters} />
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t-2 border-slate-100 bg-slate-50/70">
              <p className="text-xs font-semibold text-slate-500">
                <span className="font-black text-slate-900">
                  {filtered.length}
                </span>{' '}
                ta e&apos;londan{' '}
                <span className="font-black text-slate-900">
                  {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)}
                </span>{' '}
                ko&apos;rsatilmoqda
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage(Math.max(1, page - 1))
                  }
                  disabled={page === 1}
                  className={`${BTN_SMALL} !px-2.5`}
                  aria-label="Oldingi sahifa"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((number) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    aria-current={number === page ? 'page' : undefined}
                    className={`${BTN_BASE} w-9 h-9 ${
                      number === page
                        ? 'bg-[#00e396] border-[#00c984] text-[#05372d]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-[#00DF81]'
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, page + 1))
                  }
                  disabled={page === totalPages}
                  className={`${BTN_SMALL} !px-2.5`}
                  aria-label="Keyingi sahifa"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Add listing modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-listing-title"
            className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-b-2 border-[#bff3d9] bg-[#e8fbf1]">
              <div>
                <h2
                  id="add-listing-title"
                  className="text-lg font-black text-slate-900"
                >
                  Yangi e&apos;lon joylashtirish
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  E&apos;lon ma&apos;lumotlarini kiriting
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Yopish"
                className="p-2 rounded-lg border-2 border-slate-200 bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddListing} className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="listing-title"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  E&apos;lon sarlavhasi
                </label>

                <input
                  id="listing-title"
                  required
                  maxLength={120}
                  value={newListing.title}
                  onChange={(event) =>
                    setNewListing((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Masalan, Samsung Galaxy S24"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label
                  htmlFor="listing-category"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Kategoriya
                </label>

                <input
                  id="listing-category"
                  required
                  maxLength={100}
                  value={newListing.category}
                  onChange={(event) =>
                    setNewListing((previous) => ({
                      ...previous,
                      category: event.target.value,
                    }))
                  }
                  placeholder="Elektronika / Telefonlar"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label
                  htmlFor="listing-type"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  E&apos;lon turi
                </label>

                <select
                  id="listing-type"
                  value={newListing.type}
                  onChange={(event) =>
                    setNewListing((previous) => ({
                      ...previous,
                      type: event.target.value,
                    }))
                  }
                  className={INPUT_CLASS}
                >
                  <option value="phone">Telefon / Elektronika</option>
                  <option value="car">Avtomobil</option>
                  <option value="home">Uy-joy</option>
                  <option value="game">O&apos;yinlar</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="listing-user"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Sotuvchi ismi
                </label>

                <input
                  id="listing-user"
                  required
                  maxLength={80}
                  value={newListing.user}
                  onChange={(event) =>
                    setNewListing((previous) => ({
                      ...previous,
                      user: event.target.value,
                    }))
                  }
                  placeholder="Masalan, Ali Valiyev"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label
                  htmlFor="listing-price"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Narx (so&apos;m)
                </label>

                <input
                  id="listing-price"
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={newListing.price}
                  onChange={(event) =>
                    setNewListing((previous) => ({
                      ...previous,
                      price: event.target.value,
                    }))
                  }
                  placeholder="Masalan, 1500000"
                  className={INPUT_CLASS}
                />
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newListing.isVip}
                  onChange={(event) =>
                    setNewListing((previous) => ({
                      ...previous,
                      isVip: event.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-emerald-500"
                />

                <span className="text-sm font-bold text-slate-700">
                  VIP e&apos;lon
                </span>
              </label>

              <p className="text-xs text-slate-500">
                Yangi e&apos;lon dastlab moderatsiyaga yuboriladi.
              </p>

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={BTN_OUTLINE}
                >
                  Bekor qilish
                </button>

                <button type="submit" className={BTN_PRIMARY}>
                  <Plus className="w-4 h-4" />
                  E&apos;lonni qo&apos;shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Listing details modal */}
      {selectedListing && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedListing(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="listing-detail-title"
            className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b-2 border-[#bff3d9] bg-[#e8fbf1]">
              <div className="min-w-0">
                <p className="text-[11px] font-black text-[#05372d]/70">
                  {selectedListing.id}
                </p>

                <h3
                  id="listing-detail-title"
                  className="font-black text-slate-900 text-lg leading-snug"
                >
                  {selectedListing.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedListing(null)}
                aria-label="Yopish"
                className="p-1.5 rounded-lg border-2 border-slate-200 bg-white text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusBadge status={selectedListing.status} />

                {selectedListing.isVip && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-amber-500 bg-amber-50 text-amber-800 text-[11px] font-black">
                    <Sparkles className="w-3.5 h-3.5" />
                    VIP e&apos;lon
                  </span>
                )}
              </div>

              <p className="text-3xl font-black text-slate-900">
                {selectedListing.price}
              </p>

              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border-2 border-slate-200">
                  <dt className="font-bold text-slate-400">
                    Kategoriya
                  </dt>
                  <dd className="mt-1 font-extrabold text-slate-800">
                    {selectedListing.category}
                  </dd>
                </div>

                <div className="p-3 rounded-xl border-2 border-slate-200">
                  <dt className="font-bold text-slate-400">
                    Joylangan vaqt
                  </dt>
                  <dd className="mt-1 font-extrabold text-slate-800">
                    {selectedListing.date || '—'}
                  </dd>
                </div>

                <div className="p-3 rounded-xl border-2 border-slate-200 col-span-2">
                  <dt className="font-bold text-slate-400">
                    Sotuvchi
                  </dt>

                  <dd className="mt-2 flex items-center gap-2.5">
                    <Avatar text={selectedListing.userAvatar} />
                    <span className="font-extrabold text-slate-800">
                      {selectedListing.user}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t-2 border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => removeListings([selectedListing.id])}
                className={BTN_DANGER}
              >
                <Trash2 className="w-4 h-4" />
                O&apos;chirish
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {selectedListing.status !== 'Rad etilgan' && (
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        [selectedListing.id],
                        'Rad etilgan'
                      )
                    }
                    className={BTN_OUTLINE}
                  >
                    <XCircle className="w-4 h-4" />
                    Rad etish
                  </button>
                )}

                {selectedListing.status !== 'Faol' && (
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus([selectedListing.id], 'Faol')
                    }
                    className={BTN_PRIMARY}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Tasdiqlash
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedListing(null)}
                  className={BTN_OUTLINE}
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
