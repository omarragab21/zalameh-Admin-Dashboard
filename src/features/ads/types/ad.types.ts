export type AdvertiserType = 'STORE' | 'EXTERNAL';

export type AdStatus = 'published' | 'hidden';

export type AdPlacementKey =
  | 'hero_banner'
  | 'moving_banner'
  | 'offers_page'
  | 'featured_partners'
  | 'promo_codes'
  | 'jobs_page';

export interface AdPlacementConfig {
  key: AdPlacementKey;
  labelAr: string;
  subLabelAr: string;
  startDate: string;
  endDate: string;
}

export interface AdItem {
  id: string;
  internalTitle: string; // العنوان الداخلي (إداري فقط)
  advertiserType: AdvertiserType; // STORE | EXTERNAL
  storeId?: string; // ID of selected store
  storeName?: string; // Display name of store
  externalAdvertiserName?: string; // Display name of external client
  mainImageUrl: string; // صورة الإعلان الأساسية
  adLink?: string; // رابط الإعلان (اختياري)
  price: number; // سعر الإعلان (د.أ)
  status: AdStatus; // published | hidden
  isActive: boolean; // تفعيل / إلغاء (Toggle Switch)
  placements: AdPlacementConfig[];
  createdAt: string;
}

export type AdFilterPlacement = 'all' | AdPlacementKey;
export type AdFilterStatus = 'all' | AdStatus;
export type AdFilterType = 'all' | AdvertiserType;
