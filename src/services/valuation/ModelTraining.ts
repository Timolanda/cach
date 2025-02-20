import * as tf from '@tensorflow/tfjs';
import { FeatureEngineering } from './FeatureEngineering';
import { Asset } from '@/types/asset';
import { AssetCharacteristics, MarketData } from './types';

export class ModelTraining {
  private static readonly LEARNING_RATE = 0.001;
  private static readonly BATCH_SIZE = 32;
  private static readonly EPOCHS = 100;

  static async trainModel(
    assets: Asset[],
    marketData: MarketData[],
    characteristics: AssetCharacteristics[],
    actualPrices: number[]
  ): Promise<tf.LayersModel> {
    // Prepare features and targets
    const features = FeatureEngineering.preprocessFeatures(
      assets,
      marketData,
      characteristics
    );
    const targets = FeatureEngineering.normalizeTargets(actualPrices);

    // Create and compile model
    const model = this.createModel(features.shape[1]);
    
    // Train model
    await this.trainAndValidate(model, features, targets);

    return model;
  }

  private static createModel(numFeatures: number): tf.LayersModel {
    const model = tf.sequential();

    // Input layer
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [numFeatures]
    }));

    // Hidden layers
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));

    // Output layer
    model.add(tf.layers.dense({ units: 1 }));

    // Compile model
    model.compile({
      optimizer: tf.train.adam(this.LEARNING_RATE),
      loss: 'meanSquaredError',
      metrics: ['mse', 'mae']
    });

    return model;
  }

  private static async trainAndValidate(
    model: tf.LayersModel,
    features: tf.Tensor2D,
    targets: tf.Tensor2D
  ): Promise<void> {
    // Split data into training and validation sets
    const splitIndex = Math.floor(features.shape[0] * 0.8);
    const [trainFeatures, valFeatures] = tf.split(features, [splitIndex, features.shape[0] - splitIndex]);
    const [trainTargets, valTargets] = tf.split(targets, [splitIndex, targets.shape[0] - splitIndex]);

    // Train model
    await model.fit(trainFeatures, trainTargets, {
      epochs: this.EPOCHS,
      batchSize: this.BATCH_SIZE,
      validationData: [valFeatures, valTargets],
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, val_loss = ${logs?.val_loss.toFixed(4)}`);
        }
      }
    });

    // Cleanup
    trainFeatures.dispose();
    trainTargets.dispose();
    valFeatures.dispose();
    valTargets.dispose();
  }

  static async evaluateModel(
    model: tf.LayersModel,
    testFeatures: tf.Tensor2D,
    testTargets: tf.Tensor2D
  ): Promise<{
    mse: number;
    mae: number;
    r2: number;
  }> {
    const predictions = model.predict(testFeatures) as tf.Tensor;
    const mse = tf.losses.meanSquaredError(testTargets, predictions).arraySync() as number;
    const mae = tf.metrics.meanAbsoluteError(testTargets, predictions).arraySync() as number;
    
    // Calculate R-squared
    const mean = tf.mean(testTargets);
    const totalSum = testTargets.sub(mean).square().sum();
    const residualSum = testTargets.sub(predictions).square().sum();
    const r2 = 1 - (residualSum.div(totalSum)).arraySync() as number;

    predictions.dispose();
    return { mse, mae, r2 };
  }
} 