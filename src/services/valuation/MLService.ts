import { Asset } from '@/types/asset';
import { AssetCharacteristics, MarketData } from './types';
import * as tf from '@tensorflow/tfjs';

export class MLService {
  private static instance: MLService;
  private model: tf.LayersModel | null = null;
  private modelPath: string;

  private constructor() {
    this.modelPath = process.env.REACT_APP_ML_MODEL_PATH || '';
  }

  static getInstance(): MLService {
    if (!MLService.instance) {
      MLService.instance = new MLService();
    }
    return MLService.instance;
  }

  async loadModel(): Promise<void> {
    try {
      this.model = await tf.loadLayersModel(this.modelPath);
    } catch (error) {
      console.error('Failed to load ML model:', error);
      throw new Error('Model loading failed');
    }
  }

  async predict(
    asset: Asset,
    marketData: MarketData,
    characteristics: AssetCharacteristics
  ): Promise<number> {
    if (!this.model) {
      await this.loadModel();
    }

    const inputFeatures = this.prepareFeatures(asset, marketData, characteristics);
    const prediction = await this.model!.predict(inputFeatures) as tf.Tensor;
    const value = await prediction.data();
    
    // Cleanup
    prediction.dispose();
    inputFeatures.dispose();

    return value[0];
  }

  private prepareFeatures(
    asset: Asset,
    marketData: MarketData,
    characteristics: AssetCharacteristics
  ): tf.Tensor {
    // Normalize and prepare features for the model
    const features = [
      this.normalizePrice(marketData.averagePrice),
      this.normalizeVolatility(marketData.volatility),
      characteristics.age / 100, // Normalize age
      characteristics.rarity,
      characteristics.authenticity,
      characteristics.provenance,
      this.encodeLocation(characteristics.location),
      this.encodeAssetType(asset.type)
    ];

    return tf.tensor2d([features], [1, features.length]);
  }

  private normalizePrice(price: number): number {
    // Implement price normalization logic
    return price / 1000000; // Example: normalize to millions
  }

  private normalizeVolatility(volatility: number): number {
    return Math.min(volatility, 1);
  }

  private encodeLocation(location: string): number {
    // Implement location encoding logic
    const locationMap: { [key: string]: number } = {
      'urban': 1,
      'suburban': 0.8,
      'rural': 0.6
    };
    return locationMap[location.toLowerCase()] || 0.5;
  }

  private encodeAssetType(type: string): number {
    // Implement asset type encoding logic
    const typeMap: { [key: string]: number } = {
      'real_estate': 1,
      'art': 0.8,
      'collectible': 0.6,
      'vehicle': 0.4
    };
    return typeMap[type] || 0.5;
  }
} 