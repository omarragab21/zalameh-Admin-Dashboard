import React, { useState } from 'react';

export const FinanceOverviewTab: React.FC = () => {
  const [revenueChartTab, setRevenueChartTab] = useState<'subscriptions' | 'banners'>('subscriptions');

  const stats = [
    {
      id: 1,
      title: 'إجمالي الإيرادات',
      value: '48,990 د.أ',
      subtext: '12% من الشهر الماضي',
      isPositive: true,
      hasAlertDot: false,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 12v-2m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'إيرادات الاشتراكات',
      value: '4,340 د.أ',
      subtext: '12% من الشهر الماضي',
      isPositive: true,
      hasAlertDot: false,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'إيرادات البانرات',
      value: '44,650 د.أ',
      subtext: '12% من الشهر الماضي',
      isPositive: true,
      hasAlertDot: false,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'التحصيلات المعلقة',
      value: '3,950 د.أ',
      subtext: '12% من الشهر الماضي',
      isPositive: true,
      hasAlertDot: false,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 5,
      title: 'الاشتراكات النشطة',
      value: '7',
      subtext: '12% من الشهر الماضي',
      isPositive: true,
      hasAlertDot: false,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 6,
      title: 'البانرات النشطة',
      value: '4',
      subtext: '12% من الشهر الماضي',
      isPositive: true,
      hasAlertDot: false,
      iconBg: 'bg-pink-50 text-pink-600 border-pink-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 7,
      title: 'اشتراكات ستنتهي قريباً',
      value: '3',
      subtext: '12% من الشهر الماضي',
      isPositive: true,
      hasAlertDot: true,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: 8,
      title: 'بانرات ستنتهي قريباً',
      value: '3',
      subtext: '12% من الشهر الماضي',
      isPositive: true,
      hasAlertDot: true,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: 9,
      title: 'نسبة التجديد',
      value: '78.5%',
      subtext: '12% من الشهر الماضي',
      isPositive: true,
      hasAlertDot: false,
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: 10,
      title: 'نسبة الإشغال الإعلاني',
      value: '85.3%',
      subtext: '12% من الشهر الماضي',
      isPositive: true,
      hasAlertDot: false,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const quickAlerts = [
    { type: 'اشتراك سينتهي قريباً', partner: 'مطعم بيت الزلطة', highlight: true },
    { type: 'بانر سينتهي قريباً', partner: 'بنك القاهرة عمان', highlight: true },
    { type: 'فاتورة متأخرة', partner: 'محل الأمل للإلكترونيات', highlight: true },
    { type: 'اشتراك سينتهي قريباً', partner: 'مخبز السعادة', highlight: true },
    { type: 'تجديد اشتراك في الانتظار', partner: 'كافيه نون', highlight: false },
  ];

  const topClients = [
    { rank: 1, name: 'متجر زلمة للشوكولاتة', category: 'متجر', amount: '15,600 د.أ', color: 'bg-amber-400 text-slate-950 font-black' },
    { rank: 2, name: 'شركة الاتصالات الأردنية', category: 'معلن خارجي', amount: '12,000 د.أ', color: 'bg-slate-300 text-slate-950 font-black' },
    { rank: 3, name: 'عصام الديرباني للتكييف', category: 'متجر', amount: '8,950 د.أ', color: 'bg-amber-600 text-white font-black' },
    { rank: 4, name: 'بنك القاهرة عمان', category: 'معلن خارجي', amount: '7,000 د.أ', color: 'bg-slate-200 text-slate-800 font-bold' },
    { rank: 5, name: 'شركة فارس للتأمين', category: 'معلن خارجي', amount: '6,000 د.أ', color: 'bg-slate-200 text-slate-800 font-bold' },
  ];

  const transactions = [
    {
      id: 1,
      partner: 'متجر زلمة للشوكولاتة',
      code: 'INV-2025-S001 • CliQ',
      date: '2025-01-15',
      amount: '+650 د.أ',
      status: 'ناجح',
      statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      iconBg: 'bg-sky-50 text-sky-600',
      icon: '💳',
    },
    {
      id: 2,
      partner: 'شركة الاتصالات الأردنية',
      code: 'INV-2025-001 • Cash',
      date: '2025-06-01',
      amount: '+6,000 د.أ',
      status: 'ناجح',
      statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      iconBg: 'bg-purple-50 text-purple-600',
      icon: '🖼️',
    },
    {
      id: 3,
      partner: 'عصام الديرباني للتكييف',
      code: 'INV-2025-S002 • Wallet',
      date: '2025-06-01',
      amount: '+450 د.أ',
      status: 'ناجح',
      statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      iconBg: 'bg-sky-50 text-sky-600',
      icon: '💳',
    },
    {
      id: 4,
      partner: 'بنك القاهرة عمان',
      code: 'INV-2025-002 • CliQ',
      date: '2025-06-10',
      amount: '+3,500 د.أ',
      status: 'معلق',
      statusBg: 'bg-amber-50 text-amber-600 border border-amber-200',
      iconBg: 'bg-purple-50 text-purple-600',
      icon: '🖼️',
    },
    {
      id: 5,
      partner: 'محل الأمل للإلكترونيات',
      code: 'INV-2025-S005 • Cash',
      date: '2025-06-14',
      amount: '+150 د.أ',
      status: 'فشل',
      statusBg: 'bg-rose-50 text-rose-600 border border-rose-200',
      iconBg: 'bg-sky-50 text-sky-600',
      icon: '💳',
    },
  ];

  return (
    <div className="space-y-6 font-cairo text-slate-800" dir="rtl">
      {/* 1. Page Title Header Banner (Quick Decision Board) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide">
            لوحة القرار السريع
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            نظرة شاملة على أداء النظام المالي
          </p>
        </div>

        {/* Date badge: Standard Gregorian Month in Arabic (يوليو) */}
        <div className="px-4 py-2 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2 text-xs font-bold text-slate-700 shadow-sm">
          <svg className="w-4 h-4 text-[#d83f2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>الخميس، 30 يوليو 2026</span>
        </div>
      </div>

      {/* 2. Top KPI Cards Grid (10 Cards: 5x2 layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative bg-white rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between group shadow-sm hover:border-[#d83f2a]/30 transition-all"
          >
            {/* Top Row: Icon + Red Alert Dot (if expiring) */}
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.iconBg}`}>
                {item.icon}
              </div>
              {item.hasAlertDot && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/50 animate-pulse" />
              )}
            </div>

            {/* Middle Value & Title */}
            <div className="mt-3">
              <span className="text-[11px] font-bold text-slate-500 block leading-tight truncate">
                {item.title}
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                {item.value}
              </div>
            </div>

            {/* Bottom Subtext */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <span>↗</span>
              <span>{item.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Middle Section: Monthly Revenue on Right (7 cols), Revenue Distribution Donut on Left (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Monthly Revenue Bar Chart (Spans 7 cols on Right in RTL) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">إيرادات الشهور</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">مقارنة الإيرادات الشهرية</p>
            </div>
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setRevenueChartTab('subscriptions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  revenueChartTab === 'subscriptions'
                    ? 'bg-[#d83f2a] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                اشتراكات
              </button>
              <button
                type="button"
                onClick={() => setRevenueChartTab('banners')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  revenueChartTab === 'banners'
                    ? 'bg-[#d83f2a] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                بانرات
              </button>
            </div>
          </div>

          {/* Bar Chart Visual with Standard Gregorian Month Names (يناير, فبراير, مارس, أبريل, مايو, يونيو) */}
          <div className="h-48 flex items-end justify-between gap-3 px-2 pt-6 pb-2">
            {[
              { month: 'يناير', val: 34000 },
              { month: 'فبراير', val: 28000 },
              { month: 'مارس', val: 42000 },
              { month: 'أبريل', val: 39000 },
              { month: 'مايو', val: 45000 },
              { month: 'يونيو', val: 48990 },
            ].map((bar, index) => {
              const heightPct = Math.min(100, (bar.val / 50000) * 100);
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-[#d83f2a] opacity-0 group-hover:opacity-100 transition">
                    {(bar.val / 1000).toFixed(1)}k
                  </span>
                  <div
                    className="w-full max-w-[32px] bg-gradient-to-t from-[#d83f2a] to-red-400 rounded-t-lg group-hover:from-[#c03320] group-hover:to-red-500 transition-all duration-300 shadow-sm"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-xs text-slate-500 font-semibold mt-1">
                    {bar.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Distribution Donut Chart using System Palette Colors */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">توزيع الإيرادات</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">نسبة الاشتراكات مقابل البانرات</p>
          </div>

          {/* Donut Visual using System Primary Coral Red (#d83f2a) & System Dark Slate (#181c28) */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border-8 border-[#d83f2a] border-t-slate-700 border-r-slate-700 border-b-slate-700 flex flex-col items-center justify-center text-center shadow-md">
              <span className="text-2xl font-black text-slate-900">48,990</span>
              <span className="text-xs font-bold text-slate-400 mt-0.5">د.أ (إجمالي)</span>
            </div>
          </div>

          {/* Legend using System Colors */}
          <div className="flex items-center justify-around pt-3 border-t border-slate-100 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#d83f2a]" />
              <span className="text-slate-700">الاشتراكات 8.9%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span className="text-slate-700">البانرات 91.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Lower Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Right Side (Spans 7 cols): Quick Alerts + Recent Transactions */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Quick Alerts Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-rose-500 text-lg">⚡</span>
                <h2 className="text-base font-extrabold text-slate-900">تنبيهات سريعة</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-100">
                7 جديدة
              </span>
            </div>

            <div className="space-y-2.5 flex-1 flex flex-col justify-around">
              {quickAlerts.map((alert, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 border border-rose-200/60 flex items-center justify-between hover:bg-slate-100/80 transition"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-rose-600 block">
                      {alert.type}
                    </span>
                    <span className="text-xs font-bold text-slate-800 block">
                      {alert.partner}
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs font-bold">←</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Financial Transactions Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between flex-1 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#d83f2a] text-lg">📈</span>
                <h2 className="text-base font-extrabold text-slate-900">آخر العمليات المالية</h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">أحدث 5 عمليات</span>
            </div>

            <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-around">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-3.5 flex items-center justify-between group hover:bg-slate-50 px-3 rounded-xl transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 ${tx.iconBg}`}>
                      {tx.icon}
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">{tx.partner}</div>
                      <div className="text-xs font-medium text-slate-400">{tx.code}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-left">
                    <div>
                      <div className="text-sm font-black text-emerald-600">{tx.amount}</div>
                      <div className="text-[11px] font-medium text-slate-400">{tx.date}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${tx.statusBg}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left Side (Spans 5 cols): Top Paying Clients */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-amber-500 text-lg">👥</span>
                <h2 className="text-base font-extrabold text-slate-900">أعلى العملاء دفعاً</h2>
              </div>

              <div className="space-y-4 my-2">
                {topClients.map((client) => (
                  <div
                    key={client.rank}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-slate-100/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${client.color}`}>
                        {client.rank}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{client.name}</div>
                        <div className="text-xs font-medium text-slate-400">{client.category}</div>
                      </div>
                    </div>
                    <div className="text-sm font-black text-emerald-600">{client.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center">
              <span className="text-xs font-bold text-slate-400">إجمالي الأداء المالي الممتاز للشركاء</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
