import React, { useState, useEffect } from 'react';
import type { PromoCode, UsageLocation, PromoCodeStatus, PublishingScope, Branch } from '../types/partner.types';

interface AddEditPromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PromoCode>) => void;
  editingPromoCode?: PromoCode | null;
  branches?: Branch[];
}

export const AddEditPromoCodeModal: React.FC<AddEditPromoCodeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPromoCode,
  branches = [],
}) => {
  const [activeLang, setActiveLang] = useState<'ar' | 'en'>('ar');

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [termsAr, setTermsAr] = useState('');
  const [termsEn, setTermsEn] = useState('');

  const [code, setCode] = useState('');
  const [usageLocation, setUsageLocation] = useState<UsageLocation>('store_and_website');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<PromoCodeStatus>('active');
  const [publishingScope, setPublishingScope] = useState<PublishingScope>('all_branches');
  const [branchId, setBranchId] = useState<string>('');

  useEffect(() => {
    if (editingPromoCode) {
      setTitleAr(editingPromoCode.titleAr || '');
      setTitleEn(editingPromoCode.titleEn || '');
      setDescriptionAr(editingPromoCode.descriptionAr || '');
      setDescriptionEn(editingPromoCode.descriptionEn || '');
      setTermsAr(editingPromoCode.termsAr || '');
      setTermsEn(editingPromoCode.termsEn || '');
      setCode(editingPromoCode.code || '');
      setUsageLocation(editingPromoCode.usageLocation || 'store_and_website');
      setStartDate(editingPromoCode.startDate || '');
      setEndDate(editingPromoCode.endDate || '');
      setStatus(editingPromoCode.status || 'active');
      setPublishingScope(editingPromoCode.publishingScope || 'all_branches');
      setBranchId(editingPromoCode.branchId || '');
    } else {
      setTitleAr('');
      setTitleEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setTermsAr('');
      setTermsEn('');
      setCode('SAVE20');
      setUsageLocation('store_and_website');
      setStartDate('');
      setEndDate('');
      setStatus('active');
      setPublishingScope('all_branches');
      setBranchId('');
    }
    setActiveLang('ar');
  }, [editingPromoCode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() || !code.trim()) return;

    onSave({
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      termsAr,
      termsEn,
      code: code.toUpperCase().trim(),
      usageLocation,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status,
      publishingScope,
      branchId: publishingScope === 'specific_branch' ? branchId : undefined,
    });
    onClose();
  };

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
        <div className="p-6 pb-4 text-center border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900">
            {editingPromoCode ? 'تعديل كود الخصم' : 'إضافة كود خصم جديد'}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            أكواد الخصم المرتبطة بهذا الشريك
          </p>
        </div>

        {/* Language Tabs - Aligned to Right */}
        <div className="flex items-center justify-start px-6 gap-8 border-b border-slate-100 text-xs font-bold pt-3 pb-0">
          <button
            type="button"
            onClick={() => setActiveLang('ar')}
            className={`pb-2.5 px-2 relative transition cursor-pointer ${
              activeLang === 'ar' ? 'text-[#d83f2a]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            العربية
            {activeLang === 'ar' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d83f2a] rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`pb-2.5 px-2 relative transition cursor-pointer ${
              activeLang === 'en' ? 'text-[#d83f2a]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            English
            {activeLang === 'en' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d83f2a] rounded-full" />
            )}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Tab 1: Arabic */}
          {activeLang === 'ar' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  العنوان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="عنوان كود الخصم بالعربية"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الوصف</label>
                <textarea
                  rows={2}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="وصف مختصر للخصم..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الشروط والأحكام</label>
                <textarea
                  rows={3}
                  value={termsAr}
                  onChange={(e) => setTermsAr(e.target.value)}
                  placeholder="اكتب الشروط والأحكام الخاصة بهذا الخصم..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition resize-none"
                />
              </div>
            </div>
          )}

          {/* Tab 2: English */}
          {activeLang === 'en' && (
            <div className="space-y-4" dir="ltr">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">Title</label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Discount code title in English"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">Description</label>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Brief description of the discount..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={termsEn}
                  onChange={(e) => setTermsEn(e.target.value)}
                  placeholder="Write terms and conditions for this discount..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition resize-none"
                />
              </div>
            </div>
          )}

          {/* Common Code Information Section */}
          <div className="pt-3 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400">معلومات الكود</h4>

            {/* Discount Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كود الخصم <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SAVE20"
                dir="ltr"
                className="w-full text-right px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-extrabold text-sm font-mono placeholder-slate-300 focus:outline-none focus:border-[#d83f2a] transition uppercase"
              />
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                تحول تلقائياً إلى أحرف كبيرة
              </p>
            </div>

            {/* Dates (تاريخ البدء وتاريخ الانتهاء) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  تاريخ البدء
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-[#d83f2a] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  تاريخ الانتهاء
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-[#d83f2a] transition"
                />
              </div>
            </div>

            {/* Usage Location Options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">مكان الاستخدام</label>
              <div className="space-y-2">
                {[
                  { id: 'store', label: 'متاح في المتجر' },
                  { id: 'website', label: 'متاح على الموقع' },
                  { id: 'store_and_website', label: 'متاح في المتجر والموقع' },
                ].map((item) => {
                  const isSelected = usageLocation === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setUsageLocation(item.id as UsageLocation)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                        isSelected
                          ? 'border-[#d83f2a] bg-rose-50/40 text-[#d83f2a]'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-extrabold">{item.label}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#d83f2a] bg-[#d83f2a]' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">الحالة</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('active')}
                  className={`px-4 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    status === 'active'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>نشط</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('inactive')}
                  className={`px-4 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    status === 'inactive'
                      ? 'bg-slate-100 text-slate-600 border-slate-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>غير نشط</span>
                </button>
              </div>
            </div>

            {/* Publishing Scope */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">نطاق النشر</label>
              <div className="flex items-center gap-3">
                {[
                  { id: 'all_branches', label: 'جميع الفروع' },
                  { id: 'specific_branch', label: 'فرع محدد' },
                ].map((scope) => {
                  const isSelected = publishingScope === scope.id;
                  return (
                    <div
                      key={scope.id}
                      onClick={() => setPublishingScope(scope.id as PublishingScope)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition cursor-pointer ${
                        isSelected
                          ? 'border-[#d83f2a] bg-rose-50/40 text-[#d83f2a]'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#d83f2a] bg-[#d83f2a]' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="w-1 h-1 bg-white rounded-full" />}
                      </div>
                      <span className="text-xs font-bold">{scope.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Specific Branch Selector if selected */}
              {publishingScope === 'specific_branch' && (
                <div className="mt-3">
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#d83f2a] transition"
                  >
                    <option value="">اختر الفرع...</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer (Buttons) */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c23420] text-white font-extrabold text-xs shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
