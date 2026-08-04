import { authService } from '../../../../core/auth/authService';
import { sendTerminalLog } from '../../../../core/utils/terminalLogger';
import type { Brand, SocialLinks } from '../../domain/entities/partner.entity';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== '/api/v1'
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.DEV
    ? '/api/v1'
    : 'https://backend.zalameh.app/api/v1';

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

function parseApiErrorMessage(errJson: any, fallbackMessage: string): string {
  if (!errJson) return fallbackMessage;

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

  return errJson.message || errJson.error || fallbackMessage;
}

export function mapBrandFromApi(item: any): Brand {
  if (!item || typeof item !== 'object') {
    return {
      id: `brand-${Date.now()}`,
      partnerId: '',
      nameAr: 'علامة تجارية غير معروفة',
      nameEn: 'Unknown Brand',
      categoryId: '',
      categoryName: 'عام',
      status: 'active',
      isFeatured: false,
      hasDelivery: false,
      rate: 5.0,
      offersCount: 0,
    };
  }

  const subCats = Array.isArray(item.sub_categories) ? item.sub_categories : [];
  const firstSub = subCats[0];
  const catName = firstSub
    ? (typeof firstSub.translations?.ar === 'string'
        ? firstSub.translations.ar
        : firstSub.translations?.ar?.name || firstSub.name || '')
    : '';

  const nameAr = typeof item.translations?.ar === 'string'
    ? item.translations.ar
    : item.translations?.ar?.name || item.name_ar || item.nameAr || item.name || '';
  const nameEn = typeof item.translations?.en === 'string'
    ? item.translations.en
    : item.translations?.en?.name || item.name_en || item.nameEn || item.name || nameAr || '';

  const sloganAr = typeof item.slogan_translations?.ar === 'string'
    ? item.slogan_translations.ar
    : item.slogan_translations?.ar?.name || item.slogan_ar || item.slogan || '';
  const sloganEn = typeof item.slogan_translations?.en === 'string'
    ? item.slogan_translations.en
    : item.slogan_translations?.en?.name || item.slogan_en || item.slogan || sloganAr || '';

  const isFeatured = item.is_featured === true || item.is_featured === 1 || item.is_featured === '1' || item.is_featured === 'true';
  const hasDelivery = item.has_delivery === true || item.has_delivery === 1 || item.has_delivery === '1' || item.has_delivery === 'true';
  const isActive = item.is_active === true || item.is_active === 1 || item.is_active === '1' || item.is_active === 'true' || item.status === 'active' || item.status === 1;

  const socialLinks: SocialLinks = {
    website: item.link_url || '',
    facebook: item.facebook_url || '',
    instagram: item.instagram_url || '',
    snapchat: item.snapchat_url || '',
    twitter: item.x_url || '',
  };

  return {
    id: String(item.id ?? `brand-${Date.now()}`),
    partnerId: String(item.user?.id || item.user_id || ''),
    nameAr: nameAr || 'علامة تجارية بدون اسم',
    nameEn: nameEn || 'Unnamed Brand',
    sloganAr,
    sloganEn,
    descriptionAr: item.description_ar || item.descriptionAr || sloganAr || '',
    descriptionEn: item.description_en || item.descriptionEn || sloganEn || '',
    logoUrl: item.image_url || item.image || item.logoUrl || undefined,
    categoryId: firstSub ? String(firstSub.id) : (item.category_id ? String(item.category_id) : ''),
    categoryName: catName || 'عام',
    subcategoryIds: subCats.map((s: any) => String(s.id)),
    subcategoryNames: subCats.map((s: any) => s.translations?.ar?.name || s.name || ''),
    status: isActive ? 'active' : 'inactive',
    isFeatured,
    hasDelivery,
    rate: Number(item.rate) || 5.0,
    linkUrl: item.link_url || '',
    socialLinks,
    offersCount: Number(item.offers_count ?? (Array.isArray(item.offers) ? item.offers.length : 0)) || 0,
    offers: Array.isArray(item.offers) ? item.offers : [],
    branches: Array.isArray(item.branches) ? item.branches : [],
  };
}

export const brandApiService = {
  getHeaders(): HeadersInit {
    const token = authService.getToken();
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async fetchBrandsByPartnerId(partnerId: string): Promise<Brand[]> {
    const url = `${API_BASE_URL}/brands?user_id=${encodeURIComponent(partnerId)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const message = parseApiErrorMessage(errorJson, `فشل تحميل العلامات التجارية (رمز ${response.status})`);
        sendTerminalLog({ type: 'API_ERROR', method: 'GET', url, status: response.status, message });
        throw new ApiRequestError(message, response.status);
      }

      const json = await response.json();
      const rawData = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
      const brands = rawData.map((item: any) => mapBrandFromApi(item));

      sendTerminalLog({
        type: 'API_RESPONSE',
        method: 'GET',
        url,
        status: response.status,
        data: { partnerId, count: brands.length },
      });

      return brands;
    } catch (err: any) {
      if (err instanceof ApiRequestError) throw err;
      const msg = err?.message || 'تعذر الاتصال بخادم العلامات التجارية';
      sendTerminalLog({ type: 'API_ERROR', method: 'GET', url, status: 0, message: msg });
      throw new ApiRequestError(msg, 0);
    }
  },

  async createBrand(brandData: Partial<Brand> & { partnerId: string }): Promise<Brand> {
    const url = `${API_BASE_URL}/brands`;

    try {
      const formData = new FormData();
      formData.append('user_id', brandData.partnerId);
      formData.append('name_ar', brandData.nameAr || brandData.nameEn || '');
      formData.append('name_en', brandData.nameEn || brandData.nameAr || '');
      
      if (brandData.sloganAr) formData.append('slogan_ar', brandData.sloganAr);
      if (brandData.sloganEn) formData.append('slogan_en', brandData.sloganEn);
      if (brandData.linkUrl) formData.append('link_url', brandData.linkUrl);
      
      formData.append('rate', brandData.rate !== undefined ? String(brandData.rate) : '5.0');
      formData.append('has_delivery', brandData.hasDelivery ? '1' : '0');
      formData.append('is_featured', brandData.isFeatured ? '1' : '0');
      formData.append('is_active', brandData.status === 'active' ? '1' : '0');

      if (brandData.socialLinks) {
        if (brandData.socialLinks.facebook) formData.append('facebook_url', brandData.socialLinks.facebook);
        if (brandData.socialLinks.snapchat) formData.append('snapchat_url', brandData.socialLinks.snapchat);
        if (brandData.socialLinks.twitter) formData.append('x_url', brandData.socialLinks.twitter);
        if (brandData.socialLinks.instagram) formData.append('instagram_url', brandData.socialLinks.instagram);
      }

      // Add category_ids array
      const selectedCatIds = brandData.subcategoryIds && brandData.subcategoryIds.length > 0
        ? brandData.subcategoryIds
        : brandData.categoryId ? [brandData.categoryId] : [];
      
      selectedCatIds.forEach((catId, index) => {
        formData.append(`category_ids[${index}]`, catId);
      });

      if (brandData.imageFile) {
        formData.append('image_file', brandData.imageFile);
        formData.append('image', brandData.imageFile);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const message = parseApiErrorMessage(errorJson, 'فشل إضافة العلامة التجارية الجديدة');
        sendTerminalLog({ type: 'API_ERROR', method: 'POST', url, status: response.status, message, details: errorJson });
        throw new ApiRequestError(message, response.status);
      }

      const json = await response.json();
      const created = mapBrandFromApi(json.data || json);
      sendTerminalLog({ type: 'API_RESPONSE', method: 'POST', url, status: response.status, data: { brandId: created.id } });
      return created;
    } catch (err: any) {
      if (err instanceof ApiRequestError) throw err;
      throw new ApiRequestError(err?.message || 'فشل إضافة العلامة التجارية', 0);
    }
  },

  async updateBrand(brandId: string, brandData: Partial<Brand>): Promise<Brand> {
    const url = `${API_BASE_URL}/brands/${encodeURIComponent(brandId)}`;

    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      if (brandData.partnerId) formData.append('user_id', brandData.partnerId);
      if (brandData.nameAr !== undefined) formData.append('name_ar', brandData.nameAr);
      if (brandData.nameEn !== undefined) formData.append('name_en', brandData.nameEn);
      if (brandData.sloganAr !== undefined) formData.append('slogan_ar', brandData.sloganAr);
      if (brandData.sloganEn !== undefined) formData.append('slogan_en', brandData.sloganEn);
      if (brandData.linkUrl !== undefined) formData.append('link_url', brandData.linkUrl);
      if (brandData.rate !== undefined) formData.append('rate', String(brandData.rate));
      if (brandData.hasDelivery !== undefined) formData.append('has_delivery', brandData.hasDelivery ? '1' : '0');
      if (brandData.isFeatured !== undefined) formData.append('is_featured', brandData.isFeatured ? '1' : '0');
      if (brandData.status !== undefined) formData.append('is_active', brandData.status === 'active' ? '1' : '0');

      if (brandData.socialLinks) {
        if (brandData.socialLinks.facebook !== undefined) formData.append('facebook_url', brandData.socialLinks.facebook);
        if (brandData.socialLinks.snapchat !== undefined) formData.append('snapchat_url', brandData.socialLinks.snapchat);
        if (brandData.socialLinks.twitter !== undefined) formData.append('x_url', brandData.socialLinks.twitter);
        if (brandData.socialLinks.instagram !== undefined) formData.append('instagram_url', brandData.socialLinks.instagram);
      }

      const selectedCatIds = brandData.subcategoryIds && brandData.subcategoryIds.length > 0
        ? brandData.subcategoryIds
        : brandData.categoryId ? [brandData.categoryId] : [];
      
      selectedCatIds.forEach((catId, index) => {
        formData.append(`category_ids[${index}]`, catId);
      });

      if (brandData.imageFile) {
        formData.append('image_file', brandData.imageFile);
        formData.append('image', brandData.imageFile);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const message = parseApiErrorMessage(errorJson, 'فشل تعديل العلامة التجارية');
        sendTerminalLog({ type: 'API_ERROR', method: 'PUT', url, status: response.status, message });
        throw new ApiRequestError(message, response.status);
      }

      const json = await response.json();
      const updated = mapBrandFromApi(json.data || json);
      sendTerminalLog({ type: 'API_RESPONSE', method: 'PUT', url, status: response.status, data: { brandId: updated.id } });
      return updated;
    } catch (err: any) {
      if (err instanceof ApiRequestError) throw err;
      throw new ApiRequestError(err?.message || 'فشل تعديل العلامة التجارية', 0);
    }
  },

  async deleteBrand(brandId: string): Promise<void> {
    const url = `${API_BASE_URL}/brands/${encodeURIComponent(brandId)}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const message = parseApiErrorMessage(errorJson, 'فشل حذف العلامة التجارية');
        sendTerminalLog({ type: 'API_ERROR', method: 'DELETE', url, status: response.status, message });
        throw new ApiRequestError(message, response.status);
      }

      sendTerminalLog({ type: 'API_RESPONSE', method: 'DELETE', url, status: response.status, data: { brandId } });
    } catch (err: any) {
      if (err instanceof ApiRequestError) throw err;
      throw new ApiRequestError(err?.message || 'فشل حذف العلامة التجارية', 0);
    }
  },
};
