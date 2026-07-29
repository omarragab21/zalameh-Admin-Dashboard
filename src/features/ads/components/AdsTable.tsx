import React, { useState, useEffect } from 'react';
import type { AdItem } from '../types/ad.types';

interface AdsTableProps {
  ads: AdItem[];
  onToggleActive: (id: string) => void;
  onView: (ad: AdItem) => void;
  onEdit: (ad: AdItem) => void;
  onDelete: (ad: AdItem) => void;
}

export const AdsTable: React.FC<AdsTableProps> = ({
  ads,
  onToggleActive,
  onView,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Reset to page 1 if ads list length changes (e.g. after search/filter)
  useEffect(() => {
    setCurrentPage(1);
  }, [ads.length]);

  if (ads.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.684A1.761 1.761 0 013 12V8a1.76 1.76 0 012.436-1.684l.43.14M11 5.882L15 4h.01A2.5 2.5 0 0118 6.5v11a2.5 2.5 0 01-2.99 2.45L11 18.118" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">لا توجد إعلانات مطابقة</h3>
        <p className="text-xs text-slate-500">جرب تغيير فلتر البحث أو إضافة إعلان جديد.</p>
      </div>
    );
  }

  // Pagination calculation
  const totalPages = Math.ceil(ads.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, ads.length);
  const currentAds = ads.slice(startIndex, endIndex);

  // Format date helper (e.g. 2026-06-01 -> 1 يونيو 2026)
  const formatDateAr = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const monthsAr = [
          'يناير',
          'فبراير',
          'مارس',
          'أبريل',
          'مايو',
          'يونيو',
          'يوليو',
          'أغسطس',
          'سبتمبر',
          'أكتوبر',
          'نوفمبر',
          'ديسمبر',
        ];
        return `${day} ${monthsAr[monthIndex]} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold">
              <th className="py-3.5 px-4">صورة الإعلان</th>
              <th className="py-3.5 px-4">عنوان الإعلان</th>
              <th className="py-3.5 px-4 text-center">اسم المعلن</th>
              <th className="py-3.5 px-4 text-center">تفعيل / إلغاء</th>
              <th className="py-3.5 px-4 text-center">تاريخ النشر</th>
              <th className="py-3.5 px-4 text-center">تاريخ وقف النشر</th>
              <th className="py-3.5 px-4 text-center">حالة الإعلان</th>
              <th className="py-3.5 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {currentAds.map((ad) => {
              const primaryPlacement = ad.placements[0];
              const startDate = primaryPlacement?.startDate || ad.createdAt;
              const endDate = primaryPlacement?.endDate || '-';

              return (
                <tr key={ad.id} className="hover:bg-slate-50/60 transition">
                  {/* Image Thumbnail */}
                  <td className="py-3.5 px-4">
                    <div className="w-14 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {ad.mainImageUrl ? (
                        <img
                          src={ad.mainImageUrl}
                          alt={ad.internalTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">Image</span>
                      )}
                    </div>
                  </td>

                  {/* Title & Placement Subtitle */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 leading-snug">{ad.internalTitle}</div>
                    {primaryPlacement && (
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {primaryPlacement.labelAr}
                      </div>
                    )}
                  </td>

                  {/* Advertiser Name + Tag */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="font-bold text-slate-900">
                      {ad.advertiserType === 'STORE' ? ad.storeName : ad.externalAdvertiserName}
                    </div>
                    <div className="mt-0.5">
                      {ad.advertiserType === 'STORE' ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-sky-50 text-sky-600 rounded-md border border-sky-100">
                          داخلي
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 rounded-md border border-amber-100">
                          خارجي
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Toggle Enable/Disable Switch */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onToggleActive(ad.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        ad.isActive ? 'bg-[#d83f2a]' : 'bg-slate-300'
                      }`}
                      title={ad.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          ad.isActive ? '-translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Start Date */}
                  <td className="py-3.5 px-4 text-center text-slate-600 text-xs dir-rtl">
                    {formatDateAr(startDate)}
                  </td>

                  {/* End Date */}
                  <td className="py-3.5 px-4 text-center text-slate-600 text-xs dir-rtl">
                    {formatDateAr(endDate)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {ad.status === 'published' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        منشور
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        مخفي
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onView(ad)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 transition px-2 py-1 rounded-lg hover:bg-slate-100"
                      >
                        عرض
                      </button>
                      <button
                        onClick={() => onEdit(ad)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition px-2 py-1 rounded-lg hover:bg-indigo-50"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => onDelete(ad)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 transition px-2 py-1 rounded-lg hover:bg-rose-50"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dynamic Pagination Footer */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-semibold">
        <div>
          عرض {startIndex + 1}-{endIndex} من أصل {ads.length} إعلانات مضافة
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 transition disabled:opacity-40 cursor-pointer"
            title="الصفحة السابقة"
          >
            &rarr;
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition cursor-pointer ${
                safeCurrentPage === pageNum
                  ? 'bg-[#d83f2a] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 transition disabled:opacity-40 cursor-pointer"
            title="الصفحة التالية"
          >
            &larr;
          </button>
        </div>
      </div>
    </div>
  );
};
