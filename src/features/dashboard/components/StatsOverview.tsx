import React from 'react';

export const StatsOverview: React.FC = () => {
  const stats = [
    {
      title: 'إجمالي المستخدمين',
      value: '12,847',
      change: '+8.2%',
      isPositive: true,
      iconBg: 'bg-blue-50 text-blue-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'الشركاء النشطون',
      value: '384',
      change: '+5.1%',
      isPositive: true,
      iconBg: 'bg-emerald-50 text-emerald-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'الباقات المفضلة',
      value: '1,293',
      change: '-2.4%',
      isPositive: false,
      iconBg: 'bg-amber-50 text-amber-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'إجمالي الإيرادات',
      value: '94,200 د.أ',
      change: '+12.5%',
      isPositive: true,
      iconBg: 'bg-rose-50 text-rose-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          {/* Top row: Icon & Change Badge */}
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg}`}>
              {item.icon}
            </div>
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
          </div>

          {/* Bottom row: Value & Title */}
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {item.value}
            </div>
            <div className="text-xs font-bold text-slate-400 mt-1">
              {item.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
