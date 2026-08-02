import React, { useState, useEffect } from 'react';
import type { Category, SubCategory } from '../types/category.types';
import { validateCategoryInputs } from '../../../core/utils/securityUtils';

interface AddSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCategory: Category | null;
  onSave: (subCategoryData: Partial<SubCategory>) => void;
  editingSubCategory?: SubCategory | null;
  isLoading?: boolean;
}

export const AddSubCategoryModal: React.FC<AddSubCategoryModalProps> = ({
  isOpen,
  onClose,
  parentCategory,
  onSave,
  editingSubCategory,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [formErrors, setFormErrors] = useState<{
    nameAr?: string;
    nameEn?: string;
    general?: string;
  }>({});

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
    setFormErrors({});
    setActiveTab('ar');
  }, [editingSubCategory, isOpen]);

  if (!isOpen || !parentCategory) return null;

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

    // Security & Input Validation Check
    const validation = validateCategoryInputs({
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      isSubcategory: true,
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
      id: editingSubCategory?.id,
      parentId: parentCategory.id,
      nameAr: validation.sanitizedData.nameAr,
      nameEn: validation.sanitizedData.nameEn,
      descriptionAr: validation.sanitizedData.descriptionAr,
      descriptionEn: validation.sanitizedData.descriptionEn,
      status,
    });
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

          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Read-Only Parent Category Box */}
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
                    onChange={(e) => handleNameArChange(e.target.value)}
                    disabled={isLoading}
                    placeholder="مثال، سيارات للبيع"
                    className={`w-full bg-slate-50/70 border text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 transition font-semibold disabled:opacity-60 ${
                      formErrors.nameAr ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#d83f2a]'
                    }`}
                  />
                  {formErrors.nameAr && (
                    <p className="text-xs text-red-500 font-bold mt-1 animate-fadeIn">{formErrors.nameAr}</p>
                  )}
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
                    onChange={(e) => handleNameEnChange(e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g. Cars for Sale"
                    className={`w-full bg-slate-50/70 border text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 transition font-semibold disabled:opacity-60 ${
                      formErrors.nameEn ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#d83f2a]'
                    }`}
                  />
                  {formErrors.nameEn && (
                    <p className="text-xs text-red-500 font-bold mt-1 text-right animate-fadeIn" dir="rtl">{formErrors.nameEn}</p>
                  )}
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
                <span>{editingSubCategory ? 'حفظ التعديلات' : 'إضافة الفئة الفرعية'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
