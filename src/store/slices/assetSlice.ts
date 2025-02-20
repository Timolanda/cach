import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Asset, TokenizationRequest } from '@/types/asset';
import { TokenizationService } from '@/features/tokenization/TokenizationService';

interface AssetState {
  assets: Asset[];
  selectedAsset: Asset | null;
  loading: boolean;
  error: string | null;
}

const initialState: AssetState = {
  assets: [],
  selectedAsset: null,
  loading: false,
  error: null,
};

export const tokenizeAsset = createAsyncThunk(
  'assets/tokenize',
  async (request: TokenizationRequest) => {
    const asset = await TokenizationService.tokenizeAsset(request);
    return asset;
  }
);

const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setSelectedAsset: (state, action) => {
      state.selectedAsset = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tokenizeAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(tokenizeAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.assets.push(action.payload);
      })
      .addCase(tokenizeAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Tokenization failed';
      });
  },
});

export const { setSelectedAsset, clearError } = assetSlice.actions;
export default assetSlice.reducer; 