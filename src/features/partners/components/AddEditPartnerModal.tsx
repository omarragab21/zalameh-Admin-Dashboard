import React, { useState, useEffect } from 'react';
import type { Partner, SubscriptionPlan, PartnerStatus } from '../types/partner.types';

interface AddEditPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partnerData: Partial<Partner>) => void;
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

  const [status, setStatus] = useState<PartnerStatus>('active');
  const [password, setPassword] = useState('p@ssW0rd!2024');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

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
    } else {
      setNameAr('');
      setNameEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setEmail('');
      setPhone('');
      setSelectedPlan('basic');
      setStatus('active');
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

    onSave({
      nameAr: nameAr || nameEn,
      nameEn: nameEn || nameAr,
      descriptionAr,
      descriptionEn,
      email,
      phone,
      plan: selectedPlan,
      planName: getPlanName(selectedPlan),
      status,
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

                  {/* Password Input Box */}
                  <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xs">
                    {/* Password Display Field */}
                    <input
                      type={showPassword ? 'text' : 'password'}
                      readOnly
                      value={password}
                      className={`w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none dir-ltr text-left tracking-widest ${
                        isAr ? 'pl-24 pr-3' : 'pr-24 pl-3'
                      }`}
                    />

                    {/* Action buttons inside field */}
                    <div className={`absolute flex items-center gap-1 ${isAr ? 'left-2' : 'right-2'}`}>
                      {/* Copy Password Button */}
                      <button
                        type="button"
                        onClick={handleCopyPassword}
                        className="w-8 h-8 rounded-lg bg-[#d83f2a] hover:bg-[#c03320] text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                        title={copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ كلمة المرور' : 'Copy Password')}
                      >
                        {copied ? (
                          <span className="text-[10px] font-bold">{isAr ? 'تم' : 'Copied'}</span>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                        )}
                      </button>

                      {/* Refresh / Regenerate Button */}
                      <button
                        type="button"
                        onClick={generateNewPassword}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title={isAr ? 'توليد كلمة مرور جديدة' : 'Generate New Password'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>

                      {/* Eye Show/Hide Toggle */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title={showPassword ? (isAr ? 'إخفاء كلمة المرور' : 'Hide Password') : (isAr ? 'إظهار كلمة المرور' : 'Show Password')}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {isAr
                      ? 'سترسل كلمة المرور تلقائياً إلى بريد الشريك الإلكتروني عند الحفظ. يمكنك توليد كلمة مرور جديدة بالضغط على زر التحديث.'
                      : 'The password will be sent automatically to the partner\'s email upon saving. You can generate a new password by clicking the refresh button.'}
                  </p>
                </div>
              </div>

              {/* Partner Status Selection Section (حالة الشريك) */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-800">
                  {isAr ? 'حالة الشريك' : 'Partner Status'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Active */}
                  <button
                    type="button"
                    onClick={() => setStatus('active')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      status === 'active'
                        ? 'border-2 border-emerald-500 bg-emerald-50/60 text-emerald-700 shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {isAr ? 'نشط' : 'Active'}
                  </button>

                  {/* Inactive */}
                  <button
                    type="button"
                    onClick={() => setStatus('inactive')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      status === 'inactive'
                        ? 'border-2 border-slate-400 bg-slate-100 text-slate-700 shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    {isAr ? 'غير نشط' : 'Inactive'}
                  </button>

                  {/* Pending Review */}
                  <button
                    type="button"
                    onClick={() => setStatus('pending')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      status === 'pending'
                        ? 'border-2 border-amber-400 bg-amber-50/60 text-amber-700 shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {isAr ? 'قيد المراجعة' : 'Pending Review'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-800 text-sm mb-2">
                {isAr ? 'باقت الاشتراك' : 'Subscription Plans'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Basic Plan (أساسية) */}
                <div
                  onClick={() => setSelectedPlan('basic')}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                    selectedPlan === 'basic'
                      ? 'border-slate-800 bg-slate-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {selectedPlan === 'basic' && (
                    <div className={`absolute top-3 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow-xs ${isAr ? 'left-3' : 'right-3'}`}>
                      ✓
                    </div>
                  )}
                  <div>
                    <h5 className={`font-extrabold text-base ${selectedPlan === 'basic' ? 'text-slate-800' : 'text-slate-900'}`}>
                      {isAr ? 'أساسية' : 'Basic'}
                    </h5>
                    <p className="text-xs text-slate-400 mb-3 font-medium">
                      {isAr ? 'للشركاء الجدد' : 'For New Partners'}
                    </p>
                    <div className={`text-xl font-extrabold mb-4 ${selectedPlan === 'basic' ? 'text-slate-800' : 'text-slate-900'}`}>
                      25 <span className="text-xs font-normal text-slate-500">{isAr ? 'د.أ / شهر' : 'JOD / month'}</span>
                    </div>
                    <ul className="text-xs space-y-2 font-medium">
                      <li className={`flex items-center gap-2 ${selectedPlan === 'basic' ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'basic' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'قائمة المنتجات' : 'Products List'}
                      </li>
                      <li className={`flex items-center gap-2 ${selectedPlan === 'basic' ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'basic' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'صفحة الشريك' : 'Partner Page'}
                      </li>
                      <li className={`flex items-center gap-2 ${selectedPlan === 'basic' ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'basic' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'دعم أساسي' : 'Basic Support'}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 2. Professional Plan (احترافية) */}
                <div
                  onClick={() => setSelectedPlan('professional')}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                    selectedPlan === 'professional'
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {selectedPlan === 'professional' && (
                    <div className={`absolute top-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs ${isAr ? 'left-3' : 'right-3'}`}>
                      ✓
                    </div>
                  )}
                  <div>
                    <h5 className={`font-extrabold text-base ${selectedPlan === 'professional' ? 'text-blue-600' : 'text-slate-900'}`}>
                      {isAr ? 'احترافية' : 'Professional'}
                    </h5>
                    <p className="text-xs text-slate-400 mb-3 font-medium">
                      {isAr ? 'للشركاء النشطين' : 'For Active Partners'}
                    </p>
                    <div className={`text-xl font-extrabold mb-4 ${selectedPlan === 'professional' ? 'text-blue-600' : 'text-slate-900'}`}>
                      65 <span className="text-xs font-normal text-slate-500">{isAr ? 'د.أ / شهر' : 'JOD / month'}</span>
                    </div>
                    <ul className="text-xs space-y-2 font-medium">
                      <li className={`flex items-center gap-2 ${selectedPlan === 'professional' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'professional' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'كل مميزات الأساسية' : 'All Basic Features'}
                      </li>
                      <li className={`flex items-center gap-2 ${selectedPlan === 'professional' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'professional' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'العروض والخصومات' : 'Offers & Discounts'}
                      </li>
                      <li className={`flex items-center gap-2 ${selectedPlan === 'professional' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'professional' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'إحصاءات أساسية' : 'Basic Analytics'}
                      </li>
                      <li className={`flex items-center gap-2 ${selectedPlan === 'professional' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'professional' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'دعم متقدم' : 'Advanced Support'}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 3. Featured Plan (مميزة) */}
                <div
                  onClick={() => setSelectedPlan('featured')}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                    selectedPlan === 'featured'
                      ? 'border-purple-600 bg-purple-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`absolute top-3 flex items-center gap-1.5 ${isAr ? 'left-3' : 'right-3'}`}>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                      {isAr ? 'الأكثر طلباً' : 'Most Popular'}
                    </span>
                    {selectedPlan === 'featured' && (
                      <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        ✓
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className={`font-extrabold text-base ${selectedPlan === 'featured' ? 'text-purple-600' : 'text-slate-900'}`}>
                      {isAr ? 'مميزة' : 'Featured'}
                    </h5>
                    <p className="text-xs text-slate-400 mb-3 font-medium">
                      {isAr ? 'ظهور استثنائي' : 'Exceptional Visibility'}
                    </p>
                    <div className={`text-xl font-extrabold mb-4 ${selectedPlan === 'featured' ? 'text-purple-600' : 'text-slate-900'}`}>
                      120 <span className="text-xs font-normal text-slate-500">{isAr ? 'د.أ / شهر' : 'JOD / month'}</span>
                    </div>
                    <ul className="text-xs space-y-2 font-medium">
                      <li className={`flex items-center gap-2 ${selectedPlan === 'featured' ? 'text-purple-600 font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'featured' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'كل مميزات الاحترافية' : 'All Professional Features'}
                      </li>
                      <li className={`flex items-center gap-2 ${selectedPlan === 'featured' ? 'text-purple-600 font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'featured' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'شارة مميز' : 'Featured Badge'}
                      </li>
                      <li className={`flex items-center gap-2 ${selectedPlan === 'featured' ? 'text-purple-600 font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'featured' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'أولوية في البحث' : 'Search Priority'}
                      </li>
                      <li className={`flex items-center gap-2 ${selectedPlan === 'featured' ? 'text-purple-600 font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'featured' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'تقارير تفصيلية' : 'Detailed Reports'}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 4. Enterprise Plan (مؤسسية) */}
                <div
                  onClick={() => setSelectedPlan('enterprise')}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                    selectedPlan === 'enterprise'
                      ? 'border-[#d83f2a] bg-red-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`absolute top-3 flex items-center gap-1.5 ${isAr ? 'left-3' : 'right-3'}`}>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d83f2a] text-white text-[10px] font-bold tracking-wider">
                      VIP
                    </span>
                    {selectedPlan === 'enterprise' && (
                      <div className="w-5 h-5 rounded-full bg-[#d83f2a] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        ✓
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className={`font-extrabold text-base ${selectedPlan === 'enterprise' ? 'text-[#d83f2a]' : 'text-slate-900'}`}>
                      {isAr ? 'مؤسسية' : 'Enterprise'}
                    </h5>
                    <p className="text-xs text-slate-400 mb-3 font-medium">
                      {isAr ? 'للشركات الكبرى' : 'For Enterprises'}
                    </p>
                    <div className={`text-xl font-extrabold mb-4 ${selectedPlan === 'enterprise' ? 'text-[#d83f2a]' : 'text-slate-900'}`}>
                      220 <span className="text-xs font-normal text-slate-500">{isAr ? 'د.أ / شهر' : 'JOD / month'}</span>
                    </div>
                    <ul className="text-xs space-y-2 font-medium">
                      <li className={`flex items-center gap-2 ${selectedPlan === 'enterprise' ? 'text-[#d83f2a] font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'enterprise' ? 'bg-[#d83f2a] text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'كل مميزات المميزة' : 'All Featured Features'}
                      </li>
                      <li className={`flex items-center gap-2 ${selectedPlan === 'enterprise' ? 'text-[#d83f2a] font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'enterprise' ? 'bg-[#d83f2a] text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'مدير حساب مخصص' : 'Dedicated Account Manager'}
                      </li>
                      <li className={`flex items-center gap-2 ${selectedPlan === 'enterprise' ? 'text-[#d83f2a] font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'enterprise' ? 'bg-[#d83f2a] text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'تكامل API' : 'API Integration'}
                      </li>
                      <li className={`flex items-center gap-2 ${selectedPlan === 'enterprise' ? 'text-[#d83f2a] font-bold' : 'text-slate-500'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedPlan === 'enterprise' ? 'bg-[#d83f2a] text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                        {isAr ? 'إعلانات مدفوعة' : 'Paid Ads'}
                      </li>
                    </ul>
                  </div>
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
