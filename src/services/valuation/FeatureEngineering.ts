import { Asset } from '@/types/asset';
import { AssetCharacteristics, MarketData } from './types';
import * as tf from '@tensorflow/tfjs';

export class FeatureEngineering {
  // Feature scaling parameters
  private static readonly PRICE_SCALE = 1000000; // Scale to millions
  private static readonly AGE_SCALE = 100;
  private static readonly VOLUME_SCALE = 10000;

  static preprocessFeatures(
    assets: Asset[],
    marketData: MarketData[],
    characteristics: AssetCharacteristics[]
  ): tf.Tensor2D {
    const features = assets.map((asset, index) => [
      // Market features
      this.normalizePrice(marketData[index].averagePrice),
      this.normalizeVolatility(marketData[index].volatility),
      this.normalizeVolume(marketData[index].recentSales.length),
      
      // Asset characteristics
      characteristics[index].age / this.AGE_SCALE,
      characteristics[index].rarity,
      characteristics[index].authenticity,
      characteristics[index].provenance,
      
      // Encoded categorical features
      ...this.oneHotEncode(asset.type, this.getAssetTypes()),
      ...this.oneHotEncode(characteristics[index].location, this.getLocations())
    ]);

    return tf.tensor2d(features);
  }

  static normalizeTargets(prices: number[]): tf.Tensor2D {
    const normalizedPrices = prices.map(price => price / this.PRICE_SCALE);
    return tf.tensor2d(normalizedPrices, [normalizedPrices.length, 1]);
  }

  static denormalizePrice(normalizedPrice: number): number {
    return normalizedPrice * this.PRICE_SCALE;
  }

  private static normalizePrice(price: number): number {
    return price / this.PRICE_SCALE;
  }

  private static normalizeVolatility(volatility: number): number {
    return Math.min(volatility, 1);
  }

  private static normalizeVolume(volume: number): number {
    return volume / this.VOLUME_SCALE;
  }

  private static oneHotEncode(value: string, categories: string[]): number[] {
    return categories.map(category => value === category ? 1 : 0);
  }

  private static getAssetTypes(): string[] {
    return ['real_estate', 'art', 'collectible', 'vehicle', 'other'];
  }

  private static getLocations(): string[] {
    return ['urban', 'suburban', 'rural', 'other'];
  }

  static extractFeatureImportance(
    model: tf.LayersModel,
    features: tf.Tensor2D
  ): { feature: string; importance: number }[] {
    // Use SHAP values or feature permutation to calculate importance
    // This is a simplified example
    const weights = model.layers[1].getWeights()[0].arraySync() as number[][];
    const featureNames = this.getFeatureNames();
    
    return featureNames.map((name, index) => ({
      feature: name,
      importance: Math.abs(weights[index][0])
    })).sort((a, b) => b.importance - a.importance);
  }

  private static getFeatureNames(): string[] {
    return [
      'average_price',
      'volatility',
      'trading_volume',
      'age',
      'rarity',
      'authenticity',
      'provenance',
      ...this.getAssetTypes().map(type => `type_${type}`),
      ...this.getLocations().map(location => `location_${location}`)
    ];
  }
} 