import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { User } from '@/types/auth';

export class AuthService {
  private static readonly TOKEN_KEY = '@auth_token';
  private static readonly API_URL = process.env.NEXT_PUBLIC_API_URL;

  static async login(email: string, password: string): Promise<User> {
    try {
      const response = await axios.post(`${this.API_URL}/auth/login`, {
        email,
        password,
      });
      await this.setToken(response.data.token);
      return response.data.user;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  static async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    try {
      const response = await axios.post(`${this.API_URL}/auth/register`, userData);
      await this.setToken(response.data.token);
      return response.data.user;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  private static async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(this.TOKEN_KEY, token);
  }

  static async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(this.TOKEN_KEY);
  }

  static async logout(): Promise<void> {
    await AsyncStorage.removeItem(this.TOKEN_KEY);
  }
} 