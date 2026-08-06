import React, { useState, useEffect } from 'react';
import type { Branch, BranchStatus, DayWorkingHours, PaymentMethod } from '../types/partner.types';

interface AddEditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (branchData: Partial<Branch>) => void;
  editingBranch?: Branch | null;
}

const DEFAULT_DAYS: DayWorkingHours[] = [
  { day: 'الأحد', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الاثنين', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الثلاثاء', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الأربعاء', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الخميس', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الجمعة', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'السبت', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
];

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string }[] = [
  { id: 'cash', label: 'نقداً' },
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'MasterCard' },
  { id: 'applePay', label: 'Apple Pay' },
  { id: 'googlePay', label: 'Google Pay' },
  { id: 'cliq', label: 'CliQ' },
  { id: 'eWallets', label: 'محافظ إلكترونية' },
];

const TIME_OPTIONS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM',
  '11:00 PM', '11:30 PM', '12:00 AM'
];

export const AddEditBranchModal: React.FC<AddEditBranchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBranch,
}) => {
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [status, setStatus] = useState<BranchStatus>('active');
  const [isMainBranch, setIsMainBranch] = useState(false);

  // Extra Info fields
  const [workingHours, setWorkingHours] = useState<DayWorkingHours[]>(DEFAULT_DAYS);
  const [deliveryEnabled, setDeliveryEnabled] = useState<boolean>(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(['cash', 'visa']);
  const [whatsapp, setWhatsapp] = useState<string>('');

  useEffect(() => {
    if (editingBranch) {
      setNameAr(editingBranch.nameAr || '');
      setNameEn(editingBranch.nameEn || '');
      setAddress(editingBranch.address || '');
      setPhone(editingBranch.phone || editingBranch.extraInfo?.branchPhone || '');
      setMapUrl(editingBranch.mapUrl || '');
      setStatus(editingBranch.status || 'active');
      setIsMainBranch(editingBranch.isMainBranch || false);

      const extra = editingBranch.extraInfo;
      setWorkingHours(extra?.workingHours && extra.workingHours.length > 0 ? extra.workingHours : DEFAULT_DAYS);
      setDeliveryEnabled(extra?.deliveryEnabled ?? true);
      setPaymentMethods(extra?.paymentMethods ?? ['cash', 'visa']);
      setWhatsapp(extra?.whatsapp || '');
    } else {
      setNameAr('');
      setNameEn('');
      setAddress('');
      setPhone('');
      setMapUrl('');
      setStatus('active');
      setIsMainBranch(false);
      setWorkingHours(DEFAULT_DAYS);
      setDeliveryEnabled(true);
      setPaymentMethods(['cash', 'visa']);
      setWhatsapp('');
    }
  }, [editingBranch, isOpen]);

  if (!isOpen) return null;

  const handleToggleDay = (index: number) => {
    setWorkingHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isOpen: !item.isOpen } : item))
    );
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    setWorkingHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleTogglePayment = (methodId: PaymentMethod) => {
    setPaymentMethods((prev) =>
      prev.includes(methodId) ? prev.filter((m) => m !== methodId) : [...prev, methodId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    onSave({
      nameAr,
      nameEn: nameEn || nameAr,
      address,
      phone,
      mapUrl: mapUrl || undefined,
      status,
      isMainBranch,
      extraInfo: {
        workingHours,
        deliveryEnabled,
        paymentMethods,
        whatsapp,
        branchPhone: phone,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {editingBranch ? 'تعديل بيانات الفرع' : 'إضافة فرع جديد'}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                أدخل بيانات الفرع وساعات العمل وطرق الدفع
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition cursor-pointer p-1.5 rounded-xl hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Branch Flag Selection Card */}
          <div
            onClick={() => setIsMainBranch(!isMainBranch)}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between select-none ${
              isMainBranch
                ? 'border-amber-400 bg-amber-50/60 shadow-xs'
                : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                isMainBranch ? 'bg-amber-100 text-amber-600' : 'bg-slate-200/60 text-slate-400'
              }`}>
                ⭐
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-900 block">
                  تعيين كفرع رئيسي (Primary Branch)
                </span>
                <span className="text-[10px] text-slate-500 font-semibold block">
                  سيكون هذا الفرع المقر الرئيسي للعلامة التجارية
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isMainBranch}
              onChange={(e) => {
                e.stopPropagation();
                setIsMainBranch(e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-4.5 h-4.5 text-amber-500 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📍</span> البيانات الأساسية للفرع
            </h4>

            {/* Branch Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> اسم الفرع (عربي)
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: فرع العبدلي"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-red-500 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Branch Name (English)</label>
                <input
                  type="text"
                  dir="ltr"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Abdali Branch"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium text-left focus:outline-none focus:border-red-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">العنوان</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="المدينة، الحي، الشارع..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            {/* Phone, WhatsApp & Map URL */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم هاتف الفرع</label>
                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+962 6 XXX XXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-red-500 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم واتساب</label>
                <input
                  type="tel"
                  dir="ltr"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+962 7X XXX XXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-red-500 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رابط الخريطة</label>
                <input
                  type="url"
                  dir="ltr"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-red-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">حالة الفرع</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BranchStatus)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:border-red-500 focus:bg-white transition cursor-pointer"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
                <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Extra Information (المعلومات الإضافية) */}
          <div className="space-y-5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📋</span> المعلومات الإضافية للفرع
            </h4>

            {/* 1. Working Hours */}
            <div className="bg-slate-50/60 rounded-2xl border border-slate-200/80 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-rose-50 text-[#d83f2a] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-slate-900">ساعات العمل</h5>
                  <p className="text-[10px] text-slate-400 font-medium">حدد أوقات الفتح والإغلاق لكل يوم</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="text-[10px] font-extrabold text-slate-400 border-b border-slate-200/60 pb-2">
                      <th className="pb-2 px-2">اليوم</th>
                      <th className="pb-2 px-2">الحالة</th>
                      <th className="pb-2 px-2 text-center">الفتح</th>
                      <th className="pb-2 px-2 text-center">الإغلاق</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/40 text-xs font-semibold">
                    {workingHours.map((row, idx) => (
                      <tr key={row.day} className="hover:bg-slate-100/50 transition">
                        <td className="py-2.5 px-2 font-extrabold text-slate-800 text-xs">
                          {row.day}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleDay(idx)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                row.isOpen ? 'bg-[#d83f2a]' : 'bg-slate-200'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  row.isOpen ? '-translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                            <span className={`font-bold text-[11px] ${row.isOpen ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {row.isOpen ? 'مفتوح' : 'مغلق'}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <select
                            value={row.openTime}
                            disabled={!row.isOpen}
                            onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                            className={`px-2 py-1 rounded-lg border text-[11px] font-bold font-mono transition cursor-pointer text-center dir-ltr ${
                              row.isOpen
                                ? 'bg-white border-slate-200 text-slate-800 focus:border-[#d83f2a] focus:outline-none'
                                : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {TIME_OPTIONS.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <select
                            value={row.closeTime}
                            disabled={!row.isOpen}
                            onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                            className={`px-2 py-1 rounded-lg border text-[11px] font-bold font-mono transition cursor-pointer text-center dir-ltr ${
                              row.isOpen
                                ? 'bg-white border-slate-200 text-slate-800 focus:border-[#d83f2a] focus:outline-none'
                                : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {TIME_OPTIONS.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Delivery Service */}
            <div className="bg-slate-50/60 rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#d83f2a] flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-6-1a1 1 0 011-1h1m0 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-slate-900">خدمة التوصيل</h5>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    {deliveryEnabled ? 'متاحة للفرع' : 'غير متاحة للفرع'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className={`font-bold text-xs ${deliveryEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {deliveryEnabled ? 'متاحة' : 'غير متاحة'}
                </span>
                <button
                  type="button"
                  onClick={() => setDeliveryEnabled(!deliveryEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    deliveryEnabled ? 'bg-[#d83f2a]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      deliveryEnabled ? '-translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 3. Payment Methods */}
            <div className="bg-slate-50/60 rounded-2xl border border-slate-200/80 p-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#d83f2a] flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-slate-900">طرق الدفع المقبولة</h5>
                  <p className="text-[10px] text-slate-400 font-medium">اختر طرق الدفع المتاحة في هذا الفرع</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {PAYMENT_OPTIONS.map((opt) => {
                  const isSelected = paymentMethods.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleTogglePayment(opt.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'border border-[#d83f2a] bg-rose-50 text-[#d83f2a] shadow-2xs'
                          : 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <svg className="w-3.5 h-3.5 text-[#d83f2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              {editingBranch ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  حفظ الفرع
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  إضافة فرع
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
