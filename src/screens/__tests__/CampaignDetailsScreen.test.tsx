import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CampaignDetailsScreen from '../CampaignDetailsScreen';
import api from '../../services/api';

jest.mock('../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: { campaignId: '1' },
  }),
}));

describe('CampaignDetailsScreen', () => {
  const mockCampaign = {
    id: '1',
    name: 'Test Campaign',
    description: 'This is a test campaign',
    goal: 10000,
    raised: 5000,
    daysLeft: 10,
  };

  beforeEach(() => {
    api.get.mockResolvedValueOnce({ data: mockCampaign });
  });

  it('renders correctly', async () => {
    const { getByText } = render(<CampaignDetailsScreen />);

    await waitFor(() => {
      expect(getByText('Test Campaign')).toBeTruthy();
      expect(getByText('This is a test campaign')).toBeTruthy();
      expect(getByText('Goal: $10,000')).toBeTruthy();
      expect(getByText('Raised: $5,000')).toBeTruthy();
      expect(getByText('10 days left')).toBeTruthy();
    });
  });

  it('handles investment', async () => {
    const { getByText, getByPlaceholderText } = render(<CampaignDetailsScreen />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Investment Amount'), '1000');
      fireEvent.press(getByText('Invest'));
    });

    expect(api.post).toHaveBeenCalledWith('/campaigns/1/invest', { amount: 1000 });
  });

  it('handles API error', async () => {
    api.get.mockRejectedValueOnce(new Error('API Error'));

    const { getByText } = render(<CampaignDetailsScreen />);

    await waitFor(() => {
      expect(getByText('Failed to load campaign details')).toBeTruthy();
    });
  });
});

