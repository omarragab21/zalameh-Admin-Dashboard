import React from 'react';

export const GrowthCharts: React.FC = () => {
  const months = ['ينا', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'];

  const barData = [
    { label: 'الف', val: 45 },
    { label: 'الم', val: 72 },
    { label: 'الإ', val: 38 },
    { label: 'الب', val: 91 },
    { label: 'الشر', val: 56 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Main Dual Line Chart (Spans 2 cols on lg) */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              نمو المستخدمين والشركاء
            </h2>
            <p className="text-xs text-slate-400 font-medium">آخر 7 أشهر</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-red-50 text-[#d83f2a] text-xs font-bold border border-red-100">
            2026
          </span>
        </div>

        {/* Line Chart SVG Area */}
        <div className="w-full h-48 relative my-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />

            {/* Red Line - Users */}
            <path
              d="M 10 110 Q 80 80, 150 95 T 300 60 T 420 20 T 490 50"
              fill="none"
              stroke="#d83f2a"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* Blue Line - Partners */}
            <path
              d="M 10 115 Q 80 100, 150 90 T 300 70 T 420 15 T 490 25"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* X-Axis Month Labels */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-2 pt-2 border-t border-slate-100">
          {months.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#d83f2a] rounded-full inline-block" />
            <span>المستخدمون</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" />
            <span>الشركاء</span>
          </div>
        </div>
      </div>

      {/* Side Bar Chart (1 col on lg) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">توزيع النشاط</h2>
          <p className="text-xs text-slate-400 font-medium">هذا الشهر</p>
        </div>

        {/* Bar Chart Bars */}
        <div className="h-44 flex items-end justify-between gap-3 px-2 pt-6 pb-2">
          {barData.map((item, index) => {
            // max val 100 -> height percentage
            const heightPct = Math.min(100, Math.max(15, (item.val / 100) * 100));
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-[#d83f2a] transition">
                  {item.val}
                </span>
                <div
                  className="w-full max-w-[28px] bg-[#d83f2a] rounded-t-lg group-hover:bg-[#c03320] transition-all duration-300 shadow-sm"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-xs text-slate-400 font-medium mt-1">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
