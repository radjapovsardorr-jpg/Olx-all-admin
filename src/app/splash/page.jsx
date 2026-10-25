'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(78);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#f4f7f6] flex flex-col justify-between items-center p-8 overflow-hidden select-none">
      {/* Soft Ambient Glows */}
      <div className="absolute top-[30%] left-[35%] w-[450px] h-[450px] rounded-full bg-[#00e396]/15 blur-[140px] pointer-events-none" />

      {/* Top Header Information */}
      <div className="w-full max-w-6xl flex items-center justify-between z-10 text-xs font-semibold text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00cbb4]" />
          <span className="w-2 h-2 rounded-full bg-[#00DF81]" />
          <span className="tracking-wider uppercase text-[11px] text-slate-500 font-bold">
            TOSHKENT SERVER HUB • ID: TAS-09
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px]">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>256-Bit SSL Shifrlash</span>
        </div>
      </div>

      {/* Center Hero Loader Card */}
      <div className="flex flex-col items-center justify-center text-center z-10 space-y-6 max-w-md w-full animate-slide-up">
        {/* Glow Logo Card */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#00DF81] to-[#00cbb4] opacity-30 blur-xl group-hover:opacity-50 transition-opacity" />
          <div className="relative bg-[#09221d] px-8 py-5 rounded-2xl shadow-2xl border border-[#17483e] flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-white tracking-tight">olx</span>
              <span className="bg-[#00DF81] text-[#07241d] text-xs font-black tracking-wider px-2.5 py-0.5 rounded-full uppercase shadow-[0_0_12px_rgba(0,223,129,0.5)]">
                NEO ADMIN
              </span>
            </div>
            <span className="text-[11px] font-extrabold tracking-widest text-[#00cbb4] uppercase">
              BOSHQARUV PANELI
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full space-y-2 pt-4">
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00cbb4] via-[#00DF81] to-[#f5b324] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-baseline justify-center gap-2 pt-1">
            <span className="text-sm font-extrabold text-slate-800">
              Yuklanmoqda...
            </span>
            <span className="text-sm font-black text-[#00bfa5]">
              {progress}%
            </span>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            Hududiy xavfsizlik protokollari tekshirilmoqda...
          </p>
        </div>

        {/* Verification Status Badges */}
        <div className="flex items-center gap-3 pt-2">
          <div className="px-3.5 py-1.5 rounded-full bg-[#09221d] text-white text-xs font-bold flex items-center gap-2 border border-[#17483e] shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00DF81]" />
            <span>Sessiya tasdiqlandi</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-[#09221d] text-white text-xs font-bold flex items-center gap-2 border border-[#17483e] shadow-sm">
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Kesh yangilanmoqda</span>
          </div>
        </div>

        {/* Quick Proceed button when ready */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#f5b324] hover:bg-[#e0a11c] text-[#07241d] font-black rounded-xl text-xs shadow-md transition-all transform hover:scale-105"
          >
            <span>Boshqaruv paneliga o&apos;tish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="z-10 text-center text-xs text-slate-400 font-medium flex items-center gap-2">
        <span>OLX O&apos;zbekiston Boshqaruv Tizimi v2.8.4</span>
        <span>•</span>
        <span className="text-emerald-700 font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00bfa5]" />
          Himoyalangan ulanish
        </span>
      </div>
    </div>
  );
}
