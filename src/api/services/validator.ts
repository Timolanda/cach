import { api } from '../config';
import { Validator, ValidationResult } from '@/types/validator';

export const validatorService = {
  async getValidators(): Promise<Validator[]> {
    const { data } = await api.get('/validators');
    return data;
  },

  async registerValidator(stake: number): Promise<Validator> {
    const { data } = await api.post('/validators', { stake });
    return data;
  },

  async submitValidation(assetId: string, valuation: number): Promise<ValidationResult> {
    const { data } = await api.post(`/validations/${assetId}`, { valuation });
    return data;
  },

  async getValidatorStats(address: string): Promise<any> {
    const { data } = await api.get(`/validators/${address}/stats`);
    return data;
  },

  async claimRewards(): Promise<any> {
    const { data } = await api.post('/validators/claim-rewards');
    return data;
  }
}; 