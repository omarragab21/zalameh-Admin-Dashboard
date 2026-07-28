import React from 'react';
import type { StaticPage } from '../types/content.types';

interface StaticPagesListProps {
  pages: StaticPage[];
  onViewPage: (page: StaticPage) => void;
  onEditPage: (page: StaticPage) => void;
}

export const StaticPagesList: React.FC<StaticPagesListProps> = ({
  pages,
  onViewPage,
  onEditPage,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* Top Banner Card (Matching Screenshot 4) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            الصفحات الثابتة
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            إدارة محتوى الصفحات الأساسية للتطبيق — {pages.length} صفحات
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#d83f2a] flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      {/* Main Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-xs font-extrabold text-slate-500">
                <th className="py-4 px-6">اسم الصفحة</th>
                <th className="py-4 px-6 text-center">آخر تحديث</th>
                <th className="py-4 px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Column 1: Page Name */}
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-rose-50/80 text-[#d83f2a] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm mb-0.5">
                          {page.titleAr}
                        </h4>
                        <p className="text-xs font-semibold text-slate-400" dir="ltr">
                          {page.titleEn}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Last Updated Date */}
                  <td className="py-5 px-6 text-center">
                    <div className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{page.lastUpdated}</span>
                    </div>
                  </td>

                  {/* Column 3: Actions (View & Edit Pill Buttons) */}
                  <td className="py-5 px-6 text-center">
                    <div className="flex items-center justify-center gap-2.5">
                      {/* View Button */}
                      <button
                        onClick={() => onViewPage(page)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-600 font-extrabold text-xs transition cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>عرض</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEditPage(page)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600 font-extrabold text-xs transition cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>تعديل</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
