import React from 'react';
import type { Package } from '../types/package.types';

interface PackagesTableProps {
  packages: Package[];
  activeDurationFilter?: 'all' | 'monthly' | 'annual' | string;
  onViewPackage: (pkg: Package) => void;
  onEditPackage: (pkg: Package) => void;
  onDeletePackage: (pkg: Package) => void;
}

export const PackagesTable: React.FC<PackagesTableProps> = ({
  packages,
  activeDurationFilter = 'all',
  onViewPackage,
  onEditPackage,
  onDeletePackage,
}) => {
  if (packages.length === 0) {
    return (
      <div className="p-16 text-center flex flex-col items-center justify-center" dir="rtl">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-[#d83f2a] flex items-center justify-center mb-4 text-2xl shadow-inner">
          📦
        </div>
        <h3 className="text-base font-extrabold text-slate-900 mb-1">لا توجد باقات متاحة</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          لم يتم العثور على أي باقات مطابقة للبحث أو التصفية.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" dir="rtl">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400">
            <th className="px-5 py-3.5 font-bold">اسم الباقة</th>
            <th className="px-5 py-3.5 font-bold">السعر الشهرى والسنوي</th>
            <th className="px-5 py-3.5 font-bold">الفترة الحالية</th>
            <th className="px-5 py-3.5 font-bold">باقة مميزة</th>
            <th className="px-5 py-3.5 font-bold">الحالة</th>
            <th className="px-5 py-3.5 font-bold text-left">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/70 text-xs font-semibold">
          {packages.map((pkg) => {
            const isFeatured = pkg.settings?.isFeaturedPackage;
            const status = pkg.settings?.status || 'active';
            const mPrice = pkg.monthlyPrice ?? pkg.price ?? 0;
            const yPrice = pkg.yearlyPrice ?? (pkg.price ? pkg.price * 10 : 0);

            return (
              <tr key={pkg.id} className="hover:bg-slate-50/50 transition">
                {/* Name & English name */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#d83f2a] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">{pkg.nameAr}</h4>
                      <p className="text-[10px] font-semibold text-slate-400 dir-ltr text-right">
                        {pkg.nameEn}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Price (Monthly & Annual breakdown) */}
                <td className="px-5 py-4">
                  {activeDurationFilter === 'annual' ? (
                    <div>
                      <span className="font-black text-slate-900 text-xs">{yPrice} د.أ</span>
                      <span className="text-[10px] font-bold text-slate-400 block">سنوياً</span>
                    </div>
                  ) : activeDurationFilter === 'monthly' ? (
                    <div>
                      <span className="font-black text-slate-900 text-xs">{mPrice} د.أ</span>
                      <span className="text-[10px] font-bold text-slate-400 block">شهرياً</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-extrabold text-slate-800 text-xs">
                        شهري: <span className="font-black text-slate-900">{mPrice} د.أ</span>
                      </span>
                      <span className="font-extrabold text-slate-800 text-xs">
                        سنوي: <span className="font-black text-slate-900">{yPrice} د.أ</span>
                      </span>
                    </div>
                  )}
                </td>

                {/* Duration */}
                <td className="px-5 py-4">
                  <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-100 w-fit inline-block">
                    {activeDurationFilter === 'annual'
                      ? '🏆 اشتراك سنوي'
                      : activeDurationFilter === 'monthly'
                      ? '📅 اشتراك شهري'
                      : '📅 شهري و سنوي 🏆'}
                  </span>
                </td>

                {/* Featured Badge */}
                <td className="px-5 py-4">
                  {isFeatured ? (
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1 w-fit">
                      <span>★</span>
                      <span>مميزة</span>
                    </span>
                  ) : (
                    <span className="text-slate-300 font-bold">—</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit ${
                      status === 'active'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {status === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-left">
                  <div className="flex items-center gap-1 justify-end">
                    {/* View Details Icon (Eye) */}
                    <button
                      onClick={() => onViewPackage(pkg)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title="معاينة تفاصيل الباقة"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    {/* Edit Icon (Pencil) */}
                    <button
                      onClick={() => onEditPackage(pkg)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                      title="تعديل الباقة"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    {/* Delete Icon (Trash) */}
                    <button
                      onClick={() => onDeletePackage(pkg)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="حذف الباقة"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
