import React from 'react';
import type { Package } from '../types/package.types';

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg?: Package | null;
}

export const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({
  isOpen,
  onClose,
  pkg,
}) => {
  if (!isOpen || !pkg) return null;

  const permissions = pkg.permissions || {};
  const settings = pkg.settings || { status: 'active', displayOrder: 1 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto" dir="rtl">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden my-8 animate-scaleUp">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#d83f2a] flex items-center justify-center text-xl shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{pkg.nameAr}</h3>
            <p className="text-xs text-slate-400 font-semibold dir-ltr text-right">
              {pkg.nameEn}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
          {/* Price & Duration Block */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-0.5">السعر</span>
              <span className="text-xl font-black text-slate-900">{pkg.price} د.أ</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-0.5">المدة</span>
              <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-100 inline-block">
                {pkg.duration === 'monthly'
                  ? 'شهري'
                  : pkg.duration === 'quarterly'
                  ? 'ربع سنوي'
                  : pkg.duration === 'semi_annual'
                  ? 'نصف سنوي'
                  : 'سنوي'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-0.5">الحالة</span>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit ${
                  settings.status === 'active'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${settings.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {settings.status === 'active' ? 'نشط' : 'غير نشط'}
              </span>
            </div>
          </div>

          {/* Description */}
          {pkg.descriptionAr && (
            <div>
              <h4 className="font-extrabold text-slate-700 mb-1">وصف الباقة</h4>
              <p className="text-slate-600 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl">
                {pkg.descriptionAr}
              </p>
            </div>
          )}

          {/* Features List */}
          <div>
            <h4 className="font-extrabold text-slate-700 mb-2">المميزات المدرجة ({pkg.features?.length || 0})</h4>
            {pkg.features && pkg.features.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {pkg.features.map((feat) => (
                  <span
                    key={feat}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-[#d83f2a] border border-rose-200"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 font-semibold">لا توجد مميزات مضافة</p>
            )}
          </div>

          {/* Permissions & Limits */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-700 mb-2.5">الصلاحيات والحدود</h4>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 font-bold">الحد الأقصى للعروض:</span>
                <span className="font-black text-slate-900">
                  {permissions.maxOffers !== null && permissions.maxOffers !== undefined
                    ? permissions.maxOffers
                    : 'غير محدود'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 font-bold">الحد الأقصى للوظائف:</span>
                <span className="font-black text-slate-900">
                  {permissions.maxJobs !== null && permissions.maxJobs !== undefined
                    ? permissions.maxJobs
                    : 'غير محدود'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 font-bold">الحد الأقصى لرموز الخصم:</span>
                <span className="font-black text-slate-900">
                  {permissions.maxPromoCodes !== null && permissions.maxPromoCodes !== undefined
                    ? permissions.maxPromoCodes
                    : 'غير محدود'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 font-bold">عناصر القائمة:</span>
                <span className="font-black text-slate-900">
                  {permissions.maxMenuItems !== null && permissions.maxMenuItems !== undefined
                    ? permissions.maxMenuItems
                    : 'غير محدود'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 text-left">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
