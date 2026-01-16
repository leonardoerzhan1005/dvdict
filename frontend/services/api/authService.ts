import { API_CONFIG } from '../../config/api';
import { apiPost, apiGet, apiPatch, setAuthTokens, clearAuthTokens } from './base';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_email_verified: boolean;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginResponse {
  user: User;
  tokens: TokenPair;
}

export interface RegisterResponse {
  user: User;
}

export interface ProfileResponse {
  user: User;
}

export interface ProfileUpdateRequest {
  name?: string;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiPost<RegisterResponse>(
      API_CONFIG.getAuthUrl('/auth/register'),
      data,
      false
    );
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiPost<LoginResponse>(
      API_CONFIG.getAuthUrl('/auth/login'),
      data,
      false
    );
    
    setAuthTokens(response.tokens.access_token, response.tokens.refresh_token);
    return response;
  },

  logout: async (refreshToken: string): Promise<void> => {
    try {
      await apiPost(API_CONFIG.getAuthUrl('/auth/logout'), {
        refresh_token: refreshToken,
      });
    } finally {
      clearAuthTokens();
    }
  },

  refresh: async (refreshToken: string): Promise<TokenPair> => {
    const response = await apiPost<{ tokens: TokenPair }>(
      API_CONFIG.getAuthUrl('/auth/refresh'),
      { refresh_token: refreshToken },
      false
    );
    
    setAuthTokens(response.tokens.access_token, response.tokens.refresh_token);
    return response.tokens;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    return apiGet<ProfileResponse>(API_CONFIG.getAuthUrl('/profile'));
  },

  updateProfile: async (data: ProfileUpdateRequest): Promise<ProfileResponse> => {
    return apiPatch<ProfileResponse>(API_CONFIG.getAuthUrl('/profile'), data);
  },

  forgotPassword: async (email: string): Promise<void> => {
    return apiPost(API_CONFIG.getAuthUrl('/auth/password/forgot'), { email }, false);
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    return apiPost(
      API_CONFIG.getAuthUrl('/auth/password/reset'),
      { token, new_password: newPassword },
      false
    );
  },

  verifyEmail: async (token: string): Promise<void> => {
    return apiPost(API_CONFIG.getAuthUrl('/auth/email/verify'), { token }, false);
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    return apiPost(
      API_CONFIG.getAuthUrl('/profile/password/change'),
      { current_password: currentPassword, new_password: newPassword }
    );
  },
};
