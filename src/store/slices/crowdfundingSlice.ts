import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Campaign, Investment } from '@/types/crowdfunding';
import { CrowdfundingService } from '@/features/crowdfunding/CrowdfundingService';

interface CrowdfundingState {
  campaigns: Campaign[];
  investments: Investment[];
  selectedCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
}

const initialState: CrowdfundingState = {
  campaigns: [],
  investments: [],
  selectedCampaign: null,
  loading: false,
  error: null,
};

export const fetchCampaigns = createAsyncThunk(
  'crowdfunding/fetchCampaigns',
  async () => {
    const campaigns = await CrowdfundingService.getCampaigns();
    return campaigns;
  }
);

export const createCampaign = createAsyncThunk(
  'crowdfunding/createCampaign',
  async (campaign: Partial<Campaign>) => {
    const newCampaign = await CrowdfundingService.createCampaign(campaign);
    return newCampaign;
  }
);

const crowdfundingSlice = createSlice({
  name: 'crowdfunding',
  initialState,
  reducers: {
    setSelectedCampaign: (state, action) => {
      state.selectedCampaign = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch campaigns';
      })
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns.push(action.payload);
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create campaign';
      });
  },
});

export const { setSelectedCampaign, clearError } = crowdfundingSlice.actions;
export default crowdfundingSlice.reducer; 