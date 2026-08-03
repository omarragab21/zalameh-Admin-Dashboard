import React, { useState } from 'react';
import type { AdItem, AdvertiserType, AdStatus, AdPlacementKey, AdPlacementConfig } from '../types/ad.types';
import { ALL_PLACEMENTS_INFO } from '../data/mockAds';
import { partnerApiService } from '../../partners/data/api/partnerApiService';
import type { Partner } from '../../partners/types/partner.types';

interface AdFormProps {
  initialData?: AdItem | null;
  onSave: (adData: Omit<AdItem, 'id' | 'createdAt'> & { id?: string }) => void;
  onCancel: () => void;
}

export const AdForm: React.FC<AdFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [partnersList, setPartnersList] = useState<Partner[]>([]);

  React.useEffect(() => {
    partnerApiService.fetchPartnersPage(1, 100).then((res) => {
      setPartnersList(res.partners);
    }).catch(() => {
      // Fallback empty
    });
  }, []);

  // 1. Advertiser Info
  const [advertiserType, setAdvertiserType] = useState<AdvertiserType>(
    initialData?.advertiserType || 'STORE'
  );
  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    initialData?.storeId || ''
  );
  const [externalAdvertiserName, setExternalAdvertiserName] = useState<string>(
    initialData?.externalAdvertiserName || ''
  );
  const [internalTitle, setInternalTitle] = useState<string>(
    initialData?.internalTitle || ''
  );

  // 2. Content & Links - Default empty image URL if new ad
  const [mainImageUrl, setMainImageUrl] = useState<string>(
    initialData?.mainImageUrl || ''
  );
  const [adLink, setAdLink] = useState<string>(initialData?.adLink || '');
  const [price, setPrice] = useState<number | string>(initialData?.price ?? '');
  const [status, setStatus] = useState<AdStatus>(initialData?.status || 'published');

  // 3. Ad Placement State
  const initialPlacementsMap = (initialData?.placements || []).reduce<Record<string, { startDate: string; endDate: string }>>(
    (acc, p) => {
      acc[p.key] = { startDate: p.startDate, endDate: p.endDate };
      return acc;
    },
    {}
  );

  // All placements default to false (UNCHECKED) when adding a new ad
  const [selectedPlacements, setSelectedPlacements] = useState<Record<string, boolean>>(() => {
    const res: Record<string, boolean> = {};
    ALL_PLACEMENTS_INFO.forEach((item) => {
      res[item.key] = initialData ? !!initialPlacementsMap[item.key] : false;
    });
    return res;
  });

  // Dates default to empty string so standard browser date placeholder (mm/dd/yyyy) is shown
  const [placementDates, setPlacementDates] = useState<Record<string, { startDate: string; endDate: string }>>(() => {
    const res: Record<string, { startDate: string; endDate: string }> = {};
    ALL_PLACEMENTS_INFO.forEach((item) => {
      res[item.key] = {
        startDate: initialPlacementsMap[item.key]?.startDate || '',
        endDate: initialPlacementsMap[item.key]?.endDate || '',
      };
    });
    return res;
  });

  // Store options from partnersList
  const storesList = partnersList.map((p) => ({
    id: p.id,
    name: p.nameAr,
  }));

  const handleTogglePlacement = (key: AdPlacementKey) => {
    setSelectedPlacements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDateChange = (key: AdPlacementKey, field: 'startDate' | 'endDate', val: string) => {
    setPlacementDates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: val,
      },
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine store name
    const selectedStore = storesList.find((s) => s.id === selectedStoreId);
    const storeName = advertiserType === 'STORE' ? selectedStore?.name || 'متجر داخل النظام' : undefined;

    // Collect active placements
    const activePlacements: AdPlacementConfig[] = [];
    ALL_PLACEMENTS_INFO.forEach((item) => {
      if (selectedPlacements[item.key]) {
        activePlacements.push({
          key: item.key,
          labelAr: item.labelAr,
          subLabelAr: item.subLabelAr,
          startDate: placementDates[item.key]?.startDate || '',
          endDate: placementDates[item.key]?.endDate || '',
        });
      }
    });

    onSave({
      id: initialData?.id,
      internalTitle: internalTitle || (advertiserType === 'STORE' ? `${storeName} - إعلان` : externalAdvertiserName),
      advertiserType,
      storeId: advertiserType === 'STORE' ? selectedStoreId : undefined,
      storeName,
      externalAdvertiserName: advertiserType === 'EXTERNAL' ? externalAdvertiserName : undefined,
      mainImageUrl: mainImageUrl || 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&auto=format&fit=crop&q=80',
      adLink,
      price: Number(price) || 0,
      status,
      isActive: initialData?.isActive ?? true,
      placements: activePlacements,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {initialData ? 'تعديل بيانات الإعلان' : 'إضافة إعلان جديد'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إنشاء وإعداد إعلان جديد وتحديد أماكن ظهوره في النظام.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
        >
          رجوع للقائمة
        </button>
      </div>

      {/* SECTION 1: بيانات المعلن والنوع */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
          1. بيانات المعلن والنوع
        </h3>

        {/* Radio Option Cards */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            نوع المعلن <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Store (STORE) */}
            <div
              onClick={() => setAdvertiserType('STORE')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center gap-3 ${
                advertiserType === 'STORE'
                  ? 'border-[#d83f2a] bg-[#d83f2a]/5'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="advertiserType"
                checked={advertiserType === 'STORE'}
                onChange={() => setAdvertiserType('STORE')}
                className="w-4 h-4 text-[#d83f2a] accent-[#d83f2a] focus:ring-[#d83f2a]"
              />
              <div>
                <span className="font-bold text-sm text-slate-900 block">
                  متجر داخل النظام (STORE)
                </span>
              </div>
            </div>

            {/* External (EXTERNAL) */}
            <div
              onClick={() => setAdvertiserType('EXTERNAL')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center gap-3 ${
                advertiserType === 'EXTERNAL'
                  ? 'border-[#d83f2a] bg-[#d83f2a]/5'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="advertiserType"
                checked={advertiserType === 'EXTERNAL'}
                onChange={() => setAdvertiserType('EXTERNAL')}
                className="w-4 h-4 text-[#d83f2a] accent-[#d83f2a] focus:ring-[#d83f2a]"
              />
              <div>
                <span className="font-bold text-sm text-slate-900 block">
                  معلن خارجي (EXTERNAL)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Inputs depending on type - White Background */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {advertiserType === 'STORE' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اختر المتجر <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition cursor-pointer"
              >
                <option value="">-- اختر المتجر من القائمة --</option>
                {storesList.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المعلن الخارجي <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={externalAdvertiserName}
                onChange={(e) => setExternalAdvertiserName(e.target.value)}
                required
                placeholder="أدخل اسم المعلن الخارجي..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition"
              />
            </div>
          )}

          {/* Internal Administrative Title - White Background */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              العنوان الداخلي <span className="text-slate-400 font-normal">(إداري فقط - لا يظهر للمستخدم)</span>
            </label>
            <input
              type="text"
              value={internalTitle}
              onChange={(e) => setInternalTitle(e.target.value)}
              placeholder="مثال: حملة الصيف - إعلان الشوكولاتة"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: محتوى الإعلان والروابط */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
          2. محتوى الإعلان والروابط
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Ad Main Image Upload / Placeholder */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              صورة الإعلان الأساسية <span className="text-rose-500">*</span>
            </label>
            <label className="relative cursor-pointer block border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#d83f2a]/50 transition bg-white flex flex-col items-center justify-center min-h-[160px]">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
              {mainImageUrl ? (
                <div className="relative w-full max-w-xs h-28 rounded-xl overflow-hidden group border border-slate-200">
                  <img src={mainImageUrl} alt="Ad Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <span className="px-3 py-1 bg-white text-slate-800 rounded-lg text-xs font-bold shadow">
                      تغيير الصورة
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-[#d83f2a] flex items-center justify-center mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <span className="font-bold text-xs text-slate-700 block">اضغط لرفع الصورة</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WEBP فقط</span>
                </>
              )}
            </label>
            <div className="mt-2">
              <input
                type="text"
                value={mainImageUrl}
                onChange={(e) => setMainImageUrl(e.target.value)}
                placeholder="أو ضع رابط الصورة هنا (URL)..."
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#d83f2a]"
              />
            </div>
          </div>

          {/* Form Fields: Link, Price, Status */}
          <div className="space-y-4">
            {/* Ad Link */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رابط الإعلان <span className="text-slate-400 font-normal">(اختياري - عدم وجوده يجعله غير قابل للنقر)</span>
              </label>
              <input
                type="url"
                value={adLink}
                onChange={(e) => setAdLink(e.target.value)}
                placeholder="https://"
                dir="ltr"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition text-left"
              />
            </div>

            {/* Ad Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                سعر الإعلان <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="0.00"
                  className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  د.أ
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                يستخدم في التقارير المالية لاحقاً
              </span>
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                حالة الإعلان البدئية
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AdStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition cursor-pointer"
              >
                <option value="published">منشور ومفعل مباشرة (Published)</option>
                <option value="hidden">مخفي / مسودة (Hidden)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: أماكن ظهور الإعلان (Ad Placement) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 mb-1">
            3. أماكن ظهور الإعلان (Ad Placement)
          </h3>
          <p className="text-xs text-slate-500">
            اختر مكاناً أو أكثر، وحدد لكل مكان فترة عرض مستقلة (تاريخ بداية ونهاية). يتوقف الإعلان تلقائياً في كل مكان عند انتهاء تاريخه الخاص.
          </p>
        </div>

        {/* Placement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_PLACEMENTS_INFO.map((item) => {
            const isChecked = !!selectedPlacements[item.key];
            const dates = placementDates[item.key] || { startDate: '', endDate: '' };

            return (
              <div
                key={item.key}
                className={`p-4 rounded-2xl border-2 transition ${
                  isChecked
                    ? 'border-[#d83f2a] bg-white shadow-sm'
                    : 'border-slate-200/80 bg-white'
                }`}
              >
                {/* Header Checkbox & Title - Proper Event Propagation Handling */}
                <div
                  className="flex items-center justify-between cursor-pointer select-none pb-3 border-b border-slate-100"
                  onClick={() => handleTogglePlacement(item.key)}
                >
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block">
                      {item.labelAr}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      {item.subLabelAr}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleTogglePlacement(item.key);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4.5 h-4.5 text-[#d83f2a] accent-[#d83f2a] rounded focus:ring-[#d83f2a] cursor-pointer"
                  />
                </div>

                {/* Dates Inputs when checked */}
                {isChecked && (
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-1">
                    {/* Start Date */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        تاريخ البداية <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={dates.startDate}
                          onChange={(e) => handleDateChange(item.key, 'startDate', e.target.value)}
                          required={isChecked}
                          placeholder="mm/dd/yyyy"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#d83f2a]"
                        />
                      </div>
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        تاريخ النهاية <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={dates.endDate}
                          onChange={(e) => handleDateChange(item.key, 'endDate', e.target.value)}
                          required={isChecked}
                          placeholder="mm/dd/yyyy"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#d83f2a]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
        >
          حفظ الإعلان
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm transition cursor-pointer"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};
