import React from 'react';

export const RecentActivities: React.FC = () => {
  const activities = [
    {
      id: 1,
      text: 'تم إضافة شريك جديد: شركة الرياض للخدمات',
      time: 'منذ 5 دقائق',
      dotColor: 'bg-emerald-500 shadow-emerald-500/30',
    },
    {
      id: 2,
      text: 'تم تفعيل باقة بريميوم للمستخدم: أحمد الشمري',
      time: 'منذ 18 دقيقة',
      dotColor: 'bg-amber-500 shadow-amber-500/30',
    },
    {
      id: 3,
      text: 'تم نشر إعلان جديد في الصفحة الرئيسية',
      time: 'منذ 42 دقيقة',
      dotColor: 'bg-purple-500 shadow-purple-500/30',
    },
    {
      id: 4,
      text: 'تم إضافة فئة جديدة: خدمات التوصيل',
      time: 'منذ ساعة',
      dotColor: 'bg-blue-500 shadow-blue-500/30',
    },
    {
      id: 5,
      text: 'تم تحديث محتوى الصفحة الرئيسية',
      time: 'منذ 3 ساعات',
      dotColor: 'bg-rose-500 shadow-rose-500/30',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-start">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#d83f2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="text-base font-bold text-slate-900">آخر الأنشطة</h2>
        </div>
        <button className="text-xs font-bold text-[#d83f2a] hover:text-[#b83320] transition cursor-pointer">
          عرض الكل
        </button>
      </div>

      {/* Activity Timeline List - Starts from top naturally */}
      <div className="space-y-4">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between py-1.5 group">
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${act.dotColor} shrink-0 shadow-sm`} />
              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#d83f2a] transition">
                {act.text}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium shrink-0">
              {act.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
