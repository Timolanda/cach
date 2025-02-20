import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateCampaignScreen from '../CreateCampaignScreen';
import api from '../../services/api';

jest.mock('../../services/api', () => ({
  post: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('CreateCampaignScreen', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<CreateCampaignScreen />);

    expect(getByText('Create a New Campaign')).toBeTruthy();
    expect(getByPlaceholderText('Campaign Name')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByPlaceholderText('Funding Goal ($)')).toBeTruthy();
    expect(getByPlaceholderText('Duration (days)')).toBeTruthy();
    expect(getByText('Create Campaign')).toBeTruthy();
  });

  it('handles input changes', () => {
    const { getByPlaceholderText } = render(<CreateCampaignScreen />);

    const nameInput = getByPlaceholderText('Campaign Name');
    const descriptionInput = getByPlaceholderText('Description');
    const goalInput = getByPlaceholderText('Funding Goal ($)');
    const durationInput = getByPlaceholderText('Duration (days)');

    fireEvent.changeText(nameInput, 'Test Campaign');
    fireEvent.changeText(descriptionInput, 'This is a test campaign');
    fireEvent.changeText(goalInput, '10000');
    fireEvent.changeText(durationInput, '30');

    expect(nameInput.props.value).toBe('Test Campaign');
    expect(descriptionInput.props.value).toBe('This is a test campaign');
    expect(goalInput.props.value).toBe('10000');
    expect(durationInput.props.value).toBe('30');
  });

  it('submits the form successfully', async () => {
    const { getByText, getByPlaceholderText } = render(<CreateCampaignScreen />);

    fireEvent.changeText(getByPlaceholderText('Campaign Name'), 'Test Campaign');
    fireEvent.changeText(getByPlaceholderText('Description'), 'This is a test campaign');
    fireEvent.changeText(getByPlaceholderText('Funding Goal ($)'), '10000');
    fireEvent.changeText(getByPlaceholderText('Duration (days)'), '30');

    api.post.mockResolvedValueOnce({});

    fireEvent.press(getByText('Create Campaign'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/campaigns', {
        name: 'Test Campaign',
        description: 'This is a test campaign',
        goal: 10000,
        duration: 30,
      });
    });
  });

  it('handles API error', async () => {
    const { getByText, getByPlaceholderText } = render(<CreateCampaignScreen />);

    fireEvent.changeText(getByPlaceholderText('Campaign Name'), 'Test Campaign');
    fireEvent.changeText(getByPlaceholderText('Description'), 'This is a test campaign');
    fireEvent.changeText(getByPlaceholderText('Funding Goal ($)'), '10000');
    fireEvent.changeText(getByPlaceholderText('Duration (days)'), '30');

    api.post.mockRejectedValueOnce(new Error('API Error'));

    fireEvent.press(getByText('Create Campaign'));

    await waitFor(() => {
      expect(getByText('Failed to create campaign. Please try again.')).toBeTruthy();
    });
  });
});

