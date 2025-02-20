import * as tf from '@tensorflow/tfjs';
import { Asset } from '@/types/asset';
import { AssetCharacteristics, MarketData, ValuationResult } from './types';
import { FeatureEngineering } from './FeatureEngineering';
import { MLService } from './MLService';

export class ModelServer {
  private static instance: ModelServer;
  private mlService: MLService;
  private modelCache: Map<string, tf.LayersModel>;
  private lastUpdate: Map<string, number>;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.mlService = MLService.getInstance();
    this.modelCache = new Map();
    this.lastUpdate = new Map();
  }

  static getInstance(): ModelServer {
    if (!ModelServer.instance) {
      ModelServer.instance = new ModelServer();
    }
    return ModelServer.instance;
  }

  async getValuation(
    asset: Asset,
    marketData: MarketData,
    characteristics: AssetCharacteristics
  ): Promise<ValuationResult> {
    try {
      const model = await this.getModel(asset.type);
      const features = FeatureEngineering.preprocessFeatures([asset], [marketData], [characteristics]);
      
      const prediction = await model.predict(features) as tf.Tensor;
      const value = FeatureEngineering.denormalizePrice((await prediction.data())[0]);
      
      // Get feature importance
      const importance = FeatureEngineering.extractFeatureImportance(model, features);
      
      // Cleanup
      features.dispose();
      prediction.dispose();

      return {
        estimatedValue: value,
        confidence: this.calculateConfidence(importance, marketData),
        factors: importance.map(({ feature, importance }) => ({
          name: feature,
          weight: importance,
          value: this.getFactorValue(feature, asset, marketData, characteristics),
          confidence: this.getFactorConfidence(feature, marketData),
          description: this.getFactorDescription(feature)
        })),
        marketData,
        recommendations: this.generateRecommendations(value, marketData, importance),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Valuation error:', error);
      throw new Error('Failed to generate valuation');
    }
  }

  private async getModel(assetType: string): Promise<tf.LayersModel> {
    const cacheKey = `model_${assetType}`;
    const now = Date.now();

    // Check if we have a cached model that's still valid
    if (
      this.modelCache.has(cacheKey) &&
      this.lastUpdate.get(cacheKey)! + this.CACHE_DURATION > now
    ) {
      return this.modelCache.get(cacheKey)!;
    }

    // Load new model
    await this.mlService.loadModel();
    const model = this.mlService.model;
    
    // Update cache
    this.modelCache.set(cacheKey, model);
    this.lastUpdate.set(cacheKey, now);

    return model;
  }

  private calculateConfidence(
    importance: { feature: string; importance: number }[],
    marketData: MarketData
  ): number {
    const dataQuality = this.assessDataQuality(marketData);
    const featureReliability = importance.reduce(
      (acc, { importance }) => acc + importance,
      0
    ) / importance.length;

    return (dataQuality + featureReliability) / 2;
  }

  private assessDataQuality(marketData: MarketData): number {
    const recentSalesCount = marketData.recentSales.length;
    const volatility = marketData.volatility;
    
    // Higher quality score for more sales data and lower volatility
    const salesScore = Math.min(recentSalesCount / 10, 1);
    const volatilityScore = 1 - Math.min(volatility, 1);
    
    return (salesScore + volatilityScore) / 2;
  }

  private getFactorValue(
    feature: string,
    asset: Asset,
    marketData: MarketData,
    characteristics: AssetCharacteristics
  ): number {
    // Implementation depends on feature type
    switch (feature) {
      case 'average_price':
        return marketData.averagePrice;
      case 'age':
        return characteristics.age;
      // Add more cases for other features
      default:
        return 0;
    }
  }

  private getFactorConfidence(feature: string, marketData: MarketData): number {
    // Implementation depends on feature type and data quality
    return 0.8; // Simplified example
  }

  private getFactorDescription(feature: string): string {
    const descriptions: { [key: string]: string } = {
      average_price: 'Historical average price in the market',
      volatility: 'Price stability over time',
      trading_volume: 'Market activity level',
      age: 'Age of the asset',
      rarity: 'Scarcity in the market',
      // Add more descriptions
    };
    return descriptions[feature] || 'Factor affecting asset value';
  }

  private generateRecommendations(
    value: number,
    marketData: MarketData,
    importance: { feature: string; importance: number }[]
  ): string[] {
    const recommendations: string[] = [];

    // Price comparison
    if (value > marketData.averagePrice * 1.2) {
      recommendations.push('Consider selling as the asset is valued above market average');
    }

    // Market timing
    if (marketData.volatility > 0.3) {
      recommendations.push('High market volatility - consider waiting for market stabilization');
    }

    // Important factors
    const topFactors = importance.slice(0, 3);
    recommendations.push(
      `Focus on improving these key value drivers: ${topFactors.map(f => f.feature).join(', ')}`
    );

    return recommendations;
  }
} 