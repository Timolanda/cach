import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MarketplaceScreen from '../MarketplaceScreen';
import api from '../../services/api';

jest.mock('../../services/api', () => ({
  get: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('MarketplaceScreen', () => {
  const mockAssets = [
    { id: '1', name: 'Asset 1', price: 100, change: 5, type: 'Business', verificationLevel: 'Fully Audited' },
    { id: '2', name: 'Asset 2', price: 200, change: -2, type: 'Music', verificationLevel: '20% Stake' },
    { id: '3', name: 'Asset 3', price: 150, change: 0, type: 'Social Media', verificationLevel: 'No Stake' },
  ];

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockAssets });
  });

  it('renders correctly', async () => {
    const { getByText, getByPlaceholderText, getAllByText } = render(<MarketplaceScreen />);

    await waitFor(() => {
      expect(getByPlaceholderText('Search assets...')).toBeTruthy();
      expect(getByText('Filters & Sort')).toBeTruthy();
      expect(getAllByText('Asset 1')).toBeTruthy();
      expect(getAllByText('Asset 2')).toBeTruthy();
      expect(getAllByText('Asset 3')).toBeTruthy();
    });
  });

  it('handles search input', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<MarketplaceScreen />);

    await waitFor(() => {
      const searchInput = getByPlaceholderText('Search assets...');
      fireEvent.changeText(searchInput, 'Asset 1');
    });

    expect(getByText('Asset 1')).toBeTruthy();
    expect(queryByText('Asset 2')).toBeNull();
    expect(queryByText('Asset 3')).toBeNull();
  });

  it('applies filters correctly', async () => {
    const { getByText, queryByText, getByTestId } = render(<MarketplaceScreen />);

    await waitFor(() => {
      fireEvent.press(getByText('Filters & Sort'));
    });

    fireEvent.press(getByTestId('filter-type-business'));
    fireEvent.press(getByTestId('filter-verification-fully-audited'));
    fireEvent.press(getByText('Apply Filters'));

    expect(getByText('Asset 1')).toBeTruthy();
    expect(queryByText('Asset 2')).toBeNull();
    expect(queryByText('Asset 3')).toBeNull();
  });

  it('sorts assets correctly', async () => {
    const { getByText, getAllByTestId } = render(<MarketplaceScreen />);

    await waitFor(() => {
      fireEvent.press(getByText('Filters & Sort'));
    });

    fireEvent.press(getByText('Sort By'));
    fireEvent.press(getByText('Price (Low to High)'));
    fireEvent.press(getByText('Apply Filters'));

    const assetPrices = getAllByTestId('asset-price').map(node => node.props.children);
    expect(assetPrices).toEqual(['$100.00', '$150.00', '$200.00']);
  });

  it('handles API error', async () => {
    api.get.mockRejectedValue(new Error('API Error'));

    const { getByText } = render(<MarketplaceScreen />);

    await waitFor(() => {
      expect(getByText('Failed to load assets')).toBeTruthy();
    });
  });
});

