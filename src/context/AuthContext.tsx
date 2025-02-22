import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '@/types/auth';
import { AuthService } from '@/features/auth/AuthService';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { login, logout, register } from '@/store/slices/authSlice';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (email: string, password: string) => {
    await dispatch(login({ email, password }));
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    await dispatch(register({ email, password, name }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 