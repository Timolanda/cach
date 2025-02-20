import { api } from '../config';
import { User, UserProfile, Notification } from '@/types/user';

export const userService = {
  async updateProfile(profile: Partial<UserProfile>): Promise<User> {
    const { data } = await api.patch('/users/profile', profile);
    return data;
  },

  async getNotifications(page = 1): Promise<{
    notifications: Notification[];
    hasMore: boolean;
  }> {
    const { data } = await api.get('/users/notifications', {
      params: { page }
    });
    return data;
  },

  async markNotificationAsRead(id: string): Promise<void> {
    await api.post(`/users/notifications/${id}/read`);
  },

  async updateNotificationPreferences(preferences: any): Promise<void> {
    await api.put('/users/notification-preferences', preferences);
  },

  async getKYCStatus(): Promise<{
    status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
    message?: string;
  }> {
    const { data } = await api.get('/users/kyc-status');
    return data;
  },

  async submitKYC(formData: FormData): Promise<void> {
    await api.post('/users/kyc', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}; 