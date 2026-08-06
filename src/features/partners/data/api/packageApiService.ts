import { authService, handleUnauthorizedResponse } from '../../../../core/auth/authService';
import { sendTerminalLog } from '../../../../core/utils/terminalLogger';
import type { PackageItem } from '../../domain/entities/partner.entity';
import type {
  Package,
  PackageDuration,
  PackagePermissions,
  PackageSettings,
} from '../../../packages/types/package.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== '/api/v1'
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.DEV
    ? '/api/v1'
    : 'https://backend.zalameh.app/api/v1';

export class PackageApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'PackageApiRequestError';
    this.status = status;
  }
}

interface ManagementPackageItem extends PackageItem {
  price: number;
  duration: PackageDuration;
  permissions: PackagePermissions;
  settings: PackageSettings;
  createdAt: string;
}

function parseApiErrorMessage(payload: any, fallbackMessage: string): string {
  if (payload?.errors && typeof payload.errors === 'object') {
    const firstError = Object.values(payload.errors).find(Array.isArray);
    if (Array.isArray(firstError) && firstError.length > 0) {
      return String(firstError[0]);
    }
  }

  return payload?.message || payload?.error || fallbackMessage;
}

function parseBoolean(value: unknown, fallback = false): boolean {
  if (value === true || value === 1 || value === '1' || value === 'true' || value === 'active') {
    return true;
  }
  if (value === false || value === 0 || value === '0' || value === 'false' || value === 'inactive') {
    return false;
  }
  return fallback;
}

function parseNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseLimit(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function parseDuration(value: unknown, monthlyPrice: number, yearlyPrice: number): PackageDuration {
  if (value === 'quarterly' || value === 'semi_annual' || value === 'annual' || value === 'monthly') {
    return value;
  }
  return yearlyPrice > 0 && monthlyPrice <= 0 ? 'annual' : 'monthly';
}

function readLocalizedValue(item: any, locale: 'ar' | 'en', field: 'name' | 'description'): string {
  const directValue = item?.[`${field}_${locale}`] ?? item?.[`${field}${locale === 'ar' ? 'Ar' : 'En'}`];
  if (typeof directValue === 'string') return directValue;

  const translation = item?.translations?.[locale];
  if (typeof translation === 'string' && field === 'name') return translation;
  if (translation && typeof translation[field] === 'string') return translation[field];

  return typeof item?.[field] === 'string' ? item[field] : '';
}

function mapFeatures(rawFeatures: unknown): string[] {
  if (!Array.isArray(rawFeatures)) return [];
  return rawFeatures
    .map((feature: any) => {
      if (typeof feature === 'string') return feature;
      return readLocalizedValue(feature, 'ar', 'name') || feature?.title_ar || feature?.title || '';
    })
    .filter((feature): feature is string => Boolean(feature));
}

function mapPackageItem(item: any): ManagementPackageItem {
  const monthlyPrice = parseNumber(item?.monthly_price ?? item?.monthlyPrice);
  const yearlyPrice = parseNumber(item?.yearly_price ?? item?.yearlyPrice);
  const duration = parseDuration(item?.duration ?? item?.billing_cycle ?? item?.period, monthlyPrice, yearlyPrice);
  const permissionsSource = item?.permissions || item?.limits || {};
  const settingsSource = item?.settings || {};
  const isActive = parseBoolean(item?.is_active ?? item?.isActive ?? item?.status);
  const isFeatured = parseBoolean(item?.is_featured ?? item?.isFeatured, false);

  return {
    id: parseNumber(item?.id),
    nameAr: readLocalizedValue(item, 'ar', 'name'),
    nameEn: readLocalizedValue(item, 'en', 'name'),
    monthlyPrice,
    yearlyPrice,
    descriptionAr: readLocalizedValue(item, 'ar', 'description'),
    descriptionEn: readLocalizedValue(item, 'en', 'description'),
    badge: typeof item?.badge === 'string' ? item.badge : undefined,
    isFeatured,
    isActive,
    price: parseNumber(
      item?.price,
      duration === 'annual' ? yearlyPrice : monthlyPrice
    ),
    duration,
    features: mapFeatures(item?.features),
    permissions: {
      maxOffers: parseLimit(permissionsSource.max_offers ?? permissionsSource.maxOffers ?? item?.max_offers),
      maxJobs: parseLimit(permissionsSource.max_jobs ?? permissionsSource.maxJobs ?? item?.max_jobs),
      maxPromoCodes: parseLimit(
        permissionsSource.max_promo_codes ?? permissionsSource.maxPromoCodes ?? item?.max_promo_codes
      ),
      maxMenuItems: parseLimit(
        permissionsSource.max_menu_items ?? permissionsSource.maxMenuItems ?? item?.max_menu_items
      ),
      maxImages: parseLimit(permissionsSource.max_images ?? permissionsSource.maxImages ?? item?.max_images),
    },
    settings: {
      isFeaturedPartner: parseBoolean(
        settingsSource.is_featured_partner ?? settingsSource.isFeaturedPartner ?? item?.is_featured_partner
      ),
      priorityInSearch: parseBoolean(
        settingsSource.priority_in_search ?? settingsSource.priorityInSearch ?? item?.priority_in_search
      ),
      isFeaturedPackage: parseBoolean(
        settingsSource.is_featured_package ?? settingsSource.isFeaturedPackage ?? item?.is_featured_package,
        isFeatured
      ),
      status: isActive ? 'active' : 'inactive',
      displayOrder: parseNumber(
        settingsSource.display_order ?? settingsSource.displayOrder ?? item?.display_order,
        0
      ),
    },
    createdAt: String(item?.created_at ?? item?.createdAt ?? ''),
  };
}

function toPackage(item: ManagementPackageItem): Package {
  return {
    id: String(item.id),
    nameAr: item.nameAr,
    nameEn: item.nameEn,
    descriptionAr: item.descriptionAr,
    descriptionEn: item.descriptionEn,
    price: item.price,
    monthlyPrice: item.monthlyPrice,
    yearlyPrice: item.yearlyPrice,
    duration: item.duration,
    features: item.features || [],
    permissions: item.permissions,
    settings: item.settings,
    createdAt: item.createdAt,
  };
}

function buildPackageFormData(packageData: Partial<Package>): FormData {
  const formData = new FormData();

  if (packageData.nameAr !== undefined) formData.append('name_ar', packageData.nameAr);
  if (packageData.nameEn !== undefined) formData.append('name_en', packageData.nameEn);
  if (packageData.descriptionAr !== undefined) formData.append('description_ar', packageData.descriptionAr);
  if (packageData.descriptionEn !== undefined) formData.append('description_en', packageData.descriptionEn);
  if (packageData.price !== undefined) formData.append('price', String(packageData.price));
  if (packageData.duration !== undefined) formData.append('duration', packageData.duration);

  if (packageData.price !== undefined && packageData.duration === 'monthly') {
    formData.append('monthly_price', String(packageData.price));
  }
  if (packageData.price !== undefined && packageData.duration === 'annual') {
    formData.append('yearly_price', String(packageData.price));
  }

  packageData.features?.forEach((feature, index) => {
    formData.append(`features[${index}]`, feature);
  });

  const permissionFields: Array<[keyof PackagePermissions, string]> = [
    ['maxOffers', 'max_offers'],
    ['maxJobs', 'max_jobs'],
    ['maxPromoCodes', 'max_promo_codes'],
    ['maxMenuItems', 'max_menu_items'],
    ['maxImages', 'max_images'],
  ];
  permissionFields.forEach(([key, apiKey]) => {
    const value = packageData.permissions?.[key];
    if (value !== undefined) formData.append(apiKey, value === null ? '' : String(value));
  });

  if (packageData.settings) {
    formData.append('is_featured_partner', packageData.settings.isFeaturedPartner ? '1' : '0');
    formData.append('priority_in_search', packageData.settings.priorityInSearch ? '1' : '0');
    formData.append('is_featured_package', packageData.settings.isFeaturedPackage ? '1' : '0');
    formData.append('is_featured', packageData.settings.isFeaturedPackage ? '1' : '0');
    formData.append('is_active', packageData.settings.status === 'active' ? '1' : '0');
    formData.append('display_order', String(packageData.settings.displayOrder));
  }

  return formData;
}

async function readError(response: Response, fallbackMessage: string): Promise<PackageApiRequestError> {
  const payload = await response.json().catch(() => ({}));
  const message = parseApiErrorMessage(payload, fallbackMessage);
  if (response.status === 401 || /unauthenticated/i.test(message)) handleUnauthorizedResponse();
  return new PackageApiRequestError(message, response.status);
}

export const packageApiService = {
  getHeaders(): HeadersInit {
    const token = authService.getToken() || '17|EvauKuZOMm2TpgYGiVmhcQndhcLJhGjtx1rzVo94f9eb4825';
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async fetchPackages(): Promise<PackageItem[]> {
    const url = `${API_BASE_URL}/packages`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const fallbackUrl = `${API_BASE_URL}/get_packages`;
        const fbResponse = await fetch(fallbackUrl, {
          method: 'GET',
          headers: this.getHeaders(),
        });
        if (fbResponse.ok) {
          const fbJson = await fbResponse.json();
          return this.mapPackagesResponse(fbJson);
        }
        throw await readError(response, `فشل تحميل الباقات (رمز ${response.status})`);
      }

      const json = await response.json();
      return this.mapPackagesResponse(json);
    } catch (err: any) {
      sendTerminalLog({
        type: 'API_ERROR',
        method: 'GET',
        url,
        message: err.message || 'Error fetching packages',
      });
      if (err instanceof PackageApiRequestError) throw err;
      throw new PackageApiRequestError(err?.message || 'تعذر الاتصال بخادم الباقات', 0);
    }
  },

  mapPackagesResponse(json: any): PackageItem[] {
    const rawList = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    return rawList.map(mapPackageItem);
  },

  async fetchManagementPackages(): Promise<Package[]> {
    const items = (await this.fetchPackages()) as ManagementPackageItem[];
    return items.map(toPackage);
  },

  async createPackage(packageData: Partial<Package>): Promise<Package> {
    const url = `${API_BASE_URL}/packages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: buildPackageFormData(packageData),
    });

    if (!response.ok) {
      throw await readError(response, 'فشل إضافة الباقة');
    }

    const json = await response.json();
    return toPackage(mapPackageItem(json.data || json));
  },

  async updatePackage(packageId: string, packageData: Partial<Package>): Promise<Package> {
    const url = `${API_BASE_URL}/packages/${encodeURIComponent(packageId)}`;
    const formData = buildPackageFormData(packageData);
    formData.append('_method', 'PUT');
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw await readError(response, 'فشل تعديل الباقة');
    }

    const json = await response.json();
    return toPackage(mapPackageItem(json.data || json));
  },

  async deletePackage(packageId: string): Promise<void> {
    const url = `${API_BASE_URL}/packages/${encodeURIComponent(packageId)}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw await readError(response, 'فشل حذف الباقة');
    }
  },
};
