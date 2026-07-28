import React from 'react';
import type { Partner } from '../types/partner.types';

interface PartnersTableProps {
  partners: Partner[];
  onViewBrands: (partner: Partner) => void;
  onEditPartner: (partner: Partner) => void;
  onSuspendPartner: (partner: Partner) => void;
  onManageOffers: (partner: Partner) => void;
  onDeletePartner: (partner: Partner) => void;
}

export const PartnersTable: React.FC<PartnersTableProps> = ({
  partners,
  onViewBrands,
  onEditPartner,
  onSuspendPartner,
  onManageOffers,
  onDeletePartner,
}) => {
  const getPlanBadge = (plan: string, planName: string) => {
    switch (plan) {
      case 'featured':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
            {planName}
          </span>
        );
      case 'professional':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-200">
            {planName}
          </span>
        );
      case 'enterprise':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#d83f2a]/10 text-[#d83f2a] border border-[#d83f2a]/20">
            {planName} (VIP)
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            {planName}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            نشط
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            قيد المراجعة
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            غير نشط
          </span>
        );
    }
  };

  if (partners.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          🔍
        </div>
        <p className="font-bold text-slate-700 text-base mb-1">لا توجد نتائج مطابقة</p>
        <p className="text-xs text-slate-400">جرب تغيير معايير البحث أو تصفية الحالات</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-xs font-bold">
            <th className="py-3.5 px-6">الشريك</th>
            <th className="py-3.5 px-6">الباقة</th>
            <th className="py-3.5 px-6">الحالة</th>
            <th className="py-3.5 px-6 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {partners.map((partner) => (
            <tr key={partner.id} className="hover:bg-slate-50/60 transition group">
              {/* Partner Info */}
              <td className="py-3.5 px-6">
                <div className="flex items-center gap-3">
                  {partner.avatarUrl ? (
                    <img
                      src={partner.avatarUrl}
                      alt={partner.nameAr}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-[#d83f2a]/10 text-[#d83f2a] font-extrabold flex items-center justify-center text-base border border-[#d83f2a]/20 shrink-0">
                      {partner.nameAr.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-[#d83f2a] transition">
                      {partner.nameAr}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium block dir-ltr text-right">
                      {partner.nameEn}
                    </span>
                  </div>
                </div>
              </td>

              {/* Plan */}
              <td className="py-3.5 px-6">
                {getPlanBadge(partner.plan, partner.planName)}
              </td>

              {/* Status */}
              <td className="py-3.5 px-6">
                {getStatusBadge(partner.status)}
              </td>

              {/* Actions */}
              <td className="py-3.5 px-6">
                <div className="flex items-center justify-center gap-1.5">
                  {/* View Details / Brands (Eye Icon) */}
                  <button
                    onClick={() => onViewBrands(partner)}
                    title="عرض العلامات التجارية والتفاصيل"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  {/* Edit Partner (Outlined Pen Icon) */}
                  <button
                    onClick={() => onEditPartner(partner)}
                    title="تعديل الشريك"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  {/* Suspend / Change Status Toggle Switch */}
                  <div
                    className="p-1.5 flex items-center justify-center cursor-pointer"
                    title={partner.status === 'active' ? 'إيقاف مؤقت / تعليق حساب الشريك' : 'تفعيل حساب الشريك'}
                  >
                    <button
                      type="button"
                      onClick={() => onSuspendPartner(partner)}
                      className={`relative inline-flex items-center h-[18px] w-8 p-[2px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                        partner.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          partner.status === 'active' ? '-translate-x-3.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Offers Management (Tag Icon) */}
                  <button
                    onClick={() => onManageOffers(partner)}
                    title="إدارة العروض والخصومات"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </button>

                  {/* Delete Partner (Trash Icon) */}
                  <button
                    onClick={() => onDeletePartner(partner)}
                    title="حذف الشريك"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
