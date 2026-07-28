import type { LoginCredentials, LoginResponse, User } from '../types/auth.types';

const TOKEN_KEY = 'zalameh_admin_token';
const USER_KEY = 'zalameh_admin_user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend.zalameh.app/api/v1';

/**
 * Sanitizes input string against Script/HTML/Code injection (XSS & Injection Protection)
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && token.length > 0;
  },

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // 1. Input Sanitization against SQL/Script injection attacks
    const cleanEmail = sanitizeInput(credentials.email);
    const cleanPassword = credentials.password ? credentials.password.trim() : '';

    if (!cleanEmail || !cleanPassword) {
      throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور بشكل صحيح');
    }

    // 2. Real API HTTP Call to backend.zalameh.app/api/v1/login
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: cleanEmail,
        password: cleanPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'فشل تسجيل الدخول، يرجى التأكد من البريد وكلمة المرور');
    }

    // 3. Process Live Backend Response JSON { message, token, user }
    const data: LoginResponse = await response.json();

    if (!data.token || !data.user) {
      throw new Error('استجابة غير صالحة من الخادم');
    }

    // 4. Save actual Token and User received from API
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return { user: data.user, token: data.token };
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
