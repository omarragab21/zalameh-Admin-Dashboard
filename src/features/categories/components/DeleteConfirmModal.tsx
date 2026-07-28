import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  isSubcategory?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isSubcategory = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all p-6 text-right my-auto">
        {/* Main Content Row: Icon on Far Right, Title & Description Column directly next to it */}
        <div className="flex items-start justify-start gap-3.5 mb-6">
          {/* Warning Icon Badge */}
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#d83f2a] flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Text Column: Title on top, Body text directly underneath */}
          <div className="flex-1 text-right">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              {title}
            </h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              {isSubcategory ? (
                <>هل أنت متأكد من حذف "{itemName}"؟ لا يمكن التراجع عن هذه العملية.</>
              ) : (
                <>هل أنت متأكد من حذف فئة "{itemName}"؟ سيتم حذف جميع الفئات الفرعية المرتبطة بها. لا يمكن التراجع عن هذه العملية.</>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons Aligned to the LEFT (Cancel first, then Red Delete) */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
          >
            {isSubcategory ? 'حذف' : 'حذف الفئة'}
          </button>
        </div>
      </div>
    </div>
  );
};
