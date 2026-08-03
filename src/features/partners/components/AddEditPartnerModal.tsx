import React, { useState, useEffect } from 'react';
import type { Partner, SubscriptionPlan, PartnerStatus, PackageItem } from '../types/partner.types';
import { packageApiService } from '../data/api/packageApiService';

interface AddEditPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partnerData: any) => void;
  editingPartner?: Partner | null;
}

export const AddEditPartnerModal: React.FC<AddEditPartnerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPartner,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'subscription'>('basic');
  const [langTab, setLangTab] = useState<'ar' | 'en'>('ar');

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('basic');
  const [selectedPackageId, setSelectedPackageId] = useState<number>(1);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [packagesList, setPackagesList] = useState<PackageItem[]>([]);

  const [status, setStatus] = useState<PartnerStatus>('active');
  const [password, setPassword] = useState('p@ssW0rd!2024');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const generateNewPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let newPass = '';
    for (let i = 0; i < 12; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (isOpen) {
      packageApiService
        .fetchPackages()
        .then((pkgs) => {
          setPackagesList(pkgs);
          if (pkgs.length > 0 && !editingPartner) {
            setSelectedPackageId(pkgs[0].id);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, editingPartner]);

  useEffect(() => {
    if (editingPartner) {
      setNameAr(editingPartner.nameAr || '');
      setNameEn(editingPartner.nameEn || '');
      setDescriptionAr(editingPartner.descriptionAr || '');
      setDescriptionEn(editingPartner.descriptionEn || '');
      setEmail(editingPartner.email || '');
      setPhone(editingPartner.phone || '');
      setSelectedPlan(editingPartner.plan || 'basic');
      setStatus(editingPartner.status || 'active');
      setImagePreview(editingPartner.avatarUrl || '');
      setImageFile(null);
    } else {
      setNameAr('');
      setNameEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setEmail('');
      setPhone('');
      setSelectedPlan('basic');
      setStatus('active');
      setImagePreview('');
      setImageFile(null);
    }
    generateNewPassword();
    setActiveTab('basic');
    setLangTab('ar');
  }, [editingPartner, isOpen]);

  if (!isOpen) return null;

  const isAr = langTab === 'ar';

  const getPlanName = (p: SubscriptionPlan): string => {
    switch (p) {
      case 'basic': return isAr ? 'أساسية' : 'Basic';
      case 'professional': return isAr ? 'احترافية' : 'Professional';
      case 'featured': return isAr ? 'مميزة' : 'Featured';
      case 'enterprise': return isAr ? 'مؤسسية' : 'Enterprise';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() && !nameEn.trim()) return;

    const selectedPkg = packagesList.find((p) => p.id === selectedPackageId);

    onSave({
      nameAr: nameAr || nameEn,
      nameEn: nameEn || nameAr,
      descriptionAr,
      descriptionEn,
      email,
      phone,
      password,
      packageId: selectedPackageId,
      billingCycle,
      plan: selectedPlan,
      planName: selectedPkg ? (isAr ? selectedPkg.nameAr : selectedPkg.nameEn) : getPlanName(selectedPlan),
      status,
      imageFile: imageFile || undefined,
      avatarUrl: imagePreview || editingPartner?.avatarUrl,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#d83f2a] flex items-center justify-center font-bold shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                {editingPartner
                  ? (isAr ? 'تعديل الشريك' : 'Edit Partner')
                  : (isAr ? 'إضافة شريك جديد' : 'Add New Partner')}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {editingPartner
                  ? (isAr ? editingPartner.nameAr : editingPartner.nameEn)
                  : (isAr ? 'أدخل بيانات الشريك والتفاصيل المطلوبة' : 'Enter partner details and required information')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition flex items-center justify-center cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Tabs Header */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition cursor-pointer ${
              activeTab === 'basic'
                ? 'border-[#d83f2a] text-[#d83f2a]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {isAr ? 'المعلومات الأساسية' : 'Basic Information'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subscription')}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition cursor-pointer ${
              activeTab === 'subscription'
                ? 'border-[#d83f2a] text-[#d83f2a]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {isAr ? 'معلومات الاشتراك' : 'Subscription Information'}
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'basic' ? (
            <div className="space-y-5">
              {/* Language Switcher */}
              <div className="flex justify-start">
                <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-bold w-48">
                  <button
                    type="button"
                    onClick={() => setLangTab('ar')}
                    className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                      isAr ? 'bg-white text-[#d83f2a] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    type="button"
                    onClick={() => setLangTab('en')}
                    className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                      !isAr ? 'bg-white text-[#d83f2a] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Image / Logo Upload Section */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'صورة الشريك / اللوجو' : 'Partner Logo / Image'}
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    {isAr ? 'اختر صورة بدقة عالية (PNG, JPG)' : 'Choose high resolution image (PNG, JPG)'}
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>{isAr ? 'رفع صورة' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Name & Description Fields */}
              {isAr ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      اسم الشريك <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder="اسم الشريك بالعربية..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d83f2a] focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف مختصر</label>
                    <textarea
                      rows={2}
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      placeholder="وصف مختصر للشريك بالعربية..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d83f2a] focus:bg-white transition resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Partner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="Partner name in English..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d83f2a] focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Short Description</label>
                    <textarea
                      rows={2}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      placeholder="Short description in English..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d83f2a] focus:bg-white transition resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Grid 2-col for Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isAr ? 'رقم الهاتف' : 'Phone Number'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+962XXXXXXXXX"
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d83f2a] focus:bg-white transition ${
                      isAr ? 'dir-ltr text-right' : 'dir-ltr text-left'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d83f2a] focus:bg-white transition ${
                      isAr ? 'dir-ltr text-right' : 'dir-ltr text-left'
                    }`}
                  />
                </div>
              </div>

              {/* Login Credentials Section (بيانات الدخول) */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <span className="block text-xs font-extrabold text-slate-800">
                  {isAr ? 'بيانات الدخول' : 'Login Credentials'}
                </span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600">
                      {isAr ? 'كلمة المرور المولدة تلقائياً' : 'Auto-generated Password'}
                    </label>
                    <span className="text-xs font-extrabold text-emerald-600">
                      {isAr ? 'آمنة' : 'Secure'}
                    </span>
                  </div>

                  {/* Password Field Row */}
                  <div className="flex items-center gap-2">
                    {/* Password Input Box (ONLY Eye Icon inside) */}
                    <div className="relative flex-1 flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-2xs focus-within:border-[#d83f2a] transition">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        readOnly
                        value={password}
                        className={`w-full bg-transparent text-sm font-extrabold text-slate-800 focus:outline-none dir-ltr text-left tracking-widest ${
                          isAr ? 'pl-8 pr-2' : 'pr-8 pl-2'
                        }`}
                      />

                      {/* ONLY Eye Show/Hide Toggle inside field */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute text-slate-400 hover:text-slate-700 p-1 rounded-lg transition cursor-pointer ${
                          isAr ? 'left-2.5' : 'right-2.5'
                        }`}
                        title={showPassword ? (isAr ? 'إخفاء كلمة المرور' : 'Hide Password') : (isAr ? 'إظهار كلمة المرور' : 'Show Password')}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>

                    {/* Action 1 Outside: Recycle / Regenerate Password Button */}
                    <button
                      type="button"
                      onClick={generateNewPassword}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0 shadow-2xs"
                      title={isAr ? 'توليد كلمة مرور جديدة' : 'Generate New Password'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>

                    {/* Action 2 Outside: Copy Password Button */}
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="px-4 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-xs shadow-md shadow-[#d83f2a]/20 flex items-center gap-1.5 transition cursor-pointer shrink-0"
                      title={copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ كلمة المرور' : 'Copy Password')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ' : 'Copy')}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {isAr
                      ? 'سترسل كلمة المرور تلقائياً إلى بريد الشريك الإلكتروني عند الحفظ. يمكنك توليد كلمة مرور جديدة بالضغط على زر التحديث.'
                      : 'The password will be sent automatically to the partner\'s email upon saving. You can generate a new password by clicking the refresh button.'}
                  </p>
                </div>
              </div>

              {/* Partner Status Selection Section (حالة الشريك) */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <label className="block text-xs font-extrabold text-slate-800">
                  {isAr ? 'حالة الشريك' : 'Partner Status'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Active */}
                  <button
                    type="button"
                    onClick={() => setStatus('active')}
                    className={`py-2.5 px-4 rounded-full text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer ${
                      status === 'active'
                        ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    {isAr ? 'نشط' : 'Active'}
                  </button>

                  {/* Inactive */}
                  <button
                    type="button"
                    onClick={() => setStatus('inactive')}
                    className={`py-2.5 px-4 rounded-full text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer ${
                      status === 'inactive'
                        ? 'border-2 border-slate-400 bg-slate-100 text-slate-700 shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    {isAr ? 'غير نشط' : 'Inactive'}
                  </button>

                    <button
                      type="button"
                      onClick={() => setStatus('pending')}
                      className={`py-2.5 px-4 rounded-full text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer ${
                        status === 'pending'
                          ? 'border-2 border-amber-400 bg-amber-50 text-amber-700 shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      {isAr ? 'قيد المراجعة' : 'Pending'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Billing Cycle Option Header */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">
                      {isAr ? 'دورة الفوترة' : 'Billing Cycle'}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {isAr ? 'اختر الخطة الزمنية لدفع الاشتراك' : 'Choose subscription billing frequency'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                        billingCycle === 'monthly'
                          ? 'bg-white text-[#d83f2a] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isAr ? 'شهري (Monthly)' : 'Monthly'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('yearly')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                        billingCycle === 'yearly'
                          ? 'bg-white text-[#d83f2a] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isAr ? 'سنوي (Yearly)' : 'Yearly'}
                    </button>
                  </div>
                </div>

                {/* Dynamic Packages Cards fetched from API */}
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm mb-3">
                    {isAr ? 'باقات الاشتراك المتاحة' : 'Available Subscription Packages'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packagesList.length > 0 ? (
                      packagesList.map((pkg) => {
                        const isSelected = selectedPackageId === pkg.id;
                        const price = billingCycle === 'monthly' ? pkg.monthlyPrice : pkg.yearlyPrice;
                        const cycleUnit = billingCycle === 'monthly' ? (isAr ? 'د.أ / شهر' : 'JOD / month') : (isAr ? 'د.أ / سنة' : 'JOD / year');
                        const name = isAr ? pkg.nameAr : pkg.nameEn;
                        const desc = isAr ? pkg.descriptionAr : pkg.descriptionEn;

                        return (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedPackageId(pkg.id)}
                            className={`p-5 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#d83f2a] bg-red-50/30 shadow-md shadow-[#d83f2a]/10'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && (
                              <div className={`absolute top-3 w-6 h-6 rounded-full bg-[#d83f2a] text-white flex items-center justify-center text-xs font-bold shadow-2xs ${isAr ? 'left-3' : 'right-3'}`}>
                                ✓
                              </div>
                            )}

                            {pkg.badge && (
                              <div className={`absolute top-3 ${isSelected ? (isAr ? 'left-10' : 'right-10') : (isAr ? 'left-3' : 'right-3')}`}>
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-2xs">
                                  {pkg.badge}
                                </span>
                              </div>
                            )}

                            <div>
                              <h5 className={`font-extrabold text-base ${isSelected ? 'text-[#d83f2a]' : 'text-slate-900'}`}>
                                {name}
                              </h5>
                              {desc && (
                                <p className="text-xs text-slate-400 mb-3 font-medium line-clamp-2">
                                  {desc}
                                </p>
                              )}
                              <div className={`text-2xl font-extrabold my-3 ${isSelected ? 'text-[#d83f2a]' : 'text-slate-900'}`}>
                                {price} <span className="text-xs font-normal text-slate-500">{cycleUnit}</span>
                              </div>
                              <ul className="text-xs space-y-2 font-medium">
                                <li className={`flex items-center gap-2 ${isSelected ? 'text-[#d83f2a] font-bold' : 'text-slate-500'}`}>
                                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSelected ? 'bg-[#d83f2a] text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                                  {isAr ? 'لوحة تحكم كاملة للشريك' : 'Full partner dashboard access'}
                                </li>
                                <li className={`flex items-center gap-2 ${isSelected ? 'text-[#d83f2a] font-bold' : 'text-slate-500'}`}>
                                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSelected ? 'bg-[#d83f2a] text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                                  {isAr ? 'إمكانية إضافة علامات تجارية وفروع' : 'Add brands & branches'}
                                </li>
                                <li className={`flex items-center gap-2 ${isSelected ? 'text-[#d83f2a] font-bold' : 'text-slate-500'}`}>
                                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSelected ? 'bg-[#d83f2a] text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                                  {isAr ? 'دعم فني وتحديثات مستمرة' : 'Technical support & updates'}
                                </li>
                              </ul>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        onClick={() => setSelectedPackageId(1)}
                        className="p-5 rounded-2xl border-2 border-[#d83f2a] bg-red-50/30 shadow-md shadow-[#d83f2a]/10 cursor-pointer"
                      >
                        <h5 className="font-extrabold text-base text-[#d83f2a]">
                          {isAr ? 'زلمة على الخفيف' : 'Zalameh Ala El-Khafeef'}
                        </h5>
                        <div className="text-2xl font-extrabold my-3 text-[#d83f2a]">
                          9 <span className="text-xs font-normal text-slate-500">{billingCycle === 'monthly' ? (isAr ? 'د.أ / شهر' : 'JOD / month') : (isAr ? 'د.أ / سنة' : 'JOD / year')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-sm transition cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
            >
              {isAr ? 'حفظ' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
