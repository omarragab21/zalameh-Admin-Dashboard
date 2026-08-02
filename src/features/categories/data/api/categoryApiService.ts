import { authService } from '../../../../core/auth/authService';
import { sendTerminalLog } from '../../../../core/utils/terminalLogger';
import type {
  Category,
  SubCategory,
  PaginationMeta,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateSubCategoryPayload,
  UpdateSubCategoryPayload,
} from '../../domain/entities/category.entity';

const API_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname.endsWith('vercel.app')
    ? '/api/v1'
    : (import.meta.env.VITE_API_BASE_URL || 'https://backend.zalameh.app/api/v1');

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

export interface CategoryResponseMeta {
  hasSubcategoryList: boolean;
  hasSubcategoryCount: boolean;
}

const categoryResponseMeta = new WeakMap<Category, CategoryResponseMeta>();

const hasOwn = (value: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

export function getCategoryResponseMeta(category: Category): CategoryResponseMeta {
  return categoryResponseMeta.get(category) ?? {
    hasSubcategoryList: false,
    hasSubcategoryCount: false,
  };
}

export function setCategoryResponseMeta(
  category: Category,
  meta: CategoryResponseMeta
): void {
  categoryResponseMeta.set(category, meta);
}

function parseNonNegativeInteger(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.floor(parsed);
}

function extractCollectionItems(payload: any, _resourceName: string): any[] {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && payload.data && typeof payload.data === 'object') return [payload.data];
  return [];
}

function extractLastPage(payload: any): number {
  const lastPage = parseNonNegativeInteger(payload?.meta?.last_page);
  return Math.max(lastPage ?? 1, 1);
}

export function extractPaginationMeta(payload: any, itemsLength: number = 0): PaginationMeta {
  const meta = payload?.meta;
  const currentPage = parseNonNegativeInteger(meta?.current_page) ?? 1;
  const lastPage = Math.max(parseNonNegativeInteger(meta?.last_page) ?? 1, 1);
  const perPage = parseNonNegativeInteger(meta?.per_page) ?? 10;
  const total = parseNonNegativeInteger(meta?.total) ?? itemsLength;
  const from = parseNonNegativeInteger(meta?.from) ?? (total > 0 ? 1 : 0);
  const to = parseNonNegativeInteger(meta?.to) ?? itemsLength;

  return {
    currentPage,
    lastPage,
    perPage,
    total,
    from,
    to,
  };
}

/**
 * Helper to extract human-readable error messages from backend API 422/500 JSON responses
 */
function parseApiErrorMessage(errJson: any, fallbackMessage: string): string {
  if (!errJson) return fallbackMessage;

  // 1. Check field specific validation errors (e.g. image, image_file, name_ar, etc.)
  if (errJson.errors && typeof errJson.errors === 'object') {
    const errorKeys = Object.keys(errJson.errors);
    if (errorKeys.length > 0) {
      const firstKey = errorKeys[0];
      const firstErrorArray = errJson.errors[firstKey];
      if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
        return firstErrorArray[0];
      }
    }
  }

  // 2. Check message or error field
  return errJson.message || errJson.error || fallbackMessage;
}

/**
 * Utility mapper to transform API backend responses (Laravel JSON format with translations & is_active) to Category entity
 */
export function mapCategoryFromApi(item: any): Category {
  if (!item || typeof item !== 'object') {
    const emptyCategory: Category = {
      id: `cat-${Date.now()}`,
      nameAr: '',
      nameEn: '',
      status: 'inactive',
      subcategoriesCount: 0,
      subcategories: [],
    };
    categoryResponseMeta.set(emptyCategory, {
      hasSubcategoryList: false,
      hasSubcategoryCount: false,
    });
    return emptyCategory;
  }

  const hasSubcategoryList =
    Array.isArray(item.sub_categories) || Array.isArray(item.subcategories);
  const hasSubcategoryCount = [
    'sub_categories_count',
    'subcategories_count',
    'subCategoriesCount',
    'subcategoriesCount',
  ].some(
    (key) => hasOwn(item, key) && parseNonNegativeInteger(item[key]) !== null
  );

  const subList = Array.isArray(item.sub_categories)
    ? item.sub_categories
    : Array.isArray(item.subcategories)
    ? item.subcategories
    : [];

  const mappedSubs: SubCategory[] = subList.map((sub: any) => mapSubCategoryFromApi(sub, String(item.id || '')));

  const nameAr = typeof item.translations?.ar === 'string'
    ? item.translations.ar
    : item.translations?.ar?.name || item.name_ar || item.nameAr || item.name || '';

  const nameEn = typeof item.translations?.en === 'string'
    ? item.translations.en
    : item.translations?.en?.name || item.name_en || item.nameEn || '';

  const descriptionAr = item.translations?.ar?.description ?? item.description_ar ?? item.descriptionAr ?? item.description ?? '';
  const descriptionEn = item.translations?.en?.description ?? item.description_en ?? item.descriptionEn ?? '';

  const isActive = item.is_active === true || item.is_active === 1 || item.is_active === '1' || item.is_active === 'true' || item.status === 'active' || item.status === 1 || item.status === '1' || item.status === true;

  // Extract count directly from sub_categories_count key in GET /categories payload
  const rawSubCount = parseNonNegativeInteger(
    item.sub_categories_count ??
    item.subcategories_count ??
    item.subCategoriesCount ??
    item.subcategoriesCount
  );

  const subCount = rawSubCount !== null ? rawSubCount : mappedSubs.length;
  const finalSubCount = Math.max(subCount, mappedSubs.length);

  const category: Category = {
    id: String(item.id ?? `cat-${Date.now()}`),
    nameAr,
    nameEn,
    descriptionAr,
    descriptionEn,
    image: item.image_url || item.image || item.image_file || item.icon || '',
    status: isActive ? 'active' : 'inactive',
    subcategoriesCount: finalSubCount,
    subcategories: mappedSubs,
    createdAt: item.created_at || item.createdAt,
    updatedAt: item.updated_at || item.updatedAt,
  };

  categoryResponseMeta.set(category, { hasSubcategoryList, hasSubcategoryCount });
  return category;
}

export function mapSubCategoryFromApi(sub: any, defaultParentId: string = ''): SubCategory {
  if (!sub || typeof sub !== 'object') {
    return {
      id: `sub-${Date.now()}`,
      parentId: defaultParentId,
      nameAr: '',
      nameEn: '',
      status: 'inactive',
    };
  }

  const nameAr = typeof sub.translations?.ar === 'string'
    ? sub.translations.ar
    : sub.translations?.ar?.name || sub.name_ar || sub.nameAr || sub.name || '';

  const nameEn = typeof sub.translations?.en === 'string'
    ? sub.translations.en
    : sub.translations?.en?.name || sub.name_en || sub.nameEn || (sub.name && !/[\u0600-\u06FF]/.test(sub.name) ? sub.name : '');

  const descriptionAr = sub.translations?.ar?.description ?? sub.description_ar ?? sub.descriptionAr ?? sub.description ?? '';
  const descriptionEn = sub.translations?.en?.description ?? sub.description_en ?? sub.descriptionEn ?? '';
  const order = parseNonNegativeInteger(sub.order ?? sub.sort_order ?? sub.position);

  const isActive = sub.is_active === true || sub.is_active === 1 || sub.is_active === '1' || sub.is_active === 'true' || sub.status === 'active' || sub.status === 1 || sub.status === '1' || sub.status === true;

  return {
    id: String(sub.id ?? `sub-${Date.now()}`),
    parentId: String(sub.parent_id ?? sub.category_id ?? sub.parentId ?? defaultParentId),
    nameAr: nameAr || sub.name || 'فئة فرعية',
    nameEn: nameEn || nameAr || sub.name || 'Subcategory',
    descriptionAr,
    descriptionEn,
    image: sub.image_url || sub.image || sub.image_file || '',
    status: isActive ? 'active' : 'inactive',
    order: order ?? undefined,
    createdAt: sub.created_at || sub.createdAt,
    updatedAt: sub.updated_at || sub.updatedAt,
  };
}

/**
 * Low-level HTTP API Service communicating with Zalameh Categories Backend APIs
 */
export const categoryApiService = {
  getHeaders(): HeadersInit {
    const token = authService.getToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async fetchCategoriesPage(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    status?: string
  ): Promise<{ data: Category[]; meta: PaginationMeta }> {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (perPage) params.set('per_page', String(perPage));
    if (search && search.trim()) params.set('search', search.trim());
    if (status && status !== 'all') params.set('status', status);

    const queryStr = params.toString();
    const url = `${API_BASE_URL}/categories${queryStr ? `?${queryStr}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        sendTerminalLog({
          type: 'API_ERROR',
          method: 'GET',
          url,
          status: response.status,
          message: `Failed to fetch categories page: ${response.statusText}`,
        });
        throw new ApiRequestError(
          `Failed to fetch categories page: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      const rawList = extractCollectionItems(data, 'categories');
      const categories = rawList
        .map(mapCategoryFromApi)
        .filter((category) => Boolean(category.nameAr || category.nameEn));
      const meta = extractPaginationMeta(data, categories.length);

      sendTerminalLog({
        type: 'API_RESPONSE',
        method: 'GET',
        url,
        status: response.status,
        data: `Fetched ${categories.length} categories on page ${meta.currentPage} of ${meta.lastPage} (Total: ${meta.total})`,
      });

      return { data: categories, meta };
    } catch (err: any) {
      sendTerminalLog({
        type: 'API_ERROR',
        method: 'GET',
        url,
        message: err.message || String(err),
      });
      throw err;
    }
  },

  async fetchCategories(): Promise<Category[]> {
    const baseUrl = `${API_BASE_URL}/categories`;
    try {
      const categories: Category[] = [];
      let page = 1;
      let lastPage = 1;

      do {
        const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: this.getHeaders(),
        });

        if (!response.ok) {
          sendTerminalLog({
            type: 'API_ERROR',
            method: 'GET',
            url,
            status: response.status,
            message: `Failed to fetch categories: ${response.statusText}`,
          });
          throw new ApiRequestError(
            `Failed to fetch categories: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();
        const rawList = extractCollectionItems(data, 'categories');
        categories.push(...rawList.map(mapCategoryFromApi));
        lastPage = Math.max(lastPage, extractLastPage(data));

        sendTerminalLog({
          type: 'API_RESPONSE',
          method: 'GET',
          url,
          status: response.status,
          data: `Fetched ${rawList.length} categories from page ${page} of ${lastPage}`,
        });

        page += 1;
      } while (page <= lastPage);

      return categories.filter((category) => Boolean(category.nameAr || category.nameEn));
    } catch (err: any) {
      sendTerminalLog({
        type: 'API_ERROR',
        method: 'GET',
        url: baseUrl,
        message: err.message || String(err),
      });
      throw err;
    }
  },

  async fetchCategoryById(categoryId: string): Promise<Category> {
    const url = `${API_BASE_URL}/categories/${encodeURIComponent(categoryId)}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        sendTerminalLog({
          type: 'API_ERROR',
          method: 'GET',
          url,
          status: response.status,
          message: `Failed to fetch category details: ${response.statusText}`,
        });
        throw new ApiRequestError(
          `Failed to fetch category details: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      const rawCategory = data?.data ?? data;

      if (!rawCategory || typeof rawCategory !== 'object' || Array.isArray(rawCategory)) {
        throw new Error('Invalid category details response');
      }

      return mapCategoryFromApi(rawCategory);
    } catch (err: any) {
      sendTerminalLog({
        type: 'API_ERROR',
        method: 'GET',
        url,
        message: err.message || String(err),
      });
      throw err;
    }
  },

  async fetchSubCategoriesByCategoryId(categoryId: string): Promise<SubCategory[]> {
    const baseUrl = `${API_BASE_URL}/sub_categories`;
    try {
      const subCategories: SubCategory[] = [];
      let page = 1;
      let lastPage = 1;

      do {
        const query = new URLSearchParams({ category_id: categoryId });
        if (page > 1) query.set('page', String(page));
        const url = `${baseUrl}?${query.toString()}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: this.getHeaders(),
        });

        if (!response.ok) {
          sendTerminalLog({
            type: 'API_ERROR',
            method: 'GET',
            url,
            status: response.status,
            message: `Failed to fetch subcategories: ${response.statusText}`,
          });
          throw new ApiRequestError(
            `Failed to fetch subcategories: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();
        const rawList = extractCollectionItems(data, 'subcategories');
        subCategories.push(
          ...rawList.map((item: any) => mapSubCategoryFromApi(item, categoryId))
        );
        lastPage = Math.max(lastPage, extractLastPage(data));

        sendTerminalLog({
          type: 'API_RESPONSE',
          method: 'GET',
          url,
          status: response.status,
          data: `Fetched ${rawList.length} subcategories from page ${page} of ${lastPage} for category ${categoryId}`,
        });

        page += 1;
      } while (page <= lastPage);

      return subCategories;
    } catch (err: any) {
      sendTerminalLog({
        type: 'API_ERROR',
        method: 'GET',
        url: baseUrl,
        message: err.message || String(err),
      });
      throw err;
    }
  },

  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    const url = `${API_BASE_URL}/categories`;
    const headers = this.getHeaders();
    let body: any;

    const descAr = payload.descriptionAr ?? '';
    const descEn = payload.descriptionEn ?? '';
    const isActiveBool = payload.status === 'active';

    if (payload.image instanceof File) {
      const formData = new FormData();
      formData.append('name_en', payload.nameEn || payload.nameAr);
      formData.append('name_ar', payload.nameAr || payload.nameEn);
      formData.append('image_file', payload.image);
      formData.append('image', payload.image);
      formData.append('description_en', descEn);
      formData.append('description_ar', descAr);
      formData.append('status', payload.status);
      formData.append('is_active', isActiveBool ? 'true' : 'false');
      body = formData;
    } else {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
      body = JSON.stringify({
        name_en: payload.nameEn || payload.nameAr,
        name_ar: payload.nameAr || payload.nameEn,
        description_en: descEn,
        description_ar: descAr,
        status: payload.status,
        is_active: isActiveBool,
        image: payload.image || '',
        image_file: payload.image || '',
      });
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = parseApiErrorMessage(errJson, 'Failed to create category');
        sendTerminalLog({
          type: 'API_ERROR',
          method: 'POST',
          url,
          status: response.status,
          message: errMsg,
          details: errJson,
        });
        throw new Error(errMsg);
      }

      const resData = await response.json();
      sendTerminalLog({
        type: 'API_RESPONSE',
        method: 'POST',
        url,
        status: response.status,
        data: resData,
      });

      const rawObj = resData.data || resData;
      return mapCategoryFromApi(rawObj);
    } catch (err: any) {
      sendTerminalLog({
        type: 'API_ERROR',
        method: 'POST',
        url,
        message: err.message || String(err),
      });
      throw err;
    }
  },

  async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const url = `${API_BASE_URL}/categories/${encodeURIComponent(id)}`;
    const headers = this.getHeaders();
    const formData = new FormData();

    // Append ONLY the fields that are actually provided in the update payload
    if (payload.nameAr !== undefined) formData.append('name_ar', payload.nameAr);
    if (payload.nameEn !== undefined) formData.append('name_en', payload.nameEn);
    if (payload.descriptionAr !== undefined) formData.append('description_ar', payload.descriptionAr);
    if (payload.descriptionEn !== undefined) formData.append('description_en', payload.descriptionEn);
    
    if (payload.status !== undefined) {
      const isActiveBool = payload.status === 'active';
      formData.append('status', payload.status);
      formData.append('is_active', isActiveBool ? 'true' : 'false');
    }

    if (payload.image instanceof File) {
      formData.append('image_file', payload.image);
      formData.append('image', payload.image);
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = parseApiErrorMessage(errJson, 'Failed to update category');
        sendTerminalLog({
          type: 'API_ERROR',
          method: 'PUT',
          url,
          status: response.status,
          message: errMsg,
          details: errJson,
        });
        throw new Error(errMsg);
      }

      const resData = await response.json();
      sendTerminalLog({
        type: 'API_RESPONSE',
        method: 'PUT',
        url,
        status: response.status,
        data: resData,
      });

      const rawObj = resData.data || resData;
      const normalizedRawObj = rawObj && typeof rawObj === 'object' && !Array.isArray(rawObj)
        ? { ...rawObj, id: rawObj.id ?? id }
        : { id };
      return mapCategoryFromApi(normalizedRawObj);
    } catch (err: any) {
      sendTerminalLog({
        type: 'API_ERROR',
        method: 'PUT',
        url,
        message: err.message || String(err),
      });
      throw err;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    const url = `${API_BASE_URL}/categories/${encodeURIComponent(id)}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        sendTerminalLog({
          type: 'API_ERROR',
          method: 'DELETE',
          url,
          status: response.status,
          message: `Failed to delete category: ${response.statusText}`,
        });
        throw new Error(`Failed to delete category: ${response.statusText}`);
      }

      sendTerminalLog({
        type: 'API_RESPONSE',
        method: 'DELETE',
        url,
        status: response.status,
        message: 'Category deleted successfully',
      });
    } catch (err: any) {
      sendTerminalLog({
        type: 'API_ERROR',
        method: 'DELETE',
        url,
        message: err.message || String(err),
      });
      throw err;
    }
  },

  async createSubCategory(categoryId: string, payload: CreateSubCategoryPayload): Promise<SubCategory> {
    const url = `${API_BASE_URL}/sub_categories`;
    const headers = this.getHeaders();
    const formData = new FormData();

    const isActiveBool = payload.status === 'active';

    formData.append('category_id', categoryId);
    formData.append('name_en', payload.nameEn || payload.nameAr);
    formData.append('name_ar', payload.nameAr || payload.nameEn);
    formData.append('status', payload.status);
    formData.append('is_active', isActiveBool ? 'true' : 'false');
    if (payload.descriptionAr !== undefined) formData.append('description_ar', payload.descriptionAr);
    if (payload.descriptionEn !== undefined) formData.append('description_en', payload.descriptionEn);

    const imageFile = payload.imageFile || (payload.image instanceof File ? payload.image : undefined);
    if (imageFile) {
      formData.append('image_file', imageFile);
      formData.append('image', imageFile);
    } else if (typeof payload.image === 'string' && payload.image) {
      formData.append('image', payload.image);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = parseApiErrorMessage(errJson, 'Failed to create subcategory');
        sendTerminalLog({
          type: 'API_ERROR',
          method: 'POST',
          url,
          status: response.status,
          message: errMsg,
          details: errJson,
        });
        throw new Error(errMsg);
      }

      const resData = await response.json();
      sendTerminalLog({
        type: 'API_RESPONSE',
        method: 'POST',
        url,
        status: response.status,
        data: resData,
      });

      const rawObj = resData.data || resData;
      return mapSubCategoryFromApi(rawObj, categoryId);
    } catch (err: any) {
      sendTerminalLog({
        type: 'API_ERROR',
        method: 'POST',
        url,
        message: err.message || String(err),
      });
      throw err;
    }
  },

  async updateSubCategory(
    categoryId: string,
    subCategoryId: string,
    payload: UpdateSubCategoryPayload
  ): Promise<SubCategory> {
    const url = `${API_BASE_URL}/sub_categories/${encodeURIComponent(subCategoryId)}`;
    const headers = this.getHeaders();
    const formData = new FormData();

    formData.append('category_id', categoryId);
    if (payload.nameAr !== undefined) formData.append('name_ar', payload.nameAr);
    if (payload.nameEn !== undefined) formData.append('name_en', payload.nameEn);
    if (payload.descriptionAr !== undefined) formData.append('description_ar', payload.descriptionAr);
    if (payload.descriptionEn !== undefined) formData.append('description_en', payload.descriptionEn);
    
    if (payload.status !== undefined) {
      const isActiveBool = payload.status === 'active';
      formData.append('status', payload.status);
      formData.append('is_active', isActiveBool ? 'true' : 'false');
    }

    const imageFile = payload.imageFile || (payload.image instanceof File ? payload.image : undefined);
    if (imageFile) {
      formData.append('image_file', imageFile);
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = parseApiErrorMessage(errJson, 'Failed to update subcategory');
        sendTerminalLog({
          type: 'API_ERROR',
          method: 'PUT',
          url,
          status: response.status,
          message: errMsg,
          details: errJson,
        });
        throw new Error(errMsg);
      }

      const resData = await response.json();
      sendTerminalLog({
        type: 'API_RESPONSE',
        method: 'PUT',
        url,
        status: response.status,
        data: resData,
      });

      const rawObj = resData.data || resData;
      const normalizedRawObj = rawObj && typeof rawObj === 'object' && !Array.isArray(rawObj)
        ? {
            ...rawObj,
            id: rawObj.id ?? subCategoryId,
            category_id: rawObj.category_id ?? rawObj.parent_id ?? categoryId,
          }
        : { id: subCategoryId, category_id: categoryId };
      return mapSubCategoryFromApi(normalizedRawObj, categoryId);
    } catch (err: any) {
      sendTerminalLog({
        type: 'API_ERROR',
        method: 'PUT',
        url,
        message: err.message || String(err),
      });
      throw err;
    }
  },

  async deleteSubCategory(_categoryId: string, subCategoryId: string): Promise<void> {
    const url = `${API_BASE_URL}/sub_categories/${encodeURIComponent(subCategoryId)}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        sendTerminalLog({
          type: 'API_ERROR',
          method: 'DELETE',
          url,
          status: response.status,
          message: `Failed to delete subcategory: ${response.statusText}`,
        });
        throw new Error(`Failed to delete subcategory: ${response.statusText}`);
      }

      sendTerminalLog({
        type: 'API_RESPONSE',
        method: 'DELETE',
        url,
        status: response.status,
        message: 'Subcategory deleted successfully',
      });
    } catch (err: any) {
      sendTerminalLog({
        type: 'API_ERROR',
        method: 'DELETE',
        url,
        message: err.message || String(err),
      });
      throw err;
    }
  },

  async uploadCategoryIcon(file: File): Promise<string> {
    return URL.createObjectURL(file);
  },
};
