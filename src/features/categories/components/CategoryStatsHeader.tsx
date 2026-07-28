import React from 'react';

interface CategoryStatsHeaderProps {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
}

export const CategoryStatsHeader: React.FC<CategoryStatsHeaderProps> = ({
  totalCount,
  activeCount,
  inactiveCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Total Main Categories */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between transition hover:shadow-md">
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">
            إجمالي الفئات الرئيسية
          </span>
          <span className="text-2xl font-black text-slate-900">{totalCount}</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-red-50 text-[#d83f2a] flex items-center justify-center shrink-0">
          {/* Stacked Layers Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 4H5m14 4H5M19 7H5" />
          </svg>
        </div>
      </div>

      {/* 2. Active Categories */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between transition hover:shadow-md">
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">
            الفئات النشطة
          </span>
          <span className="text-2xl font-black text-slate-900">{activeCount}</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          {/* Stacked Layers Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 4H5m14 4H5M19 7H5" />
          </svg>
        </div>
      </div>

      {/* 3. Inactive Categories */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between transition hover:shadow-md">
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">
            الفئات غير النشطة
          </span>
          <span className="text-2xl font-black text-slate-900">{inactiveCount}</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
          {/* Stacked Layers Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 4H5m14 4H5M19 7H5" />
          </svg>
        </div>
      </div>
    </div>
  );
};
