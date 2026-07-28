import React from 'react';
import type { Partner } from '../types/partner.types';

interface SuspendPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  partner: Partner | null;
}

export const SuspendPartnerModal: React.FC<SuspendPartnerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  partner,
}) => {
  if (!isOpen || !partner) return null;

  const isCurrentlyActive = partner.status === 'active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl">
          ⚠️
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-2">
          {isCurrentlyActive ? 'تعليق حساب الشريك' : 'تفعيل حساب الشريك'}
        </h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">
          هل أنت متاكد من {isCurrentlyActive ? 'تعليق' : 'إعادة تفعيل'} حساب الشريك{' '}
          <strong className="text-slate-800">{partner.nameAr}</strong>؟
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
};
