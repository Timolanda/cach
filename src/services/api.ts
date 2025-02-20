import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.cach.io'; // Replace with your actual API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

const cache = new Map();

api.interceptors.request.use(async (config) => {
  const cachedResponse = await AsyncStorage.getItem(config.url);
  if (cachedResponse) {
    const { data, expiry } = JSON.parse(cachedResponse);
    if (expiry > Date.now()) {
      return Promise.resolve({
        ...config,
        data,
        headers: {
          ...config.headers,
          'Cache-Control': 'max-age=3600',
        },
      });
    }
  }
  return config;
});

api.interceptors.response.use(
  async (response) => {
    if (response.config.method === 'get') {
      const expiry = Date.now() + 60 * 60 * 1000; // Cache for 1 hour
      await AsyncStorage.setItem(
        response.config.url,
        JSON.stringify({ data: response.data, expiry })
      );
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

