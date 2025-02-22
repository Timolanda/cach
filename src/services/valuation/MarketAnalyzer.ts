import { Trade } from '@/types/market';
import { MarketData } from './types';
import { analyticsService } from '@/api/services/analytics';

export class MarketAnalyzer {
  static async analyzeTrends(trades: Trade[], timeframe: string): Promise<{
    trend: 'up' | 'down' | 'stable';
    confidence: number;
    factors: string[];
  }> {
    const prices = trades.map(t => Number(t.price));
    const trend = this.calculateTrend(prices);
    const volatility = this.calculateVolatility(prices);
    const volume = this.calculateVolume(trades, timeframe);
    
    // Get market sentiment from analytics service
    const marketMetrics = await analyticsService.getMarketMetrics();
    
    return {
      trend: this.determineTrend(trend, volatility, volume),
      confidence: this.calculateConfidence(volatility, volume),
      factors: this.identifyFactors(trend, volatility, volume, marketMetrics)
    };
  }

  static calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;

    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  static calculateTrend(prices: number[]): number {
    if (prices.length < 2) return 0;

    const xValues = Array.from({ length: prices.length }, (_, i) => i);
    const n = prices.length;

    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = prices.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((a, i) => a + (i * prices[i]), 0);
    const sumXX = xValues.reduce((a, b) => a + (b * b), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  static calculateVolume(trades: Trade[], timeframe: string): number {
    const period = this.getTimePeriod(timeframe);
    const recentTrades = trades.filter(t => 
      new Date(t.timestamp).getTime() > Date.now() - period
    );

    return recentTrades.reduce((sum, trade) => sum + Number(trade.amount), 0);
  }

  private static getTimePeriod(timeframe: string): number {
    const periods: { [key: string]: number } = {
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000,
      '1m': 30 * 24 * 60 * 60 * 1000
    };
    return periods[timeframe] || periods['1w'];
  }

  private static determineTrend(
    trend: number,
    volatility: number,
    volume: number
  ): 'up' | 'down' | 'stable' {
    if (Math.abs(trend) < 0.01 || volatility > 0.5) return 'stable';
    return trend > 0 ? 'up' : 'down';
  }

  private static calculateConfidence(volatility: number, volume: number): number {
    // Higher volume and lower volatility = higher confidence
    const volumeWeight = Math.min(volume / 1000, 1);
    const volatilityWeight = Math.max(1 - volatility, 0);
    return (volumeWeight + volatilityWeight) / 2;
  }

  private static identifyFactors(
    trend: number,
    volatility: number,
    volume: number,
    marketMetrics: any
  ): string[] {
    const factors = [];
    
    if (Math.abs(trend) > 0.05) {
      factors.push(`Strong ${trend > 0 ? 'upward' : 'downward'} price trend`);
    }
    if (volatility > 0.3) {
      factors.push('High market volatility');
    }
    if (volume > 1000) {
      factors.push('High trading volume');
    }
    
    return factors;
  }
} 