import React from 'react';
import type { PartnerFilterStatus } from '../types/partner.types';

interface PartnerFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: PartnerFilterStatus;
  onStatusFilterChange: (status: PartnerFilterStatus) => void;
  onAddPartnerClick: () => void;
}

export const PartnerFilterBar: React.FC<PartnerFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddPartnerClick,
}) => {
  return (
    <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3" dir="rtl">
      {/* 1. Search Field (Far Right in RTL) */}
      <div className="relative flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث باسم الشريك أو البريد أو الهاتف..."
          className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-[#d83f2a] focus:bg-white transition"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 2. Status Dropdown Filter with White Background (Middle in RTL) */}
      <div className="relative sm:w-44 shrink-0">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as PartnerFilterStatus)}
          className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 text-sm font-semibold focus:outline-none focus:border-[#d83f2a] shadow-xs transition cursor-pointer appearance-none"
        >
          <option value="all">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="pending">قيد المراجعة</option>
          <option value="inactive">غير نشط</option>
        </select>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* 3. Add Partner Button (Far Left in RTL) */}
      <button
        onClick={onAddPartnerClick}
        className="px-5 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-sm shadow-md shadow-[#d83f2a]/20 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>إضافة شريك</span>
      </button>
    </div>
  );
};
