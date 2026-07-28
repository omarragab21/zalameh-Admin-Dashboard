import React, { useState } from 'react';
import type { StaticPage } from '../types/content.types';

interface EditPageFormProps {
  page: StaticPage;
  onSave: (updatedPage: StaticPage) => void;
  onCancel: () => void;
}

export const EditPageForm: React.FC<EditPageFormProps> = ({
  page,
  onSave,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');
  const [headerAr, setHeaderAr] = useState(page.pageHeaderAr);
  const [headerEn, setHeaderEn] = useState(page.pageHeaderEn);
  const [contentAr, setContentAr] = useState(page.contentAr);
  const [contentEn, setContentEn] = useState(page.contentEn);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...page,
      pageHeaderAr: headerAr,
      pageHeaderEn: headerEn,
      contentAr,
      contentEn,
      lastUpdated: new Date().toLocaleDateString('ar-EG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* Top Header Row with Title, Back Button, and Save / Cancel Actions */}
      <div className="flex items-center justify-between gap-4">
        {/* Right side: Back Arrow (pointing Right) + Page Edit Title & Subtitle aligned Right */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
            title="رجوع"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="text-right">
            <h2 className="text-xl font-extrabold text-slate-900">
              تعديل: {page.titleAr}
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5 text-right">
              {page.titleEn}
            </p>
          </div>
        </div>

        {/* Left side: Save & Cancel Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-sm transition cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleFormSubmit}
            className="px-6 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </div>

      {/* Main Edit Form Container */}
      <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden">
        {/* Language Tabs */}
        <div className="flex border-b border-slate-100 px-6 pt-2 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('ar')}
            className={`py-3.5 px-6 text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
              activeTab === 'ar'
                ? 'border-[#d83f2a] text-[#d83f2a]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={`py-3.5 px-6 text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
              activeTab === 'en'
                ? 'border-[#d83f2a] text-[#d83f2a]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            English
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {/* Arabic Fields */}
          {activeTab === 'ar' && (
            <>
              {/* Field 1: Page Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  عنوان الصفحة
                </label>
                <input
                  type="text"
                  value={headerAr}
                  onChange={(e) => setHeaderAr(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold"
                />
              </div>

              {/* Field 2: Rich Page Content with Toolbar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  محتوى الصفحة
                </label>
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {/* Toolbar */}
                  <div className="flex items-center gap-2 p-3 bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 flex-wrap">
                    {/* Format selector */}
                    <select className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold text-slate-700 cursor-pointer">
                      <option>تنسيق ▾</option>
                      <option>عنوان رئيسي (H2)</option>
                      <option>عنوان فرعي (H3)</option>
                      <option>فقرة (Paragraph)</option>
                    </select>

                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded font-black text-slate-800" title="Bold">
                      B
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded italic text-slate-800" title="Italic">
                      I
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded underline text-slate-800" title="Underline">
                      U
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded text-slate-800" title="Horizontal Line">
                      —
                    </button>

                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded text-slate-800" title="Numbered List">
                      1.
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded text-slate-800" title="Bullet List">
                      •
                    </button>

                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded text-slate-800" title="Link">
                      🔗
                    </button>
                  </div>

                  {/* Textarea Box */}
                  <textarea
                    rows={12}
                    value={contentAr}
                    onChange={(e) => setContentAr(e.target.value)}
                    className="w-full p-5 text-sm font-semibold text-slate-800 focus:outline-none resize-y leading-relaxed"
                    placeholder="أدخل محتوى الصفحة هنا..."
                  />
                </div>
              </div>
            </>
          )}

          {/* English Fields */}
          {activeTab === 'en' && (
            <div dir="ltr" className="text-left">
              {/* Field 1: Page Title */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={headerEn}
                  onChange={(e) => setHeaderEn(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/30 focus:border-[#d83f2a] transition font-semibold"
                />
              </div>

              {/* Field 2: Rich Page Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Page Content
                </label>
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {/* Toolbar */}
                  <div className="flex items-center gap-2 p-3 bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 flex-wrap">
                    <select className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold text-slate-700 cursor-pointer">
                      <option>Format ▾</option>
                      <option>Heading (H2)</option>
                      <option>Subheading (H3)</option>
                      <option>Paragraph</option>
                    </select>

                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded font-black text-slate-800">
                      B
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded italic text-slate-800">
                      I
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded underline text-slate-800">
                      U
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded text-slate-800">
                      —
                    </button>

                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded text-slate-800">
                      1.
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/60 rounded text-slate-800">
                      •
                    </button>
                  </div>

                  <textarea
                    rows={12}
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    className="w-full p-5 text-sm font-semibold text-slate-800 focus:outline-none resize-y leading-relaxed"
                    placeholder="Enter page content here..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
