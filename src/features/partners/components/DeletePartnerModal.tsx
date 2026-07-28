import React from 'react';
import type { Partner } from '../types/partner.types';

interface DeletePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  partner: Partner | null;
}

export const DeletePartnerModal: React.FC<DeletePartnerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  partner,
}) => {
  if (!isOpen || !partner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#d83f2a] flex items-center justify-center mx-auto mb-4 text-2xl">
          🗑️
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-2">تأكيد حذف الشريك</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">
          هل أنت متاكد من حذف الشريك <strong className="text-slate-800">{partner.nameAr}</strong>؟ لن يمكنك التراجع عن هذا الإجراء بعد الحذف.
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
            className="flex-1 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
          >
            حذف الشريك
          </button>
        </div>
      </div>
    </div>
  );
};
