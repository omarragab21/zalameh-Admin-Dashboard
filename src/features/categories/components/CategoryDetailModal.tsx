import React from 'react';
import type { Category } from '../types/category.types';

interface CategoryDetailModalProps {
  category: Category | null;
  onClose: () => void;
}

export const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({ category, onClose }) => {
  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 transform transition-all my-auto max-h-[88vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={category.image}
              alt={category.nameAr}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{category.nameAr}</h3>
              <p className="text-xs text-slate-400 font-semibold">{category.nameEn}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-bold block mb-1">الحالة</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold ${
                  category.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-200/60 text-slate-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    category.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                {category.status === 'active' ? 'نشط' : 'غير نشط'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-1">عدد الفئات الفرعية</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {category.subcategories?.length || category.subcategoriesCount} فئات
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-[#d83f2a] uppercase tracking-wider mb-2">الوصف</h4>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {category.descriptionAr || category.descriptionEn || 'لا يوجد وصف متاح لهذا القسم حالياً.'}
            </p>
          </div>

          {/* Subcategories List */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
              الفئات الفرعية ({category.subcategories?.length || 0})
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {category.subcategories && category.subcategories.length > 0 ? (
                category.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{sub.nameAr}</span>
                      <span className="text-[11px] font-semibold text-slate-400">{sub.nameEn}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sub.status === 'active'
                          ? 'bg-emerald-100/70 text-emerald-700'
                          : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {sub.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 font-semibold">
                  لا توجد فئات فرعية مضافة بعد.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
