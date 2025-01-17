import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AssetDetailsScreen from '../AssetDetailsScreen';
import api from '../../services/api';

jest.mock('../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: { assetId: '1' },
  }),
}));

describe('AssetDetailsScreen', () => {
  const mockAsset = {
    id: '1',
    name: 'Test Asset',
    price: 100,
    change: 5,
    description: 'This is a test asset',
    type: 'Business',
    verificationLevel: 'Fully Audited',
  };

  beforeEach(() => {
    api.get.mockResolvedValueOnce({ data: mockAsset });
  });

  it('renders correctly', async () => {
    const { getByText } = render(<AssetDetailsScreen />);

    await waitFor(() => {
      expect(getByText('Test Asset')).toBeTruthy();
      expect(getByText('Current Price: $100.00')).toBeTruthy();
      expect(getByText('24h Change: +5.00%')).toBeTruthy();
      expect(getByText('This is a test asset')).toBeTruthy();
      expect(getByText('Type: Business')).toBeTruthy();
      expect(getByText('Verification Level: Fully Audited')).toBeTruthy();
    });
  });

  it('handles buy action', async () => {
    const { getByText, getByPlaceholderText } = render(<AssetDetailsScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Amount'), '10');
      fireEvent.press(getByText('Buy'));
    });

    expect(api.post).toHaveBeenCalledWith('/trades', {
      assetId: '1',
      action: 'buy',
      amount: 10,
    });
  });

  it('handles sell action', async () => {
    const { getByText, getByPlaceholderText } = render(<AssetDetailsScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Amount'), '5');
      fireEvent.press(getByText('Sell'));
    });

    expect(api.post).toHaveBeenCalledWith('/trades', {
      assetId: '1',
      action: 'sell',
      amount: 5,
    });
  });

  it('handles API error', async () => {
    api.get.mockRejectedValueOnce(new Error('API Error'));

    const { getByText } = render(<AssetDetailsScreen />);

    await waitFor(() => {
      expect(getByText('Failed to load asset details')).toBeTruthy();
    });
  });
});

