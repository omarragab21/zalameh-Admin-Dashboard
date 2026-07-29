import React from 'react';
import type { AdItem } from '../types/ad.types';

interface DeleteAdModalProps {
  ad: AdItem | null;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteAdModal: React.FC<DeleteAdModalProps> = ({ ad, onConfirm, onClose }) => {
  if (!ad) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold">
          🗑️
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 mb-1">حذف الإعلان</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            هل أنت تأكد من إغلاق وحذف الإعلان <span className="font-bold text-slate-800">"{ad.internalTitle}"</span>؟ لن يمكنك التراجع عن هذا الإجراء.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition cursor-pointer"
          >
            تأكيد الحذف
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
