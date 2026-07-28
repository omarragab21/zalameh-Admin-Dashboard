import React, { useState, useEffect } from 'react';
import type { Category, SubCategory } from '../types/category.types';

interface AddSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCategory: Category | null;
  onSave: (subCategoryData: Partial<SubCategory>) => void;
  editingSubCategory?: SubCategory | null;
}

export const AddSubCategoryModal: React.FC<AddSubCategoryModalProps> = ({
  isOpen,
  onClose,
  parentCategory,
  onSave,
  editingSubCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    if (editingSubCategory) {
      setNameAr(editingSubCategory.nameAr || '');
      setNameEn(editingSubCategory.nameEn || '');
      setDescriptionAr(editingSubCategory.descriptionAr || '');
      setDescriptionEn(editingSubCategory.descriptionEn || '');
      setStatus(editingSubCategory.status);
    } else {
      setNameAr('');
      setNameEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setStatus('active');
    }
    setActiveTab('ar');
  }, [editingSubCategory, isOpen]);

  if (!isOpen || !parentCategory) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() && !nameEn.trim()) {
      alert('يرجى إدخال اسم الفئة الفرعية بالعربية أو الإنجليزية على الأقل.');
      return;
    }

    onSave({
      id: editingSubCategory?.id,
      parentId: parentCategory.id,
      nameAr: nameAr.trim() || nameEn.trim(),
      nameEn: nameEn.trim() || nameAr.trim(),
      descriptionAr: descriptionAr.trim(),
      descriptionEn: descriptionEn.trim(),
      status,
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
              {editingSubCategory ? 'تعديل فئة فرعية' : 'إضافة فئة فرعية جديدة'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              ضمن: <span className="text-[#d83f2a] font-extrabold">{parentCategory.nameAr}</span>
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
          {/* Language Switch Tabs */}
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

          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Read-Only Parent Category Box (Matching Image 2 in mockup) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الفئة الرئيسية
              </label>
              <div className="bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={parentCategory.image}
                    alt={parentCategory.nameAr}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <span className="font-extrabold text-slate-800 text-sm">
                    {parentCategory.nameAr}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold">
                  للقراءة فقط
                </span>
              </div>
            </div>

            {/* Arabic Fields */}
            {activeTab === 'ar' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اسم الفئة الفرعية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال، سيارات للبيع"
                    className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold"
                  />
                </div>
              </>
            )}

            {/* English Fields */}
            {activeTab === 'en' && (
              <div dir="ltr" className="text-left">
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> Subcategory Name
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Cars for Sale"
                    className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold"
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
              {editingSubCategory ? 'حفظ التعديلات' : 'إضافة الفئة الفرعية'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
