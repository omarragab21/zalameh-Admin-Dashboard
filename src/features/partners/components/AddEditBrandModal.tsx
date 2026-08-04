import React, { useState, useEffect, useRef } from 'react';
import type { Brand, BrandStatus, SocialLinks } from '../types/partner.types';
import { categoryApiService } from '../../categories/data/api/categoryApiService';
import type { Category, SubCategory } from '../../categories/domain/entities/category.entity';

interface AddEditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (brandData: Partial<Brand>) => Promise<void> | void;
  partnerName: string;
  editingBrand?: Brand | null;
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^data:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

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
  const [sloganAr, setSloganAr] = useState('');
  const [sloganEn, setSloganEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryIds, setSubcategoryIds] = useState<string[]>([]);
  const [isSubcatOpen, setIsSubcatOpen] = useState(false);

  const [status, setStatus] = useState<BrandStatus>('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(true);
  const [rate, setRate] = useState<number>(4.5);
  const [linkUrl, setLinkUrl] = useState('');

  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [snapchatUrl, setSnapchatUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Load categories dynamically from /get_categories
    setLoadingCategories(true);
    categoryApiService
      .fetchGetCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch(() => {
        setCategories([]);
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, [isOpen]);

  useEffect(() => {
    setErrorMsg(null);
    setIsSubmitting(false);

    if (editingBrand) {
      setNameAr(editingBrand.nameAr || '');
      setNameEn(editingBrand.nameEn || '');
      setSloganAr(editingBrand.sloganAr || '');
      setSloganEn(editingBrand.sloganEn || '');
      setDescriptionAr(editingBrand.descriptionAr || '');
      setDescriptionEn(editingBrand.descriptionEn || '');
      setLogoUrl(editingBrand.logoUrl || '');
      setImageFile(null);
      setCategoryId(editingBrand.categoryId || '');
      setSubcategoryIds(editingBrand.subcategoryIds || []);
      setStatus(editingBrand.status || 'active');
      setIsFeatured(editingBrand.isFeatured || false);
      setHasDelivery(editingBrand.hasDelivery ?? true);
      setRate(editingBrand.rate ?? 4.5);
      setLinkUrl(editingBrand.linkUrl || '');

      setFacebookUrl(editingBrand.socialLinks?.facebook || '');
      setInstagramUrl(editingBrand.socialLinks?.instagram || '');
      setSnapchatUrl(editingBrand.socialLinks?.snapchat || '');
      setTwitterUrl(editingBrand.socialLinks?.twitter || '');
    } else {
      setNameAr('');
      setNameEn('');
      setSloganAr('');
      setSloganEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setLogoUrl('');
      setImageFile(null);
      setCategoryId('');
      setSubcategoryIds([]);
      setStatus('active');
      setIsFeatured(false);
      setHasDelivery(true);
      setRate(4.5);
      setLinkUrl('');

      setFacebookUrl('');
      setInstagramUrl('');
      setSnapchatUrl('');
      setTwitterUrl('');
    }
    setLangTab('ar');
    setIsSubcatOpen(false);
  }, [editingBrand, isOpen]);

  if (!isOpen) return null;

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);
  const availableSubcategories: SubCategory[] = selectedCategoryObj?.subcategories || [];

  const toggleSubcategory = (id: string) => {
    setSubcategoryIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setLogoUrl(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() && !nameEn.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const selectedSubNames = availableSubcategories
        .filter((s) => subcategoryIds.includes(s.id))
        .map((s) => s.nameAr || s.nameEn);

      const formattedLinkUrl = normalizeUrl(linkUrl);
      const formattedFacebookUrl = normalizeUrl(facebookUrl);
      const formattedInstagramUrl = normalizeUrl(instagramUrl);
      const formattedSnapchatUrl = normalizeUrl(snapchatUrl);
      const formattedTwitterUrl = normalizeUrl(twitterUrl);

      const socialLinks: SocialLinks = {
        website: formattedLinkUrl,
        facebook: formattedFacebookUrl,
        instagram: formattedInstagramUrl,
        snapchat: formattedSnapchatUrl,
        twitter: formattedTwitterUrl,
      };

      await onSave({
        nameAr: nameAr || nameEn,
        nameEn: nameEn || nameAr,
        sloganAr,
        sloganEn,
        descriptionAr,
        descriptionEn,
        logoUrl: logoUrl ? normalizeUrl(logoUrl) : undefined,
        imageFile: imageFile || undefined,
        categoryId,
        categoryName: selectedCategoryObj ? selectedCategoryObj.nameAr || selectedCategoryObj.nameEn : '',
        subcategoryIds,
        subcategoryNames: selectedSubNames,
        status,
        isFeatured,
        hasDelivery,
        rate,
        linkUrl: formattedLinkUrl,
        socialLinks,
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'حدث خطأ أثناء حفظ بيانات العلامة التجارية');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
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
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 transition cursor-pointer mt-1 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

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
                disabled={isSubmitting}
                title="اختر صورة من جهازك"
                className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:text-emerald-600 flex flex-col items-center justify-center text-slate-400 shrink-0 overflow-hidden gap-1 transition cursor-pointer group disabled:opacity-50"
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4" />
                    </svg>
                    <span className="text-[10px] font-bold">رفع صورة</span>
                  </>
                )}
              </button>
              <div className="flex-1 space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">رابط الشعار أو رفعه كملف</label>
                <input
                  type="text"
                  inputMode="url"
                  dir="ltr"
                  disabled={isSubmitting}
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/brand-logo.png"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-emerald-600 transition disabled:bg-slate-50"
                />
                <p className="text-[11px] text-slate-400">يمكنك رفع صورة مباشرة أو إدخال رابط الشعار</p>
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
                        <span className="text-red-500">*</span> اسم العلامة التجارية بالعربية
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={nameAr}
                        onChange={(e) => setNameAr(e.target.value)}
                        placeholder="اسم العلامة التجارية بالعربية (مثال: برجر كينج)"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 transition disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">الشعار (Slogan) بالعربية</label>
                      <input
                        type="text"
                        disabled={isSubmitting}
                        value={sloganAr}
                        onChange={(e) => setSloganAr(e.target.value)}
                        placeholder="شعار العلامة التجارية بالعربية (مثال: طعم الملوك)"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 transition disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف العلامة التجارية بالعربية</label>
                      <textarea
                        rows={2}
                        disabled={isSubmitting}
                        value={descriptionAr}
                        onChange={(e) => setDescriptionAr(e.target.value)}
                        placeholder="وصف مختصر للعلامة التجارية بالعربية (اختياري)..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 transition resize-none disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        <span className="text-red-500">*</span> Brand Name in English
                      </label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        disabled={isSubmitting}
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        placeholder="Brand name in English (e.g. Burger King)"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium text-left focus:outline-none focus:border-emerald-600 transition disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Slogan in English</label>
                      <input
                        type="text"
                        dir="ltr"
                        disabled={isSubmitting}
                        value={sloganEn}
                        onChange={(e) => setSloganEn(e.target.value)}
                        placeholder="Brand slogan in English (e.g. Taste of Kings)"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium text-left focus:outline-none focus:border-emerald-600 transition disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Brand Description in English</label>
                      <textarea
                        rows={2}
                        dir="ltr"
                        disabled={isSubmitting}
                        value={descriptionEn}
                        onChange={(e) => setDescriptionEn(e.target.value)}
                        placeholder="Brief description of the brand in English (optional)..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium text-left focus:outline-none focus:border-emerald-600 transition resize-none disabled:bg-slate-50"
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
              <label className="block text-xs font-bold text-slate-700 mb-1.5">الفئة الرئيسيّة</label>
              <div className="relative">
                <select
                  disabled={isSubmitting}
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSubcategoryIds([]);
                  }}
                  className={`w-full appearance-none px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-600 transition cursor-pointer disabled:bg-slate-50 ${
                    categoryId ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  <option value="">
                    {loadingCategories ? 'جاري تحميل الفئات...' : 'اختر الفئة الرئيسية'}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameAr || cat.nameEn}
                    </option>
                  ))}
                </select>
                <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Subcategories drop-down / multi-select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">الفئات الفرعية</label>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsSubcatOpen(!isSubcatOpen)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-600 transition cursor-pointer flex items-center justify-between disabled:bg-slate-50"
              >
                <span className={subcategoryIds.length > 0 ? 'text-slate-900' : 'text-slate-400'}>
                  {subcategoryIds.length > 0
                    ? `تم اختيار ${subcategoryIds.length} فئة فرعية`
                    : 'اختر الفئات الفرعية'}
                </span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isSubcatOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isSubcatOpen && (
                <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2 space-y-0.5 max-h-40 overflow-y-auto">
                  {availableSubcategories.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-3 font-medium">
                      {categoryId ? 'لا توجد فئات فرعية مضافة لهذه الفئة' : 'اختر الفئة الرئيسية أولاً'}
                    </p>
                  ) : (
                    availableSubcategories.map((sub) => (
                      <label
                        key={sub.id}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition"
                      >
                        <span className="text-xs font-bold text-slate-700">{sub.nameAr || sub.nameEn}</span>
                        <input
                          type="checkbox"
                          disabled={isSubmitting}
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

          {/* Links & Rating */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900">الروابط والتقييم</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رابط الموقع (Link URL)</label>
                <input
                  type="text"
                  inputMode="url"
                  dir="ltr"
                  disabled={isSubmitting}
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium text-left focus:outline-none focus:border-emerald-600 transition disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">التقييم (Rate)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  disabled={isSubmitting}
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 5.0)}
                  placeholder="4.5"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-emerald-600 transition disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900">روابط وسائل التواصل الاجتماعي</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">فيسبوك (Facebook)</label>
                <input
                  type="text"
                  inputMode="url"
                  dir="ltr"
                  disabled={isSubmitting}
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/brand"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-emerald-600 transition disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">إنستغرام (Instagram)</label>
                <input
                  type="text"
                  inputMode="url"
                  dir="ltr"
                  disabled={isSubmitting}
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/brand"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-emerald-600 transition disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">سناب شات (Snapchat)</label>
                <input
                  type="text"
                  inputMode="url"
                  dir="ltr"
                  disabled={isSubmitting}
                  value={snapchatUrl}
                  onChange={(e) => setSnapchatUrl(e.target.value)}
                  placeholder="https://snapchat.com/add/brand"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-emerald-600 transition disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">X (تويتر سابقاً)</label>
                <input
                  type="text"
                  inputMode="url"
                  dir="ltr"
                  disabled={isSubmitting}
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/brand"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-emerald-600 transition disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Settings & Toggles */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900">الإعدادات والميزات</h4>
            
            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">حالة العلامة التجارية</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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

            {/* Is Featured Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">علامة تجارية مميزة</span>
                  <span className="text-[11px] text-slate-400">تظهر في أعلى القوائم وبشارة مميزة</span>
                </div>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
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

            {/* Has Delivery Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">خدمة التوصيل</span>
                  <span className="text-[11px] text-slate-400">هل تتوفر خدمة التوصيل لهذه العلامة التجارية</span>
                </div>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setHasDelivery(!hasDelivery)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                  hasDelivery ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    hasDelivery ? '-translate-x-5' : 'translate-x-0'
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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm transition cursor-pointer disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{editingBrand ? 'حفظ التعديلات' : 'إضافة العلامة'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
