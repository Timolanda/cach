import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CrowdfundingScreen from '../CrowdfundingScreen';
import api from '../../services/api';

jest.mock('../../services/api', () => ({
  get: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('CrowdfundingScreen', () => {
  const mockCampaigns = [
    { id: '1', name: 'Campaign 1', goal: 10000, raised: 5000, daysLeft: 10 },
    { id: '2', name: 'Campaign 2', goal: 20000, raised: 15000, daysLeft: 5 },
  ];

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockCampaigns });
  });

  it('renders correctly', async () => {
    const { getByText } = render(<CrowdfundingScreen />);

    await waitFor(() => {
      expect(getByText('Active Crowdfunding Campaigns')).toBeTruthy();
      expect(getByText('Campaign 1')).toBeTruthy();
      expect(getByText('Campaign 2')).toBeTruthy();
      expect(getByText('Start Your Own Campaign')).toBeTruthy();
    });
  });

  it('displays campaign details', async () => {
    const { getByText } = render(<CrowdfundingScreen />);

    await waitFor(() => {
      expect(getByText('Goal: $10,000')).toBeTruthy();
      expect(getByText('Raised: $5,000')).toBeTruthy();
      expect(getByText('10 days left')).toBeTruthy();
    });
  });

  it('navigates to campaign details', async () => {
    const { getByText } = render(<CrowdfundingScreen />);

    await waitFor(() => {
      fireEvent.press(getByText('Campaign 1'));
    });

    // Check if navigation.navigate was called with correct params
    // This would require mocking the navigation object
  });

  it('navigates to create campaign screen', async () => {
    const { getByText } = render(<CrowdfundingScreen />);

    fireEvent.press(getByText('Start Your Own Campaign'));

    // Check if navigation.navigate was called with 'CreateCampaign'
    // This would require mocking the navigation object
  });

  it('handles API error', async () => {
    api.get.mockRejectedValue(new Error('API Error'));

    const { getByText } = render(<CrowdfundingScreen />);

    await waitFor(() => {
      expect(getByText('Failed to load campaigns')).toBeTruthy();
    });
  });
});

