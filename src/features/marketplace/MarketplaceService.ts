import axios from 'axios';
import { Asset, Trade } from '@/types/asset';

export class MarketplaceService {
  private static readonly API_URL = process.env.NEXT_PUBLIC_API_URL;

  static async listAssets(): Promise<Asset[]> {
    const response = await axios.get(`${this.API_URL}/marketplace/assets`);
    return response.data;
  }

  static async createTrade(trade: Partial<Trade>): Promise<Trade> {
    const response = await axios.post(`${this.API_URL}/marketplace/trades`, trade);
    return response.data;
  }

  static async executeTrade(tradeId: string): Promise<Trade> {
    const response = await axios.post(`${this.API_URL}/marketplace/trades/${tradeId}/execute`);
    return response.data;
  }
} 