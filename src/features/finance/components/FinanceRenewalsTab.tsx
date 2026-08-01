import React, { useState } from 'react';

interface RenewalItem {
  id: string;
  name: string;
  category: 'subscriptions' | 'banners';
  amount: string;
  manager: string;
  contactStatus: 'معلق' | 'مؤكد' | 'تم التواصل';
  daysLeft: number;
  urgentText: string;
  type: 'card' | 'banner';
}

export const FinanceRenewalsTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'subscriptions' | 'banners'>('subscriptions');
  const [activeTimeframe, setActiveTimeframe] = useState<number>(3); // 3, 7, 14, 30 days

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'renew' | 'reminder' | 'call'>('renew');
  const [selectedItem, setSelectedItem] = useState<RenewalItem | null>(null);
  const [noteMessage, setNoteMessage] = useState('');

  const [renewalsList, setRenewalsList] = useState<RenewalItem[]>([
    // Subscriptions (within 3 days & 7 days)
    {
      id: '1',
      name: 'مطعم بيت الزلطة',
      category: 'subscriptions',
      amount: '650 د.أ',
      manager: 'أحمد المصري',
      contactStatus: 'مؤكد',
      daysLeft: 1,
      urgentText: '1 يوم',
      type: 'card',
    },
    {
      id: '2',
      name: 'مخبز السعادة',
      category: 'subscriptions',
      amount: '280 د.أ',
      manager: 'محمد العبادي',
      contactStatus: 'معلق',
      daysLeft: 2,
      urgentText: '2 يوم',
      type: 'card',
    },
    {
      id: '3',
      name: 'محل الضياء للأجهزة',
      category: 'subscriptions',
      amount: '150 د.أ',
      manager: 'نادين الشرفات',
      contactStatus: 'تم التواصل',
      daysLeft: 3,
      urgentText: '3 أيام',
      type: 'card',
    },
    {
      id: '4',
      name: 'متجر زلمة للشوكولاتة',
      category: 'subscriptions',
      amount: '650 د.أ',
      manager: 'أحمد المصري',
      contactStatus: 'مؤكد',
      daysLeft: 7,
      urgentText: '7 أيام',
      type: 'card',
    },

    // Banners (within 3 days & 7 days)
    {
      id: '5',
      name: 'بنك القاهرة عمان',
      category: 'banners',
      amount: '3,500 د.أ',
      manager: 'سارة النابلسي',
      contactStatus: 'معلق',
      daysLeft: 1,
      urgentText: '1 يوم',
      type: 'banner',
    },
    {
      id: '6',
      name: 'شركة المنارة للعقارات',
      category: 'banners',
      amount: '5,250 د.أ',
      manager: 'خالد التل',
      contactStatus: 'مؤكد',
      daysLeft: 3,
      urgentText: '3 أيام',
      type: 'banner',
    },
    {
      id: '7',
      name: 'شركة الاتصالات الأردنية',
      category: 'banners',
      amount: '6,000 د.أ',
      manager: 'سارة النابلسي',
      contactStatus: 'مؤكد',
      daysLeft: 6,
      urgentText: '6 أيام',
      type: 'banner',
    },
  ]);

  // Filter items based on Category and Timeframe
  const filteredRenewals = renewalsList.filter((item) => {
    const matchesCategory = item.category === activeCategory;
    const matchesTime = item.daysLeft <= activeTimeframe;
    return matchesCategory && matchesTime;
  });

  const subscriptionsCount = renewalsList.filter((i) => i.category === 'subscriptions').length;
  const bannersCount = renewalsList.filter((i) => i.category === 'banners').length;

  const handleOpenActionModal = (item: RenewalItem, type: 'renew' | 'reminder' | 'call') => {
    setSelectedItem(item);
    setModalType(type);
    setNoteMessage('');
    setIsModalOpen(true);
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (modalType === 'renew') {
      setRenewalsList(
        renewalsList.map((r) => (r.id === selectedItem.id ? { ...r, contactStatus: 'مؤكد' } : r))
      );
      alert(`تم تأكيد تجديد ${selectedItem.name} بنجاح!`);
    } else if (modalType === 'reminder') {
      alert(`تم إرسال التذكير إلى ${selectedItem.name} بنجاح!`);
    } else if (modalType === 'call') {
      setRenewalsList(
        renewalsList.map((r) => (r.id === selectedItem.id ? { ...r, contactStatus: 'تم التواصل' } : r))
      );
      alert(`تم تسجيل إجراء الاتصال بـ ${selectedItem.name}`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-cairo text-slate-800" dir="rtl">
      {/* 1. Page Header & Notification Alert Pill */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide">
            التجديدات القادمة
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            متابعة الاشتراكات والبانرات القادمة للتجديد
          </p>
        </div>

        {/* Clean SVG Notification Alert Pill */}
        <div className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center gap-2 text-xs font-black text-rose-600 shadow-xs">
          <svg className="w-4 h-4 text-rose-500 animate-pulse shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span>6 تجديدات عاجلة</span>
        </div>
      </div>

      {/* 2. Main Category Filter Tabs (White Container, Selected Tab is System Primary Color with White Text, No Emojis) */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 max-w-lg gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('subscriptions')}
          className={`py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeCategory === 'subscriptions'
              ? 'bg-[#d83f2a] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>الاشتراكات</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              activeCategory === 'subscriptions'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {subscriptionsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('banners')}
          className={`py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeCategory === 'banners'
              ? 'bg-[#d83f2a] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>البانرات</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              activeCategory === 'banners'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {bannersCount}
          </span>
        </button>
      </div>

      {/* 3. Time Filter Buttons (خلال 3 أيام, خلال 7 أيام, خلال 14 يوم, خلال 30 يوم) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { days: 3, label: 'خلال 3 أيام' },
          { days: 7, label: 'خلال 7 أيام' },
          { days: 14, label: 'خلال 14 يوم' },
          { days: 30, label: 'خلال 30 يوم' },
        ].map((tf) => (
          <button
            key={tf.days}
            type="button"
            onClick={() => setActiveTimeframe(tf.days)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border whitespace-nowrap ${
              activeTimeframe === tf.days
                ? 'bg-[#d83f2a] text-white border-[#d83f2a] shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* 4. Renewals Cards Grid (Elevated, Clean Border with Right Accent Width=4 for Banners/Renewals) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRenewals.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border-y border-l border-slate-100 border-r-4 border-r-[#d83f2a] shadow-md hover:shadow-lg transition flex flex-col justify-between space-y-4"
          >
            {/* Top Bar: Urgent Tag + Clean SVG Category Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                <span>⚠️ عاجل</span>
                <span>•</span>
                <span>⌛ {item.urgentText}</span>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs shrink-0">
                {item.type === 'card' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Title / Store Name */}
            <div>
              <h3 className="text-base font-black text-slate-900">{item.name}</h3>
            </div>

            {/* Info Grid (Amount, Manager, Contact Status) */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50/80 rounded-2xl p-3 text-center border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">المبلغ المتوقع</span>
                <span className="text-xs font-black text-slate-900 mt-1 block">{item.amount}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">مسؤول الحساب</span>
                <span className="text-xs font-extrabold text-slate-700 mt-1 block truncate">
                  {item.manager}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">حالة التواصل</span>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    item.contactStatus === 'مؤكد'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : item.contactStatus === 'تم التواصل'
                      ? 'bg-sky-50 text-sky-600 border border-sky-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}
                >
                  {item.contactStatus}
                </span>
              </div>
            </div>

            {/* Bottom Action Buttons in exact RTL order:
                Right = Renew (Emerald with SVG refresh icon)
                Middle = Reminder (Sky with SVG mail envelope icon)
                Left = Call Phone (Slate button with SVG phone handset icon) */}
            <div className="flex items-center gap-2 pt-1">
              {/* Renew Button (Rightmost) */}
              <button
                type="button"
                onClick={() => handleOpenActionModal(item, 'renew')}
                className="flex-1 py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-emerald-200/80"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>تجديد</span>
              </button>

              {/* Reminder Button (Middle) */}
              <button
                type="button"
                onClick={() => handleOpenActionModal(item, 'reminder')}
                className="flex-1 py-2.5 px-3.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-sky-200/80"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>تذكير</span>
              </button>

              {/* Call Button (Leftmost) */}
              <button
                type="button"
                onClick={() => handleOpenActionModal(item, 'call')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0 border border-slate-200/80"
                title="اتصال"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Interactive Action Confirmation Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">
                {modalType === 'renew'
                  ? `تأكيد تجديد ${selectedItem.name}`
                  : modalType === 'reminder'
                  ? `إرسال تذكير إلى ${selectedItem.name}`
                  : `تسجيل الاتصال بـ ${selectedItem.name}`}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleConfirmAction} className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">الجهة/المتجر</span>
                  <span className="text-slate-900 font-extrabold">{selectedItem.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">المبلغ المتوقع</span>
                  <span className="text-slate-900 font-black">{selectedItem.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">المتبقي</span>
                  <span className="text-rose-600 font-extrabold">{selectedItem.urgentText}</span>
                </div>
              </div>

              {/* Note / Message Textarea for Reminder / Call */}
              {(modalType === 'reminder' || modalType === 'call') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">ملاحظات / نص الرسالة</label>
                  <textarea
                    rows={3}
                    value={noteMessage}
                    onChange={(e) => setNoteMessage(e.target.value)}
                    placeholder="اكتب تفاصيل التذكير أو نتيجة المكالمة..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#d83f2a] font-medium"
                  />
                </div>
              )}

              {/* Modal Buttons (System Primary Color) */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
                >
                  تأكيد
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
