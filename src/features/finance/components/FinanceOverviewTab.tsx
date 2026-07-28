import React from 'react';

export const FinanceOverviewTab: React.FC = () => {
  const stats = [
    {
      title: 'إجمالي الإيرادات',
      value: '330.00 د.أ',
      subtext: 'الفواتير المدفوعة فقط',
      change: '+12%',
      isPositive: true,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      icon: (
        <span className="font-extrabold text-base">$</span>
      ),
    },
    {
      title: 'فواتير معلقة',
      value: '145.00 د.أ',
      subtext: '2 فاتورة',
      change: null,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'فواتير متأخرة',
      value: '65.00 د.أ',
      subtext: '1 فاتورة',
      change: '-3%',
      isPositive: false,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      title: 'إجمالي الفواتير',
      value: '8',
      subtext: 'هذا الشهر',
      change: null,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const packagesRevenue = [
    { name: 'باقة Pro', partners: '3 شركاء', amount: '65 د.أ', color: 'bg-purple-500', barWidth: '40%' },
    { name: 'باقة Premium', partners: '3 شركاء', amount: '240 د.أ', color: 'bg-[#d83f2a]', barWidth: '90%' },
    { name: 'باقة Basic', partners: '2 شركاء', amount: '25 د.أ', color: 'bg-blue-500', barWidth: '20%' },
  ];

  const invoiceStatuses = [
    { label: 'مدفوعة', count: 4, dotBg: 'bg-emerald-500', textBg: 'bg-emerald-50 text-emerald-600', icon: '✓' },
    { label: 'معلقة', count: 2, dotBg: 'bg-amber-500', textBg: 'bg-amber-50 text-amber-600', icon: '🕒' },
    { label: 'متأخرة', count: 1, dotBg: 'bg-rose-500', textBg: 'bg-rose-50 text-rose-600', icon: '!' },
    { label: 'ملغاة', count: 1, dotBg: 'bg-slate-400', textBg: 'bg-slate-100 text-slate-500', icon: '✕' },
  ];

  const transactions = [
    {
      id: 1,
      partner: 'مطعم الأصالة',
      type: 'تحويل بنكي - TXN-98231',
      date: '28 كانون الثاني 2024',
      amount: '+65.00 د.أ',
      color: 'text-emerald-600',
      icon: '🏦',
    },
    {
      id: 2,
      partner: 'صيدلية الشفاء',
      type: 'دفع إلكتروني - TXN-98230',
      date: '27 كانون الثاني 2024',
      amount: '+120.00 د.أ',
      color: 'text-emerald-600',
      icon: '🌐',
    },
    {
      id: 3,
      partner: 'بوتيك الأناقة',
      type: 'بطاقة ائتمان - TXN-98229',
      date: '26 كانون الثاني 2024',
      amount: '+25.00 د.أ',
      color: 'text-emerald-600',
      icon: '💳',
    },
    {
      id: 4,
      partner: 'مطبخ النكهات',
      type: 'تحويل بنكي - TXN-98228',
      date: '25 كانون الثاني 2024',
      amount: '+120.00 د.أ',
      color: 'text-emerald-600',
      icon: '🏦',
    },
    {
      id: 5,
      partner: 'كافيه نون',
      type: 'نقداً - TXN-98227',
      date: '24 كانون الثاني 2024',
      amount: '25.00 د.أ',
      color: 'text-amber-600',
      icon: '💵',
    },
  ];

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* 1. Top 4 Stats Cards - Flat border, no elevation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.iconBg}`}>
                {item.icon}
              </div>
              {item.change && (
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    item.isPositive
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}
                >
                  <span>{item.change}</span>
                  <span>{item.isPositive ? '↗' : '↘'}</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {item.value}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1">
                {item.title}
              </div>
              <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                {item.subtext}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Middle Grid: Revenue by Package & Invoices Status - Flat border, no elevation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Right (Spans 2 cols): Revenue by package */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80">
          <h2 className="text-base font-extrabold text-slate-900 mb-6">
            الإيرادات حسب نوع الباقة
          </h2>
          <div className="space-y-6">
            {packagesRevenue.map((pkg, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${pkg.color}`} />
                    <span className="text-slate-900">{pkg.name}</span>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {pkg.partners}
                    </span>
                  </div>
                  <span className="text-slate-900 font-extrabold">{pkg.amount}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pkg.color} transition-all duration-500`}
                    style={{ width: pkg.barWidth }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left (1 col): Invoices Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80">
          <h2 className="text-base font-extrabold text-slate-900 mb-6">
            حالة الفواتير
          </h2>
          <div className="space-y-4">
            {invoiceStatuses.map((st, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${st.dotBg}`} />
                  <span className="text-sm font-bold text-slate-800">{st.label}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${st.textBg}`}>
                  {st.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Latest Transactions - Flat border, no elevation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 mb-2">
          آخر المعاملات
        </h2>
        <div className="divide-y divide-slate-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between group hover:bg-slate-50/60 px-2 rounded-xl transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-base shrink-0">
                  {tx.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{tx.partner}</div>
                  <div className="text-xs font-medium text-slate-400">{tx.type}</div>
                </div>
              </div>

              <div className="text-left">
                <div className={`text-sm font-extrabold ${tx.color}`}>{tx.amount}</div>
                <div className="text-[11px] font-medium text-slate-400">{tx.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
