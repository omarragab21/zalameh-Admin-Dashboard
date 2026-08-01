import React, { useState } from 'react';

interface SubscriptionItem {
  id: string;
  storeName: string;
  storeCode: string;
  packageName: string;
  packageColor: string;
  amount: string;
  startDate: string;
  endDate: string;
  daysRemaining: string;
  daysRemainingBg: string;
  status: string;
  statusBg: string;
  paymentStatus: string;
  paymentBg: string;
  representative: string;
}

export const FinanceSubscriptionsTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubscriptionItem | null>(null);

  // Form State for Add / Renew
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('زلمة تمام');
  const [selectedDuration, setSelectedDuration] = useState('سنوي');
  const [selectedRep, setSelectedRep] = useState('أحمد المصري');
  const [targetUpgradePackage, setTargetUpgradePackage] = useState('زلمة تمام - 280 د.أ/سنوي');

  const [subscriptionsList, setSubscriptionsList] = useState<SubscriptionItem[]>([
    {
      id: '1',
      storeName: 'متجر زلمة للشوكولاتة',
      storeCode: 'SUB-001',
      packageName: 'زلمة سوبر',
      packageColor: 'bg-amber-500 text-white shadow-xs',
      amount: '650 د.أ',
      startDate: '2025-01-15',
      endDate: '2026-01-14',
      daysRemaining: '205 يوم',
      daysRemainingBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      status: 'نشط',
      statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      paymentStatus: 'مدفوع',
      paymentBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      representative: 'أحمد المصري',
    },
    {
      id: '2',
      storeName: 'عصام الديرباني للتكييف',
      storeCode: 'SUB-002',
      packageName: 'زلمة قوي',
      packageColor: 'bg-purple-600 text-white shadow-xs',
      amount: '450 د.أ',
      startDate: '2025-06-01',
      endDate: '2026-05-31',
      daysRemaining: '342 يوم',
      daysRemainingBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      status: 'نشط',
      statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      paymentStatus: 'مدفوع',
      paymentBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      representative: 'محمد العبادي',
    },
    {
      id: '3',
      storeName: 'غزال الأردن للمواد الخام',
      storeCode: 'SUB-003',
      packageName: 'زلمة تمام',
      packageColor: 'bg-sky-500 text-white shadow-xs',
      amount: '280 د.أ',
      startDate: '2025-03-10',
      endDate: '2026-03-09',
      daysRemaining: '260 يوم',
      daysRemainingBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      status: 'نشط',
      statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      paymentStatus: 'مدفوع',
      paymentBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      representative: 'سارة النابلسي',
    },
    {
      id: '4',
      storeName: 'مطعم بيت الزلطة',
      storeCode: 'SUB-004',
      packageName: 'زلمة سوبر',
      packageColor: 'bg-amber-500 text-white shadow-xs',
      amount: '650 د.أ',
      startDate: '2025-12-01',
      endDate: '2026-06-28',
      daysRemaining: '5 يوم',
      daysRemainingBg: 'bg-rose-50 text-rose-600 border border-rose-200',
      status: 'قريب الانتهاء',
      statusBg: 'bg-amber-50 text-amber-600 border border-amber-200',
      paymentStatus: 'مدفوع',
      paymentBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      representative: 'أحمد المصري',
    },
    {
      id: '5',
      storeName: 'محل الأمل للإلكترونيات',
      storeCode: 'SUB-005',
      packageName: 'زلمة على الخفيف',
      packageColor: 'bg-slate-600 text-white shadow-xs',
      amount: '150 د.أ',
      startDate: '2024-06-15',
      endDate: '2025-06-14',
      daysRemaining: 'منتهي',
      daysRemainingBg: 'bg-slate-100 text-slate-500 border border-slate-200',
      status: 'منتهي',
      statusBg: 'bg-rose-50 text-rose-600 border border-rose-200',
      paymentStatus: 'غير مدفوع',
      paymentBg: 'bg-rose-50 text-rose-600 border border-rose-200',
      representative: 'خالد التل',
    },
    {
      id: '6',
      storeName: 'صيدلية الحياة الحديثة',
      storeCode: 'SUB-006',
      packageName: 'زلمة قوي',
      packageColor: 'bg-purple-600 text-white shadow-xs',
      amount: '450 د.أ',
      startDate: '2025-04-20',
      endDate: '2026-04-19',
      daysRemaining: '300 يوم',
      daysRemainingBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      status: 'نشط',
      statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      paymentStatus: 'مدفوع',
      paymentBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      representative: 'نادين الشرفات',
    },
  ]);

  const filteredSubscriptions = subscriptionsList.filter((item) => {
    const matchesSearch =
      item.storeName.includes(search) || item.storeCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || item.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Action Triggers
  const openRenewModal = (sub: SubscriptionItem) => {
    setSelectedSub(sub);
    setSelectedStore(sub.storeName);
    setSelectedPackage(sub.packageName);
    setSelectedRep(sub.representative);
    setIsRenewModalOpen(true);
  };

  const openUpgradeModal = (sub: SubscriptionItem) => {
    setSelectedSub(sub);
    setIsUpgradeModalOpen(true);
  };

  const openInvoiceModal = (sub: SubscriptionItem) => {
    setSelectedSub(sub);
    setIsInvoiceModalOpen(true);
  };

  const openHistoryModal = (sub: SubscriptionItem) => {
    setSelectedSub(sub);
    setIsHistoryModalOpen(true);
  };

  const handleDeleteSubscription = (id: string, storeName: string) => {
    if (window.confirm(`هل أنت تأكد من حذف اشتراك متجر "${storeName}"؟`)) {
      setSubscriptionsList(subscriptionsList.filter((s) => s.id !== id));
    }
  };

  const handleDownloadInvoice = (sub: SubscriptionItem) => {
    alert(`جاري تحميل فاتورة المتجر ${sub.storeName} (${sub.storeCode})...`);
  };

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore) {
      alert('يرجى اختيار اسم المتجر');
      return;
    }
    const newSub: SubscriptionItem = {
      id: String(Date.now()),
      storeName: selectedStore,
      storeCode: `SUB-00${subscriptionsList.length + 1}`,
      packageName: selectedPackage,
      packageColor:
        selectedPackage === 'زلمة سوبر'
          ? 'bg-amber-500 text-white shadow-xs'
          : selectedPackage === 'زلمة قوي'
          ? 'bg-purple-600 text-white shadow-xs'
          : selectedPackage === 'زلمة تمام'
          ? 'bg-sky-500 text-white shadow-xs'
          : 'bg-slate-600 text-white shadow-xs',
      amount: selectedPackage === 'زلمة سوبر' ? '650 د.أ' : selectedPackage === 'زلمة قوي' ? '450 د.أ' : '280 د.أ',
      startDate: '2026-07-30',
      endDate: '2027-07-29',
      daysRemaining: '365 يوم',
      daysRemainingBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      status: 'نشط',
      statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      paymentStatus: 'مدفوع',
      paymentBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      representative: selectedRep,
    };
    setSubscriptionsList([newSub, ...subscriptionsList]);
    setIsAddModalOpen(false);
  };

  const handleConfirmRenew = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSub) {
      setSubscriptionsList(
        subscriptionsList.map((s) =>
          s.id === selectedSub.id
            ? {
                ...s,
                status: 'نشط',
                statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
                daysRemaining: '365 يوم',
                daysRemainingBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
                endDate: '2027-07-30',
              }
            : s
        )
      );
    }
    setIsRenewModalOpen(false);
  };

  const handleConfirmUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSub) {
      const newPkgName = targetUpgradePackage.split(' - ')[0];
      const newPkgColor =
        newPkgName === 'زلمة سوبر'
          ? 'bg-amber-500 text-white shadow-xs'
          : newPkgName === 'زلمة قوي'
          ? 'bg-purple-600 text-white shadow-xs'
          : newPkgName === 'زلمة تمام'
          ? 'bg-sky-500 text-white shadow-xs'
          : 'bg-slate-600 text-white shadow-xs';
      const newAmount =
        newPkgName === 'زلمة سوبر'
          ? '650 د.أ'
          : newPkgName === 'زلمة قوي'
          ? '450 د.أ'
          : newPkgName === 'زلمة تمام'
          ? '280 د.أ'
          : '150 د.أ';

      setSubscriptionsList(
        subscriptionsList.map((s) =>
          s.id === selectedSub.id
            ? {
                ...s,
                packageName: newPkgName,
                packageColor: newPkgColor,
                amount: newAmount,
              }
            : s
        )
      );
    }
    setIsUpgradeModalOpen(false);
  };

  return (
    <div className="space-y-6 font-cairo text-slate-800" dir="rtl">
      {/* 1. Header Title Banner & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide">
            إدارة الاشتراكات
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            إدارة ومتابعة جميع اشتراكات المتاجر
          </p>
        </div>

        {/* Add New Subscription Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedStore('');
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#d83f2a]/20 transition cursor-pointer whitespace-nowrap"
        >
          <span className="text-base font-bold">+</span>
          <span>إضافة اشتراك جديد</span>
        </button>
      </div>

      {/* 2. Top Summary Stat Cards (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500">إجمالي الاشتراكات</span>
          <span className="text-3xl font-black text-slate-900 mt-2">12</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500">النشطة</span>
          <span className="text-3xl font-black text-emerald-600 mt-2">7</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500">قريبة الانتهاء</span>
          <span className="text-3xl font-black text-amber-500 mt-2">3</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500">المنتهية</span>
          <span className="text-3xl font-black text-rose-500 mt-2">2</span>
        </div>
      </div>

      {/* 3. Search and Filters Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#d83f2a] cursor-pointer shadow-sm whitespace-nowrap"
          >
            <option value="all">جميع الحالات</option>
            <option value="نشط">نشط</option>
            <option value="قريب الانتهاء">قريب الانتهاء</option>
            <option value="منتهي">منتهي</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#d83f2a] cursor-pointer shadow-sm whitespace-nowrap"
          >
            <option value="all">جميع الدفعات</option>
            <option value="مدفوع">مدفوع</option>
            <option value="غير مدفوع">غير مدفوع</option>
          </select>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث عن متجر أو رقم اشتراك..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition-all text-right font-medium shadow-sm"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 4. Subscriptions Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs whitespace-nowrap">
            <thead className="bg-slate-50/90 text-slate-500 font-bold border-b border-slate-200/80">
              <tr>
                <th className="py-4 px-4 whitespace-nowrap">المتجر</th>
                <th className="py-4 px-4 whitespace-nowrap">الباقة</th>
                <th className="py-4 px-4 whitespace-nowrap">القيمة</th>
                <th className="py-4 px-4 whitespace-nowrap">تاريخ البداية</th>
                <th className="py-4 px-4 whitespace-nowrap">تاريخ الانتهاء</th>
                <th className="py-4 px-4 whitespace-nowrap">الأيام المتبقية</th>
                <th className="py-4 px-4 whitespace-nowrap">الحالة</th>
                <th className="py-4 px-4 whitespace-nowrap">الدفع</th>
                <th className="py-4 px-4 whitespace-nowrap">الممثل</th>
                <th className="py-4 px-4 text-center whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                  {/* Store Name & Code */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                        💳
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs">{sub.storeName}</div>
                        <div className="text-[10px] font-mono font-semibold text-slate-400">{sub.storeCode}</div>
                      </div>
                    </div>
                  </td>

                  {/* Package Pill */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded-lg font-extrabold text-xs text-white ${sub.packageColor}`}>
                      {sub.packageName}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm whitespace-nowrap">
                    {sub.amount}
                  </td>

                  {/* Start Date */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {sub.startDate}
                  </td>

                  {/* End Date */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {sub.endDate}
                  </td>

                  {/* Days Remaining Pill */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-0.5 rounded-full font-bold text-xs ${sub.daysRemainingBg}`}>
                      {sub.daysRemaining}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded-full font-bold text-xs gap-1 ${sub.statusBg}`}>
                      {sub.status === 'نشط' ? '✓ نشط' : sub.status === 'قريب الانتهاء' ? '⚠️ قريب الانتهاء' : '✕ منتهي'}
                    </span>
                  </td>

                  {/* Payment Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded-full font-bold text-xs ${sub.paymentBg}`}>
                      {sub.paymentStatus}
                    </span>
                  </td>

                  {/* Representative */}
                  <td className="py-3.5 px-4 text-slate-700 font-bold whitespace-nowrap">
                    {sub.representative}
                  </td>

                  {/* Action SVG Icons triggering interactive modals */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* 1. Refresh/Sync Icon -> Opens Renew Modal (Screenshot 4) */}
                      <button
                        type="button"
                        onClick={() => openRenewModal(sub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                        title="تجديد الاشتراك"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>

                      {/* 2. Upgrade/Downgrade Icon -> Opens Upgrade Modal (Screenshot 3) */}
                      <button
                        type="button"
                        onClick={() => openUpgradeModal(sub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                        title="ترقية الباقة"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </button>

                      {/* 3. Download Icon -> Triggers Download Alert */}
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(sub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="تحميل الفاتورة"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>

                      {/* 4. Invoice Doc Icon -> Opens Invoice View Modal (Screenshot 2) */}
                      <button
                        type="button"
                        onClick={() => openInvoiceModal(sub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                        title="عرض الفاتورة"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>

                      {/* 5. History Clock Icon -> Opens Payment History Modal (Screenshot 1) */}
                      <button
                        type="button"
                        onClick={() => openHistoryModal(sub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                        title="سجل الدفعات"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>

                      {/* 6. Red Checkbox / Delete Icon -> Deletes Subscription */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSubscription(sub.id, sub.storeName)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                        title="تحديد/حذف"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth={2} />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL 1: Add New Subscription Modal (إضافة اشتراك جديد) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">إضافة اشتراك جديد</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubscription} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">اسم المتجر</label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#d83f2a] cursor-pointer"
                >
                  <option value="">اختر المتجر</option>
                  <option value="متجر زلمة للشوكولاتة">متجر زلمة للشوكولاتة</option>
                  <option value="عصام الديرباني للتكييف">عصام الديرباني للتكييف</option>
                  <option value="غزال الأردن للمواد الخام">غزال الأردن للمواد الخام</option>
                  <option value="مطعم بيت الزلطة">مطعم بيت الزلطة</option>
                  <option value="صيدلية الحياة الحديثة">صيدلية الحياة الحديثة</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">الباقة</label>
                <div className="grid grid-cols-2 gap-2">
                  {['زلمة على الخفيف', 'زلمة تمام', 'زلمة قوي', 'زلمة سوبر'].map((pkg) => (
                    <button
                      key={pkg}
                      type="button"
                      onClick={() => setSelectedPackage(pkg)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedPackage === pkg
                          ? 'bg-[#d83f2a] text-white border-[#d83f2a] shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">المدة</label>
                <div className="grid grid-cols-3 gap-2">
                  {['شهري', 'ربع سنوي', 'سنوي'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSelectedDuration(dur)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedDuration === dur
                          ? 'bg-[#d83f2a] text-white border-[#d83f2a] shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">القيمة الإجمالية</label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-center font-black text-slate-900 text-lg">
                  {selectedPackage === 'زلمة سوبر' ? '650 د.أ' : selectedPackage === 'زلمة قوي' ? '450 د.أ' : '280 د.أ'}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">ممثل المبيعات</label>
                <select
                  value={selectedRep}
                  onChange={(e) => setSelectedRep(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#d83f2a] cursor-pointer"
                >
                  <option value="أحمد المصري">أحمد المصري</option>
                  <option value="محمد العبادي">محمد العبادي</option>
                  <option value="سارة النابلسي">سارة النابلسي</option>
                  <option value="خالد التل">خالد التل</option>
                  <option value="نادين الشرفات">نادين الشرفات</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
                >
                  تأكيد
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL 2: Renew Subscription Modal (تجديد الاشتراك - Screenshot 4) */}
      {isRenewModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">تجديد الاشتراك</h2>
              <button
                type="button"
                onClick={() => setIsRenewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmRenew} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">اسم المتجر</label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-800">
                  {selectedSub.storeName}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">الباقة</label>
                <div className="grid grid-cols-2 gap-2">
                  {['زلمة على الخفيف', 'زلمة تمام', 'زلمة قوي', 'زلمة سوبر'].map((pkg) => (
                    <button
                      key={pkg}
                      type="button"
                      onClick={() => setSelectedPackage(pkg)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedPackage === pkg
                          ? 'bg-[#d83f2a] text-white border-[#d83f2a] shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">المدة</label>
                <div className="grid grid-cols-3 gap-2">
                  {['شهري', 'ربع سنوي', 'سنوي'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSelectedDuration(dur)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedDuration === dur
                          ? 'bg-[#d83f2a] text-white border-[#d83f2a] shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">القيمة الإجمالية</label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-center font-black text-slate-900 text-lg">
                  {selectedSub.amount}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">ممثل المبيعات</label>
                <select
                  value={selectedRep}
                  onChange={(e) => setSelectedRep(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#d83f2a] cursor-pointer"
                >
                  <option value="أحمد المصري">أحمد المصري</option>
                  <option value="محمد العبادي">محمد العبادي</option>
                  <option value="سارة النابلسي">سارة النابلسي</option>
                  <option value="خالد التل">خالد التل</option>
                  <option value="نادين الشرفات">نادين الشرفات</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
                >
                  تأكيد التجديد
                </button>
                <button
                  type="button"
                  onClick={() => setIsRenewModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL 3: Package Upgrade Modal (ترقية الباقة - Screenshot 3) */}
      {isUpgradeModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">ترقية الباقة</h2>
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmUpgrade} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">الباقة الحالية</label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-center font-black text-slate-900 text-base">
                  {selectedSub.packageName}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">ترقية إلى</label>
                <div className="space-y-2">
                  {[
                    'زلمة على الخفيف - 150 د.أ/سنوي',
                    'زلمة تمام - 280 د.أ/سنوي',
                    'زلمة قوي - 450 د.أ/سنوي',
                    'زلمة سوبر - 650 د.أ/سنوي',
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTargetUpgradePackage(option)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition text-center border cursor-pointer ${
                        targetUpgradePackage === option
                          ? 'bg-[#d83f2a] text-white border-[#d83f2a] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
                >
                  تأكيد
                </button>
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL 4: Redesigned Invoice View Modal (عرض الفاتورة - Styled with System Primary Color & Premium Card) */}
      {isInvoiceModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[#d83f2a] text-lg">📄</span>
                <h2 className="text-lg font-black text-slate-900">عرض الفاتورة</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Store & Invoice Code Banner */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200/80 text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#d83f2a] text-white flex items-center justify-center text-2xl shadow-md shadow-[#d83f2a]/30">
                💳
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">{selectedSub.storeName}</h3>
                <span className="text-xs font-mono font-bold text-[#d83f2a] bg-[#d83f2a]/10 px-2.5 py-0.5 rounded-md inline-block mt-1">
                  {selectedSub.storeCode}
                </span>
              </div>
            </div>

            {/* Structured Details Box */}
            <div className="bg-slate-50/80 rounded-2xl p-4 space-y-3 text-xs border border-slate-200/60">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-bold">الباقة</span>
                <span className={`px-2.5 py-0.5 rounded-lg font-extrabold text-[11px] ${selectedSub.packageColor}`}>
                  {selectedSub.packageName}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-bold">فترة الاشتراك</span>
                <span className="text-slate-900 font-bold font-mono text-[11px]">
                  {selectedSub.startDate} إلى {selectedSub.endDate}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-bold">طريقة الدفع</span>
                <span className="text-slate-800 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  CliQ / الإلكتروني
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-bold">المبلغ الإجمالي</span>
                <span className="text-slate-900 font-black text-sm text-[#d83f2a]">{selectedSub.amount}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500 font-bold">الحالة</span>
                <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] ${selectedSub.statusBg}`}>
                  {selectedSub.status}
                </span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-xs shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={() => handleDownloadInvoice(selectedSub)}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
              >
                <span>⬇️</span>
                <span>تحميل PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL 5: Payment History Modal (سجل الدفعات - Styled with System Primary Close Button) */}
      {isHistoryModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-lg">🕒</span>
                <h2 className="text-lg font-black text-slate-900">سجل الدفعات</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {[
                { year: 'يناير 2025', amount: selectedSub.amount },
                { year: 'يناير 2024', amount: selectedSub.amount },
                { year: 'يناير 2023', amount: selectedSub.amount },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/80 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-lg">
                      $
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">التجديد السنوي</div>
                      <div className="text-xs text-slate-400 font-semibold">{item.year}</div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-emerald-600">{item.amount}</div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsHistoryModalOpen(false)}
              className="w-full py-3 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-xs shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
