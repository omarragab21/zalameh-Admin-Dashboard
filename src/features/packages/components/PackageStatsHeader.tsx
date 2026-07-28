import React from 'react';

interface PackageStatsHeaderProps {
  totalCount: number;
  activeCount: number;
  featuredCount: number;
}

export const PackageStatsHeader: React.FC<PackageStatsHeaderProps> = ({
  totalCount,
  activeCount,
  featuredCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn" dir="rtl">
      {/* 1. Total Packages Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-extrabold text-slate-400 mb-1">إجمالي الباقات</p>
          <h3 className="text-2xl font-black text-slate-900">{totalCount}</h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#d83f2a] flex items-center justify-center text-xl shrink-0 shadow-inner">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>

      {/* 2. Active Packages Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-extrabold text-slate-400 mb-1">الباقات النشطة</p>
          <h3 className="text-2xl font-black text-slate-900">{activeCount}</h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0 shadow-inner">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* 3. Featured Packages Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-extrabold text-slate-400 mb-1">الباقات المميزة</p>
          <h3 className="text-2xl font-black text-slate-900">{featuredCount}</h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl shrink-0 shadow-inner">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
