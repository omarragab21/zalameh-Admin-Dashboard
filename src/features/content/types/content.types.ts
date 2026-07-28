export interface StaticPage {
  id: string;
  titleAr: string;
  titleEn: string;
  pageHeaderAr: string;
  pageHeaderEn: string;
  lastUpdated: string;
  contentAr: string;
  contentEn: string;
}

export type ContentMode = 'list' | 'view' | 'edit';
