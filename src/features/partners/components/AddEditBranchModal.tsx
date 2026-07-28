import React, { useState, useEffect } from 'react';
import type { Branch, BranchStatus } from '../types/partner.types';

interface AddEditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (branchData: Partial<Branch>) => void;
  editingBranch?: Branch | null;
}

export const AddEditBranchModal: React.FC<AddEditBranchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBranch,
}) => {
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [status, setStatus] = useState<BranchStatus>('active');

  useEffect(() => {
    if (editingBranch) {
      setNameAr(editingBranch.nameAr || '');
      setNameEn(editingBranch.nameEn || '');
      setAddress(editingBranch.address || '');
      setPhone(editingBranch.phone || '');
      setMapUrl(editingBranch.mapUrl || '');
      setStatus(editingBranch.status || 'active');
    } else {
      setNameAr('');
      setNameEn('');
      setAddress('');
      setPhone('');
      setMapUrl('');
      setStatus('active');
    }
  }, [editingBranch, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    onSave({
      nameAr,
      nameEn: nameEn || nameAr,
      address,
      phone,
      mapUrl: mapUrl || undefined,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {editingBranch ? 'تعديل بيانات الفرع' : 'إضافة فرع جديد'}
              </h3>
              {!editingBranch && (
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">أدخل بيانات الفرع الجديد</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition cursor-pointer mt-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Branch Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <span className="text-red-500">*</span> اسم الفرع (عربي)
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: فرع العبدلي"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-red-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Branch Name (English)</label>
              <input
                type="text"
                dir="ltr"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Abdali Branch"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium text-left focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">العنوان</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="المدينة، الحي، الشارع..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-red-500 transition"
            />
          </div>

          {/* Phone & Map URL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف</label>
              <input
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+962 6 ..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-red-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">رابط الخريطة</label>
              <input
                type="url"
                dir="ltr"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">الحالة</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BranchStatus)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:border-red-500 transition cursor-pointer"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
              <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              {editingBranch ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  حفظ التغييرات
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  إضافة الفرع
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
