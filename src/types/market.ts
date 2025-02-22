export interface Order {
  id: string;
  seller: string;
  assetId: string;
  tokenAddress: string;
  amount: string;
  price: string;
  total: string;
  status: OrderStatus;
  expiry?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'open' | 'filled' | 'cancelled' | 'expired';

export interface Trade {
  id: string;
  orderId: string;
  assetId: string;
  seller: string;
  buyer: string;
  amount: string;
  price: string;
  total: string;
  timestamp: string;
  transactionHash: string;
}

export interface OrderBook {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
  lastPrice: string;
  dailyVolume: string;
  dailyChange: number;
}

export interface OrderBookEntry {
  price: string;
  amount: string;
  total: string;
  orderCount: number;
}

export interface MarketState {
  orders: Order[];
  trades: Trade[];
  loading: boolean;
  error: string | null;
} 