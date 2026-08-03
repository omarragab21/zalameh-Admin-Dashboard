import { authService } from '../../../../core/auth/authService';
import { sendTerminalLog } from '../../../../core/utils/terminalLogger';
import type { PackageItem } from '../../domain/entities/partner.entity';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== '/api/v1'
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.DEV
    ? '/api/v1'
    : 'https://backend.zalameh.app/api/v1';

export const packageApiService = {
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

  async fetchPackages(): Promise<PackageItem[]> {
    const url = `${API_BASE_URL}/packages`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        // Fallback to /get_packages if /packages fails
        const fallbackUrl = `${API_BASE_URL}/get_packages`;
        const fbResponse = await fetch(fallbackUrl, {
          method: 'GET',
          headers: this.getHeaders(),
        });
        if (fbResponse.ok) {
          const fbJson = await fbResponse.json();
          return this.mapPackagesResponse(fbJson);
        }
        throw new Error(`Failed to fetch packages (${response.status})`);
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
      // Return default starter package if backend is unavailable
      return [
        {
          id: 1,
          nameAr: 'زلمة على الخفيف',
          nameEn: 'Zalameh Ala El-Khafeef',
          monthlyPrice: 9,
          yearlyPrice: 90,
          isActive: true,
        },
      ];
    }
  },

  mapPackagesResponse(json: any): PackageItem[] {
    const rawList = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    return rawList.map((item: any) => ({
      id: Number(item.id ?? 1),
      nameAr: item.name_ar || item.translations?.ar || item.name || 'باقة بدون اسم',
      nameEn: item.name_en || item.translations?.en || item.name || 'Unnamed Package',
      monthlyPrice: Number(item.monthly_price ?? 0),
      yearlyPrice: Number(item.yearly_price ?? 0),
      descriptionAr: item.description_ar || item.description || '',
      descriptionEn: item.description_en || item.description || '',
      isActive: item.is_active ?? true,
    }));
  },
};
