export interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
