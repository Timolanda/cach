import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WalletService } from '@/features/wallet/WalletService';
import { Transaction } from '@/types/asset';

interface WalletState {
  address: string | null;
  balance: string;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  address: null,
  balance: '0',
  transactions: [],
  loading: false,
  error: null,
};

export const connectWallet = createAsyncThunk(
  'wallet/connect',
  async () => {
    const walletService = new WalletService();
    const address = await walletService.connectWallet();
    return address;
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to connect wallet';
      });
  },
});

export const { clearError, updateBalance } = walletSlice.actions;
export default walletSlice.reducer; 