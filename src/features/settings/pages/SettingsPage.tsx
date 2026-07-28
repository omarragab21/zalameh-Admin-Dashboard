import React from 'react';

export const SettingsPage: React.FC = () => {
  const settingsCategories = [
    {
      title: 'الإعدادات العامة',
      desc: 'اسم المنصة، اللغة الافتراضية، المنطقة الزمنية',
      colorBg: 'bg-blue-50 text-blue-600 border-blue-100',
      linkColor: 'text-blue-600 hover:text-blue-700',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.6 9h16.8M3.6 15h16.8" />
        </svg>
      ),
    },
    {
      title: 'إعدادات الإشعارات',
      desc: 'تخصيص وإدارة إشعارات البريد والرسائل',
      colorBg: 'bg-amber-50 text-amber-600 border-amber-100',
      linkColor: 'text-amber-600 hover:text-amber-700',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      title: 'الأمان والخصوصية',
      desc: 'كلمات المرور، المصادقة الثنائية، صلاحيات الوصول',
      colorBg: 'bg-[#d83f2a]/10 text-[#d83f2a] border-[#d83f2a]/20',
      linkColor: 'text-[#d83f2a] hover:text-[#b83320]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: 'إعدادات البريد الإلكتروني',
      desc: 'خادم SMTP، قوالب البريد، عنوان الإرسال',
      colorBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      linkColor: 'text-emerald-600 hover:text-emerald-700',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'مظهر المنصة',
      desc: 'الألوان، الخطوط، الشعار الهوية البصرية',
      colorBg: 'bg-purple-50 text-purple-600 border-purple-100',
      linkColor: 'text-purple-600 hover:text-purple-700',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      title: 'النسخ الاحتياطي',
      desc: 'جدولة النسخ الاحتياطية واستعادة البيانات',
      colorBg: 'bg-slate-100 text-slate-600 border-slate-200',
      linkColor: 'text-slate-600 hover:text-slate-800',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-cairo">
      {/* 6 Settings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {settingsCategories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header: Title & Icon */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#d83f2a] transition">
                  {cat.title}
                </h3>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${cat.colorBg}`}>
                  {cat.icon}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                {cat.desc}
              </p>
            </div>

            {/* Bottom Action Link */}
            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-start">
              <button
                type="button"
                className={`text-xs font-bold transition flex items-center gap-1 cursor-pointer ${cat.linkColor}`}
              >
                <span>تعديل الإعدادات</span>
                <span className="text-base font-normal">←</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
