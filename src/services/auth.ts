import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh', { refreshToken });
    const { token } = response.data;
    await AsyncStorage.setItem('token', token);
    setAuthToken(token);
    return token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., logout user)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

