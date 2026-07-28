import React, { useState, useEffect, useRef } from 'react';
import type { Category } from '../types/category.types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<Category>) => void;
  editingCategory?: Category | null;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCategory) {
      setNameAr(editingCategory.nameAr || '');
      setNameEn(editingCategory.nameEn || '');
      setDescriptionAr(editingCategory.descriptionAr || 'جميع خدمات التوصيل والشحن المحلي والدولي');
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
    setActiveTab('ar');
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() && !nameEn.trim()) {
      alert('يرجى إدخال اسم الفئة بالعربية أو الإنجليزية على الأقل.');
      return;
    }

    onSave({
      id: editingCategory?.id,
      nameAr: nameAr.trim() || nameEn.trim(),
      nameEn: nameEn.trim() || nameAr.trim(),
      descriptionAr: descriptionAr.trim(),
      descriptionEn: descriptionEn.trim(),
      status,
      image: imagePreview || 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=150&auto=format&fit=crop&q=80',
    });

    onClose();
  };

  return (
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
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Language Switch Tabs (Arabic / English) */}
          <div className="flex border-b border-slate-100 px-6 pt-2 shrink-0 bg-white">
            <button
              type="button"
              onClick={() => setActiveTab('ar')}
              className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'ar'
                  ? 'border-[#d83f2a] text-[#d83f2a]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'en'
                  ? 'border-[#d83f2a] text-[#d83f2a]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              English
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Image Upload Zone (Matching Image 1 in mockup) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                صورة الفئة <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              <div className="flex items-center gap-4">
                {/* Image Box */}
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

                {/* Upload Button + Description Text */}
                <div className="flex flex-col items-start gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>{editingCategory ? 'تغيير الصورة' : 'رفع صورة'}</span>
                  </button>

                  <p className="text-[11px] text-slate-400 font-semibold">
                    PNG, JPG حتى 5MB الحد الأدنى 200x200 بكسل
                  </p>
                </div>
              </div>
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
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال، خدمات التوصيل"
                    className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الوصف <span className="text-slate-400 font-normal">(اختياري)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    placeholder="أدخل وصفاً متصلاً للفئة..."
                    className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold resize-none"
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
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Delivery Services"
                    className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Description <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Enter a brief description..."
                    className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold resize-none"
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
                className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold cursor-pointer"
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
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
            >
              {editingCategory ? 'حفظ التعديلات' : 'إضافة الفئة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
