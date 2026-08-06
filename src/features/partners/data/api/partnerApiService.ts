import { authService, handleUnauthorizedResponse } from '../../../../core/auth/authService';
import { sendTerminalLog } from '../../../../core/utils/terminalLogger';
import type {
  Partner,
  PartnerStatus,
  PaginationMeta,
  CreatePartnerPayload,
  UpdatePartnerPayload,
  PartnerFilterStatus,
} from '../../domain/entities/partner.entity';
import { PartnerStatusEnum } from '../../domain/entities/partner.entity';
import { mapBrandFromApi } from './brandApiService';

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

function parseNonNegativeInteger(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.floor(parsed);
}

function parseStatus(statusVal: any): PartnerStatus {
  if (statusVal === PartnerStatusEnum.ACTIVE || statusVal === '1' || statusVal === 'active' || statusVal === true) {
    return 'active';
  }
  if (statusVal === PartnerStatusEnum.PENDING || statusVal === '2' || statusVal === 'pending') {
    return 'pending';
  }
  if (statusVal === PartnerStatusEnum.INACTIVE || statusVal === '0' || statusVal === 'inactive' || statusVal === false) {
    return 'inactive';
  }
  return 'inactive';
}

function encodeStatusToNumber(statusStr?: PartnerStatus): number {
  if (statusStr === 'active') return PartnerStatusEnum.ACTIVE; // 1
  if (statusStr === 'pending') return PartnerStatusEnum.PENDING; // 2
  return PartnerStatusEnum.INACTIVE; // 0
}



export function extractPaginationMeta(payload: any, itemsLength: number = 0): PaginationMeta {
  const meta = payload?.meta;
  const currentPage = parseNonNegativeInteger(meta?.current_page) ?? 1;
  const lastPage = Math.max(parseNonNegativeInteger(meta?.last_page) ?? 1, 1);
  const perPage = parseNonNegativeInteger(meta?.per_page) ?? 15;
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

export function mapPartnerFromApi(item: any): Partner {
  if (!item || typeof item !== 'object') {
    return {
      id: `partner-${Date.now()}`,
      nameAr: 'شريك غير معروف',
      nameEn: 'Unknown Partner',
      email: '',
      phone: '',
      plan: 'basic',
      planName: 'أساسية',
      rating: 5.0,
      status: 'inactive',
      createdAt: new Date().toISOString(),
      brandsCount: 0,
    };
  }

  const rawStatus = item.status ?? item.is_active;
  const partnerStatus = parseStatus(rawStatus);

  const packageName = item.package_name || item.plan_name || item.planName || '';

  let plan: Partner['plan'] = 'basic';
  if (packageName.includes('سوبر') || packageName.toLowerCase().includes('featured')) {
    plan = 'featured';
  } else if (packageName.toLowerCase().includes('pro') || packageName.toLowerCase().includes('professional')) {
    plan = 'professional';
  } else if (packageName.toLowerCase().includes('vip') || packageName.toLowerCase().includes('enterprise')) {
    plan = 'enterprise';
  }

  const nameAr = item.name_ar || item.nameAr || item.name || item.name_en || '';
  const nameEn = item.name_en || item.nameEn || item.name || nameAr || '';

  const rawBrands = Array.isArray(item.brands) ? item.brands : [];
  const brands = rawBrands.map((b: any) => mapBrandFromApi(b));

  const brandsCount = parseNonNegativeInteger(
    item.brands_count ?? (Array.isArray(item.brands) ? item.brands.length : 0)
  ) ?? brands.length;

  return {
    id: String(item.id ?? `partner-${Date.now()}`),
    nameAr: nameAr || 'شريك بدون اسم',
    nameEn: nameEn || 'Unnamed Partner',
    descriptionAr: item.description_ar ?? item.descriptionAr ?? '',
    descriptionEn: item.description_en ?? item.descriptionEn ?? '',
    email: item.email || '',
    phone: item.phone_number || item.phone || '',
    avatarUrl: item.image_url || item.image || item.avatar_url || item.avatarUrl || undefined,
    plan,
    planName: packageName,
    role: item.role || 'shop',
    rating: parseNonNegativeInteger(item.rating) ?? 5.0,
    status: partnerStatus,
    createdAt: item.created_at || item.createdAt || new Date().toISOString(),
    updatedAt: item.updated_at || item.updatedAt,
    brandsCount,
    brands,
  };
}

export const partnerApiService = {
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

  async fetchPartnersPage(
    page: number = 1,
    perPage: number = 15,
    search?: string,
    statusFilter?: PartnerFilterStatus
  ): Promise<{ partners: Partner[]; meta: PaginationMeta }> {
    const queryParams = new URLSearchParams();
    queryParams.set('page', page.toString());
    queryParams.set('per_page', perPage.toString());

    if (search && search.trim()) {
      queryParams.set('search', search.trim());
    }

    if (statusFilter && statusFilter !== 'all') {
      queryParams.set('status', encodeStatusToNumber(statusFilter).toString());
    }

    const url = `${API_BASE_URL}/partners?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const message = parseApiErrorMessage(errorJson, `فشل تحميل قائمة الشركاء (رمز ${response.status})`);
        sendTerminalLog({ type: 'API_ERROR', method: 'GET', url, status: response.status, message });
        throw new ApiRequestError(message, response.status);
      }

      const json = await response.json();
      const rawData = Array.isArray(json.data) ? json.data : json ? [json] : [];
      const partners = rawData.map((item: any) => mapPartnerFromApi(item));
      const meta = extractPaginationMeta(json, partners.length);

      sendTerminalLog({
        type: 'API_RESPONSE',
        method: 'GET',
        url,
        status: response.status,
        data: { count: partners.length, page: meta.currentPage, total: meta.total },
      });

      return { partners, meta };
    } catch (err: any) {
      if (err instanceof ApiRequestError) throw err;
      const msg = err?.message || 'تعذر الاتصال بخادم الشركاء';
      sendTerminalLog({ type: 'API_ERROR', method: 'GET', url, status: 0, message: msg });
      throw new ApiRequestError(msg, 0);
    }
  },

  async fetchPartnerById(id: string): Promise<Partner> {
    const url = `${API_BASE_URL}/partners/${id}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const message = parseApiErrorMessage(errorJson, `لم يتم العثور على الشريك (${id})`);
        throw new ApiRequestError(message, response.status);
      }

      const json = await response.json();
      const partner = mapPartnerFromApi(json.data || json);
      sendTerminalLog({ type: 'API_RESPONSE', method: 'GET', url, status: response.status, data: { partnerId: partner.id } });
      return partner;
    } catch (err: any) {
      if (err instanceof ApiRequestError) throw err;
      throw new ApiRequestError(err?.message || 'تعذر استرجاع بيانات الشريك', 0);
    }
  },

  async createPartner(payload: CreatePartnerPayload): Promise<Partner> {
    const url = `${API_BASE_URL}/partners`;

    try {
      const formData = new FormData();
      formData.append('name_ar', payload.nameAr);
      formData.append('name_en', payload.nameEn || payload.nameAr);
      formData.append('email', payload.email);
      formData.append('phone_number', payload.phone);
      if (payload.password) {
        formData.append('password', payload.password);
      }
      if (payload.descriptionAr) {
        formData.append('description_ar', payload.descriptionAr);
      }
      if (payload.descriptionEn) {
        formData.append('description_en', payload.descriptionEn);
      }
      const statusNum = encodeStatusToNumber(payload.status || 'active');
      formData.append('status', statusNum.toString());
      formData.append('is_active', statusNum === 1 ? '1' : '0');

      if (payload.packageId !== undefined && payload.packageId !== null) {
        formData.append('package_id', payload.packageId.toString());
      } else {
        formData.append('package_id', '1');
      }

      if (payload.billingCycle) {
        formData.append('billing_cycle', payload.billingCycle);
      } else {
        formData.append('billing_cycle', 'monthly');
      }

      const fileToUpload = payload.imageFile || (payload.avatarUrl instanceof File ? payload.avatarUrl : undefined);
      if (fileToUpload) {
        formData.append('image_file', fileToUpload);
        formData.append('image', fileToUpload);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const message = parseApiErrorMessage(errorJson, 'فشل إضافة الشريك الجديد');
        sendTerminalLog({ type: 'API_ERROR', method: 'POST', url, status: response.status, message });
        throw new ApiRequestError(message, response.status);
      }

      const json = await response.json();
      const created = mapPartnerFromApi(json.data || json);
      sendTerminalLog({ type: 'API_RESPONSE', method: 'POST', url, status: response.status, data: { partnerId: created.id } });
      return created;
    } catch (err: any) {
      if (err instanceof ApiRequestError) throw err;
      throw new ApiRequestError(err?.message || 'فشل إضافة الشريك', 0);
    }
  },

  async updatePartner(id: string, payload: UpdatePartnerPayload): Promise<Partner> {
    const url = `${API_BASE_URL}/partners/${id}`;

    try {
      const fileToUpload = payload.imageFile || (payload.avatarUrl instanceof File ? payload.avatarUrl : undefined);

      let body: any;
      let headers = this.getHeaders();
      let method = 'PUT';

      if (fileToUpload) {
        method = 'POST';
        const formData = new FormData();
        formData.append('_method', 'PUT');
        if (payload.nameAr !== undefined) formData.append('name_ar', payload.nameAr);
        if (payload.nameEn !== undefined) formData.append('name_en', payload.nameEn);
        if (payload.email !== undefined) formData.append('email', payload.email);
        if (payload.phone !== undefined) formData.append('phone_number', payload.phone);
        if (payload.password !== undefined) formData.append('password', payload.password);
        if (payload.descriptionAr !== undefined) formData.append('description_ar', payload.descriptionAr);
        if (payload.descriptionEn !== undefined) formData.append('description_en', payload.descriptionEn);
        if (payload.status !== undefined) {
          const statusNum = encodeStatusToNumber(payload.status);
          formData.append('status', statusNum.toString());
          formData.append('is_active', statusNum === 1 ? '1' : '0');
        }
        if (payload.packageId !== undefined) formData.append('package_id', payload.packageId.toString());
        if (payload.billingCycle !== undefined) formData.append('billing_cycle', payload.billingCycle);
        formData.append('image_file', fileToUpload);
        formData.append('image', fileToUpload);
        body = formData;
      } else {
        (headers as Record<string, string>)['Content-Type'] = 'application/json';
        const bodyObj: Record<string, any> = { _method: 'PUT' };
        if (payload.nameAr !== undefined) bodyObj.name_ar = payload.nameAr;
        if (payload.nameEn !== undefined) bodyObj.name_en = payload.nameEn;
        if (payload.email !== undefined) bodyObj.email = payload.email;
        if (payload.phone !== undefined) bodyObj.phone_number = payload.phone;
        if (payload.password !== undefined) bodyObj.password = payload.password;
        if (payload.descriptionAr !== undefined) bodyObj.description_ar = payload.descriptionAr;
        if (payload.descriptionEn !== undefined) bodyObj.description_en = payload.descriptionEn;
        if (payload.status !== undefined) {
          const statusNum = encodeStatusToNumber(payload.status);
          bodyObj.status = statusNum;
          bodyObj.is_active = statusNum === 1 ? 1 : 0;
        }
        if (payload.packageId !== undefined) bodyObj.package_id = payload.packageId;
        if (payload.billingCycle !== undefined) bodyObj.billing_cycle = payload.billingCycle;
        if (typeof payload.avatarUrl === 'string' && payload.avatarUrl) bodyObj.image_url = payload.avatarUrl;
        body = JSON.stringify(bodyObj);
      }

      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const message = parseApiErrorMessage(errorJson, 'فشل تحديث بيانات الشريك');
        sendTerminalLog({ type: 'API_ERROR', method: 'PUT', url, status: response.status, message });
        throw new ApiRequestError(message, response.status);
      }

      const json = await response.json();
      const updated = mapPartnerFromApi(json.data || json);
      sendTerminalLog({ type: 'API_RESPONSE', method: 'PUT', url, status: response.status, data: { partnerId: updated.id } });
      return updated;
    } catch (err: any) {
      if (err instanceof ApiRequestError) throw err;
      throw new ApiRequestError(err?.message || 'فشل تعديل بيانات الشريك', 0);
    }
  },

  async deletePartner(id: string): Promise<void> {
    const url = `${API_BASE_URL}/partners/${id}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorizedResponse();
        }
        const errorJson = await response.json().catch(() => ({}));
        const message = parseApiErrorMessage(errorJson, 'فشل حذف الشريك');
        sendTerminalLog({ type: 'API_ERROR', method: 'DELETE', url, status: response.status, message });
        throw new ApiRequestError(message, response.status);
      }

      sendTerminalLog({ type: 'API_RESPONSE', method: 'DELETE', url, status: response.status, data: { partnerId: id } });
    } catch (err: any) {
      if (err instanceof ApiRequestError) throw err;
      throw new ApiRequestError(err?.message || 'حدث خطأ أثناء حذف الشريك', 0);
    }
  },
};
