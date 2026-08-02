import React, { useState, useEffect, useRef } from 'react';
import type { Category } from '../types/category.types';
import { ImageCropModal } from './ImageCropModal';
import { validateCategoryInputs } from '../../../core/utils/securityUtils';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<Category> & { imageFile?: File }) => void;
  editingCategory?: Category | null;
  isLoading?: boolean;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageError, setImageError] = useState<string | null>(null);

  // Form Validation Errors
  const [formErrors, setFormErrors] = useState<{
    nameAr?: string;
    nameEn?: string;
    general?: string;
  }>({});

  // Image Cropper Modal State
  const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  const MAX_IMAGE_SIZE_KB = 512;
  const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

  useEffect(() => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (editingCategory) {
      setNameAr(editingCategory.nameAr || '');
      setNameEn(editingCategory.nameEn || '');
      setDescriptionAr(editingCategory.descriptionAr || '');
      setDescriptionEn(editingCategory.descriptionEn || '');
      setStatus(editingCategory.status);
      setImagePreview(editingCategory.image);
    } else {
      setNameAr('');
      setNameEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setStatus('active');
      setImagePreview(undefined);
    }
    setImageFile(undefined);
    setImageError(null);
    setFormErrors({});
    setIsCropperOpen(false);
    setCropImageSrc(null);
    setActiveTab('ar');
  }, [editingCategory, isOpen]);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
      const url = URL.createObjectURL(file);
      previewObjectUrlRef.current = url;
      setImageFile(file);
      setImagePreview(url);

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setImageError(`حجم الصورة الحالي (${(file.size / 1024).toFixed(0)}KB) أكبر من 512KB. يمكنك قص الصورة وضبط حجمها فوراً.`);
        setCropImageSrc(url);
        setIsCropperOpen(true);
      } else {
        setImageError(null);
      }
      e.target.value = '';
    }
  };

  const handleOpenCropper = () => {
    if (imageFile && imagePreview) {
      setCropImageSrc(imagePreview);
      setIsCropperOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleCropComplete = (croppedFile: File, croppedPreviewUrl: string) => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
    }
    previewObjectUrlRef.current = croppedPreviewUrl;
    setImageFile(croppedFile);
    setImagePreview(croppedPreviewUrl);
    setImageError(null);
  };

  const handleNameArChange = (val: string) => {
    setNameAr(val);
    if (/[a-zA-Z]/.test(val)) {
      setFormErrors((prev) => ({
        ...prev,
        nameAr: 'عفواً، حقل الاسم بالعربية مخصص للغة العربية فقط (يرجى عدم كتابة حروف إنجليزية هنا).',
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, nameAr: undefined }));
    }
  };

  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    if (/[\u0600-\u06FF]/.test(val)) {
      setFormErrors((prev) => ({
        ...prev,
        nameEn: 'عفواً، حقل الاسم بالإنجليزية مخصص للغة الإنجليزية فقط (يرجى عدم كتابة حروف عربية هنا).',
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, nameEn: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (imageFile && imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError(`حجم ملف الصورة يجب ألا يتجاوز 512 كيلوبايت. يرجى استخدام أداة "قص وضبط الصورة" لتقليل الحجم تلقائياً.`);
      handleOpenCropper();
      return;
    }

    // Security & Input Validation Check
    const validation = validateCategoryInputs({
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      isSubcategory: false,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      if (validation.errors.nameAr) {
        setActiveTab('ar');
      } else if (validation.errors.nameEn) {
        setActiveTab('en');
      }
      return;
    }

    setFormErrors({});

    onSave({
      id: editingCategory?.id,
      nameAr: validation.sanitizedData.nameAr,
      nameEn: validation.sanitizedData.nameEn,
      descriptionAr: validation.sanitizedData.descriptionAr,
      descriptionEn: validation.sanitizedData.descriptionEn,
      status,
      image: imagePreview || '',
      imageFile,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 transform transition-all my-auto max-h-[88vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 flex items-start justify-between relative border-b border-slate-100 shrink-0">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold">
                {editingCategory ? 'قم بتحديث بيانات الفئة' : 'أدخل بيانات الفئة الجديدة'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            {/* General Security Error Banner */}
            {formErrors.general && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formErrors.general}</span>
              </div>
            )}

            {/* Language Switch Tabs */}
            <div className="flex border-b border-slate-100 px-6 pt-2 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setActiveTab('ar')}
                disabled={isLoading}
                className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer relative ${
                  activeTab === 'ar'
                    ? 'border-[#d83f2a] text-[#d83f2a]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>العربية</span>
                {formErrors.nameAr && (
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block mr-1.5 align-middle"></span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                disabled={isLoading}
                className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer relative ${
                  activeTab === 'en'
                    ? 'border-[#d83f2a] text-[#d83f2a]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>English</span>
                {formErrors.nameEn && (
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block ml-1.5 align-middle"></span>
                )}
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Image Upload Zone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  صورة الفئة <span className="text-slate-400 font-normal">(الحد الأقصى 512KB)</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  disabled={isLoading}
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>{editingCategory || imagePreview ? 'تغيير الصورة' : 'رفع صورة'}</span>
                      </button>

                      {/* Crop Image Option Button */}
                      {imageFile && imagePreview && (
                        <button
                          type="button"
                          onClick={handleOpenCropper}
                          disabled={isLoading}
                          className="px-3.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                          title="قص وتعديل حجم الصورة"
                        >
                          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1m0 0L10 4m2-1v2.5M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1m2 1l-2 1m2-1v-2.5M18 18l2-1m-2 1l2 1m-2 1v-2.5" />
                          </svg>
                          <span>قص وضبط الحجم</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 font-semibold">
                      PNG, JPG حتى <span className="text-[#d83f2a] font-bold">512KB</span>
                    </p>
                  </div>
                </div>

                {/* Image Size Warning Banner */}
                {imageError && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{imageError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenCropper}
                      className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-extrabold hover:bg-amber-700 transition cursor-pointer shrink-0"
                    >
                      قص الصورة الآن
                    </button>
                  </div>
                )}
              </div>

              {/* Arabic Tab Fields */}
              {activeTab === 'ar' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      اسم الفئة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nameAr}
                      onChange={(e) => handleNameArChange(e.target.value)}
                      disabled={isLoading}
                      placeholder="مثال، خدمات التوصيل"
                      className={`w-full bg-slate-50/70 border text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 transition font-semibold disabled:opacity-60 ${
                        formErrors.nameAr ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#d83f2a]'
                      }`}
                    />
                    {formErrors.nameAr && (
                      <p className="text-xs text-red-500 font-bold mt-1 animate-fadeIn">{formErrors.nameAr}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الوصف <span className="text-slate-400 font-normal">(اختياري)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      disabled={isLoading}
                      placeholder="أدخل وصفاً متصلاً للفئة..."
                      className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold resize-none disabled:opacity-60"
                    />
                  </div>
                </>
              )}

              {/* English Tab Fields */}
              {activeTab === 'en' && (
                <div dir="ltr" className="text-left">
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Category Name
                    </label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => handleNameEnChange(e.target.value)}
                      disabled={isLoading}
                      placeholder="e.g. Delivery Services"
                      className={`w-full bg-slate-50/70 border text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 transition font-semibold disabled:opacity-60 ${
                        formErrors.nameEn ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#d83f2a]'
                      }`}
                    />
                    {formErrors.nameEn && (
                      <p className="text-xs text-red-500 font-bold mt-1 text-right animate-fadeIn" dir="rtl">{formErrors.nameEn}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Description <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      disabled={isLoading}
                      placeholder="Enter a brief description..."
                      className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold resize-none disabled:opacity-60"
                    />
                  </div>
                </div>
              )}

              {/* Status Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الحالة
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                  disabled={isLoading}
                  className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold cursor-pointer disabled:opacity-60"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition cursor-pointer disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <span>{editingCategory ? 'حفظ التعديلات' : 'إضافة الفئة'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Interactive Image Cropper Modal */}
      <ImageCropModal
        isOpen={isCropperOpen}
        imageSrc={cropImageSrc}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </>
  );
};
