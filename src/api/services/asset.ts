import { api } from '../config';
import { Asset, AssetCreationParams, AssetValuation } from '@/types/asset';

export const assetService = {
  async getAssets(): Promise<Asset[]> {
    const { data } = await api.get('/assets');
    return data;
  },

  async getAssetById(id: string): Promise<Asset> {
    const { data } = await api.get(`/assets/${id}`);
    return data;
  },

  async createAsset(params: AssetCreationParams): Promise<Asset> {
    const { data } = await api.post('/assets', params);
    return data;
  },

  async getAssetValuation(id: string): Promise<AssetValuation> {
    const { data } = await api.get(`/assets/${id}/valuation`);
    return data;
  },

  async updateAssetMetadata(id: string, metadata: any): Promise<Asset> {
    const { data } = await api.patch(`/assets/${id}/metadata`, metadata);
    return data;
  },

  async getAssetHistory(id: string): Promise<any[]> {
    const { data } = await api.get(`/assets/${id}/history`);
    return data;
  }
}; 