export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  provider: string;
  isConnected: boolean;
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  type: 'send' | 'receive' | 'trade' | 'stake' | 'unstake';
}

export interface WalletState {
  address: string | null;
  balance: string;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
} 