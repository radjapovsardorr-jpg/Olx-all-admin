
'use client';

import React, { useMemo, useState } from 'react';
import Header from '@/components/Header';
import {
  CreditCard,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileText,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Filter,
  X,
  RefreshCw,
} from 'lucide-react';
import { initialTransactions } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

const PAGE_SIZE = 10;

const CHART_DATA = {
  Kun: {
    labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'],
    main: [5, 9, 12, 11, 17, 13, 20],
    extra: [2, 5, 7, 6, 9, 7, 11],
  },
  Hafta: {
    labels: ['Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha', 'Ya'],
    main: [7, 11, 9, 15, 13, 18, 16],
    extra: [3, 6, 5, 8, 7, 10, 8],
  },
  Oy: {
    labels: ['1-Okt', '5-Okt', '10-Okt', '15-Okt', '20-Okt', '25-Okt', '30-Okt'],
    main: [5, 9, 12, 11, 17, 13, 20],
    extra: [2, 5, 7, 6, 9, 7, 11],
  },
  Yil: {
    labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul'],
    main: [6, 8, 12, 10, 14, 17, 20],
    extra: [2, 4, 6, 5, 8, 9, 12],
  },
};

function money(value) {
  return new Intl.NumberFormat('uz-UZ').format(value);
}

function amountNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function downloadCSV(filename, rows) {
  const content =
    '\uFEFF' +
    rows.map((row) => row.map(csvCell).join(';')).join('\r\n');

  const blob = new Blob([content], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function statusStyle(status) {
  if (status === 'Muvaffaqiyatli') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }

  if (status === 'Kutilmoqda') {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }

  return 'border-red-200 bg-red-50 text-red-600';
}

function statusDot(status) {
  if (status === 'Muvaffaqiyatli') return 'bg-emerald-500';
  if (status === 'Kutilmoqda') return 'bg-amber-500';
  return 'bg-red-500';
}

export default function TolovlarPage() {
  const { showToast } = useApp();

  const [transactions] = useState(() =>
    Array.isArray(initialTransactions) ? initialTransactions : []
  );

  const [timeTab, setTimeTab] = useState('Oy');
  const [selectedPoint, setSelectedPoint] = useState(4);
  const [searchVal, setSearchVal] = useState('');
  const [methodFilter, setMethodFilter] = useState('Barchasi');
  const [statusFilter, setStatusFilter] = useState('Barchasi');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reportTitle, setReportTitle] = useState('Moliyaviy hisobot');
  const [reportPeriod, setReportPeriod] = useState('Oy');

  const filteredTransactions = useMemo(() => {
    const query = searchVal.trim().toLowerCase();

    return transactions.filter((tx) => {
      const matchesSearch =
        !query ||
        String(tx.id ?? '').toLowerCase().includes(query) ||
        String(tx.user ?? '').toLowerCase().includes(query) ||
        String(tx.phone ?? '').toLowerCase().includes(query) ||
        String(tx.serviceType ?? '').toLowerCase().includes(query);

      const matchesMethod =
        methodFilter === 'Barchasi' || tx.method === methodFilter;

      const matchesStatus =
        statusFilter === 'Barchasi' || tx.status === statusFilter;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [transactions, searchVal, methodFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE)
  );

  const page = Math.min(currentPage, totalPages);

  const visibleTransactions = filteredTransactions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const successful = transactions.filter(
    (tx) => tx.status === 'Muvaffaqiyatli'
  );

  const pending = transactions.filter(
    (tx) => tx.status === 'Kutilmoqda'
  );

  const cancelled = transactions.filter(
    (tx) => tx.status === 'Bekor qilingan'
  );

  const totalRevenue = successful.reduce(
    (sum, tx) => sum + amountNumber(tx.amount),
    0
  );

  const successRate = transactions.length
    ? ((successful.length / transactions.length) * 100).toFixed(1)
    : '0.0';

  const paymentBreakdown = ['Payme', 'Click', 'Uzum Bank'].map((method) => {
    const items = successful.filter((tx) => tx.method === method);
    const total = items.reduce((sum, tx) => sum + amountNumber(tx.amount), 0);

    return {
      method,
      total,
      count: items.length,
      percent: totalRevenue ? (total / totalRevenue) * 100 : 0,
    };
  });

  const chart = CHART_DATA[timeTab];
  const points = chart.main.map((value, index) => ({
    x: 45 + index * 92,
    y: 185 - value * 8,
    value,
    label: chart.labels[index],
  }));

  const extraPoints = chart.extra.map((value, index) => ({
    x: 45 + index * 92,
    y: 185 - value * 8,
    value,
    label: chart.labels[index],
  }));

  const linePath = (list) =>
    list
      .map((point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
      )
      .join(' ');

  const areaPath = (list) => {
    if (!list.length) return '';
    return `${linePath(list)} L ${list[list.length - 1].x} 200 L ${list[0].x} 200 Z`;
  };

  const activePoint = points[
    Math.max(0, Math.min(selectedPoint, points.length - 1))
  ];

  function resetFilters() {
    setSearchVal('');
    setMethodFilter('Barchasi');
    setStatusFilter('Barchasi');
    setCurrentPage(1);
    showToast('Filtrlar tozalandi', 'success');
  }

  function exportTransactions() {
    if (!filteredTransactions.length) {
      showToast('Eksport uchun tranzaksiya topilmadi', 'error');
      return;
    }

    const rows = [
      [
        'Tranzaksiya ID',
        'Foydalanuvchi',
        'Telefon',
        'Xizmat',
        'Tafsilot',
        'Summa',
        "To'lov usuli",
        'Sana',
        'Status',
      ],
      ...filteredTransactions.map((tx) => [
        tx.id,
        tx.user,
        tx.phone,
        tx.serviceType,
        tx.serviceDetail ?? '',
        tx.amount,
        tx.method,
        tx.date,
        tx.status,
      ]),
    ];

    downloadCSV('tolovlar.csv', rows);
    showToast('CSV fayl yuklab olindi', 'success');
  }

  function generateReport() {
    if (!reportTitle.trim()) {
      showToast('Hisobot nomini kiriting', 'error');
      return;
    }

    const rows = [
      ['Hisobot nomi', reportTitle],
      ['Davr', reportPeriod],
      ['Tranzaksiyalar', transactions.length],
      ['Muvaffaqiyatli tolovlar', successful.length],
      ['Kutilayotgan tolovlar', pending.length],
      ['Bekor qilingan tolovlar', cancelled.length],
      ['Jami tushum UZS', totalRevenue],
      [],
      [
        'Tranzaksiya ID',
        'Foydalanuvchi',
        'Telefon',
        'Xizmat',
        'Summa',
        "To'lov usuli",
        'Sana',
        'Status',
      ],
      ...transactions.map((tx) => [
        tx.id,
        tx.user,
        tx.phone,
        tx.serviceType,
        tx.amount,
        tx.method,
        tx.date,
        tx.status,
      ]),
    ];

    downloadCSV('moliyaviy-hisobot.csv', rows);
    setShowReport(false);
    showToast('Hisobot yuklab olindi', 'success');
  }

  return (
    <div className="min-h-screen flex-1 bg-[#f6f9f8]">
      <Header onSearch={setSearchVal} />

      <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Sahifa sarlavhasi */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00DF81]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00bfa5]">
                MOLIYA VA HISOBOTLAR
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-black text-slate-900">
              To&apos;lovlar va tushum tahlili
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              To&apos;lovlarni boshqarish va moliyaviy hisobotlar.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              {new Date().toLocaleDateString('uz-UZ')}
            </div>

            <button
              type="button"
              onClick={() => setShowReport(true)}
              className="flex items-center gap-2 rounded-xl bg-[#09221d] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#123931]"
            >
              <FileText className="h-4 w-4 text-[#00DF81]" />
              Yangi hisobot
            </button>
          </div>
        </div>

        {/* Statistika */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Jami tushum"
            value={money(totalRevenue)}
            suffix="UZS"
            icon={<CreditCard className="h-5 w-5" />}
            iconClass="bg-cyan-50 text-cyan-600"
            footer="Muvaffaqiyatli to'lovlar summasi"
          />

          <StatCard
            title="Muvaffaqiyatli to'lovlar"
            value={money(successful.length)}
            suffix="ta"
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconClass="bg-emerald-50 text-emerald-600"
            footer={`Muvaffaqiyat: ${successRate}%`}
          />

          <StatCard
            title="Kutilayotgan to'lovlar"
            value={money(pending.length)}
            suffix="ta"
            icon={<Wallet className="h-5 w-5" />}
            iconClass="bg-amber-50 text-amber-600"
            footer="Tekshirilayotgan tranzaksiyalar"
          />

          <StatCard
            title="Bekor qilingan"
            value={money(cancelled.length)}
            suffix="ta"
            icon={<AlertTriangle className="h-5 w-5" />}
            iconClass="bg-red-50 text-red-500"
            footer={`Jami ${money(transactions.length)} ta tranzaksiya`}
          />
        </div>

        {/* Grafik va to'lov usullari */}
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 xl:col-span-2">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-extrabold text-slate-800">
                  Tushum dinamikasi
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Grafik nuqtasini bosib ko&apos;rsatkichni ko&apos;ring
                </p>
              </div>

              <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
                {['Kun', 'Hafta', 'Oy', 'Yil'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setTimeTab(tab);
                      setSelectedPoint(0);
                    }}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                      timeTab === tab
                        ? 'bg-[#00cbb4] text-white'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-5 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#00cbb4]" />
                Asosiy tushum
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#f5b324]" />
                Qo&apos;shimcha tushum
              </span>
            </div>

            <div className="mt-4 w-full">
              <svg
                viewBox="0 0 650 225"
                className="h-auto w-full overflow-visible"
                role="img"
                aria-label={`${timeTab} tushum grafigi`}
              >
                <defs>
                  <linearGradient
                    id="revenueAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#00cbb4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00cbb4" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {[30, 70, 110, 150, 190].map((y) => (
                  <line
                    key={y}
                    x1="40"
                    y1={y}
                    x2="610"
                    y2={y}
                    stroke="#e2edf0"
                    strokeDasharray="4 4"
                  />
                ))}

                <path d={areaPath(points)} fill="url(#revenueAreaGradient)" />

                <path
                  d={linePath(points)}
                  fill="none"
                  stroke="#00cbb4"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d={linePath(extraPoints)}
                  fill="none"
                  stroke="#f5b324"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <line
                  x1={activePoint.x}
                  y1="25"
                  x2={activePoint.x}
                  y2="200"
                  stroke="#00cbb4"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />

                {points.map((point, index) => (
                  <g
                    key={point.label}
                    role="button"
                    tabIndex={0}
                    aria-label={`${point.label}: ${point.value}`}
                    className="cursor-pointer"
                    onClick={() => setSelectedPoint(index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedPoint(index);
                      }
                    }}
                  >
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={selectedPoint === index ? 7 : 4.5}
                      fill="white"
                      stroke="#00cbb4"
                      strokeWidth="3"
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="13"
                      fill="transparent"
                    />
                  </g>
                ))}

                {extraPoints.map((point) => (
                  <circle
                    key={`extra-${point.label}`}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="#f5b324"
                  />
                ))}

                {points.map((point) => (
                  <text
                    key={`label-${point.label}`}
                    x={point.x}
                    y="218"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                  >
                    {point.label}
                  </text>
                ))}
              </svg>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">
                  {timeTab}: {activePoint.label}
                </p>
                <p className="mt-1 text-lg font-black text-slate-900">
                  {activePoint.value} mln UZS
                </p>
              </div>

              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                Demo ko&apos;rsatkichi
              </span>
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              Grafikdagi qiymatlar namunaviy. Haqiqiy tushum grafigi uchun
              backenddan sana va summa ma&apos;lumotlari kerak.
            </p>
          </section>

          {/* To'lov usullari */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <h2 className="font-extrabold text-slate-800">To&apos;lov usullari</h2>
            <p className="mt-1 text-xs text-slate-400">
              Muvaffaqiyatli tranzaksiyalar bo&apos;yicha
            </p>

            <div className="my-6 flex justify-center">
              <div
                className="relative flex h-44 w-44 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(
                    #00cbb4 0% ${paymentBreakdown[0].percent}%,
                    #0b2620 ${paymentBreakdown[0].percent}% ${
                      paymentBreakdown[0].percent + paymentBreakdown[1].percent
                    }%,
                    #f5b324 ${
                      paymentBreakdown[0].percent + paymentBreakdown[1].percent
                    }% 100%
                  )`,
                }}
              >
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white text-center">
                  <span className="text-[10px] font-bold text-slate-400">
                    JAMI TUSHUM
                  </span>
                  <span className="mt-1 text-sm font-black text-slate-900">
                    {money(totalRevenue)}
                  </span>
                  <span className="text-[10px] text-slate-500">UZS</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {paymentBreakdown.map((item, index) => (
                <div
                  key={item.method}
                  className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        index === 0
                          ? 'bg-[#00cbb4]'
                          : index === 1
                          ? 'bg-[#0b2620]'
                          : 'bg-[#f5b324]'
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-800">
                      {item.method}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-slate-900">
                      {item.percent.toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {money(item.total)} UZS
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Tranzaksiyalar jadvali */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-extrabold text-slate-800">
                So&apos;nggi to&apos;lov operatsiyalari
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {filteredTransactions.length} ta natija topildi
              </p>
            </div>

            <button
              type="button"
              onClick={exportTransactions}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#09221d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#123931]"
            >
              <Download className="h-4 w-4" />
              CSV yuklab olish
            </button>
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 p-4 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchVal}
                onChange={(event) => {
                  setSearchVal(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="ID, ism, telefon yoki xizmat qidirish..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#00cbb4]"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Filtrlarni yashirish' : 'Filtrlarni ko‘rsatish'}
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Tozalash
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 border-b border-slate-100 bg-white p-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                To&apos;lov usuli
                <select
                  value={methodFilter}
                  onChange={(event) => {
                    setMethodFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#00cbb4]"
                >
                  <option value="Barchasi">Barchasi</option>
                  <option value="Payme">Payme</option>
                  <option value="Click">Click</option>
                  <option value="Uzum Bank">Uzum Bank</option>
                </select>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                Status
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#00cbb4]"
                >
                  <option value="Barchasi">Barchasi</option>
                  <option value="Muvaffaqiyatli">Muvaffaqiyatli</option>
                  <option value="Kutilmoqda">Kutilmoqda</option>
                  <option value="Bekor qilingan">Bekor qilingan</option>
                </select>
              </label>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Tranzaksiya ID</th>
                  <th className="px-5 py-4">Foydalanuvchi</th>
                  <th className="px-5 py-4">Xizmat turi</th>
                  <th className="px-5 py-4">Summa</th>
                  <th className="px-5 py-4">To&apos;lov usuli</th>
                  <th className="px-5 py-4">Sana va vaqt</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleTransactions.map((tx, index) => (
                  <tr
                    key={`${tx.id ?? 'tx'}-${index}`}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-mono font-bold text-slate-900">
                      {tx.id ?? '—'}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">
                        {tx.user ?? 'Noma’lum'}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {tx.phone ?? '—'}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-700">
                        {tx.serviceType ?? '—'}
                      </p>
                      {tx.serviceDetail && (
                        <p className="mt-1 text-[11px] text-slate-400">
                          {tx.serviceDetail}
                        </p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-extrabold text-slate-900">
                      {typeof tx.amount === 'number'
                        ? `${money(tx.amount)} UZS`
                        : tx.amount ?? '0 UZS'}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1.5 font-bold text-slate-700">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            tx.method === 'Payme'
                              ? 'bg-[#00cbb4]'
                              : tx.method === 'Click'
                              ? 'bg-slate-800'
                              : 'bg-amber-500'
                          }`}
                        />
                        {tx.method ?? 'Noma’lum'}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {tx.date ?? '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-bold ${statusStyle(tx.status)}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusDot(tx.status)}`}
                        />
                        {tx.status ?? 'Noma’lum'}
                      </span>
                    </td>
                  </tr>
                ))}

                {visibleTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <Search className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 font-bold text-slate-700">
                        Tranzaksiya topilmadi
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Qidiruv yoki filtrlarni o&apos;zgartiring.
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white"
                      >
                        Filtrlarni tozalash
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sahifalash */}
          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:px-5">
            <p className="text-xs text-slate-500">
              {filteredTransactions.length === 0
                ? '0 ta natija'
                : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                    page * PAGE_SIZE,
                    filteredTransactions.length
                  )} / ${filteredTransactions.length} ta`}
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Oldingi
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (number) =>
                    number === 1 ||
                    number === totalPages ||
                    Math.abs(number - page) <= 1
                )
                .reduce((result, number, index, list) => {
                  if (index > 0 && number - list[index - 1] > 1) {
                    result.push('...');
                  }
                  result.push(number);
                  return result;
                }, [])
                .map((number, index) =>
                  number === '...' ? (
                    <span key={`dots-${index}`} className="px-1 text-slate-400">
                      ...
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold ${
                        page === number
                          ? 'bg-[#0b2620] text-white'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-40"
              >
                Keyingi
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Hisobot oynasi */}
      {showReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowReport(false);
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Moliyaviy hisobot
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Hisobot nomi va davrini tanlang.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowReport(false)}
                aria-label="Yopish"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Hisobot nomi
                </label>
                <input
                  value={reportTitle}
                  onChange={(event) => setReportTitle(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#00cbb4]"
                  placeholder="Hisobot nomi"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Hisobot davri
                </label>
                <select
                  value={reportPeriod}
                  onChange={(event) => setReportPeriod(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#00cbb4]"
                >
                  <option value="Kun">Kun</option>
                  <option value="Hafta">Hafta</option>
                  <option value="Oy">Oy</option>
                  <option value="Yil">Yil</option>
                </select>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tranzaksiyalar</span>
                  <strong>{money(transactions.length)}</strong>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-slate-600">Jami tushum</span>
                  <strong>{money(totalRevenue)} UZS</strong>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReport(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
                >
                  Bekor qilish
                </button>

                <button
                  type="button"
                  onClick={generateReport}
                  className="flex-1 rounded-xl bg-[#09221d] px-4 py-3 text-sm font-bold text-white hover:bg-[#123931]"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Yuklab olish
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, suffix, icon, iconClass, footer }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">{title}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
            <h3 className="break-words text-xl font-black text-slate-900">
              {value}
            </h3>
            <span className="text-xs font-bold text-slate-500">{suffix}</span>
          </div>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>{icon}</div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
        {footer}
      </div>
    </div>
  );
}
