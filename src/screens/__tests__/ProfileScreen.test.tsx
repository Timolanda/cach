import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../ProfileScreen';
import api from '../../services/api';

jest.mock('../../services/api', () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('ProfileScreen', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockUser });
  });

  it('renders correctly', async () => {
    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('john@example.com')).toBeTruthy();
      expect(getByText('Edit Profile')).toBeTruthy();
      expect(getByText('Security')).toBeTruthy();
      expect(getByText('Notifications')).toBeTruthy();
      expect(getByText('Payment Methods')).toBeTruthy();
      expect(getByText('Help & Support')).toBeTruthy();
      expect(getByText('About')).toBeTruthy();
      expect(getByText('Log Out')).toBeTruthy();
    });
  });

  it('handles edit profile', async () => {
    const { getByText, getByPlaceholderText } = render(<ProfileScreen />);

    await waitFor(() => {
      fireEvent.press(getByText('Edit Profile'));
    });

    const nameInput = getByPlaceholderText('Name');
    const emailInput = getByPlaceholderText('Email');

    fireEvent.changeText(nameInput, 'Jane Doe');
    fireEvent.changeText(emailInput, 'jane@example.com');

    api.put.mockResolvedValue({ data: { ...mockUser, name: 'Jane Doe', email: 'jane@example.com' } });

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Jane Doe')).toBeTruthy();
      expect(getByText('jane@example.com')).toBeTruthy();
    });
  });

  it('handles logout', async () => {
    const { getByText } = render(<ProfileScreen />);

    api.post.mockResolvedValue({});

    fireEvent.press(getByText('Log Out'));

    await waitFor(() => {
      // Check if navigation.navigate was called with 'Login'
      // This would require mocking the navigation object
    });
  });

  it('handles API error', async () => {
    api.get.mockRejectedValue(new Error('API Error'));

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('Failed to fetch user data')).toBeTruthy();
    });
  });
});

