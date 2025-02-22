export interface User {
  id: string;
  email: string;
  name: string;
  walletAddress?: string;
  isEmailVerified: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  createdAt: string;
  updatedAt: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
} 