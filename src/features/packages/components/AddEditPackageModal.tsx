import React, { useState, useEffect } from 'react';
import type { Package, PackageDuration, PackageStatus } from '../types/package.types';

interface AddEditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Package>) => void;
  editingPackage?: Package | null;
}

const SUGGESTED_FEATURES = [
  'قوائم مميزة',
  'إدارة العروض',
  'إدارة الوظائف',
  'رموز الخصم',
  'الأولوية في الظهور',
  'مدير حساب مخصص',
];

export const AddEditPackageModal: React.FC<AddEditPackageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPackage,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'features'>('basic');
  const [activeLang, setActiveLang] = useState<'ar' | 'en'>('ar');

  // Basic Info State
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [price, setPrice] = useState<number | string>(0);
  const [duration, setDuration] = useState<PackageDuration>('monthly');

  // Features & Permissions State
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');

  // Limits
  const [maxOffers, setMaxOffers] = useState<string | number>('');
  const [maxJobs, setMaxJobs] = useState<string | number>('');
  const [maxPromoCodes, setMaxPromoCodes] = useState<string | number>('');
  const [maxMenuItems, setMaxMenuItems] = useState<string | number>('');
  const [maxImages, setMaxImages] = useState<string | number>('');

  // Settings
  const [isFeaturedPartner, setIsFeaturedPartner] = useState(false);
  const [priorityInSearch, setPriorityInSearch] = useState(false);
  const [isFeaturedPackage, setIsFeaturedPackage] = useState(false);
  const [status, setStatus] = useState<PackageStatus>('active');
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  useEffect(() => {
    if (editingPackage) {
      setNameAr(editingPackage.nameAr || '');
      setNameEn(editingPackage.nameEn || '');
      setDescriptionAr(editingPackage.descriptionAr || '');
      setDescriptionEn(editingPackage.descriptionEn || '');
      setPrice(editingPackage.price ?? 0);
      setDuration(editingPackage.duration || 'monthly');

      setFeatures(editingPackage.features || []);

      const p = editingPackage.permissions || {};
      setMaxOffers(p.maxOffers !== undefined && p.maxOffers !== null ? p.maxOffers : '');
      setMaxJobs(p.maxJobs !== undefined && p.maxJobs !== null ? p.maxJobs : '');
      setMaxPromoCodes(p.maxPromoCodes !== undefined && p.maxPromoCodes !== null ? p.maxPromoCodes : '');
      setMaxMenuItems(p.maxMenuItems !== undefined && p.maxMenuItems !== null ? p.maxMenuItems : '');
      setMaxImages(p.maxImages !== undefined && p.maxImages !== null ? p.maxImages : '');

      const s = editingPackage.settings || { status: 'active', displayOrder: 1 };
      setIsFeaturedPartner(s.isFeaturedPartner || false);
      setPriorityInSearch(s.priorityInSearch || false);
      setIsFeaturedPackage(s.isFeaturedPackage || false);
      setStatus(s.status || 'active');
      setDisplayOrder(s.displayOrder || 1);
    } else {
      setNameAr('');
      setNameEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setPrice(0);
      setDuration('monthly');

      setFeatures(['قوائم مميزة', 'إدارة العروض']);

      setMaxOffers('');
      setMaxJobs('');
      setMaxPromoCodes('');
      setMaxMenuItems('');
      setMaxImages('');

      setIsFeaturedPartner(false);
      setPriorityInSearch(false);
      setIsFeaturedPackage(false);
      setStatus('active');
      setDisplayOrder(1);
    }
    setActiveTab('basic');
    setActiveLang('ar');
  }, [editingPackage, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = (feat: string) => {
    const trimmed = feat.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed]);
    }
    setFeatureInput('');
  };

  const handleRemoveFeature = (feat: string) => {
    setFeatures((prev) => prev.filter((f) => f !== feat));
  };

  const handleKeyDownFeature = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature(featureInput);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    onSave({
      nameAr,
      nameEn: nameEn.trim() || nameAr.trim(),
      descriptionAr,
      descriptionEn,
      price: Number(price) || 0,
      duration,
      features,
      permissions: {
        maxOffers: maxOffers !== '' ? Number(maxOffers) : null,
        maxJobs: maxJobs !== '' ? Number(maxJobs) : null,
        maxPromoCodes: maxPromoCodes !== '' ? Number(maxPromoCodes) : null,
        maxMenuItems: maxMenuItems !== '' ? Number(maxMenuItems) : null,
        maxImages: maxImages !== '' ? Number(maxImages) : null,
      },
      settings: {
        isFeaturedPartner,
        priorityInSearch,
        isFeaturedPackage,
        status,
        displayOrder: Number(displayOrder) || 1,
      },
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
            {editingPackage ? 'تعديل الباقة' : 'إضافة باقة جديدة'}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            إدارة وتعديل تفاصيل الباقة
          </p>
        </div>

        {/* Main Tabs (المعلومات الأساسية | المميزات والصلاحيات) - Aligned to Right */}
        <div className="flex items-center justify-start px-6 gap-8 border-b border-slate-100 text-xs font-bold pt-3 pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`pb-2.5 px-1 relative transition cursor-pointer ${
              activeTab === 'basic' ? 'text-[#d83f2a]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            المعلومات الأساسية
            {activeTab === 'basic' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d83f2a] rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`pb-2.5 px-1 relative transition cursor-pointer ${
              activeTab === 'features' ? 'text-[#d83f2a]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            المميزات والصلاحيات
            {activeTab === 'features' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d83f2a] rounded-full" />
            )}
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-5">
              {/* Language Switcher - Aligned to Right */}
              <div className="flex items-center justify-start gap-3 text-xs font-bold mb-4">
                <button
                  type="button"
                  onClick={() => setActiveLang('ar')}
                  className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                    activeLang === 'ar'
                      ? 'bg-[#d83f2a] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang('en')}
                  className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                    activeLang === 'en'
                      ? 'bg-[#d83f2a] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  English
                </button>
              </div>

              {/* Arabic Inputs */}
              {activeLang === 'ar' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      اسم الباقة بالعربية <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder="مثال: الباقة الاحترافية"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف الباقة بالعربية</label>
                    <textarea
                      rows={3}
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      placeholder="وصف مختصر للباقة وميزاتها..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition resize-none"
                    />
                  </div>
                </div>
              )}

              {/* English Inputs */}
              {activeLang === 'en' && (
                <div className="space-y-4" dir="ltr">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">
                      Package Name (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="e.g. Professional Package"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">Package Description (English)</label>
                    <textarea
                      rows={3}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      placeholder="Brief description of the package..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Section: Pricing */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400">التسعير</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      السعر (د.أ) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="0"
                        step="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        dir="ltr"
                        className="w-full text-right pl-12 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-extrabold text-sm placeholder-slate-300 focus:outline-none focus:border-[#d83f2a] transition"
                      />
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400 pointer-events-none">
                        د.أ
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">مدة الاشتراك</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value as PackageDuration)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#d83f2a] transition cursor-pointer"
                    >
                      <option value="monthly">شهري</option>
                      <option value="quarterly">ربع سنوي</option>
                      <option value="semi_annual">نصف سنوي</option>
                      <option value="annual">سنوي</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEATURES & PERMISSIONS */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              {/* Features Input Container (Compact Tag & Text Field) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">المميزات</label>

                {/* Compact Tag-Input Box */}
                <div className="w-full p-2 px-3 rounded-xl bg-white border border-slate-200 focus-within:border-[#d83f2a] transition flex flex-wrap items-center gap-1.5 min-h-[42px] mb-2.5">
                  {features.map((feat) => (
                    <span
                      key={feat}
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-[#d83f2a] border border-rose-200 flex items-center gap-1.5"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feat)}
                        className="hover:text-red-800 cursor-pointer font-extrabold text-sm leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={handleKeyDownFeature}
                    placeholder={features.length > 0 ? '' : 'إضافة ميزة...'}
                    className="flex-1 min-w-[120px] bg-transparent text-slate-800 text-xs font-medium placeholder-slate-400 focus:outline-none py-1"
                  />
                </div>

                {/* Suggested Tags */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1.5">اقتراحات:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {SUGGESTED_FEATURES.map((sug) => {
                      const isAdded = features.includes(sug);
                      return (
                        <button
                          key={sug}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddFeature(sug)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                            isAdded
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              : 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-[#d83f2a] border border-slate-200 hover:border-rose-200'
                          }`}
                        >
                          + {sug}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section: Permissions & Limits */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400">الصلاحيات والحدود</h4>
                <p className="text-[11px] text-slate-400 mb-2">اترك الحقل فارغاً للإشارة إلى حد غير محدود</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">الحد الأقصى للعروض</label>
                    <input
                      type="number"
                      min="0"
                      value={maxOffers}
                      onChange={(e) => setMaxOffers(e.target.value)}
                      placeholder="غير محدود"
                      dir="rtl"
                      className="w-full px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold placeholder-slate-400 focus:bg-white focus:border-[#d83f2a] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">الحد الأقصى للوظائف</label>
                    <input
                      type="number"
                      min="0"
                      value={maxJobs}
                      onChange={(e) => setMaxJobs(e.target.value)}
                      placeholder="غير محدود"
                      dir="rtl"
                      className="w-full px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold placeholder-slate-400 focus:bg-white focus:border-[#d83f2a] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">الحد الأقصى لرموز الخصم</label>
                    <input
                      type="number"
                      min="0"
                      value={maxPromoCodes}
                      onChange={(e) => setMaxPromoCodes(e.target.value)}
                      placeholder="غير محدود"
                      dir="rtl"
                      className="w-full px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold placeholder-slate-400 focus:bg-white focus:border-[#d83f2a] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">الحد الأقصى لعناصر القائمة</label>
                    <input
                      type="number"
                      min="0"
                      value={maxMenuItems}
                      onChange={(e) => setMaxMenuItems(e.target.value)}
                      placeholder="غير محدود"
                      dir="rtl"
                      className="w-full px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold placeholder-slate-400 focus:bg-white focus:border-[#d83f2a] transition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">الحد الأقصى للصور</label>
                    <input
                      type="number"
                      min="0"
                      value={maxImages}
                      onChange={(e) => setMaxImages(e.target.value)}
                      placeholder="غير محدود"
                      dir="rtl"
                      className="w-full px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold placeholder-slate-400 focus:bg-white focus:border-[#d83f2a] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Additional Settings & Toggles */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400">إعدادات إضافية</h4>

                <div className="space-y-2">
                  {/* Toggle 1 */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <span className="text-xs font-extrabold text-slate-800">شريك مميز مدرج</span>
                    <button
                      type="button"
                      onClick={() => setIsFeaturedPartner(!isFeaturedPartner)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isFeaturedPartner ? 'bg-[#d83f2a]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isFeaturedPartner ? '-translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 2 */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <span className="text-xs font-extrabold text-slate-800">الأولوية في نتائج البحث</span>
                    <button
                      type="button"
                      onClick={() => setPriorityInSearch(!priorityInSearch)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        priorityInSearch ? 'bg-[#d83f2a]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          priorityInSearch ? '-translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 3 */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <span className="text-xs font-extrabold text-slate-800">باقة مميزة (Featured)</span>
                    <button
                      type="button"
                      onClick={() => setIsFeaturedPackage(!isFeaturedPackage)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isFeaturedPackage ? 'bg-[#d83f2a]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isFeaturedPackage ? '-translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">الحالة</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PackageStatus)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#d83f2a] transition cursor-pointer"
                    >
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">ترتيب العرض</label>
                    <input
                      type="number"
                      min="1"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(Number(e.target.value))}
                      placeholder="1"
                      dir="ltr"
                      className="w-full text-right px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-[#d83f2a] transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
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
              {editingPackage ? 'حفظ التغييرات' : 'إضافة الباقة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
