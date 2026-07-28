import React from 'react';
import type { CategoryFilterStatus } from '../types/category.types';

interface CategoryFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: CategoryFilterStatus;
  onStatusFilterChange: (status: CategoryFilterStatus) => void;
  onAddCategoryClick: () => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddCategoryClick,
}) => {
  return (
    <div className="p-5 border-b border-slate-200/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white">
      {/* Right Side in RTL: Search Input followed by Status Dropdown */}
      <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-xl">
        {/* 1. Search Input (First on the right in RTL) */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث بالاسم..."
            className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl pr-10 pl-4 py-2.5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 2. Status Dropdown Filter */}
        <div className="relative w-full sm:w-44 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as CategoryFilterStatus)}
            className="w-full appearance-none bg-slate-50/80 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl px-4 py-2.5 pl-9 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition cursor-pointer"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Left Side in RTL: Add Main Category Button */}
      <button
        onClick={onAddCategoryClick}
        className="px-5 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#d83f2a]/20 transition cursor-pointer shrink-0"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        <span>إضافة فئة رئيسية</span>
      </button>
    </div>
  );
};
