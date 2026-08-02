import React from 'react';
import type { Category, SubCategory } from '../types/category.types';

interface SubCategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCategory: Category | null;
  subCategory: SubCategory | null;
  onEditClick: (parentCategory: Category, subCategory: SubCategory) => void;
  orderIndex?: number;
}

export const SubCategoryDetailModal: React.FC<SubCategoryDetailModalProps> = ({
  isOpen,
  onClose,
  parentCategory,
  subCategory,
  onEditClick,
  orderIndex = 1,
}) => {
  if (!isOpen || !subCategory || !parentCategory) return null;

  // Convert numbers to Arabic digits
  const toArabicNums = (n: number) => n.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);

  // Format creation date in Arabic
  const formatDateInArabic = (dateStr?: string) => {
    if (!dateStr) return 'غير محدد';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const formattedDate = formatDateInArabic(subCategory.createdAt);
  const actualOrder = subCategory.order ?? orderIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all my-auto max-h-[88vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 flex items-start justify-between relative border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              تفاصيل الفئة الفرعية
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-semibold">
              ضمن: <span className="text-[#d83f2a] font-extrabold">{parentCategory.nameAr}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Main Titles: Arabic Top-Right, English Bottom-Left */}
          <div className="mb-5 pb-3 border-b border-slate-100 space-y-1">
            <h2 className="text-lg font-black text-slate-900 text-right">
              {subCategory.nameAr}
            </h2>
            <div className="text-left font-extrabold text-slate-500 text-sm" dir="ltr">
              {subCategory.nameEn}
            </div>
          </div>

          {/* 3 Detail Cards (With Real Date & Order) */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Card 1: Order (#) */}
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100/80 flex flex-col items-center justify-center text-center">
              <div className="text-slate-400 text-xs font-bold mb-1 flex items-center justify-center">
                <span className="text-sm font-black">#</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 mb-1 block">الترتيب</span>
              <span className="font-black text-slate-900 text-sm">{toArabicNums(actualOrder)}</span>
            </div>

            {/* Card 2: Real Creation Date in Arabic */}
            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100/80 flex flex-col items-center justify-center text-center">
              <div className="text-slate-400 text-xs mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-slate-400 mb-1 block">تاريخ الإنشاء</span>
              <span className="font-extrabold text-slate-800 text-[11px]">{formattedDate}</span>
            </div>

            {/* Card 3: Parent Category */}
            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100/80 flex flex-col items-center justify-center text-center">
              <div className="text-slate-400 text-xs mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 4H5m14 4H5M19 7H5" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-slate-400 mb-1 block">الفئة الرئيسية</span>
              <span className="font-extrabold text-slate-900 text-xs truncate max-w-full" title={parentCategory.nameAr}>
                {parentCategory.nameAr}
              </span>
            </div>
          </div>

          {/* Status Row */}
          <div className="flex items-center justify-start gap-2 text-xs font-bold text-slate-600">
            <span>الحالة:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                subCategory.status === 'active'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                  : 'bg-slate-100 text-slate-500 border border-slate-200/50'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  subCategory.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              {subCategory.status === 'active' ? 'نشط' : 'غير نشط'}
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm transition cursor-pointer"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEditClick(parentCategory, subCategory);
            }}
            className="px-6 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
          >
            تعديل
          </button>
        </div>
      </div>
    </div>
  );
};
