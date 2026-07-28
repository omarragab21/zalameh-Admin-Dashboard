import React from 'react';

interface PartnerStatsHeaderProps {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  inactiveCount: number;
}

export const PartnerStatsHeader: React.FC<PartnerStatsHeaderProps> = ({
  totalCount,
  activeCount,
  pendingCount,
  inactiveCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Partners */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي الشركاء</span>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalCount}</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d83f2a] flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>

      {/* 2. Active Partners */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">الشركاء النشطون</span>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeCount}</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* 3. Pending Review */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">قيد المراجعة</span>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{pendingCount}</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* 4. Inactive */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">غير نشط</span>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{inactiveCount}</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
