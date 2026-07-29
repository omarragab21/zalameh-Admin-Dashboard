import React from 'react';
import type { AdFilterPlacement, AdFilterStatus, AdFilterType } from '../types/ad.types';

interface AdsFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  placementFilter: AdFilterPlacement;
  onPlacementFilterChange: (p: AdFilterPlacement) => void;
  statusFilter: AdFilterStatus;
  onStatusFilterChange: (s: AdFilterStatus) => void;
  advertiserTypeFilter: AdFilterType;
  onAdvertiserTypeFilterChange: (t: AdFilterType) => void;
}

export const AdsFilterBar: React.FC<AdsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  placementFilter,
  onPlacementFilterChange,
  statusFilter,
  onStatusFilterChange,
  advertiserTypeFilter,
  onAdvertiserTypeFilterChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      {/* 1. General Search */}
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5">
          بحث عام
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالعنوان أو اسم المعلن..."
            className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Placement Area Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5">
          منطقة الإعلان (مكان العرض)
        </label>
        <select
          value={placementFilter}
          onChange={(e) => onPlacementFilterChange(e.target.value as AdFilterPlacement)}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition cursor-pointer"
        >
          <option value="all">الكل</option>
          <option value="hero_banner">Hero Banner (أعلى الرئيسية)</option>
          <option value="moving_banner">Moving Banner Ad (تحت السلايدر)</option>
          <option value="offers_page">Offers Page (صفحة العروض)</option>
          <option value="featured_partners">Featured Partners (الشركاء المميزين)</option>
          <option value="promo_codes">Promo Codes (أكواد الخصم)</option>
          <option value="jobs_page">Jobs Page (صفحة الوظائف)</option>
        </select>
      </div>

      {/* 3. Status Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5">
          حالة الإعلان
        </label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as AdFilterStatus)}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition cursor-pointer"
        >
          <option value="all">الكل</option>
          <option value="published">منشور</option>
          <option value="hidden">مخفي</option>
        </select>
      </div>

      {/* 4. Advertiser Type Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5">
          نوع المعلن
        </label>
        <select
          value={advertiserTypeFilter}
          onChange={(e) => onAdvertiserTypeFilterChange(e.target.value as AdFilterType)}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition cursor-pointer"
        >
          <option value="all">الكل</option>
          <option value="STORE">متجر داخل النظام (STORE)</option>
          <option value="EXTERNAL">معلن خارجي (EXTERNAL)</option>
        </select>
      </div>
    </div>
  );
};
