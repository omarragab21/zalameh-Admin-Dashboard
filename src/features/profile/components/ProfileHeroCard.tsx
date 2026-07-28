import React from 'react';
import { useAuth } from '../../../core/auth/AuthContext';

export const ProfileHeroCard: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.name || 'محمد أحمد الشمري';
  const roleName = user?.role === 'admin' ? 'مدير النظام الرئيسي' : user?.role || 'مدير النظام الرئيسي';
  const initial = userName.charAt(0);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right w-full">
        {/* Avatar with Red Badge & Camera Overlay */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#d83f2a] rounded-2xl flex items-center justify-center font-extrabold text-3xl sm:text-4xl text-white shadow-lg shadow-[#d83f2a]/25">
            {initial}
          </div>
          <button
            type="button"
            className="absolute -bottom-1.5 -left-1.5 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center border-2 border-white shadow hover:bg-slate-800 transition cursor-pointer"
            title="تغيير الصورة الشخصية"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* User Info & Status Badges */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {userName}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-400">
            {roleName}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              مشرف عام
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200/60 text-xs font-medium flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              عضو منذ يناير 2023
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
