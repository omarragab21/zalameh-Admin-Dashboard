export interface SubCategory {
  id: string;
  parentId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
  status: 'active' | 'inactive';
  order?: number;
  createdAt?: string;
  updatedAt?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export type CategoryFilterStatus = 'all' | 'active' | 'inactive';

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginatedCategoriesResult {
  categories: Category[];
  meta: PaginationMeta;
}

export interface CategoryStats {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  subcategoriesCount: number;
}

export interface CreateCategoryPayload {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  status: 'active' | 'inactive';
  image?: string | File;
}

export interface UpdateCategoryPayload {
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  status?: 'active' | 'inactive';
  image?: string | File;
}

export interface CreateSubCategoryPayload {
  parentId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  status: 'active' | 'inactive';
  image?: string | File;
  imageFile?: File;
}

export interface UpdateSubCategoryPayload {
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  status?: 'active' | 'inactive';
  image?: string | File;
  imageFile?: File;
}
