import React, { useState } from 'react';
import type { Brand } from '../types/partner.types';

interface DeleteBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  brand: Brand | null;
}

export const DeleteBrandModal: React.FC<DeleteBrandModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  brand,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !brand) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // error handled upstream
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
          🗑️
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-2">تأكيد حذف العلامة التجارية</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">
          هل أنت ممتأكد من حذف العلامة التجارية <strong className="text-slate-800">{brand.nameAr}</strong>؟ يتم الحذف عبر خادم البيانات (API) ولا يمكن التراجع بعد ذلك.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition cursor-pointer disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className={`flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition cursor-pointer flex items-center justify-center gap-2 ${
              isDeleting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isDeleting ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>جاري الحذف...</span>
              </>
            ) : (
              <span>حذف العلامة</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
