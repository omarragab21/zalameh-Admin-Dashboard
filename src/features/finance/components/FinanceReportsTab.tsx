import React, { useState } from 'react';

export const FinanceReportsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'financial' | 'banners' | 'subscriptions'>('financial');

  const handleExportPDF = () => {
    alert('جاري تصدير التقرير الحالي كملف PDF...');
  };

  const handleExportExcel = () => {
    alert('جاري تصدير التقرير الحالي كملف Excel...');
  };

  return (
    <div className="space-y-6 font-cairo text-slate-800" dir="rtl">
      {/* 1. Page Header with Title (Right aligned in RTL) & Premium System Export Action Buttons (Left aligned in RTL) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
        {/* Right Section: Title & Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide">
            التقارير والتحليلات
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            تقارير مفصلة عن جميع جوانب النظام
          </p>
        </div>

        {/* Left Section: Upgraded Premium System Export Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportPDF}
            className="bg-white border-2 border-[#d83f2a]/30 hover:border-[#d83f2a] text-[#d83f2a] hover:bg-rose-50/50 shadow-xs hover:shadow-md px-5 py-2.5 rounded-2xl flex items-center gap-2.5 text-xs font-black transition cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0 text-[#d83f2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>تصدير PDF</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="bg-white border-2 border-emerald-300 hover:border-emerald-500 text-emerald-600 hover:bg-emerald-50/50 shadow-xs hover:shadow-md px-5 py-2.5 rounded-2xl flex items-center gap-2.5 text-xs font-black transition cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>تصدير Excel</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Tabs Bar (Styled with Zalameh System Primary Red Brand Gradient) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {/* Financial Reports Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('financial')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2.5 transition cursor-pointer shrink-0 border ${
            activeTab === 'financial'
              ? 'bg-gradient-to-r from-[#d83f2a] to-[#b83320] text-white border-transparent shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>التقارير المالية</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              activeTab === 'financial' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            4
          </span>
        </button>

        {/* Banners Reports Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('banners')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2.5 transition cursor-pointer shrink-0 border ${
            activeTab === 'banners'
              ? 'bg-gradient-to-r from-[#d83f2a] to-[#b83320] text-white border-transparent shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>تقارير البانرات</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              activeTab === 'banners' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            3
          </span>
        </button>

        {/* Subscriptions Reports Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('subscriptions')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2.5 transition cursor-pointer shrink-0 border ${
            activeTab === 'subscriptions'
              ? 'bg-gradient-to-r from-[#d83f2a] to-[#b83320] text-white border-transparent shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>تقارير الاشتراكات</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              activeTab === 'subscriptions' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            3
          </span>
        </button>
      </div>

      {/* 3. Tab Specific Content */}
      {/* ---------------------------------------------------- */}
      {/* FINANCIAL REPORTS TAB CONTENT */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Revenue (Zalameh Primary Red Gradient Card) */}
            <div className="bg-gradient-to-br from-[#d83f2a] to-[#b83320] rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-100">إجمالي الإيرادات</span>
                <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-3xl font-black tracking-tight">49,740 د.أ</span>
              </div>
            </div>

            {/* Card 2: Subscriptions Revenue */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">إيرادات الاشتراكات</span>
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block">5,090 د.أ</span>
                <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">
                  +12% من الشهر الماضي
                </span>
              </div>
            </div>

            {/* Card 3: Banners Revenue */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">إيرادات البانرات</span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block">44,650 د.أ</span>
                <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">
                  +23% من الشهر الماضي
                </span>
              </div>
            </div>

            {/* Card 4: Current Month Collections */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">تحصيلات هذا الشهر</span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block">49,740 د.أ</span>
              </div>
            </div>
          </div>

          {/* Month-by-Month Comparison Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs space-y-4 p-6">
            <h3 className="text-base font-black text-slate-900">مقارنة شهر بشهر</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-4">الشهر</th>
                    <th className="py-3.5 px-4">الاشتراكات</th>
                    <th className="py-3.5 px-4">البانرات</th>
                    <th className="py-3.5 px-4">الإجمالي</th>
                    <th className="py-3.5 px-4">التغير</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { month: 'يناير', subs: '2,800 د.أ', banners: '4,500 د.أ', total: '7,300 د.أ', change: '-', changeColor: 'text-slate-400' },
                    { month: 'فبراير', subs: '3,100 د.أ', banners: '5,200 د.أ', total: '8,300 د.أ', change: '↗ 13.7%', changeColor: 'text-emerald-600' },
                    { month: 'مارس', subs: '2,400 د.أ', banners: '4,800 د.أ', total: '7,200 د.أ', change: '↘ 13.3%', changeColor: 'text-rose-500' },
                    { month: 'أبريل', subs: '2,900 د.أ', banners: '6,100 د.أ', total: '9,000 د.أ', change: '↗ 25.0%', changeColor: 'text-emerald-600' },
                    { month: 'مايو', subs: '3,200 د.أ', banners: '7,500 د.أ', total: '10,700 د.أ', change: '↗ 18.9%', changeColor: 'text-emerald-600' },
                    { month: 'يونيو', subs: '1,500 د.أ', banners: '8,000 د.أ', total: '9,500 د.أ', change: '↘ 11.2%', changeColor: 'text-rose-500' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{row.month}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{row.subs}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{row.banners}</td>
                      <td className="py-3.5 px-4 font-black text-emerald-600">{row.total}</td>
                      <td className={`py-3.5 px-4 font-extrabold ${row.changeColor}`}>{row.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Months Forecast */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">توقعات تحصيلات الأشهر القادمة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { period: 'بعد 1 شهر', amount: '44,766 د.أ' },
                { period: 'بعد 2 شهر', amount: '44,766 د.أ' },
                { period: 'بعد 3 شهر', amount: '44,766 د.أ' },
              ].map((forecast, i) => (
                <div key={i} className="bg-slate-50/80 rounded-2xl p-5 text-center border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-500 block">{forecast.period}</span>
                  <span className="text-xl font-black text-slate-900 block">{forecast.amount}</span>
                  <span className="text-[11px] font-extrabold text-slate-400 block">متوقع التجديد</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* BANNERS REPORTS TAB CONTENT */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards with Clean SVG Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Banners Income */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">إجمالي دخل البانرات</span>
                <div className="w-10 h-10 rounded-2xl bg-[#d83f2a]/10 text-[#d83f2a] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block">44,650 د.أ</span>
              </div>
            </div>

            {/* Card 2: Occupancy Rate */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">نسبة الإشغال</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-600 block">85.3%</span>
              </div>
            </div>

            {/* Card 3: Average Banner Price */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">متوسط سعر البانر</span>
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block">5,581.25 د.أ</span>
              </div>
            </div>

            {/* Card 4: Active Banners */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">البانرات النشطة</span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 block">4</span>
              </div>
            </div>
          </div>

          {/* Best Ad Positions List (Zalameh Primary Red Progress Bars & Prominent Red Amounts) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-black text-slate-900">أفضل مواضع الإعلانات</h3>
            <div className="space-y-4">
              {[
                { name: 'البانر الرئيسي', rank: '1', rankBg: 'bg-[#d83f2a] text-white', amount: '7,400 د.أ (2 بانر)', progress: '85%' },
                { name: 'البانر المتحرك', rank: '2', rankBg: 'bg-slate-200 text-slate-700', amount: '18,000 د.أ (2 بانر)', progress: '65%' },
                { name: 'الشريط الجانبي', rank: '3', rankBg: 'bg-slate-200 text-slate-700', amount: '10,500 د.أ (2 بانر)', progress: '75%' },
                { name: 'النافذة المنبثقة', rank: '4', rankBg: 'bg-slate-200 text-slate-700', amount: '8,750 د.أ (2 بانر)', progress: '70%' },
              ].map((pos, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-1/4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${pos.rankBg}`}>
                      {pos.rank}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">{pos.name}</span>
                  </div>

                  {/* Zalameh Primary Red Gradient Progress Bar */}
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#d83f2a] to-[#f05a46] h-full rounded-full" style={{ width: pos.progress }} />
                  </div>

                  {/* Prominent Zalameh Red Amount Text */}
                  <span className="text-xs sm:text-sm font-black text-[#d83f2a] w-1/4 text-left">{pos.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Paying Advertisers */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">أعلى المعلنين دفوعاً</h3>
            <div className="space-y-3">
              {[
                { name: 'متجر زلمة للشوكولاتة', rank: '1', rankBg: 'bg-[#d83f2a] text-white', amount: '15,600 د.أ' },
                { name: 'شركة الاتصالات الأردنية', rank: '2', rankBg: 'bg-slate-300 text-slate-800', amount: '12,000 د.أ' },
                { name: 'عصام الديرباني للتكييف', rank: '3', rankBg: 'bg-[#d83f2a]/80 text-white', amount: '8,950 د.أ' },
              ].map((adv, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${adv.rankBg}`}>
                      {adv.rank}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">{adv.name}</span>
                  </div>
                  <span className="text-sm font-black text-[#d83f2a]">{adv.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUBSCRIPTIONS REPORTS TAB CONTENT */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">إيرادات الشهر</span>
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block">1,500 د.أ</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">نسبة التجديد</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-600 block">78.5%</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">نسبة التسرب</span>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-rose-500 block">12.3%</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">الاشتراكات النشطة</span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 block">7</span>
              </div>
            </div>
          </div>

          {/* Package Performance Table & Progress */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-black text-slate-900">أداء الباقات</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-4">الباقة</th>
                    <th className="py-3.5 px-4">عدد المشتركين</th>
                    <th className="py-3.5 px-4">الإيرادات</th>
                    <th className="py-3.5 px-4">نسبة من الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { name: 'زلمه سوبر', badgeBg: 'bg-[#d83f2a] text-white', count: '4', rev: '2,600 د.أ', percent: '51.1%' },
                    { name: 'زلمه قوي', badgeBg: 'bg-purple-200 text-purple-800', count: '3', rev: '1,350 د.أ', percent: '26.5%' },
                    { name: 'زلمه تمام', badgeBg: 'bg-sky-200 text-sky-800', count: '3', rev: '840 د.أ', percent: '16.5%' },
                    { name: 'زلمه على الخفيف', badgeBg: 'bg-slate-200 text-slate-700', count: '2', rev: '300 د.أ', percent: '5.9%' },
                  ].map((pkg, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <span className={`px-3 py-1 rounded-xl font-bold text-xs ${pkg.badgeBg}`}>
                          {pkg.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{pkg.count}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{pkg.rev}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 w-48">
                          <span className="text-slate-500 font-bold text-[11px] w-12">{pkg.percent}</span>
                          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: pkg.percent }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
