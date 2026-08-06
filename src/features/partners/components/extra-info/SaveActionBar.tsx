import React from 'react';

interface SaveActionBarProps {
  isDirty: boolean;
  saveSuccess: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const StatusMessage: React.FC<{ isDirty: boolean; saveSuccess: boolean }> = ({
  isDirty,
  saveSuccess,
}) => {
  if (saveSuccess) {
    return (
      <span className="text-emerald-600 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        تم حفظ التغييرات بنجاح
      </span>
    );
  }

  if (isDirty) {
    return (
      <span className="text-amber-600 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        يوجد تغييرات غير محفوظة
      </span>
    );
  }

  return <span>لا توجد تغييرات معلقة</span>;
};

export const SaveActionBar: React.FC<SaveActionBarProps> = ({
  isDirty,
  saveSuccess,
  onSave,
  onCancel,
}) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 order-2 sm:order-1">
      <StatusMessage isDirty={isDirty} saveSuccess={saveSuccess} />
    </div>

    <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs transition cursor-pointer w-full sm:w-auto text-center"
      >
        إلغاء
      </button>

      <button
        type="button"
        onClick={onSave}
        className="px-5 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c23420] text-white font-extrabold text-xs shadow-md shadow-[#d83f2a]/20 transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        <span>حفظ التغييرات</span>
      </button>
    </div>
  </div>
);
