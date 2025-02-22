import { api } from '../config';
import { WalletInfo, Transaction } from '@/types/wallet';

export const walletService = {
  async connectWallet(provider: string): Promise<WalletInfo> {
    const { data } = await api.post('/wallet/connect', { provider });
    return data;
  },

  async disconnectWallet(): Promise<void> {
    await api.post('/wallet/disconnect');
  },

  async getBalance(address: string): Promise<string> {
    const { data } = await api.get(`/wallet/balance/${address}`);
    return data.balance;
  },

  async getTransactions(address: string, page = 1): Promise<{
    transactions: Transaction[];
    hasMore: boolean;
  }> {
    const { data } = await api.get(`/wallet/transactions/${address}`, {
      params: { page }
    });
    return data;
  },

  async estimateGas(transaction: Partial<Transaction>): Promise<string> {
    const { data } = await api.post('/wallet/estimate-gas', transaction);
    return data.gasEstimate;
  },

  async signMessage(message: string): Promise<string> {
    const { data } = await api.post('/wallet/sign-message', { message });
    return data.signature;
  }
}; 