import React from 'react';
import type { AdItem } from '../types/ad.types';

interface AdsStatsOverviewProps {
  ads: AdItem[];
}

export const AdsStatsOverview: React.FC<AdsStatsOverviewProps> = ({ ads }) => {
  // Real dynamic calculations based on the actual ads array
  const totalAds = ads.length;
  
  // Unique internal stores count
  const internalStoresSet = new Set(
    ads
      .filter((a) => a.advertiserType === 'STORE')
      .map((a) => a.storeId || a.storeName || a.id)
  );
  const internalAdvertisersCount = internalStoresSet.size;

  // Unique external clients count
  const externalClientsSet = new Set(
    ads
      .filter((a) => a.advertiserType === 'EXTERNAL')
      .map((a) => a.externalAdvertiserName || a.id)
  );
  const externalAdvertisersCount = externalClientsSet.size;

  // Total collected price sum
  const totalAmount = ads.reduce((sum, ad) => sum + (ad.price || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Ads */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between transition hover:shadow-md">
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">
            إجمالي الإعلانات
          </span>
          <span className="text-2xl font-black text-slate-900">{totalAds}</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>
      </div>

      {/* Card 2: Internal Advertisers */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between transition hover:shadow-md">
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">
            المعلنون (داخلي)
          </span>
          <span className="text-2xl font-black text-slate-900">{internalAdvertisersCount} متجر</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>

      {/* Card 3: External Advertisers */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between transition hover:shadow-md">
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">
            المعلنون (خارجي)
          </span>
          <span className="text-2xl font-black text-slate-900">{externalAdvertisersCount} عميل</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      {/* Card 4: Total Amount Collected */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between transition hover:shadow-md">
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">
            المبلغ الإجمالي المحصل
          </span>
          <span className="text-2xl font-black text-slate-900">
            {totalAmount.toLocaleString('en-US')} <span className="text-sm font-bold text-slate-600">د.أ</span>
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
