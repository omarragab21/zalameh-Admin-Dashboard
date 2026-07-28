import React, { useState, useEffect, useRef } from 'react';
import type { Branch, Offer, OfferStatus } from '../types/partner.types';

interface AddEditOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (offerData: Partial<Offer>) => void;
  brandName: string;
  editingOffer?: Offer | null;
  branches?: Branch[];
}

export const AddEditOfferModal: React.FC<AddEditOfferModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingOffer,
  branches = [],
}) => {
  const [langTab, setLangTab] = useState<'ar' | 'en'>('ar');

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<OfferStatus>('active');
  const [publishScope, setPublishScope] = useState<'all' | 'specific'>('all');
  const [branchIds, setBranchIds] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingOffer) {
      setTitleAr(editingOffer.titleAr || '');
      setTitleEn(editingOffer.titleEn || '');
      setDescriptionAr(editingOffer.descriptionAr || '');
      setDescriptionEn(editingOffer.descriptionEn || '');
      setImageUrl(editingOffer.imageUrl || '');
      setStartDate(editingOffer.startDate || '');
      setEndDate(editingOffer.endDate || '');
      setStatus(editingOffer.status || 'active');
      setBranchIds(editingOffer.branchIds || []);
      setPublishScope(editingOffer.branchIds && editingOffer.branchIds.length > 0 ? 'specific' : 'all');
    } else {
      setTitleAr('');
      setTitleEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setImageUrl('');
      setStartDate('');
      setEndDate('');
      setStatus('active');
      setPublishScope('all');
      setBranchIds([]);
    }
    setLangTab('ar');
  }, [editingOffer, isOpen]);

  if (!isOpen) return null;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() && !titleEn.trim()) return;
    if (!startDate || !endDate) return;

    onSave({
      titleAr: titleAr || titleEn,
      titleEn: titleEn || titleAr,
      descriptionAr,
      descriptionEn,
      imageUrl: imageUrl || undefined,
      startDate,
      endDate,
      status,
      branchIds: publishScope === 'specific' ? branchIds : [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">
              {editingOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">العروض المرتبطة بهذا الشريك</p>
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

        {/* Language Tabs */}
        <div className="px-6 pt-3 flex items-center gap-5 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setLangTab('ar')}
            className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
              langTab === 'ar' ? 'text-red-600 border-red-600' : 'text-slate-500 border-transparent'
            }`}
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => setLangTab('en')}
            className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
              langTab === 'en' ? 'text-red-600 border-red-600' : 'text-slate-500 border-transparent'
            }`}
          >
            English
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Offer Image */}
          <div className="flex items-start gap-4">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              title="اختر صورة من جهازك"
              className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-400 hover:text-red-500 flex flex-col items-center justify-center text-slate-400 shrink-0 overflow-hidden gap-1 transition cursor-pointer"
            >
              {imageUrl ? (
                <img src={imageUrl} alt="Offer" className="w-full h-full object-cover" />
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4" />
                  </svg>
                  <span className="text-[10px] font-bold">صورة العرض</span>
                </>
              )}
            </button>
            <div className="flex-1 space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">رابط الصورة (اختياري)</label>
              <input
                type="url"
                dir="ltr"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-red-500 transition"
              />
              <p className="text-[11px] text-slate-400">الصورة ستظهر للمستخدمين في العرض</p>
            </div>
          </div>

          {/* Title & Details */}
          {langTab === 'ar' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> عنوان العرض
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="عنوان العرض بالعربية"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-red-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">تفاصيل العرض</label>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="اكتب تفاصيل العرض بالعربية..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-red-500 transition resize-none"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Offer Title
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Offer title in English"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium text-left focus:outline-none focus:border-red-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Offer Details</label>
                <textarea
                  rows={3}
                  dir="ltr"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Write the offer details in English..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium text-left focus:outline-none focus:border-red-500 transition resize-none"
                />
              </div>
            </>
          )}

          {/* Extra Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900">معلومات إضافية</h4>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> تاريخ البدء
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-red-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> تاريخ الانتهاء
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-red-500 transition"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">الحالة</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('active')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                    status === 'active'
                      ? 'bg-emerald-50 border-emerald-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  نشط
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('disabled')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                    status === 'disabled'
                      ? 'bg-slate-100 border-slate-400 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${status === 'disabled' ? 'bg-slate-500' : 'bg-slate-300'}`}></span>
                  غير نشط
                </button>
              </div>
            </div>

            {/* Publish Scope */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">نطاق النشر</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPublishScope('all');
                    setBranchIds([]);
                  }}
                  className={`py-2 px-4 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                    publishScope === 'all'
                      ? 'bg-red-50 border-red-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                      publishScope === 'all' ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    {publishScope === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                  </span>
                  جميع الفروع
                </button>
                <button
                  type="button"
                  onClick={() => setPublishScope('specific')}
                  className={`py-2 px-4 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                    publishScope === 'specific'
                      ? 'bg-red-50 border-red-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                      publishScope === 'specific' ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    {publishScope === 'specific' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                  </span>
                  فرع محدد
                </button>
              </div>

              {publishScope === 'specific' && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-bold text-slate-700 mb-2">اختر الفروع المستهدفة</p>
                  {branches.length === 0 ? (
                    <p className="text-[11px] text-slate-400 text-center py-3 font-medium">
                      لا توجد فروع متاحة لهذه العلامة التجارية — أضف فروعاً من تبويب الفروع أولاً
                    </p>
                  ) : (
                    <div className="space-y-0.5">
                      {branches.map((branch) => (
                        <label
                          key={branch.id}
                          className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition"
                        >
                          <span className="text-xs font-bold text-slate-700">{branch.nameAr}</span>
                          <input
                            type="checkbox"
                            checked={branchIds.includes(branch.id)}
                            onChange={() =>
                              setBranchIds((prev) =>
                                prev.includes(branch.id)
                                  ? prev.filter((id) => id !== branch.id)
                                  : [...prev, branch.id]
                              )
                            }
                            className="w-4 h-4 accent-red-600 cursor-pointer"
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
              className="px-8 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition cursor-pointer"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
