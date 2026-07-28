import React, { useState } from 'react';
import type { BrandExtraInfo, DayWorkingHours, PaymentMethod } from '../types/partner.types';

interface BrandExtraInfoViewProps {
  initialData?: BrandExtraInfo;
  onSave?: (data: BrandExtraInfo) => void;
  onCancel?: () => void;
}

const DEFAULT_DAYS: DayWorkingHours[] = [
  { day: 'الأحد', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الاثنين', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الثلاثاء', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الأربعاء', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الخميس', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الجمعة', isOpen: false, openTime: '02:00 PM', closeTime: '10:00 PM' },
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

export const BrandExtraInfoView: React.FC<BrandExtraInfoViewProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [workingHours, setWorkingHours] = useState<DayWorkingHours[]>(
    initialData?.workingHours && initialData.workingHours.length > 0
      ? initialData.workingHours
      : DEFAULT_DAYS
  );

  const [deliveryEnabled, setDeliveryEnabled] = useState<boolean>(
    initialData?.deliveryEnabled ?? true
  );

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialData?.paymentMethods ?? ['cash', 'visa']
  );

  const [whatsapp, setWhatsapp] = useState<string>(
    initialData?.whatsapp ?? '+962 7X XXX XXXX'
  );

  const [branchPhone, setBranchPhone] = useState<string>(
    initialData?.branchPhone ?? '+962 6 XXX XXXX'
  );

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Toggle Day Open / Closed
  const handleToggleDay = (index: number) => {
    setWorkingHours((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
    setIsDirty(true);
    setSaveSuccess(false);
  };

  // Change Day Times
  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    setWorkingHours((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
    setIsDirty(true);
    setSaveSuccess(false);
  };

  // Apply to all days
  const handleApplyToAll = (sourceIndex: number) => {
    const source = workingHours[sourceIndex];
    setWorkingHours((prev) =>
      prev.map((item) => ({
        ...item,
        isOpen: source.isOpen,
        openTime: source.openTime,
        closeTime: source.closeTime,
      }))
    );
    setIsDirty(true);
    setSaveSuccess(false);
  };

  // Toggle Payment Method
  const handleTogglePayment = (methodId: PaymentMethod) => {
    setPaymentMethods((prev) => {
      if (prev.includes(methodId)) {
        return prev.filter((m) => m !== methodId);
      } else {
        return [...prev, methodId];
      }
    });
    setIsDirty(true);
    setSaveSuccess(false);
  };

  // Save changes
  const handleSave = () => {
    const data: BrandExtraInfo = {
      workingHours,
      deliveryEnabled,
      paymentMethods,
      whatsapp,
      branchPhone,
    };
    if (onSave) {
      onSave(data);
    }
    setIsDirty(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (initialData) {
      setWorkingHours(initialData.workingHours || DEFAULT_DAYS);
      setDeliveryEnabled(initialData.deliveryEnabled ?? true);
      setPaymentMethods(initialData.paymentMethods ?? ['cash', 'visa']);
      setWhatsapp(initialData.whatsapp ?? '+962 7X XXX XXXX');
      setBranchPhone(initialData.branchPhone ?? '+962 6 XXX XXXX');
    } else {
      setWorkingHours(DEFAULT_DAYS);
      setDeliveryEnabled(true);
      setPaymentMethods(['cash', 'visa']);
      setWhatsapp('+962 7X XXX XXXX');
      setBranchPhone('+962 6 XXX XXXX');
    }
    setIsDirty(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* 1. Working Hours Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#d83f2a] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">ساعات العمل</h3>
            <p className="text-xs text-slate-400 font-medium">حدد أوقات الفتح والإغلاق لكل يوم</p>
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="text-[11px] font-extrabold text-slate-400 border-b border-slate-100 pb-2">
                <th className="pb-3 px-3 font-bold">اليوم</th>
                <th className="pb-3 px-3 font-bold">الحالة</th>
                <th className="pb-3 px-3 font-bold text-center">الفتح</th>
                <th className="pb-3 px-3 font-bold text-center">الإغلاق</th>
                <th className="pb-3 px-3 font-bold text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-xs font-semibold">
              {workingHours.map((row, idx) => (
                <tr key={row.day} className="hover:bg-slate-50/50 transition">
                  {/* Day */}
                  <td className="py-3.5 px-3 font-extrabold text-slate-800 text-sm">
                    {row.day}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleDay(idx)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          row.isOpen ? 'bg-[#d83f2a]' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            row.isOpen ? '-translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className={`font-bold text-xs ${row.isOpen ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {row.isOpen ? 'مفتوح' : 'مغلق'}
                      </span>
                    </div>
                  </td>

                  {/* Open Time */}
                  <td className="py-3.5 px-3 text-center">
                    <select
                      value={row.openTime}
                      disabled={!row.isOpen}
                      onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition cursor-pointer text-center dir-ltr ${
                        row.isOpen
                          ? 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 focus:bg-white focus:border-[#d83f2a] focus:outline-none'
                          : 'bg-slate-100/60 border-slate-200/60 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Close Time */}
                  <td className="py-3.5 px-3 text-center">
                    <select
                      value={row.closeTime}
                      disabled={!row.isOpen}
                      onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition cursor-pointer text-center dir-ltr ${
                        row.isOpen
                          ? 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 focus:bg-white focus:border-[#d83f2a] focus:outline-none'
                          : 'bg-slate-100/60 border-slate-200/60 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Apply to All */}
                  <td className="py-3.5 px-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleApplyToAll(idx)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
                      title="تطبيق هذه المواعيد على جميع الأيام"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>تطبيق للكل</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Delivery Service Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#d83f2a] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-6-1a1 1 0 011-1h1m0 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">خدمة التوصيل</h3>
            <p className="text-xs text-slate-400 font-medium">هل تتوفر خدمة التوصيل؟</p>
          </div>
        </div>

        {/* Toggle Inner Box */}
        <div className="bg-slate-50/60 rounded-2xl p-4 sm:p-5 border border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-0.5">خدمة التوصيل</h4>
            <p className="text-xs font-semibold text-slate-400">
              {deliveryEnabled
                ? 'متاحة — يمكن للعملاء طلب التوصيل'
                : 'غير متاحة — لا يمكن للعملاء طلب التوصيل'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`font-bold text-xs ${deliveryEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
              {deliveryEnabled ? 'متاحة' : 'غير متاحة'}
            </span>
            <button
              type="button"
              onClick={() => {
                setDeliveryEnabled(!deliveryEnabled);
                setIsDirty(true);
                setSaveSuccess(false);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                deliveryEnabled ? 'bg-[#d83f2a]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  deliveryEnabled ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Payment Methods Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#d83f2a] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">طرق الدفع</h3>
            <p className="text-xs text-slate-400 font-medium">حدد طرق الدفع المقبولة</p>
          </div>
        </div>

        {/* Payment Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {PAYMENT_OPTIONS.map((opt) => {
            const isSelected = paymentMethods.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleTogglePayment(opt.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'border border-[#d83f2a] bg-rose-50/70 text-[#d83f2a] shadow-sm'
                    : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
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

      {/* 4. Contact Information Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#d83f2a] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">معلومات التواصل</h3>
            <p className="text-xs text-slate-400 font-medium">أرقام التواصل المخصصة لهذا الفرع</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم واتساب</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => {
                setWhatsapp(e.target.value);
                setIsDirty(true);
                setSaveSuccess(false);
              }}
              placeholder="+962 7X XXX XXXX"
              dir="ltr"
              className="w-full text-right px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم هاتف الفرع</label>
            <input
              type="text"
              value={branchPhone}
              onChange={(e) => {
                setBranchPhone(e.target.value);
                setIsDirty(true);
                setSaveSuccess(false);
              }}
              placeholder="+962 6 XXX XXXX"
              dir="ltr"
              className="w-full text-right px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* 5. Bottom Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status text (Right side in RTL) */}
        <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 order-2 sm:order-1">
          {saveSuccess ? (
            <span className="text-emerald-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              تم حفظ التغييرات بنجاح
            </span>
          ) : isDirty ? (
            <span className="text-amber-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              يوجد تغييرات غير محفوظة
            </span>
          ) : (
            <span>لا توجد تغييرات معلقة</span>
          )}
        </div>

        {/* Buttons (Left side in RTL) */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs transition cursor-pointer w-full sm:w-auto text-center"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c23420] text-white font-extrabold text-xs shadow-md shadow-[#d83f2a]/20 transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
