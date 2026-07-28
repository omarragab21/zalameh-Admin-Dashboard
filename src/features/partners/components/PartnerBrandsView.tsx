import React, { useState, useMemo } from 'react';
import type { Partner, Brand } from '../types/partner.types';

interface PartnerBrandsViewProps {
  partner: Partner;
  onBack: () => void;
  onAddBrand: () => void;
  onEditBrand: (brand: Brand) => void;
  onManageBrandOffers: (brand: Brand) => void;
  onDeleteBrand: (brand: Brand) => void;
}

export const PartnerBrandsView: React.FC<PartnerBrandsViewProps> = ({
  partner,
  onBack,
  onAddBrand,
  onEditBrand,
  onManageBrandOffers,
  onDeleteBrand,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const brands = partner.brands || [];

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands;
    const q = searchQuery.toLowerCase().trim();
    return brands.filter(
      (b) =>
        b.nameAr.toLowerCase().includes(q) ||
        b.nameEn.toLowerCase().includes(q) ||
        b.categoryName.toLowerCase().includes(q)
    );
  }, [brands, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-2">
            <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>
              الرئيسية
            </span>
            <span>/</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>
              إدارة الشركاء
            </span>
            <span>/</span>
            <span className="text-[#d83f2a]">العلامات التجارية</span>
          </div>

          {/* Title and Partner Subtitle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
              title="العودة لشركاء"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {partner.avatarUrl && (
              <img
                src={partner.avatarUrl}
                alt={partner.nameAr}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">العلامات التجارية</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {brands.length} علامة
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                تابعة لـ: <span className="font-bold text-slate-700">{partner.nameAr}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Green Add Brand Button */}
        <button
          onClick={onAddBrand}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>إضافة علامة تجارية</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في العلامات التجارية..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Body: Empty State or Brands Grid */}
        {brands.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 text-2xl shadow-inner">
              🏷️
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">لا توجد علامات تجارية بعد</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              أضف العلامات التجارية التابعة لهذا الشريك لتقديم العروض والخدمات للمستخدمين.
            </p>
            <button
              onClick={onAddBrand}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة أول علامة تجارية</span>
            </button>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="font-bold text-slate-700">لا توجد نتائج مطابقة للبحث</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => onManageBrandOffers(brand)}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Logo Container with Featured Star Badge Overlay */}
                      <div className="relative shrink-0">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={brand.nameAr}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-lg">
                            {brand.nameAr.charAt(0)}
                          </div>
                        )}
                        {/* Circular Yellow Star Badge on top-left corner */}
                        {brand.isFeatured && (
                          <div
                            className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-400 text-amber-950 border-2 border-white shadow-md flex items-center justify-center text-[10px] font-black z-10"
                            title="علامة تجارية مميزة"
                          >
                            ★
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition">
                          {brand.nameAr}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium block dir-ltr text-right">
                          {brand.nameEn}
                        </span>
                      </div>
                    </div>
                    {brand.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        مميزة ★
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {brand.descriptionAr || 'لا يوجد وصف خاص بهذه العلامة التجارية'}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200/70 text-slate-700">
                      {brand.categoryName}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        brand.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {brand.status === 'active' ? 'نشطة' : 'غير نشطة'}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onManageBrandOffers(brand);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>العروض ({brand.offersCount || 0})</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditBrand(brand);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                      title="تعديل العلامة التجارية"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBrand(brand);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="حذف العلامة التجارية"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
