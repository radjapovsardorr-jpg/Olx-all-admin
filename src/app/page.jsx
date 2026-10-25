'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/components/Header';
import {
  Users, Tag, AlertTriangle, Wallet, ArrowUpRight, ArrowDownRight,
  Eye, ChevronLeft, ChevronRight, ChevronDown, Smartphone, Car,
  Building, Gamepad, Check, X, Download, RefreshCw, Inbox, Search,
  Activity, TrendingUp, Zap, ShieldCheck, Clock, Star, BarChart3,
  CircleDot, Flame,
} from 'lucide-react';
import { initialStats, initialRecentListings } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

/* ------------------------------------------------------------------ */
/*  CHART CONFIG                                                        */
/* ------------------------------------------------------------------ */
const COLOR_VISITS   = '#23E5DB';
const COLOR_LISTINGS = '#FFCE32';
const W = 760, H = 300;
const PAD = { l: 56, r: 56, t: 24, b: 38 };
const INNER = 24;

const CHART_DATA = {
  Kunlik: {
    subtitle: 'Bugungi kun — 3 soatlik oraliqlar',
    labels: ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'],
    full:   ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'],
    visits:   [820,  430, 1260, 2840, 3920, 4310, 3680, 2150],
    listings: [ 64,   28,  120,  260,  340,  372,  318,  190],
  },
  Haftalik: {
    subtitle: "So'nggi 7 kunlik statistika",
    labels: ['Dush','Sesh','Chor','Pay','Jum','Shan','Yak'],
    full:   ['Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba','Yakshanba'],
    visits:   [9800, 12400, 11200, 10600, 18420, 16300, 13100],
    listings: [1020,  1310,  1190,  1240,  1840,  1620,  1380],
  },
  Oylik: {
    subtitle: "So'nggi 30 kunlik statistika",
    labels: ['1-okt','4-okt','7-okt','10-okt','13-okt','16-okt','19-okt','22-okt','25-okt','28-okt'],
    full:   ['1-oktabr','4-oktabr','7-oktabr','10-oktabr','13-oktabr','16-oktabr','19-oktabr','22-oktabr','25-oktabr','28-oktabr'],
    visits:   [48200,52100,49800,57400,61200,58900,66300,72800,69100,75400],
    listings: [4200, 4650, 4400, 5100, 5480, 5230, 5900, 6420, 6150, 6710],
  },
  Yillik: {
    subtitle: 'Joriy yil — oylar kesimida',
    labels: ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt'],
    full:   ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr'],
    visits:   [182000,195000,214000,208000,236000,251000,244000,268000,289000,312000],
    listings: [16200, 17100, 19400, 18600, 21300, 22800, 22100, 24500, 26300, 28400],
  },
};

const INTERVALS = Object.keys(CHART_DATA);
const PAGE_SIZE = 5;

/* ------------------------------------------------------------------ */
/*  HELPERS                                                             */
/* ------------------------------------------------------------------ */
const fmtNum = (n) => Number(n).toLocaleString('en-US');

const fmtAxis = (n) => {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000)      return `${+(n / 1000).toFixed(1)}K`;
  return `${n}`;
};

const niceStep = (raw) => {
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / pow;
  const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nf * pow;
};

const monotonePath = (pts) => {
  const n = pts.length;
  if (n < 2) return '';
  const dx = [], m = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1].x - pts[i].x;
    m[i]  = (pts[i + 1].y - pts[i].y) / dx[i];
  }
  const t = new Array(n);
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++)
    t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; }
    else {
      const a = t[i] / m[i], b = t[i + 1] / m[i];
      const s = a * a + b * b;
      if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
    }
  }
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C ${pts[i].x + h} ${pts[i].y + t[i] * h}, ${pts[i + 1].x - h} ${pts[i + 1].y - t[i + 1] * h}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
};

const peakIndex = (arr) => arr.indexOf(Math.max(...arr));

const getPageList = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('...');
    out.push(p);
  });
  return out;
};

/* ------------------------------------------------------------------ */
/*  STAT CARD                                                           */
/* ------------------------------------------------------------------ */
function StatCard({ label, value, icon: Icon, gradient, change, note, alert, danger = false, onClick }) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`text-left relative overflow-hidden rounded-2xl p-5 transition-all duration-300 group w-full ${
        onClick ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40' : ''
      } ${gradient}`}
    >
      {/* Decorative circle */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-500" />
      <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-700" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-semibold text-white/70 leading-tight">{label}</p>
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
            <Icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
        </div>
        <h3 className={`text-2xl font-black tracking-tight text-white flex items-center gap-2 ${danger ? 'text-red-200' : ''}`}>
          {value}
          {danger && <span className="w-2 h-2 rounded-full bg-red-300 animate-ping inline-block" />}
        </h3>
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {alert ? (
            <span className="text-red-200 flex items-center gap-1 font-semibold text-[11px]">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              {alert}
            </span>
          ) : (
            <>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/20 text-white">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />{change}
              </span>
              <span className="text-white/60 font-medium">{note}</span>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

/* ------------------------------------------------------------------ */
/*  REALTIME CARD                                                        */
/* ------------------------------------------------------------------ */
function RealtimeCard({ label, value, unit, max, maxLabel, icon: Icon, color, bgClass, prevValue }) {
  const pct = Math.min(100, (value / max) * 100);
  const went_up = prevValue !== null && value > prevValue;
  const went_down = prevValue !== null && value < prevValue;

  return (
    <div className={`rounded-2xl p-5 border relative overflow-hidden ${bgClass}`}>
      {/* Live badge */}
      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: color }} />
        <span className="text-[10px] font-black tracking-widest uppercase" style={{ color }}>Jonli</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '22' }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <p className="text-xs font-semibold text-white/60 leading-tight">{label}</p>
      </div>

      <div className="flex items-end gap-2 mb-3">
        <span className="text-3xl font-black text-white tabular-nums" style={{ transition: 'all 0.5s ease' }}>
          {fmtNum(value)}
        </span>
        {unit && <span className="text-sm font-bold mb-1" style={{ color }}>{unit}</span>}
        {(went_up || went_down) && (
          <span className={`text-xs font-bold mb-1 flex items-center gap-0.5 ${went_up ? 'text-emerald-400' : 'text-red-400'}`}>
            {went_up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct.toFixed(1)}%`, background: color }}
        />
      </div>
      <p className="text-[10px] text-white/30 mt-1.5">{maxLabel}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const { showToast } = useApp();

  /* chart */
  const [timeFilter, setTimeFilter]           = useState('Haftalik');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [activeIdx, setActiveIdx]             = useState(() => peakIndex(CHART_DATA.Haftalik.visits));
  const [visible, setVisible]                 = useState({ visits: true, listings: true });
  const [chartKey, setChartKey]               = useState(0);
  const [isRefreshing, setIsRefreshing]       = useState(false);

  /* realtime */
  const [realtimeStats, setRealtimeStats] = useState({
    onlineUsers: 1247,
    newListingsToday: 84,
    activeModeration: 12,
  });
  const prevRT = useRef({ onlineUsers: 1247, newListingsToday: 84, activeModeration: 12 });

  useEffect(() => {
    const id = setInterval(() => {
      setRealtimeStats((prev) => {
        prevRT.current = { ...prev };
        return {
          onlineUsers:       Math.max(800, prev.onlineUsers + Math.floor((Math.random() - 0.45) * 35)),
          newListingsToday:  Math.max(0,   prev.newListingsToday + (Math.random() > 0.55 ? 1 : 0)),
          activeModeration:  Math.max(0,   prev.activeModeration + (Math.random() > 0.78 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        };
      });
    }, 2500);
    return () => clearInterval(id);
  }, []);

  /* table */
  const [activeTab, setActiveTab]           = useState('Barchasi');
  const [listings, setListings]             = useState(initialRecentListings);
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchQuery, setSearchQuery]       = useState('');
  const [currentPage, setCurrentPage]       = useState(1);

  const dropdownRef = useRef(null);
  const tableRef    = useRef(null);

  /* listeners */
  useEffect(() => {
    const onKey  = (e) => { if (e.key === 'Escape') { setSelectedListing(null); setShowTimeDropdown(false); } };
    const onDown = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowTimeDropdown(false); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, []);

  /* chart geometry */
  const data = CHART_DATA[timeFilter];

  const geo = useMemo(() => {
    const n = data.labels.length;
    const plotW = W - PAD.l - PAD.r;
    const plotH = H - PAD.t - PAD.b;
    const base  = PAD.t + plotH;
    const xs    = data.labels.map((_, i) => PAD.l + INNER + ((plotW - INNER * 2) * i) / (n - 1));
    const vStep = niceStep((Math.max(...data.visits)   * 1.1) / 4);
    const lStep = niceStep((Math.max(...data.listings) * 1.1) / 4);
    const vMax  = vStep * 4, lMax = lStep * 4;
    const yV = data.visits.map  ((v) => base - (v / vMax) * plotH);
    const yL = data.listings.map((v) => base - (v / lMax) * plotH);
    const lineV = monotonePath(xs.map((x, i) => ({ x, y: yV[i] })));
    const lineL = monotonePath(xs.map((x, i) => ({ x, y: yL[i] })));
    const closeArea = ` L ${xs[n - 1]} ${base} L ${xs[0]} ${base} Z`;
    return { n, plotH, base, xs, yV, yL, vStep, lStep, lineV, lineL,
      areaV: lineV + closeArea, areaL: lineL + closeArea, colW: xs[1] - xs[0] };
  }, [data]);

  const idx = Math.min(activeIdx, geo.n - 1);

  const totals = useMemo(() => {
    const sumV = data.visits.reduce((a, b) => a + b, 0);
    const sumL = data.listings.reduce((a, b) => a + b, 0);
    const pk   = peakIndex(data.visits);
    return { sumV, sumL, rate: ((sumL / sumV) * 100).toFixed(1), peakLabel: data.full[pk], peakValue: data.visits[pk] };
  }, [data]);

  /* chart handlers */
  const changeInterval = (opt) => { setTimeFilter(opt); setActiveIdx(peakIndex(CHART_DATA[opt].visits)); setShowTimeDropdown(false); setChartKey((k) => k + 1); };
  const toggleSeries   = (key) => {
    setVisible((prev) => {
      const other = key === 'visits' ? 'listings' : 'visits';
      if (prev[key] && !prev[other]) { showToast("Kamida bitta ko'rsatkich ko'rinib turishi kerak"); return prev; }
      return { ...prev, [key]: !prev[key] };
    });
  };
  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => { setIsRefreshing(false); setChartKey((k) => k + 1); showToast("Statistika yangilandi!", 'success'); }, 700);
  };

  /* tooltip */
  const tipVisits   = data.visits[idx];
  const tipListings = data.listings[idx];
  const prevVisits  = idx > 0 ? data.visits[idx - 1]   : null;
  const prevList    = idx > 0 ? data.listings[idx - 1] : null;
  const deltaV = prevVisits ? ((tipVisits   - prevVisits) / prevVisits) * 100   : null;
  const deltaL = prevList   ? ((tipListings - prevList)   / prevList)   * 100   : null;

  const tipYs      = [];
  if (visible.visits)   tipYs.push(geo.yV[idx]);
  if (visible.listings) tipYs.push(geo.yL[idx]);
  const tipTopPct  = Math.min(Math.max((Math.min(...tipYs) / H) * 100 - 8, 2), 48);
  const tipLeftPct = (geo.xs[idx] / W) * 100;
  const tipOnLeft  = idx >= geo.n / 2;

  /* table */
  const filteredListings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return listings.filter((item) => {
      const ok = !q || item.title.toLowerCase().includes(q) || item.user.toLowerCase().includes(q) || String(item.id).toLowerCase().includes(q);
      if (!ok) return false;
      if (activeTab === 'VIP')          return item.isVip;
      if (activeTab === 'Kutilayotgan') return item.status === 'Moderatsiyada';
      return true;
    });
  }, [listings, searchQuery, activeTab]);

  const tabCounts = useMemo(() => ({
    Barchasi:     listings.length,
    VIP:          listings.filter((i) => i.isVip).length,
    Kutilayotgan: listings.filter((i) => i.status === 'Moderatsiyada').length,
  }), [listings]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const startIdx   = (safePage - 1) * PAGE_SIZE;
  const pageItems  = filteredListings.slice(startIdx, startIdx + PAGE_SIZE);

  useEffect(() => { setCurrentPage(1); }, [activeTab, searchQuery]);

  const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));
  const scrollToTable = useCallback(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), []);

  const handleApprove = (id, title) => {
    setListings((prev) => prev.map((item) => item.id === id ? { ...item, status: 'Faol', statusColor: 'green' } : item));
    showToast(`"${title}" tasdiqlandi!`, 'success');
  };
  const handleReject = (id, title) => {
    setListings((prev) => prev.map((item) => item.id === id ? { ...item, status: 'Rad etilgan', statusColor: 'red' } : item));
    showToast(`"${title}" rad etildi!`, 'error');
  };
  const showAll    = () => { setActiveTab('Barchasi'); setSearchQuery(''); setCurrentPage(1); scrollToTable(); };
  const openPending = () => { setActiveTab('Kutilayotgan'); setSearchQuery(''); scrollToTable(); };

  const exportCsv = () => {
    if (!filteredListings.length) { showToast("Yuklab olish uchun e'lonlar yo'q", 'error'); return; }
    const rows = [['ID','Sarlavha','Kategoriya','Foydalanuvchi','Narx','Status'], ...filteredListings.map((i) => [i.id,i.title,i.category,i.user,i.price,i.status])];
    const csv  = '\uFEFF' + rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'elonlar.csv';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    showToast(`${filteredListings.length} ta e'lon CSV ga yuklandi`, 'success');
  };

  const getTypeIcon = (type) => {
    const cls = "w-5 h-5";
    switch (type) {
      case 'phone':   return <Smartphone className={cls} />;
      case 'car':     return <Car className={cls} />;
      case 'building':return <Building className={cls} />;
      default:        return <Gamepad className={cls} />;
    }
  };

  const statusConfig = {
    'Faol':         { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
    'Moderatsiyada':{ bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   border: 'border-amber-200'  },
    'Rad etilgan':  { bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-500',     border: 'border-red-200'    },
  };

  /* ================================================================ */
  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ background: '#f0f4f8' }}>
      <style>{`
        @keyframes dashDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes fadeIn   { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .chart-line { stroke-dasharray:1; stroke-dashoffset:0; animation: dashDraw 0.9s ease-out both; }
        .chart-area { animation: fadeIn 0.8s ease-out both; }
        .chart-dots { animation: fadeIn 0.5s ease-out 0.5s both; }
        .fade-in    { animation: fadeIn 0.4s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .chart-line,.chart-area,.chart-dots,.fade-in { animation:none; } }
      `}</style>

      <Header onSearch={setSearchQuery} />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto w-full">

        {/* ======================================================== */}
        {/*  SECTION 1 — STAT CARDS (gradient)                       */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Jami Foydalanuvchilar"
            value={initialStats.users.count}
            icon={Users}
            gradient="bg-gradient-to-br from-[#002F34] to-[#005c63]"
            change={initialStats.users.change}
            note={initialStats.users.note}
          />
          <StatCard
            label="Faol E'lonlar"
            value={initialStats.activeListings.count}
            icon={Tag}
            gradient="bg-gradient-to-br from-[#0f4c6b] to-[#1a7aab]"
            change={initialStats.activeListings.change}
            note={initialStats.activeListings.note}
          />
          <StatCard
            label="Kutilayotgan"
            value={initialStats.pendingModeration.count}
            icon={ShieldCheck}
            gradient="bg-gradient-to-br from-[#7c2d12] to-[#b45309]"
            alert={initialStats.pendingModeration.alert}
            danger
            onClick={openPending}
          />
          <StatCard
            label="Daromad (oy)"
            value={initialStats.revenue.count}
            icon={Wallet}
            gradient="bg-gradient-to-br from-[#3b1f6e] to-[#6d28d9]"
            change={initialStats.revenue.change}
            note={initialStats.revenue.note}
          />
        </div>

        {/* ======================================================== */}
        {/*  SECTION 2 — REALTIME (3 cards)                          */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RealtimeCard
            label="Hozir online foydalanuvchilar"
            value={realtimeStats.onlineUsers}
            max={2000}
            maxLabel="Maksimum: 2,000 foydalanuvchi"
            icon={Activity}
            color="#23E5DB"
            bgClass="bg-[#001f22] border-[#0a4a52]"
            prevValue={prevRT.current.onlineUsers}
          />
          <RealtimeCard
            label="Bugungi yangi e'lonlar"
            value={realtimeStats.newListingsToday}
            unit="ta"
            max={200}
            maxLabel="Kunlik maqsad: 200 ta e'lon"
            icon={TrendingUp}
            color="#FFCE32"
            bgClass="bg-[#1c1500] border-[#3d2e00]"
            prevValue={prevRT.current.newListingsToday}
          />
          <RealtimeCard
            label="Kutayotgan moderatsiya"
            value={realtimeStats.activeModeration}
            unit="ta"
            max={50}
            maxLabel="Maksimum: 50 ta kutilmoqda"
            icon={Zap}
            color="#ff7a7a"
            bgClass="bg-[#1a0505] border-[#3d1010]"
            prevValue={prevRT.current.activeModeration}
          />
        </div>

        {/* ======================================================== */}
        {/*  SECTION 3 — CHART + SUMMARY                             */}
        {/* ======================================================== */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-5 sm:p-6 pb-5 gap-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-4.5 h-4.5 text-[#23E5DB]" style={{ width: 18, height: 18 }} />
                Tashriflar va yangi e&apos;lonlar dinamikasi
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{data.subtitle}</p>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {/* Legend toggles */}
              {[
                { key: 'visits',   label: 'Tashriflar',     color: COLOR_VISITS   },
                { key: 'listings', label: "Yangi e'lonlar", color: COLOR_LISTINGS },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSeries(key)}
                  aria-pressed={visible[key]}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    visible[key]
                      ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
                      : 'bg-slate-50 border-slate-100 text-slate-400 line-through'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: visible[key] ? color : '#cbd5e1' }} />
                  {label}
                </button>
              ))}

              {/* Interval dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowTimeDropdown((s) => !s)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                >
                  <span>{timeFilter}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showTimeDropdown && (
                  <div role="listbox" className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-30 text-xs fade-in">
                    {INTERVALS.map((opt) => (
                      <button
                        key={opt} type="button" role="option" aria-selected={timeFilter === opt}
                        onClick={() => changeInterval(opt)}
                        className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${timeFilter === opt ? 'text-[#00bfa5] font-bold' : 'text-slate-600'}`}
                      >
                        {opt}
                        {timeFilter === opt && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Refresh */}
              <button
                type="button" onClick={handleRefresh} title="Yangilash"
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* SVG Chart */}
          <div className={`relative px-2 pt-2 transition-opacity duration-300 ${isRefreshing ? 'opacity-40' : 'opacity-100'}`} style={{ aspectRatio: `${W} / ${H}` }}>
            <svg key={chartKey} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full select-none" role="img" aria-label="Grafik">
              <defs>
                <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_VISITS}   stopOpacity="0.3" />
                  <stop offset="100%" stopColor={COLOR_VISITS} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_LISTINGS}   stopOpacity="0.25" />
                  <stop offset="100%" stopColor={COLOR_LISTINGS} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid */}
              {[0,1,2,3,4].map((t) => {
                const y = geo.base - (geo.plotH * t) / 4;
                return (
                  <g key={t}>
                    <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y}
                      stroke={t === 0 ? '#e2e8f0' : '#f1f5f9'} strokeWidth="1" />
                    <text x={PAD.l - 10} y={y + 4} fontSize="11" textAnchor="end"
                      fill={COLOR_VISITS} opacity={visible.visits ? 0.85 : 0.2}>
                      {fmtAxis(geo.vStep * t)}
                    </text>
                    <text x={W - PAD.r + 10} y={y + 4} fontSize="11" textAnchor="start"
                      fill={COLOR_LISTINGS} opacity={visible.listings ? 0.9 : 0.2}>
                      {fmtAxis(geo.lStep * t)}
                    </text>
                  </g>
                );
              })}

              {/* Active guide */}
              <line x1={geo.xs[idx]} x2={geo.xs[idx]} y1={PAD.t} y2={geo.base}
                stroke="#94a3b8" strokeWidth="1.25" strokeDasharray="4 4"
                style={{ transition: 'all 0.2s ease' }} />

              {/* Series */}
              <g key={`s-${chartKey}-${timeFilter}`}>
                {visible.listings && (
                  <g>
                    <path d={geo.areaL} fill="url(#gL)" className="chart-area" />
                    <path d={geo.lineL} fill="none" stroke={COLOR_LISTINGS} strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="chart-line" />
                  </g>
                )}
                {visible.visits && (
                  <g>
                    <path d={geo.areaV} fill="url(#gV)" className="chart-area" />
                    <path d={geo.lineV} fill="none" stroke={COLOR_VISITS} strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="chart-line" />
                  </g>
                )}

                <g className="chart-dots">
                  {geo.xs.map((x, i) => {
                    const on = i === idx;
                    return (
                      <g key={i}>
                        {visible.listings && (
                          <g>
                            {on && <circle cx={x} cy={geo.yL[i]} r="10" fill={COLOR_LISTINGS} opacity="0.2" />}
                            <circle cx={x} cy={geo.yL[i]} r={on ? 5.5 : 3.5} fill="#fff"
                              stroke={COLOR_LISTINGS} strokeWidth={on ? 3 : 2} style={{ transition: 'r 0.2s ease' }} />
                          </g>
                        )}
                        {visible.visits && (
                          <g>
                            {on && <circle cx={x} cy={geo.yV[i]} r="10" fill={COLOR_VISITS} opacity="0.2" />}
                            <circle cx={x} cy={geo.yV[i]} r={on ? 5.5 : 3.5} fill="#fff"
                              stroke={COLOR_VISITS} strokeWidth={on ? 3 : 2} style={{ transition: 'r 0.2s ease' }} />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </g>

              {/* X labels */}
              {data.labels.map((label, i) => (
                <text key={label} x={geo.xs[i]} y={H - 10}
                  fontSize={i === idx ? 12 : 11} fontWeight={i === idx ? 800 : 500}
                  textAnchor="middle" fill={i === idx ? '#0f172a' : '#94a3b8'}
                  style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
                  onClick={() => setActiveIdx(i)}>
                  {label}
                </text>
              ))}

              {/* Hit areas */}
              {geo.xs.map((x, i) => (
                <rect key={`hit-${i}`} x={x - geo.colW / 2} y={PAD.t}
                  width={geo.colW} height={geo.plotH + PAD.b}
                  fill="transparent" style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseMove={() => setActiveIdx(i)}
                  onTouchStart={() => setActiveIdx(i)}
                  onClick={() => setActiveIdx(i)} />
              ))}
            </svg>

            {/* Tooltip */}
            <div
              className="absolute pointer-events-none z-20 bg-[#0d1f1c] text-white p-3.5 rounded-2xl shadow-2xl border border-white/10 text-xs min-w-[180px] backdrop-blur-sm"
              style={{
                left: `${tipLeftPct}%`,
                top: `${tipTopPct}%`,
                transform: tipOnLeft ? 'translateX(calc(-100% - 18px))' : 'translateX(18px)',
                transition: 'left 0.2s ease, top 0.2s ease',
              }}
            >
              <div className="font-bold text-[#23E5DB] text-[11px] mb-2.5 flex items-center justify-between gap-3">
                <span>{data.full[idx]}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#23E5DB] animate-ping" />
              </div>
              <div className="space-y-1.5">
                {visible.visits && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLOR_VISITS }} />
                    <span className="text-[11px]">Tashriflar:</span>
                    <strong className="text-white font-bold ml-auto">{fmtNum(tipVisits)}</strong>
                  </div>
                )}
                {visible.visits && deltaV !== null && (
                  <div className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${deltaV >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {deltaV >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(deltaV).toFixed(1)}% oldingisiga nisbatan
                  </div>
                )}
                {visible.listings && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLOR_LISTINGS }} />
                    <span className="text-[11px]">E&apos;lonlar:</span>
                    <strong className="text-white font-bold ml-auto">{fmtNum(tipListings)}</strong>
                  </div>
                )}
                {visible.listings && !visible.visits && deltaL !== null && (
                  <div className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${deltaL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {deltaL >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(deltaL).toFixed(1)}% oldingisiga nisbatan
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-t border-slate-100">
            {[
              { label: 'Jami tashriflar', value: fmtNum(totals.sumV), sub: null, icon: Activity, color: COLOR_VISITS },
              { label: "Yangi e'lonlar",  value: fmtNum(totals.sumL), sub: `tashrifdan ${totals.rate}%`, icon: Tag, color: COLOR_LISTINGS },
              { label: 'Eng faol davr',   value: totals.peakLabel,    sub: fmtNum(totals.peakValue),     icon: Flame, color: '#f97316' },
            ].map((s, i) => (
              <div key={i} className={`p-5 flex items-center gap-4 ${i < 2 ? 'sm:border-r border-slate-100' : ''}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color + '18' }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400">{s.label}</p>
                  <p className="text-lg font-black text-slate-900 leading-tight">
                    {s.value}
                    {s.sub && <span className="text-xs font-bold text-slate-400 ml-2">{s.sub}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/*  SECTION 4 — LISTINGS TABLE                              */}
        {/* ======================================================== */}
        <section ref={tableRef} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden scroll-mt-6">
          {/* Table header */}
          <div className="p-5 sm:p-6 pb-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-800">So&apos;nggi e&apos;lonlar</h2>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                {listings.length} ta
              </span>
              {searchQuery.trim() && (
                <button type="button" onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#002F34]/10 text-[#002F34] text-xs font-bold hover:bg-[#002F34]/20 transition-colors">
                  <Search className="w-3 h-3" />
                  &quot;{searchQuery}&quot;
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full xl:w-auto justify-between xl:justify-end flex-wrap">
              {/* Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {['Barchasi','VIP','Kutilayotgan'].map((tab) => (
                  <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}>
                    {tab === 'VIP' && <Star className="w-3 h-3 text-amber-500" />}
                    {tab}
                    <span className={`px-1.5 rounded-md text-[10px] ${activeTab === tab ? 'bg-[#002F34]/15 text-[#002F34]' : 'bg-slate-200 text-slate-500'}`}>
                      {tabCounts[tab]}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={exportCsv}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
                <button type="button" onClick={showAll}
                  className="text-xs font-bold text-[#002F34] hover:text-[#005c63] flex items-center gap-1 transition-colors whitespace-nowrap">
                  Barchasini ko&apos;rish <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <tr className="bg-slate-50/60">
                  <th className="py-3.5 px-5">ID</th>
                  <th className="py-3.5 px-5">Mahsulot</th>
                  <th className="py-3.5 px-5">Foydalanuvchi</th>
                  <th className="py-3.5 px-5">Narx</th>
                  <th className="py-3.5 px-5 text-right">Holat &amp; amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageItems.map((item) => {
                  const sc = statusConfig[item.status] ?? statusConfig['Faol'];
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* ID */}
                      <td className="py-4 px-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-500 text-[11px]">{item.id}</span>
                          {item.isVip && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-amber-600">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />VIP
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-[#002F34]/8 transition-colors">
                            {getTypeIcon(item.type)}
                          </div>
                          <div className="min-w-0">
                            <button type="button" onClick={() => setSelectedListing(item)}
                              className="font-bold text-slate-800 hover:text-[#002F34] text-sm text-left leading-tight line-clamp-1">
                              {item.title}
                            </button>
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.category}</p>
                          </div>
                        </div>
                      </td>

                      {/* User */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#002F34]/10 text-[#002F34] font-black text-[10px] flex items-center justify-center shrink-0">
                            {item.userAvatar}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700 text-xs">{item.user}</span>
                            <p className="text-[10px] text-slate-400">{item.date}</p>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-5">
                        <span className="font-extrabold text-slate-900 text-sm whitespace-nowrap">{item.price}</span>
                      </td>

                      {/* Status + Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {item.status}
                          </span>

                          {item.status === 'Moderatsiyada' && (
                            <>
                              <button type="button" onClick={() => handleApprove(item.id, item.title)}
                                title="Tasdiqlash" aria-label="Tasdiqlash"
                                className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-colors">
                                <Check className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => handleReject(item.id, item.title)}
                                title="Rad etish" aria-label="Rad etish"
                                className="w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button type="button" onClick={() => setSelectedListing(item)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Batafsil" aria-label="Batafsil ko'rish">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {pageItems.length === 0 && (
              <div className="py-16 flex flex-col items-center text-center text-slate-400">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Inbox className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-slate-600">E&apos;lon topilmadi</p>
                <p className="text-xs mt-1">Filtr yoki qidiruv so&apos;zini o&apos;zgartiring</p>
                <button type="button" onClick={showAll}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#002F34] text-white text-xs font-bold hover:bg-[#005c63] transition-colors">
                  Filtrni tozalash
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="p-4 px-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
            <span>
              {filteredListings.length === 0
                ? "Ko'rsatiladigan e'lon yo'q"
                : `Jami ${filteredListings.length} tadan ${startIdx + 1}–${startIdx + pageItems.length} ko'rsatilmoqda`}
            </span>
            <div className="flex items-center gap-1.5 font-semibold flex-wrap justify-center">
              <button type="button" disabled={safePage === 1} onClick={() => goToPage(safePage - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" /> Oldingi
              </button>
              {getPageList(safePage, totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`d-${i}`} className="px-1 text-slate-400">...</span>
                ) : (
                  <button key={p} type="button" onClick={() => goToPage(p)}
                    className={`w-8 h-8 rounded-xl font-bold transition-all ${safePage === p ? 'bg-[#002F34] text-white shadow-sm' : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                    {p}
                  </button>
                )
              )}
              <button type="button" disabled={safePage === totalPages} onClick={() => goToPage(safePage + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Keyingi <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ============ DETAIL MODAL ============ */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedListing(null)}>
          <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden fade-in">
            {/* Modal header */}
            <div className="flex items-start justify-between p-6 pb-5 border-b border-slate-100 gap-4 bg-gradient-to-r from-[#002F34] to-[#005c63]">
              <div>
                <span className="text-[11px] font-bold text-[#23E5DB]/80">{selectedListing.id}</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">{selectedListing.title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedListing(null)} aria-label="Yopish"
                className="p-1.5 rounded-xl text-white/60 hover:bg-white/15 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Price + Status */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-4">
                <div className="flex-1">
                  <p className="text-[11px] text-slate-400 font-semibold">Narxi</p>
                  <p className="text-xl font-black text-slate-900">{selectedListing.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400 font-semibold">Holati</p>
                  {(() => {
                    const currentStatus = listings.find((l) => l.id === selectedListing.id)?.status ?? selectedListing.status;
                    const sc = statusConfig[currentStatus] ?? statusConfig['Faol'];
                    return (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {currentStatus}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2.5 text-xs">
                {[
                  { label: 'Kategoriya', value: selectedListing.category },
                  { label: 'Foydalanuvchi', value: selectedListing.user },
                  { label: "Qo'shilgan vaqt", value: selectedListing.date },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2.5 border-b border-slate-100 last:border-0">
                    <span className="text-slate-400 font-semibold">{label}</span>
                    <span className="font-bold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal actions */}
            <div className="px-6 pb-6 flex items-center justify-end gap-3">
              {(() => {
                const currentStatus = listings.find((l) => l.id === selectedListing.id)?.status ?? selectedListing.status;
                if (currentStatus === 'Moderatsiyada') return (
                  <>
                    <button type="button"
                      onClick={() => { handleReject(selectedListing.id, selectedListing.title); setSelectedListing(null); }}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition-colors border border-red-200">
                      Rad etish
                    </button>
                    <button type="button"
                      onClick={() => { handleApprove(selectedListing.id, selectedListing.title); setSelectedListing(null); }}
                      className="px-5 py-2.5 bg-[#002F34] hover:bg-[#005c63] text-white font-bold rounded-xl text-xs shadow-md transition-all">
                      Tasdiqlash
                    </button>
                  </>
                );
                return (
                  <button type="button" onClick={() => setSelectedListing(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors">
                    Yopish
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
