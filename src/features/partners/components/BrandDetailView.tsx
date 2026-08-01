import React, { useState } from 'react';
import type { Brand, Branch, Offer, BrandExtraInfo, PromoCode, JobPosition, MenuItem } from '../types/partner.types';
import { PartnerSocialLinks } from './PartnerSocialLinks';
import { BrandExtraInfoView } from './BrandExtraInfoView';

interface BrandDetailViewProps {
  brand: Brand;
  partnerName: string;
  onBack: () => void;
  onEditBrand: () => void;
  onToggleStatus: () => void;
  onDeleteBrand: () => void;
  onAddOffer: () => void;
  onEditOffer: (offer: Offer) => void;
  onDeleteOffer: (offerId: string) => void;
  onAddBranch: () => void;
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch: (branchId: string) => void;
  onToggleBranchStatus: (branch: Branch) => void;
  onSaveExtraInfo?: (extraInfo: BrandExtraInfo) => void;
  onAddPromoCode?: () => void;
  onEditPromoCode?: (promoCode: PromoCode) => void;
  onDeletePromoCode?: (promoCodeId: string) => void;
  onAddJob?: () => void;
  onEditJob?: (job: JobPosition) => void;
  onDeleteJob?: (jobId: string) => void;
  onAddMenuItem?: () => void;
  onEditMenuItem?: (item: MenuItem) => void;
  onDeleteMenuItem?: (itemId: string) => void;
}

type DetailTab =
  | 'overview'
  | 'offers'
  | 'jobs'
  | 'promoCodes'
  | 'menu'
  | 'contact'
  | 'extraInfo'
  | 'branches';

const TAB_ICONS: Record<DetailTab, React.ReactNode> = {
  overview: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  offers: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  jobs: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  promoCodes: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  menu: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  contact: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  extraInfo: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  branches: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
};

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'offers', label: 'العروض' },
  { id: 'jobs', label: 'الوظائف' },
  { id: 'promoCodes', label: 'أكواد الخصم' },
  { id: 'menu', label: 'القائمة' },
  { id: 'contact', label: 'مواقع التواصل' },
  { id: 'extraInfo', label: 'معلومات إضافية' },
  { id: 'branches', label: 'الفروع' },
];

export const BrandDetailView: React.FC<BrandDetailViewProps> = ({
  brand,
  partnerName,
  onBack,
  onEditBrand,
  onToggleStatus,
  onDeleteBrand,
  onAddOffer,
  onEditOffer,
  onDeleteOffer,
  onAddBranch,
  onEditBranch,
  onDeleteBranch,
  onToggleBranchStatus,
  onSaveExtraInfo,
  onAddPromoCode,
  onEditPromoCode,
  onDeletePromoCode,
  onAddJob,
  onEditJob,
  onDeleteJob,
  onAddMenuItem,
  onEditMenuItem,
  onDeleteMenuItem,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const offers = brand.offers || [];
  const branches = brand.branches || [];
  const promoCodes = brand.promoCodes && brand.promoCodes.length > 0 ? brand.promoCodes : [
    {
      id: 'promo-1',
      brandId: brand.id,
      code: 'SAVE20',
      titleAr: 'خصم 20% للعملاء الجدد',
      usageLocation: 'store_and_website' as const,
      status: 'active' as const,
      publishingScope: 'all_branches' as const,
    },
    {
      id: 'promo-2',
      brandId: brand.id,
      code: 'FIRST50',
      titleAr: 'خصم الاشتراك الأول',
      usageLocation: 'website' as const,
      status: 'inactive' as const,
      publishingScope: 'all_branches' as const,
    },
  ];

  const jobs = brand.jobs && brand.jobs.length > 0 ? brand.jobs : [
    {
      id: 'job-1',
      brandId: brand.id,
      titleAr: 'مندوب مبيعات',
      employmentType: 'full_time' as const,
      contactMethods: ['phone' as const],
      status: 'open' as const,
      publishingScope: 'all_branches' as const,
    },
    {
      id: 'job-2',
      brandId: brand.id,
      titleAr: 'مشرف عمليات',
      employmentType: 'part_time' as const,
      contactMethods: ['phone' as const],
      status: 'closed' as const,
      publishingScope: 'all_branches' as const,
    },
  ];

  const menuItems: MenuItem[] = brand.menuItems && brand.menuItems.length > 0 ? brand.menuItems : [
    {
      id: 'menu-1',
      brandId: brand.id,
      nameAr: 'خدمة التوصيل السريع',
      category: 'توصيل',
      price: 25,
      unitType: 'count',
      status: 'available',
      publishingScope: 'all_branches',
    },
    {
      id: 'menu-2',
      brandId: brand.id,
      nameAr: 'باقة التوصيل الشهرية',
      category: 'باقات',
      price: 199,
      unitType: 'quantity',
      status: 'available',
      publishingScope: 'all_branches',
    },
    {
      id: 'menu-3',
      brandId: brand.id,
      nameAr: 'توصيل دولي',
      category: 'توصيل',
      price: 150,
      unitType: 'count',
      status: 'unavailable',
      publishingScope: 'all_branches',
    },
  ];

  return (
    <div className="space-y-5 animate-fadeIn" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
        <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>
          الرئيسية
        </span>
        <span>‹</span>
        <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>
          إدارة الشركاء
        </span>
        <span>‹</span>
        <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>
          {partnerName}
        </span>
        <span>‹</span>
        <span className="text-emerald-600">{brand.nameAr}</span>
      </div>

      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            title="العودة للعلامات التجارية"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="relative shrink-0">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.nameAr}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 bg-white"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-2xl">
                {brand.nameAr.charAt(0)}
              </div>
            )}
            {brand.isFeatured && (
              <div
                className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-400 text-amber-950 border-2 border-white shadow-md flex items-center justify-center text-[10px] font-black z-10"
                title="علامة تجارية مميزة"
              >
                ★
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{brand.nameAr}</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                  brand.status === 'active'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${brand.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                {brand.status === 'active' ? 'نشطة' : 'غير نشطة'}
              </span>
              {brand.isFeatured && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  مميزة
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {brand.categoryName} <span className="text-slate-300">•</span> <span dir="ltr">{brand.nameEn}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onEditBrand}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            تعديل
          </button>
          <button
            onClick={onToggleStatus}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm transition flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {brand.status === 'active' ? 'إيقاف' : 'تفعيل'}
          </button>
          <button
            onClick={onDeleteBrand}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition cursor-pointer"
            title="حذف العلامة التجارية"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-5 border-b border-slate-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'text-emerald-600 border-emerald-600'
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            {TAB_ICONS[tab.id]}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Brand Info Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">معلومات العلامة التجارية</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  الاسم العربية
                </p>
                <p className="text-sm font-extrabold text-slate-900">{brand.nameAr}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  الاسم الإنجليزية
                </p>
                <p className="text-sm font-bold text-slate-700" dir="ltr">
                  {brand.nameEn}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  الوصف العربية
                </p>
                <p className="text-sm font-bold text-slate-700">{brand.descriptionAr || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description in English
                </p>
                <p className="text-sm font-bold text-slate-700" dir="ltr">
                  {brand.descriptionEn || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Status & Settings Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 h-fit">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">الحالة والإعدادات</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 mb-1.5">الحالة</p>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit ${
                    brand.status === 'active'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${brand.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                  {brand.status === 'active' ? 'نشطة' : 'غير نشطة'}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 mb-1.5">التميز</p>
                {brand.isFeatured ? (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600 flex items-center gap-1.5 w-fit">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    علامة مميزة
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 w-fit block">
                    علامة عادية
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Classification Card */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">التصنيف والفئات</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  الفئة الرئيسية
                </p>
                <p className="text-sm font-extrabold text-slate-900">{brand.categoryName || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 mb-1.5">الفئات الفرعية</p>
                {brand.subcategoryNames && brand.subcategoryNames.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {brand.subcategoryNames.map((name) => (
                      <span
                        key={name}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-bold text-slate-400">—</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          {/* Offers Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
            <h3 className="text-base font-extrabold text-slate-900">العروض</h3>
            <button
              onClick={onAddOffer}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة عرض
            </button>
          </div>

          {offers.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center border-t border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-1">لا توجد عروض بعد</h4>
              <p className="text-xs text-slate-400 mb-4">أضف أول عرض لهذه العلامة التجارية ليظهر للمستخدمين.</p>
            </div>
          ) : (
            <table className="w-full text-right">
              <thead>
                <tr className="border-t border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">العنوان</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">الحالة</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">تاريخ البدء</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">تاريخ الانتهاء</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5 text-xs font-extrabold text-slate-900">{offer.titleAr}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit ${
                          offer.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${offer.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {offer.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-500" dir="ltr">
                      {offer.startDate}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-500" dir="ltr">
                      {offer.endDate}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditOffer(offer)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                          title="تعديل العرض"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDeleteOffer(offer.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="حذف العرض"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'branches' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          {/* Branches Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">الفروع</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {branches.length > 0 ? `${branches.length} فرع مسجل` : 'لا توجد فروع مسجلة'}
              </p>
            </div>
            <button
              onClick={onAddBranch}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة فرع
            </button>
          </div>

          {branches.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center border-t border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-1">لا توجد فروع بعد</h4>
              <p className="text-xs text-slate-400">أضف أول فرع لهذه العلامة التجارية.</p>
            </div>
          ) : (
            <table className="w-full text-right">
              <thead>
                <tr className="border-t border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">اسم الفرع</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">العنوان</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">الهاتف</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">الحالة</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => (
                  <tr key={branch.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-extrabold text-slate-900">{branch.nameAr}</p>
                            {branch.isMainBranch && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                                ⭐ فرع رئيسي
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-semibold text-slate-400" dir="ltr">{branch.nameEn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                      <div className="flex flex-col gap-1">
                        <span>{branch.address || '—'}</span>
                        {branch.mapUrl && (
                          <a
                            href={branch.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 hover:underline w-fit"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>فتح الموقع على الخريطة 📍</span>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-500" dir="ltr">
                      {branch.phone || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit ${
                          branch.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${branch.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {branch.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditBranch(branch)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                          title="تعديل الفرع"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onToggleBranchStatus(branch)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                          title={branch.status === 'active' ? 'إخفاء الفرع' : 'إظهار الفرع'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDeleteBranch(branch.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="حذف الفرع"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'promoCodes' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          {/* Promo Codes Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
            <h3 className="text-base font-extrabold text-slate-900">أكواد الخصم</h3>
            <button
              onClick={onAddPromoCode}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة كود خصم</span>
            </button>
          </div>

          {promoCodes.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center border-t border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-1">لا توجد أكواد خصم بعد</h4>
              <p className="text-xs text-slate-400">أضف أول كود خصم لهذه العلامة التجارية ليظهر للمستخدمين.</p>
            </div>
          ) : (
            <table className="w-full text-right">
              <thead>
                <tr className="border-t border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">العنوان</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">الكود</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">مكان الاستخدام</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">الحالة</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-400">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {promoCodes.map((promo) => (
                  <tr key={promo.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5 text-xs font-extrabold text-slate-900">{promo.titleAr}</td>
                    <td className="px-5 py-3.5 font-mono text-xs" dir="ltr">
                      <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-100 w-fit inline-block">
                        {promo.code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-bold text-slate-600">
                      {promo.usageLocation === 'store_and_website'
                        ? 'متجر وموقع'
                        : promo.usageLocation === 'website'
                        ? 'موقع'
                        : 'متجر'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit ${
                          promo.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${promo.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {promo.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditPromoCode && onEditPromoCode(promo)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                          title="تعديل كود الخصم"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDeletePromoCode && onDeletePromoCode(promo.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="حذف كود الخصم"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          {/* Jobs Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">الوظائف والفرص الشاغرة</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {jobs.length > 0 ? `${jobs.length} وظيفة مسجلة` : 'لا توجد وظائف مسجلة'}
              </p>
            </div>
            <button
              onClick={onAddJob}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة وظيفة</span>
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-1">لا توجد وظائف بعد</h4>
              <p className="text-xs text-slate-400">أضف أول وظيفة لهذه العلامة التجارية لتظهر للمتقدمين.</p>
            </div>
          ) : (
            <div className="p-4 sm:p-5 space-y-4 bg-slate-50/50">
              {jobs.map((job) => {
                const hasResponsibilities = (job.responsibilitiesAr && job.responsibilitiesAr.length > 0) || (job.responsibilitiesEn && job.responsibilitiesEn.length > 0);
                const hasRequirements = (job.requirementsAr && job.requirementsAr.length > 0) || (job.requirementsEn && job.requirementsEn.length > 0);
                const hasBenefits = (job.benefitsAr && job.benefitsAr.length > 0) || (job.benefitsEn && job.benefitsEn.length > 0);

                return (
                  <div key={job.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition hover:shadow-md space-y-4">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-extrabold text-slate-900">{job.titleAr}</h4>
                          {job.titleEn && <span className="text-xs font-semibold text-slate-400" dir="ltr">({job.titleEn})</span>}
                          
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                              job.status === 'open'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'open' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            {job.status === 'open' ? 'نشط / مفتوح' : 'مغلق'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                          <span className="px-3 py-1 rounded-lg font-bold bg-sky-50 text-sky-700 border border-sky-100">
                            {job.employmentType === 'full_time'
                              ? 'دوام كامل'
                              : job.employmentType === 'part_time'
                              ? 'دوام جزئي'
                              : job.employmentType === 'hourly'
                              ? 'بالساعة'
                              : job.employmentType === 'contract'
                              ? 'عقد مؤقت'
                              : job.employmentType === 'internship'
                              ? 'تدريب'
                              : 'عن بُعد'}
                          </span>

                          {job.workingHoursAr && (
                            <span className="px-3 py-1 rounded-lg font-bold bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                              <span>⏰</span>
                              <span>{job.workingHoursAr}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => onEditJob && onEditJob(job)}
                          className="p-2 rounded-xl text-slate-500 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                          title="تعديل الوظيفة"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => onDeleteJob && onDeleteJob(job.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200/80 transition cursor-pointer"
                          title="حذف الوظيفة"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    {job.descriptionAr && (
                      <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                        {job.descriptionAr}
                      </p>
                    )}

                    {/* Grid for Responsibilities, Requirements, Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Responsibilities */}
                      {hasResponsibilities && (
                        <div className="bg-rose-50/30 p-3.5 rounded-xl border border-rose-100/60 space-y-2">
                          <h5 className="font-extrabold text-[#d83f2a] flex items-center gap-1.5">
                            <span>📋</span>
                            <span>المهام والمسؤوليات</span>
                          </h5>
                          <ul className="space-y-1 text-slate-700 font-medium">
                            {(job.responsibilitiesAr || []).map((resp, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#d83f2a] font-bold">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Requirements */}
                      {hasRequirements && (
                        <div className="bg-sky-50/30 p-3.5 rounded-xl border border-sky-100/60 space-y-2">
                          <h5 className="font-extrabold text-sky-700 flex items-center gap-1.5">
                            <span>🎯</span>
                            <span>المتطلبات والخبرات</span>
                          </h5>
                          <ul className="space-y-1 text-slate-700 font-medium">
                            {(job.requirementsAr || []).map((req, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-sky-600 font-bold">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Benefits */}
                      {hasBenefits && (
                        <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/60 space-y-2">
                          <h5 className="font-extrabold text-emerald-700 flex items-center gap-1.5">
                            <span>🎁</span>
                            <span>المزايا والفوائد</span>
                          </h5>
                          <ul className="space-y-1 text-slate-700 font-medium">
                            {(job.benefitsAr || []).map((ben, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span>{ben}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Contact Information & Methods Details */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-400 text-[11px]">طرق التواصل:</span>
                        {job.contactMethods?.map((method) => {
                          let icon: React.ReactNode = null;
                          let subDetail = '';
                          let colorStyle = '';
                          let title = '';

                          if (method === 'phone') {
                            title = 'اتصال هاتفي';
                            colorStyle = 'bg-sky-50 text-sky-700 border-sky-200';
                            icon = (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            );
                            subDetail = job.contactDetails?.phone || '';
                          } else if (method === 'whatsapp') {
                            title = 'واتساب';
                            colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                            icon = (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.634-1.156 4.22 4.316-1.131.584.344z"/>
                              </svg>
                            );
                            subDetail = job.contactDetails?.whatsapp || '';
                          } else if (method === 'email') {
                            title = 'البريد الإلكتروني';
                            colorStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                            icon = (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            );
                            subDetail = job.contactDetails?.email || '';
                          }

                          return (
                            <span
                              key={method}
                              title={title}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-extrabold text-xs border ${colorStyle}`}
                            >
                              {icon}
                              {subDetail && <span className="font-mono text-xs" dir="ltr">{subDetail}</span>}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          {/* Menu Header matching Screenshot 2 */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
            <h3 className="text-base font-extrabold text-slate-900">القائمة</h3>
            <button
              onClick={onAddMenuItem}
              className="px-4.5 py-2.5 rounded-xl bg-[#10b981] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة عنصر</span>
            </button>
          </div>

          {menuItems.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center border-t border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-1">لا توجد عناصر في القائمة بعد</h4>
              <p className="text-xs text-slate-400">أضف أول عنصر للقائمة لهذه العلامة التجارية.</p>
            </div>
          ) : (
            <table className="w-full text-right">
              <thead>
                <tr className="border-t border-b border-slate-100 bg-slate-50/60 text-slate-400 font-bold text-[11px]">
                  <th className="px-5 py-3">الاسم</th>
                  <th className="px-5 py-3">الفئة</th>
                  <th className="px-5 py-3">السعر</th>
                  <th className="px-5 py-3">الحالة</th>
                  <th className="px-5 py-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.nameAr} className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 text-xs font-bold">
                            🍽️
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">{item.nameAr}</p>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            النوع: {item.unitType === 'quantity' ? 'كمية' : 'عدد'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200/60 w-fit inline-block">
                        {item.category || 'توصيل'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-extrabold text-emerald-600" dir="ltr">
                      {item.price} د.أ
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit ${
                          item.status === 'available'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'available' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {item.status === 'available' ? 'متاح' : 'غير متاح'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditMenuItem && onEditMenuItem(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                          title="تعديل العنصر"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDeleteMenuItem && onDeleteMenuItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="حذف العنصر"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'contact' && (
        <PartnerSocialLinks
          title="مواقع التواصل"
          name={brand.nameAr}
          avatarUrl={brand.logoUrl}
          socialLinks={brand.socialLinks}
          onBack={onBack}
        />
      )}

      {activeTab === 'extraInfo' && (
        <BrandExtraInfoView
          initialData={brand.extraInfo}
          onSave={onSaveExtraInfo}
        />
      )}

      {activeTab !== 'overview' &&
        activeTab !== 'offers' &&
        activeTab !== 'branches' &&
        activeTab !== 'contact' &&
        activeTab !== 'extraInfo' &&
        activeTab !== 'promoCodes' &&
        activeTab !== 'jobs' &&
        activeTab !== 'menu' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center">
            <p className="text-sm font-bold text-slate-400">لا توجد بيانات متاحة حالياً</p>
          </div>
        )}
    </div>
  );
};
