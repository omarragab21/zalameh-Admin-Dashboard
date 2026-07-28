import React, { useState, useEffect } from 'react';
import type { JobPosition, EmploymentType, ContactMethod, JobStatus, PublishingScope, Branch } from '../types/partner.types';

interface AddEditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<JobPosition>) => void;
  editingJob?: JobPosition | null;
  branches?: Branch[];
}

const EMPLOYMENT_TYPES: { id: EmploymentType; label: string }[] = [
  { id: 'full_time', label: 'دوام كامل' },
  { id: 'part_time', label: 'دوام جزئي' },
  { id: 'hourly', label: 'بالساعة' },
  { id: 'contract', label: 'عقد مؤقت' },
  { id: 'internship', label: 'تدريب' },
  { id: 'remote', label: 'عن بُعد' },
];

const CONTACT_METHODS: { id: ContactMethod; label: string }[] = [
  { id: 'phone', label: 'اتصال هاتفي' },
  { id: 'whatsapp', label: 'واتساب' },
  { id: 'email', label: 'البريد الإلكتروني' },
];

export const AddEditJobModal: React.FC<AddEditJobModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingJob,
  branches = [],
}) => {
  const [activeLang, setActiveLang] = useState<'ar' | 'en'>('ar');

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time');
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>(['phone']);
  const [status, setStatus] = useState<JobStatus>('open');
  const [publishingScope, setPublishingScope] = useState<PublishingScope>('all_branches');
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);

  useEffect(() => {
    if (editingJob) {
      setTitleAr(editingJob.titleAr || '');
      setTitleEn(editingJob.titleEn || '');
      setDescriptionAr(editingJob.descriptionAr || '');
      setDescriptionEn(editingJob.descriptionEn || '');
      setEmploymentType(editingJob.employmentType || 'full_time');
      setContactMethods(editingJob.contactMethods && editingJob.contactMethods.length > 0 ? editingJob.contactMethods : ['phone']);
      setStatus(editingJob.status || 'open');
      setPublishingScope(editingJob.publishingScope || 'all_branches');
      setSelectedBranchIds(editingJob.branchIds || []);
    } else {
      setTitleAr('');
      setTitleEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setEmploymentType('full_time');
      setContactMethods(['phone']);
      setStatus('open');
      setPublishingScope('all_branches');
      setSelectedBranchIds([]);
    }
    setActiveLang('ar');
  }, [editingJob, isOpen]);

  if (!isOpen) return null;

  const handleToggleContactMethod = (method: ContactMethod) => {
    setContactMethods((prev) =>
      prev.includes(method)
        ? prev.length > 1
          ? prev.filter((m) => m !== method)
          : prev
        : [...prev, method]
    );
  };

  const handleToggleBranch = (branchId: string) => {
    setSelectedBranchIds((prev) =>
      prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim()) return;

    onSave({
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      employmentType,
      contactMethods,
      status,
      publishingScope,
      branchIds: publishingScope === 'specific_branch' ? selectedBranchIds : undefined,
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
            {editingJob ? 'تعديل الوظيفة' : 'إضافة وظيفة جديدة'}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            الوظائف المرتبطة بهذا الشريك
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center justify-center gap-8 border-b border-slate-100 text-xs font-bold pt-3 pb-0">
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
                  المسمى الوظيفي <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="المسمى الوظيفي بالعربية"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف الوظيفة</label>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="اكتب وصف الوظيفة والمتطلبات بالعربية..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition resize-none"
                />
              </div>
            </div>
          )}

          {/* Tab 2: English */}
          {activeLang === 'en' && (
            <div className="space-y-4" dir="ltr">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">Job Title</label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Job title in English"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">Job Description</label>
                <textarea
                  rows={3}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Write job description and requirements in English..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition resize-none"
                />
              </div>
            </div>
          )}

          {/* Section: Additional Info (معلومات إضافية) */}
          <div className="pt-3 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400">معلومات إضافية</h4>

            {/* Employment Type Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">نوع التوظيف</label>
              <div className="flex flex-wrap items-center gap-2">
                {EMPLOYMENT_TYPES.map((type) => {
                  const isSelected = employmentType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setEmploymentType(type.id)}
                      className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'border border-[#d83f2a] bg-rose-50/70 text-[#d83f2a] shadow-xs'
                          : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Method Pills (Selectable buttons as requested in audio) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">طريقة التواصل</label>
              <div className="flex flex-wrap items-center gap-2">
                {CONTACT_METHODS.map((method) => {
                  const isSelected = contactMethods.includes(method.id);
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handleToggleContactMethod(method.id)}
                      className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'border border-[#d83f2a] bg-rose-50/70 text-[#d83f2a] shadow-xs'
                          : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {method.label}
                    </button>
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
                  onClick={() => setStatus('open')}
                  className={`px-4 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    status === 'open'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>نشط</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('closed')}
                  className={`px-4 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    status === 'closed'
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

              {/* Specific Branches Checkboxes Container */}
              {publishingScope === 'specific_branch' && (
                <div className="mt-3 bg-slate-50/60 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    اختر الفروع المستهدفة
                  </span>
                  {branches.length === 0 ? (
                    <p className="text-xs font-bold text-slate-400">لا توجد فروع مسجلة</p>
                  ) : (
                    branches.map((b) => {
                      const isChecked = selectedBranchIds.includes(b.id);
                      return (
                        <label
                          key={b.id}
                          className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleBranch(b.id)}
                            className="rounded text-[#d83f2a] focus:ring-[#d83f2a] accent-[#d83f2a]"
                          />
                          <span>{b.nameAr}</span>
                        </label>
                      );
                    })
                  )}
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
