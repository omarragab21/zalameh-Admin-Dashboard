import React from 'react';

export const FinanceReportsTab: React.FC = () => {
  const reports = [
    {
      title: 'تقرير الإيرادات الشهرية',
      desc: 'ملخص شامل للإيرادات المحصلة لهذا الشهر',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      linkColor: 'text-emerald-600 hover:text-emerald-700',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'تقرير الفواتير المتأخرة',
      desc: 'قائمة بجميع الفواتير التي تجاوزت تاريخ الاستحقاق',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      linkColor: 'text-[#d83f2a] hover:text-[#b83320]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      title: 'تقرير المدفوعات حسب الباقة',
      desc: 'توزيع المدفوعات على أنواع الباقات المختلفة',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      linkColor: 'text-purple-600 hover:text-purple-700',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'تقرير أداء الشركاء المالي',
      desc: 'تحليل الالتزام بالدفع لكل شريك',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      linkColor: 'text-[#d83f2a] hover:text-[#b83320]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* 2x2 Grid Reports Cards - Flat border, no elevation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {reports.map((rep, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header: Title & Icon */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#d83f2a] transition">
                  {rep.title}
                </h3>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${rep.iconBg}`}>
                  {rep.icon}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                {rep.desc}
              </p>
            </div>

            {/* Download Report Link */}
            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-start">
              <button
                type="button"
                onClick={() => alert(`جاري تنزيل ${rep.title}...`)}
                className={`text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${rep.linkColor}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>تنزيل التقرير</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
