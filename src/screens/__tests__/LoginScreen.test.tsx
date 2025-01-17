import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import api from '../../services/api';

// Mock the navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock the api service
jest.mock('../../services/api', () => ({
  post: jest.fn(),
}));

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    expect(getByText('Login to Cach')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText("Don't have an account? Sign up")).toBeTruthy();
  });

  it('handles input changes', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('handles successful login', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    api.post.mockResolvedValueOnce({ data: { token: 'fake-token' } });

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('Main');
    });
  });

  it('handles login failure', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    api.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(getByText('Invalid email or password')).toBeTruthy();
    });
  });

  it('navigates to registration screen', () => {
    const { getByText } = render(<LoginScreen />);
    
    fireEvent.press(getByText("Don't have an account? Sign up"));

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });
});

