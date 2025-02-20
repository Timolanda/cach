import { api } from '../config';
import { AnalyticsData, MarketMetrics } from '@/types/analytics';

export const analyticsService = {
  async getPortfolioAnalytics(timeframe: string): Promise<AnalyticsData> {
    const { data } = await api.get('/analytics/portfolio', {
      params: { timeframe }
    });
    return data;
  },

  async getMarketMetrics(): Promise<MarketMetrics> {
    const { data } = await api.get('/analytics/market');
    return data;
  },

  async getAssetPerformance(assetId: string, timeframe: string): Promise<any> {
    const { data } = await api.get(`/analytics/assets/${assetId}/performance`, {
      params: { timeframe }
    });
    return data;
  },

  async getPredictedTrends(assetType: string): Promise<any> {
    const { data } = await api.get('/analytics/trends', {
      params: { assetType }
    });
    return data;
  }
}; 