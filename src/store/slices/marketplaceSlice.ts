import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Asset, Trade } from '@/types/asset';
import { MarketplaceService } from '@/features/marketplace/MarketplaceService';

interface MarketplaceState {
  assets: Asset[];
  trades: Trade[];
  loading: boolean;
  error: string | null;
}

const initialState: MarketplaceState = {
  assets: [],
  trades: [],
  loading: false,
  error: null,
};

export const fetchMarketplaceAssets = createAsyncThunk(
  'marketplace/fetchAssets',
  async () => {
    const assets = await MarketplaceService.listAssets();
    return assets;
  }
);

export const createTrade = createAsyncThunk(
  'marketplace/createTrade',
  async (trade: Partial<Trade>) => {
    const newTrade = await MarketplaceService.createTrade(trade);
    return newTrade;
  }
);

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketplaceAssets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMarketplaceAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload;
      })
      .addCase(fetchMarketplaceAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch assets';
      })
      .addCase(createTrade.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.trades.push(action.payload);
      })
      .addCase(createTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create trade';
      });
  },
});

export const { clearError } = marketplaceSlice.actions;
export default marketplaceSlice.reducer; 