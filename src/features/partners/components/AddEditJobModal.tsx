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

const CONTACT_METHODS: {
  id: ContactMethod;
  label: string;
  activeColor: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'phone',
    label: 'اتصال هاتفي',
    activeColor: 'bg-sky-500 text-white border-sky-600 shadow-md shadow-sky-500/20 scale-105',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'واتساب',
    activeColor: 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20 scale-105',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.634-1.156 4.22 4.316-1.131.584.344z"/>
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'البريد الإلكتروني',
    activeColor: 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20 scale-105',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

interface BulletListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  dir?: 'rtl' | 'ltr';
}

const BulletListInput: React.FC<BulletListInputProps> = ({
  label,
  items,
  onChange,
  placeholder,
  dir = 'rtl',
}) => {
  const [inputText, setInputText] = useState('');

  const handleAdd = () => {
    if (!inputText.trim()) return;
    onChange([...items, inputText.trim()]);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2" dir={dir}>
      <label className={`block text-xs font-bold text-slate-700 ${dir === 'ltr' ? 'text-left' : 'text-right'}`}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#d83f2a] hover:text-white text-slate-700 font-bold text-xs transition cursor-pointer shrink-0 flex items-center gap-1"
        >
          <span>+</span>
          <span>إضافة</span>
        </button>
      </div>

      {items.length > 0 && (
        <ul className="space-y-1.5 pt-1">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 font-medium"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d83f2a] shrink-0" />
                <span className="truncate">{item}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-slate-400 hover:text-red-500 font-bold text-xs p-1 rounded transition shrink-0 cursor-pointer"
                title="حذف"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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

  const [responsibilitiesAr, setResponsibilitiesAr] = useState<string[]>([]);
  const [responsibilitiesEn, setResponsibilitiesEn] = useState<string[]>([]);
  const [requirementsAr, setRequirementsAr] = useState<string[]>([]);
  const [requirementsEn, setRequirementsEn] = useState<string[]>([]);
  const [benefitsAr, setBenefitsAr] = useState<string[]>([]);
  const [benefitsEn, setBenefitsEn] = useState<string[]>([]);
  const [workingHoursAr, setWorkingHoursAr] = useState('');
  const [workingHoursEn, setWorkingHoursEn] = useState('');

  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time');
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>(['phone']);

  // Dynamic Contact Sub-fields
  const [contactPhone, setContactPhone] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const [status, setStatus] = useState<JobStatus>('open');
  const [publishingScope, setPublishingScope] = useState<PublishingScope>('all_branches');
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);

  useEffect(() => {
    if (editingJob) {
      setTitleAr(editingJob.titleAr || '');
      setTitleEn(editingJob.titleEn || '');
      setDescriptionAr(editingJob.descriptionAr || '');
      setDescriptionEn(editingJob.descriptionEn || '');

      setResponsibilitiesAr(editingJob.responsibilitiesAr || []);
      setResponsibilitiesEn(editingJob.responsibilitiesEn || []);
      setRequirementsAr(editingJob.requirementsAr || []);
      setRequirementsEn(editingJob.requirementsEn || []);
      setBenefitsAr(editingJob.benefitsAr || []);
      setBenefitsEn(editingJob.benefitsEn || []);
      setWorkingHoursAr(editingJob.workingHoursAr || '');
      setWorkingHoursEn(editingJob.workingHoursEn || '');

      setEmploymentType(editingJob.employmentType || 'full_time');
      setContactMethods(editingJob.contactMethods && editingJob.contactMethods.length > 0 ? editingJob.contactMethods : ['phone']);
      
      setContactPhone(editingJob.contactDetails?.phone || '');
      setContactWhatsapp(editingJob.contactDetails?.whatsapp || '');
      setContactEmail(editingJob.contactDetails?.email || '');

      setStatus(editingJob.status || 'open');
      setPublishingScope(editingJob.publishingScope || 'all_branches');
      setSelectedBranchIds(editingJob.branchIds || []);
    } else {
      setTitleAr('');
      setTitleEn('');
      setDescriptionAr('');
      setDescriptionEn('');

      setResponsibilitiesAr([]);
      setResponsibilitiesEn([]);
      setRequirementsAr([]);
      setRequirementsEn([]);
      setBenefitsAr([]);
      setBenefitsEn([]);
      setWorkingHoursAr('');
      setWorkingHoursEn('');

      setEmploymentType('full_time');
      setContactMethods(['phone']);
      setContactPhone('');
      setContactWhatsapp('');
      setContactEmail('');

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
      responsibilitiesAr,
      responsibilitiesEn,
      requirementsAr,
      requirementsEn,
      benefitsAr,
      benefitsEn,
      workingHoursAr,
      workingHoursEn,
      employmentType,
      contactMethods,
      contactDetails: {
        phone: contactMethods.includes('phone') ? contactPhone : undefined,
        whatsapp: contactMethods.includes('whatsapp') ? contactWhatsapp : undefined,
        email: contactMethods.includes('email') ? contactEmail : undefined,
      },
      status,
      publishingScope,
      branchIds: publishingScope === 'specific_branch' ? selectedBranchIds : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto" dir="rtl">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden my-8 animate-scaleUp">
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
            إدارة تفاصيل ومتطلبات الوظيفة الشاغرة
          </p>
        </div>

        {/* Language Tabs */}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
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
                  placeholder="المسمى الوظيفي بالعربية (مثل: سائق توصيل / مشرف مبيعات)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف الوظيفة</label>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="نبذة مختصرة عن الوظيفة بالعربية..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition resize-none"
                />
              </div>

              {/* Responsibilities list (المهام والمسؤوليات) */}
              <BulletListInput
                label="المهام والمسؤوليات"
                items={responsibilitiesAr}
                onChange={setResponsibilitiesAr}
                placeholder="أضف مهمة أو مسؤولية (مثل: توصيل الطلبات في الوقت المحدد)"
              />

              {/* Requirements list (المتطلبات) */}
              <BulletListInput
                label="المتطلبات والخبرات"
                items={requirementsAr}
                onChange={setRequirementsAr}
                placeholder="أضف شرطاً أو متطلباً (مثل: خبرة لا تقل عن سنة)"
              />

              {/* Benefits list (المزايا) */}
              <BulletListInput
                label="المزايا والفوائد"
                items={benefitsAr}
                onChange={setBenefitsAr}
                placeholder="أضف ميزة وظيفية (مثل: تأمين صحي شامل)"
              />

              {/* Working hours (ساعات العمل) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ساعات العمل</label>
                <input
                  type="text"
                  value={workingHoursAr}
                  onChange={(e) => setWorkingHoursAr(e.target.value)}
                  placeholder="مثل: 8 ساعات يومياً (من 9 صباحاً إلى 5 مساءً)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition"
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
                  placeholder="Brief summary of the role..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition resize-none"
                />
              </div>

              {/* Responsibilities EN */}
              <BulletListInput
                label="Tasks & Responsibilities"
                items={responsibilitiesEn}
                onChange={setResponsibilitiesEn}
                placeholder="Add a task (e.g. Deliver orders on time)"
                dir="ltr"
              />

              {/* Requirements EN */}
              <BulletListInput
                label="Requirements & Qualifications"
                items={requirementsEn}
                onChange={setRequirementsEn}
                placeholder="Add a requirement (e.g. 1+ year experience)"
                dir="ltr"
              />

              {/* Benefits EN */}
              <BulletListInput
                label="Benefits & Perks"
                items={benefitsEn}
                onChange={setBenefitsEn}
                placeholder="Add a benefit (e.g. Health Insurance)"
                dir="ltr"
              />

              {/* Working Hours EN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">Working Hours</label>
                <input
                  type="text"
                  value={workingHoursEn}
                  onChange={(e) => setWorkingHoursEn(e.target.value)}
                  placeholder="e.g. 8 hours/day (9:00 AM - 5:00 PM)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition"
                />
              </div>
            </div>
          )}

          {/* Section: Additional Info (معلومات إضافية والتواصل) */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400">معلومات التوظيف والتواصل</h4>

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

            {/* Contact Method Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">طرق التواصل المتاحة</label>
              <div className="flex flex-wrap items-center gap-2">
                {CONTACT_METHODS.map((method) => {
                  const isSelected = contactMethods.includes(method.id);
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handleToggleContactMethod(method.id)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'border border-[#d83f2a] bg-rose-50/70 text-[#d83f2a] shadow-xs'
                          : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="shrink-0">{method.icon}</span>
                      <span>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Contact Sub-fields (رقم آخر / واتساب آخر / بريد آخر) */}
            <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-500 block">
                تفاصيل بيانات التواصل (تظهر تلقائياً عند تحديد طريقة التواصل)
              </span>

              {/* Conditional Phone Sub-field */}
              {contactMethods.includes('phone') && (
                <div className="animate-fadeIn">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <span>📞</span>
                    <span>رقم هاتف آخر / رقم الاتصال</span>
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="أدخل رقم الهاتف للتواصل المباشر..."
                    dir="ltr"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition text-left"
                  />
                </div>
              )}

              {/* Conditional WhatsApp Sub-field */}
              {contactMethods.includes('whatsapp') && (
                <div className="animate-fadeIn">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <span>💬</span>
                    <span>واتساب آخر / رقم الواتساب</span>
                  </label>
                  <input
                    type="text"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    placeholder="أدخل رقم الواتساب المخصص للتواصل..."
                    dir="ltr"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition text-left"
                  />
                </div>
              )}

              {/* Conditional Email Sub-field */}
              {contactMethods.includes('email') && (
                <div className="animate-fadeIn">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <span>✉️</span>
                    <span>بريد آخر / البريد الإلكتروني</span>
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="أدخل البريد الإلكتروني لاستقبال الطلبات..."
                    dir="ltr"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition text-left"
                  />
                </div>
              )}
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
                  <span>نشط / مفتوح</span>
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
                  <span>غير نشط / مغلق</span>
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
              حفظ الوظيفة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
