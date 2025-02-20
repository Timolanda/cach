import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TokenizeAssetScreen from '../TokenizeAssetScreen';
import api from '../../services/api';

jest.mock('../../services/api', () => ({
  post: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('TokenizeAssetScreen', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<TokenizeAssetScreen />);

    expect(getByText('Tokenize Your Asset')).toBeTruthy();
    expect(getByPlaceholderText('Asset Name')).toBeTruthy();
    expect(getByPlaceholderText('Asset Description')).toBeTruthy();
    expect(getByPlaceholderText('Asset Type (e.g., Business, Idea, Music Album)')).toBeTruthy();
    expect(getByPlaceholderText('Total Shares')).toBeTruthy();
    expect(getByPlaceholderText('Initial Share Price ($)')).toBeTruthy();
    expect(getByText('Tokenize Asset')).toBeTruthy();
  });

  it('handles input changes', () => {
    const { getByPlaceholderText } = render(<TokenizeAssetScreen />);

    const nameInput = getByPlaceholderText('Asset Name');
    const descriptionInput = getByPlaceholderText('Asset Description');
    const typeInput = getByPlaceholderText('Asset Type (e.g., Business, Idea, Music Album)');
    const sharesInput = getByPlaceholderText('Total Shares');
    const priceInput = getByPlaceholderText('Initial Share Price ($)');

    fireEvent.changeText(nameInput, 'Test Asset');
    fireEvent.changeText(descriptionInput, 'This is a test asset');
    fireEvent.changeText(typeInput, 'Business');
    fireEvent.changeText(sharesInput, '1000');
    fireEvent.changeText(priceInput, '10');

    expect(nameInput.props.value).toBe('Test Asset');
    expect(descriptionInput.props.value).toBe('This is a test asset');
    expect(typeInput.props.value).toBe('Business');
    expect(sharesInput.props.value).toBe('1000');
    expect(priceInput.props.value).toBe('10');
  });

  it('submits the form successfully', async () => {
    const { getByText, getByPlaceholderText } = render(<TokenizeAssetScreen />);

    fireEvent.changeText(getByPlaceholderText('Asset Name'), 'Test Asset');
    fireEvent.changeText(getByPlaceholderText('Asset Description'), 'This is a test asset');
    fireEvent.changeText(getByPlaceholderText('Asset Type (e.g., Business, Idea, Music Album)'), 'Business');
    fireEvent.changeText(getByPlaceholderText('Total Shares'), '1000');
    fireEvent.changeText(getByPlaceholderText('Initial Share Price ($)'), '10');

    api.post.mockResolvedValueOnce({});

    fireEvent.press(getByText('Tokenize Asset'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/assets/tokenize', {
        name: 'Test Asset',
        description: 'This is a test asset',
        type: 'Business',
        totalShares: 1000,
        initialSharePrice: 10,
      });
    });
  });

  it('handles API error', async () => {
    const { getByText, getByPlaceholderText } = render(<TokenizeAssetScreen />);

    fireEvent.changeText(getByPlaceholderText('Asset Name'), 'Test Asset');
    fireEvent.changeText(getByPlaceholderText('Asset Description'), 'This is a test asset');
    fireEvent.changeText(getByPlaceholderText('Asset Type (e.g., Business, Idea, Music Album)'), 'Business');
    fireEvent.changeText(getByPlaceholderText('Total Shares'), '1000');
    fireEvent.changeText(getByPlaceholderText('Initial Share Price ($)'), '10');

    api.post.mockRejectedValueOnce(new Error('API Error'));

    fireEvent.press(getByText('Tokenize Asset'));

    await waitFor(() => {
      expect(getByText('Failed to tokenize asset. Please try again.')).toBeTruthy();
    });
  });
});

