import React, { useState } from 'react';
import type { StaticPage } from '../types/content.types';

interface ViewPageDetailsProps {
  page: StaticPage;
  onBack: () => void;
  onEdit: () => void;
}

export const ViewPageDetails: React.FC<ViewPageDetailsProps> = ({
  page,
  onBack,
  onEdit,
}) => {
  const [activeLang, setActiveLang] = useState<'ar' | 'en'>('ar');

  const currentHeader = activeLang === 'ar' ? page.pageHeaderAr : page.pageHeaderEn;
  const currentContent = activeLang === 'ar' ? page.contentAr : page.contentEn;

  return (
    <div className="space-y-4 animate-fadeIn" dir="rtl">
      {/* Main Container (Elevation/Shadow removed as requested) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden">
        {/* Top Controls Header Bar */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          {/* Right side: Back Arrow (pointing Right) + Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
              title="رجوع"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {page.titleAr}
              </h2>
              <p className="text-xs font-semibold text-slate-400" dir="ltr">
                {page.titleEn}
              </p>
            </div>
          </div>

          {/* Left side: Language Switcher Tabs + Edit Button */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60">
              <button
                onClick={() => setActiveLang('ar')}
                className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  activeLang === 'ar'
                    ? 'bg-white text-[#d83f2a]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  activeLang === 'en'
                    ? 'bg-white text-[#d83f2a]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={onEdit}
              className="px-5 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-xs shadow-md shadow-[#d83f2a]/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>تعديل الصفحة</span>
            </button>
          </div>
        </div>

        {/* Lower Preview Area with Light Grey Background */}
        <div className="bg-slate-100/70 p-6 sm:p-8">
          {/* Centered Box: Contains Preview Tag and Inner Card Aligned Together */}
          <div className="max-w-2xl mx-auto space-y-2.5">
            {/* Preview Tag: Aligned to the Right edge directly above the Inner Card */}
            <div className="flex items-center justify-start gap-2 text-xs font-extrabold text-slate-400 px-0.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>معاينة كما تظهر داخل التطبيق</span>
            </div>

            {/* Inner Preview Card (Flat border, zero shadow) */}
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
              {/* Inner Subheader */}
              <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
                <span className="font-extrabold text-slate-900 text-sm">
                  {currentHeader}
                </span>
                <div className="w-7 h-7 rounded-xl bg-rose-50 text-[#d83f2a] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>

              {/* Rendered HTML Body */}
              <div
                className="p-6 sm:p-8 prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm space-y-4"
                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                dangerouslySetInnerHTML={{ __html: currentContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
