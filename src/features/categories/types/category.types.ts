export interface SubCategory {
  id: string;
  parentId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
  status: 'active' | 'inactive';
  subcategoriesCount: number;
  subcategories: SubCategory[];
}

export type CategoryFilterStatus = 'all' | 'active' | 'inactive';
