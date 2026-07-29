import React from 'react';
import type { AdItem } from '../types/ad.types';

interface AdDetailModalProps {
  ad: AdItem | null;
  onClose: () => void;
}

export const AdDetailModal: React.FC<AdDetailModalProps> = ({ ad, onClose }) => {
  if (!ad) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 space-y-0">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-bold text-slate-400 block">تفاصيل الإعلان</span>
            <h3 className="text-base font-extrabold text-slate-900">{ad.internalTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Image & Main Specs */}
          <div className="flex items-center gap-4">
            <img
              src={ad.mainImageUrl}
              alt={ad.internalTitle}
              className="w-24 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">
                  {ad.advertiserType === 'STORE' ? ad.storeName : ad.externalAdvertiserName}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ad.advertiserType === 'STORE'
                      ? 'bg-sky-50 text-sky-600 border border-sky-100'
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}
                >
                  {ad.advertiserType === 'STORE' ? 'داخلي (STORE)' : 'خارجي (EXTERNAL)'}
                </span>
              </div>

              <div className="text-xs text-slate-500 font-semibold">
                السعر: <span className="text-slate-900 font-bold">{ad.price.toLocaleString()} د.أ</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {ad.status === 'published' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                    • منشور
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200/80">
                    • مخفي
                  </span>
                )}
                {ad.isActive ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">مفعل</span>
                ) : (
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">معطل</span>
                )}
              </div>
            </div>
          </div>

          {/* Ad Link */}
          {ad.adLink && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 block mb-0.5">رابط الإعلان</span>
              <a
                href={ad.adLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#d83f2a] hover:underline break-all dir-ltr block text-left"
              >
                {ad.adLink}
              </a>
            </div>
          )}

          {/* Placement Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2">أماكن ظهور الإعلان والفترات:</h4>
            <div className="space-y-2">
              {ad.placements.map((p) => (
                <div key={p.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-800 block">{p.labelAr}</span>
                    <span className="text-slate-400 text-[11px] block">{p.subLabelAr}</span>
                  </div>
                  <div className="text-left font-bold text-slate-600 text-[11px]">
                    <div>من: {p.startDate}</div>
                    <div>إلى: {p.endDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
