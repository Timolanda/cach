import { useState, useCallback } from 'react';
import { Asset } from '@/types/asset';
import { ValuationResult } from '@/services/valuation/types';
import { ModelServer } from '@/services/valuation/ModelServer';
import { marketService } from '@/api/services/market';
import { analyticsService } from '@/api/services/analytics';

export const useAssetValuation = (asset: Asset) => {
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getValuation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get market data
      const trades = await marketService.getTrades(asset.id);
      const marketMetrics = await analyticsService.getMarketMetrics();
      
      // Get asset characteristics
      const characteristics = await analyticsService.getAssetCharacteristics(asset.id);
      
      // Get valuation
      const modelServer = ModelServer.getInstance();
      const result = await modelServer.getValuation(
        asset,
        {
          recentSales: trades.map(trade => ({
            price: Number(trade.price),
            date: trade.timestamp,
            condition: 'good'
          })),
          averagePrice: marketMetrics.averagePrice,
          priceRange: marketMetrics.priceRange,
          volatility: marketMetrics.volatility
        },
        characteristics
      );

      setValuation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get valuation');
    } finally {
      setLoading(false);
    }
  }, [asset.id]);

  return {
    valuation,
    loading,
    error,
    getValuation
  };
}; 