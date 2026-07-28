import React from 'react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'إضافة شريك',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'إنشاء باقة',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'إضافة فئة',
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 4H5m14 4H5M19 7H5" />
        </svg>
      ),
    },
    {
      title: 'نشر إعلان',
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.684A1.761 1.761 0 013 12V8a1.76 1.76 0 012.436-1.684l.43.14M11 5.882L15 4h.01A2.5 2.5 0 0118 6.5v11a2.5 2.5 0 01-2.99 2.45L11 18.118" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-[#d83f2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h2 className="text-base font-bold text-slate-900">الإجراءات السريعة</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((act, i) => (
          <button
            key={i}
            className="p-3.5 rounded-xl border border-slate-200/70 hover:border-[#d83f2a]/40 bg-slate-50/40 hover:bg-white flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer shadow-none hover:shadow-md"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${act.iconBg}`}>
              {act.icon}
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-[#d83f2a] transition">
              {act.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
