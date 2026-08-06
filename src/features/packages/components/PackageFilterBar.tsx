import React from 'react';
import type { PackageDuration, PackageFilterStatus } from '../types/package.types';

export type PackageFilterDuration = 'all' | PackageDuration;

interface PackageFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: PackageFilterStatus;
  onStatusFilterChange: (status: PackageFilterStatus) => void;
  durationFilter: PackageFilterDuration;
  onDurationFilterChange: (duration: PackageFilterDuration) => void;
  onAddPackageClick: () => void;
}

export const PackageFilterBar: React.FC<PackageFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  durationFilter,
  onDurationFilterChange,
  onAddPackageClick,
}) => {
  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100" dir="rtl">
      {/* Right Side (in RTL): Search Input then Duration & Status Dropdowns */}
      <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-64 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث باسم الباقة..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] focus:bg-white transition"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Duration Dropdown (شهري / سنوي) */}
        <div className="relative shrink-0">
          <select
            value={durationFilter}
            onChange={(e) => onDurationFilterChange(e.target.value as PackageFilterDuration)}
            className="appearance-none px-4 py-2.5 pl-8 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold focus:outline-none focus:border-[#d83f2a] transition cursor-pointer"
          >
            <option value="all">جميع الفترات (شهري وسنوي)</option>
            <option value="monthly">📅 اشتراك شهري</option>
            <option value="annual">🏆 اشتراك سنوي</option>
          </select>
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="relative shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as PackageFilterStatus)}
            className="appearance-none px-4 py-2.5 pl-8 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold focus:outline-none focus:border-[#d83f2a] transition cursor-pointer"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">🟢 نشط</option>
            <option value="inactive">⚪ غير نشط</option>
          </select>
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Left Side (in RTL): Add Package Button */}
      <button
        type="button"
        onClick={onAddPackageClick}
        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c23420] text-white font-extrabold text-xs shadow-md shadow-[#d83f2a]/20 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>إضافة باقة</span>
      </button>
    </div>
  );
};
