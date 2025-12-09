import axios from 'axios';
import { api, publicApi } from '../api';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  roleId: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: {
      name: string;
    };
  };
}

export const authService = {
  async register(data: RegisterData) {
    const response = await publicApi.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await publicApi.post('/auth/login', data);
    const { accessToken } = response.data;
    
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      
      // Get user info
      try {
        // Create a temporary api instance with the token
        const tempApi = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userResponse = await tempApi.get('/auth/me');
        return {
          accessToken,
          user: userResponse.data,
        };
      } catch {
        return { accessToken };
      }
    }
    
    throw new Error('No access token received');
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await publicApi.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await publicApi.post('/auth/reset-password', { token, password });
    return response.data;
  },
};

