import { Asset, AssetType } from '@/types/asset';
import { ValuationResult, ValuationFactor, MarketData } from './types';
import { marketService } from '@/api/services/market';
import { analyticsService } from '@/api/services/analytics';

export class ValuationService {
  private static instance: ValuationService;
  private modelEndpoint: string;

  private constructor() {
    this.modelEndpoint = process.env.REACT_APP_AI_VALUATION_ENDPOINT || '';
  }

  static getInstance(): ValuationService {
    if (!ValuationService.instance) {
      ValuationService.instance = new ValuationService();
    }
    return ValuationService.instance;
  }

  async valuateAsset(asset: Asset): Promise<ValuationResult> {
    try {
      // Gather all necessary data
      const marketData = await this.getMarketData(asset);
      const characteristics = this.extractAssetCharacteristics(asset);
      const factors = await this.analyzeValuationFactors(asset, marketData);
      
      // Calculate base value using ML model
      const baseValue = await this.getMLPrediction(asset, marketData, characteristics);
      
      // Apply adjustment factors
      const adjustedValue = this.applyAdjustmentFactors(baseValue, factors);
      
      // Calculate confidence score
      const confidence = this.calculateConfidence(factors);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(asset, factors, marketData);

      return {
        estimatedValue: adjustedValue,
        confidence,
        factors,
        marketData,
        recommendations,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Valuation error:', error);
      throw new Error('Failed to valuate asset');
    }
  }

  private async getMarketData(asset: Asset): Promise<MarketData> {
    const trades = await marketService.getTrades(asset.id);
    const metrics = await analyticsService.getMarketMetrics();
    
    // Process and analyze market data
    return {
      recentSales: trades.map(trade => ({
        price: Number(trade.price),
        date: trade.timestamp,
        condition: 'good' // This should come from trade metadata
      })),
      averagePrice: this.calculateAveragePrice(trades),
      priceRange: this.calculatePriceRange(trades),
      volatility: this.calculateVolatility(trades)
    };
  }

  private async getMLPrediction(
    asset: Asset,
    marketData: MarketData,
    characteristics: AssetCharacteristics
  ): Promise<number> {
    const response = await fetch(this.modelEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asset,
        marketData,
        characteristics
      })
    });

    if (!response.ok) {
      throw new Error('ML prediction failed');
    }

    const prediction = await response.json();
    return prediction.value;
  }

  private async analyzeValuationFactors(
    asset: Asset,
    marketData: MarketData
  ): Promise<ValuationFactor[]> {
    const factors: ValuationFactor[] = [];

    // Market demand factor
    factors.push({
      name: 'Market Demand',
      weight: 0.3,
      value: this.calculateMarketDemand(marketData),
      confidence: 0.85,
      description: 'Current market demand based on recent trading activity'
    });

    // Asset condition factor
    factors.push({
      name: 'Condition',
      weight: 0.2,
      value: this.evaluateCondition(asset),
      confidence: 0.9,
      description: 'Physical condition and maintenance status'
    });

    // Add more factors based on asset type
    if (asset.type === 'real_estate') {
      factors.push(...this.getRealEstateFactors(asset));
    } else if (asset.type === 'art') {
      factors.push(...this.getArtFactors(asset));
    }

    return factors;
  }

  private applyAdjustmentFactors(baseValue: number, factors: ValuationFactor[]): number {
    let adjustedValue = baseValue;
    
    factors.forEach(factor => {
      const adjustment = factor.value * factor.weight;
      adjustedValue *= (1 + adjustment);
    });

    return adjustedValue;
  }

  private calculateConfidence(factors: ValuationFactor[]): number {
    const weightedConfidence = factors.reduce((acc, factor) => {
      return acc + (factor.confidence * factor.weight);
    }, 0);

    const totalWeight = factors.reduce((acc, factor) => acc + factor.weight, 0);
    return weightedConfidence / totalWeight;
  }

  // Helper methods for specific asset types
  private getRealEstateFactors(asset: Asset): ValuationFactor[] {
    // Implement real estate specific factors
    return [];
  }

  private getArtFactors(asset: Asset): ValuationFactor[] {
    // Implement art specific factors
    return [];
  }

  // Additional helper methods...
} 