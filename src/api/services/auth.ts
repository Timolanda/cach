import { api } from '../config';
import { User, LoginParams, RegisterParams } from '@/types/auth';

export const authService = {
  async login(params: LoginParams): Promise<{ token: string; user: User }> {
    const { data } = await api.post('/auth/login', params);
    localStorage.setItem('token', data.token);
    return data;
  },

  async register(params: RegisterParams): Promise<{ token: string; user: User }> {
    const { data } = await api.post('/auth/register', params);
    localStorage.setItem('token', data.token);
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token });
  },

  async resetPassword(email: string): Promise<void> {
    await api.post('/auth/reset-password', { email });
  },

  async updatePassword(token: string, password: string): Promise<void> {
    await api.post('/auth/update-password', { token, password });
  }
}; 