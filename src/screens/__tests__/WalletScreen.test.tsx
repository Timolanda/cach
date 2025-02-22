import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import WalletScreen from '../WalletScreen';
import api from '../../services/api';

jest.mock('../../services/api', () => ({
  get: jest.fn(),
}));

describe('WalletScreen', () => {
  const mockBalance = 1000;
  const mockAssets = [
    { id: '1', name: 'Asset 1', amount: 100, value: 500 },
    { id: '2', name: 'Asset 2', amount: 200, value: 1000 },
  ];

  beforeEach(() => {
    api.get.mockImplementation((url) => {
      if (url === '/wallet/balance') {
        return Promise.resolve({ data: { balance: mockBalance } });
      } else if (url === '/wallet/assets') {
        return Promise.resolve({ data: mockAssets });
      }
    });
  });

  it('renders correctly', async () => {
    const { getByText, getAllByText } = render(<WalletScreen />);

    await waitFor(() => {
      expect(getByText('Total Balance')).toBeTruthy();
      expect(getByText(`$${mockBalance.toFixed(2)}`)).toBeTruthy();
      expect(getByText('Your Assets')).toBeTruthy();
      expect(getAllByText('Asset 1')).toBeTruthy();
      expect(getAllByText('Asset 2')).toBeTruthy();
    });
  });

  it('handles refresh correctly', async () => {
    const { getByText } = render(<WalletScreen />);

    await waitFor(() => {
      expect(getByText(`$${mockBalance.toFixed(2)}`)).toBeTruthy();
    });

    api.get.mockImplementation((url) => {
      if (url === '/wallet/balance') {
        return Promise.resolve({ data: { balance: 2000 } });
      } else if (url === '/wallet/assets') {
        return Promise.resolve({ data: [...mockAssets, { id: '3', name: 'Asset 3', amount: 300, value: 1500 }] });
      }
    });

    fireEvent(getByText('Total Balance'), 'refresh');

    await waitFor(() => {
      expect(getByText('$2000.00')).toBeTruthy();
      expect(getByText('Asset 3')).toBeTruthy();
    });
  });

  it('handles API error', async () => {
    api.get.mockRejectedValue(new Error('API Error'));

    const { getByText } = render(<WalletScreen />);

    await waitFor(() => {
      expect(getByText('Failed to fetch wallet data')).toBeTruthy();
    });
  });
});

