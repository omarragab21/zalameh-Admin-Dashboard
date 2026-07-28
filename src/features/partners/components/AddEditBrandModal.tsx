import React, { useState, useEffect, useRef } from 'react';
import type { Brand, BrandStatus } from '../types/partner.types';

interface AddEditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (brandData: Partial<Brand>) => void;
  partnerName: string;
  editingBrand?: Brand | null;
}

const CATEGORIES_LIST = [
  { id: 'cat-1', name: 'خدمات اللوجستيات والتوصيل', subcategories: [
    { id: 'sub-1-1', name: 'توصيل الطعام' },
    { id: 'sub-1-2', name: 'توصيل الطرود' },
    { id: 'sub-1-3', name: 'الشحن الثقيل' },
    { id: 'sub-1-4', name: 'التوصيل الفوري' },
  ]},
  { id: 'cat-2', name: 'الخدمات المنزلية والصيانة', subcategories: [
    { id: 'sub-2-1', name: 'تنظيف المنازل' },
    { id: 'sub-2-2', name: 'صيانة الكهرباء والسباكة' },
    { id: 'sub-2-3', name: 'الدهانات والديكور' },
  ]},
  { id: 'cat-3', name: 'التقنية والبرمجيات', subcategories: [
    { id: 'sub-3-1', name: 'تطوير التطبيقات' },
    { id: 'sub-3-2', name: 'الاستضافة السحابية' },
    { id: 'sub-3-3', name: 'حلول الذكاء الاصطناعي' },
  ]},
  { id: 'cat-4', name: 'اللياقة والصحة', subcategories: [
    { id: 'sub-4-1', name: 'النوادي الرياضية' },
    { id: 'sub-4-2', name: 'التغذية الصحية' },
    { id: 'sub-4-3', name: 'التدريب الشخصي' },
  ]},
  { id: 'cat-5', name: 'المطاعم والمأكولات', subcategories: [
    { id: 'sub-5-1', name: 'مطاعم' },
    { id: 'sub-5-2', name: 'مقاهي' },
    { id: 'sub-5-3', name: 'حلويات' },
    { id: 'sub-5-4', name: 'وجبات سريعة' },
  ]},
  { id: 'cat-6', name: 'التسوق والتجارة', subcategories: [
    { id: 'sub-6-1', name: 'أزياء' },
    { id: 'sub-6-2', name: 'إلكترونيات' },
    { id: 'sub-6-3', name: 'سوبرماركت' },
  ]},
];

export const AddEditBrandModal: React.FC<AddEditBrandModalProps> = ({
  isOpen,
  onClose,
  onSave,
  partnerName,
  editingBrand,
}) => {
  const [langTab, setLangTab] = useState<'ar' | 'en'>('ar');

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryIds, setSubcategoryIds] = useState<string[]>([]);
  const [isSubcatOpen, setIsSubcatOpen] = useState(false);
  const [status, setStatus] = useState<BrandStatus>('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingBrand) {
      setNameAr(editingBrand.nameAr || '');
      setNameEn(editingBrand.nameEn || '');
      setDescriptionAr(editingBrand.descriptionAr || '');
      setDescriptionEn(editingBrand.descriptionEn || '');
      setLogoUrl(editingBrand.logoUrl || '');
      setCategoryId(editingBrand.categoryId || '');
      setSubcategoryIds(editingBrand.subcategoryIds || []);
      setStatus(editingBrand.status || 'active');
      setIsFeatured(editingBrand.isFeatured || false);
    } else {
      setNameAr('');
      setNameEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setLogoUrl('');
      setCategoryId('');
      setSubcategoryIds([]);
      setStatus('active');
      setIsFeatured(false);
    }
    setLangTab('ar');
    setIsSubcatOpen(false);
  }, [editingBrand, isOpen]);

  if (!isOpen) return null;

  const availableSubcategories = CATEGORIES_LIST.find((c) => c.id === categoryId)?.subcategories || [];

  const toggleSubcategory = (id: string) => {
    setSubcategoryIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setLogoUrl(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() && !nameEn.trim()) return;
    if (!categoryId) return;

    const selectedCatObj = CATEGORIES_LIST.find((c) => c.id === categoryId);
    const selectedSubNames = availableSubcategories
      .filter((s) => subcategoryIds.includes(s.id))
      .map((s) => s.name);

    onSave({
      nameAr: nameAr || nameEn,
      nameEn: nameEn || nameAr,
      descriptionAr,
      descriptionEn,
      logoUrl: logoUrl || undefined,
      categoryId,
      categoryName: selectedCatObj ? selectedCatObj.name : '',
      subcategoryIds,
      subcategoryNames: selectedSubNames,
      status,
      isFeatured,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {editingBrand ? 'تعديل العلامة التجارية' : 'إضافة علامة تجارية'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">تابعة لـ {partnerName}</p>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Logo Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900">شعار العلامة التجارية</h4>
            <div className="flex items-start gap-4">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                title="اختر صورة من جهازك"
                className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 flex flex-col items-center justify-center text-slate-400 shrink-0 overflow-hidden gap-1 transition cursor-pointer"
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4" />
                    </svg>
                    <span className="text-[10px] font-bold">الشعار</span>
                  </>
                )}
              </button>
              <div className="flex-1 space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">رابط الشعار (اختياري)</label>
                <input
                  type="url"
                  dir="ltr"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/brand-logo.png"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-emerald-600 transition"
                />
                <p className="text-[11px] text-slate-400">الصورة ستظهر للمستخدمين في صفحة العلامة التجارية</p>
              </div>
            </div>
          </div>

          {/* Brand Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900">معلومات العلامة التجارية</h4>
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 pt-2 flex items-center gap-5 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setLangTab('ar')}
                  className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                    langTab === 'ar' ? 'text-emerald-600 border-emerald-600' : 'text-slate-500 border-transparent'
                  }`}
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => setLangTab('en')}
                  className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                    langTab === 'en' ? 'text-emerald-600 border-emerald-600' : 'text-slate-500 border-transparent'
                  }`}
                >
                  English
                </button>
              </div>
              <div className="p-4">
                {langTab === 'ar' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        <span className="text-red-500">*</span> اسم العلامة التجارية
                      </label>
                      <input
                        type="text"
                        required
                        value={nameAr}
                        onChange={(e) => setNameAr(e.target.value)}
                        placeholder="اسم العلامة التجارية بالعربية"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف العلامة التجارية</label>
                      <textarea
                        rows={3}
                        value={descriptionAr}
                        onChange={(e) => setDescriptionAr(e.target.value)}
                        placeholder="وصف مختصر للعلامة التجارية بالعربية (اختياري)..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 transition resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        <span className="text-red-500">*</span> Brand Name
                      </label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        placeholder="Brand name in English"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium text-left focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Brand Description</label>
                      <textarea
                        rows={3}
                        dir="ltr"
                        value={descriptionEn}
                        onChange={(e) => setDescriptionEn(e.target.value)}
                        placeholder="Brief description of the brand in English (optional)..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium text-left focus:outline-none focus:border-emerald-600 transition resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900">التصنيف</h4>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <span className="text-red-500">*</span> الفئة الرئيسية
              </label>
              <div className="relative">
                <select
                  required
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSubcategoryIds([]);
                  }}
                  className={`w-full appearance-none px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-600 transition cursor-pointer ${
                    categoryId ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  <option value="" disabled>
                    اختر الفئة الرئيسية
                  </option>
                  {CATEGORIES_LIST.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">الفئات الفرعية</label>
              <button
                type="button"
                onClick={() => setIsSubcatOpen(!isSubcatOpen)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-600 transition cursor-pointer flex items-center justify-between"
              >
                <span className={subcategoryIds.length > 0 ? 'text-slate-900' : 'text-slate-400'}>
                  {subcategoryIds.length > 0 ? `تم اختيار ${subcategoryIds.length} فئة فرعية` : 'اختر الفئات الفرعية (اختياري)'}
                </span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isSubcatOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isSubcatOpen && (
                <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2 space-y-0.5">
                  {availableSubcategories.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-3 font-medium">اختر الفئة الرئيسية أولاً</p>
                  ) : (
                    availableSubcategories.map((sub) => (
                      <label
                        key={sub.id}
                        className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition"
                      >
                        <span className="text-xs font-bold text-slate-700">{sub.name}</span>
                        <input
                          type="checkbox"
                          checked={subcategoryIds.includes(sub.id)}
                          onChange={() => toggleSubcategory(sub.id)}
                          className="w-4 h-4 accent-emerald-600 cursor-pointer"
                        />
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900">الإعدادات</h4>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">حالة العلامة التجارية</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('active')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                    status === 'active'
                      ? 'bg-emerald-50 border-emerald-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  نشطة
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('inactive')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                    status === 'inactive'
                      ? 'bg-slate-100 border-slate-400 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${status === 'inactive' ? 'bg-slate-500' : 'bg-slate-300'}`}></span>
                  غير نشطة
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">علامة تجارية مميزة</span>
                  <span className="text-[11px] text-slate-400">تظهر في أعلى القوائم وبشارة مميزة</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFeatured(!isFeatured)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                  isFeatured ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    isFeatured ? '-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              {editingBrand ? 'حفظ التعديلات' : 'إضافة العلامة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
