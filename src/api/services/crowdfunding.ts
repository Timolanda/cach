import { api } from '../config';
import { Campaign, CampaignCreationParams } from '@/types/crowdfunding';

export const crowdfundingService = {
  async getCampaigns(): Promise<Campaign[]> {
    const { data } = await api.get('/campaigns');
    return data;
  },

  async getCampaignById(id: string): Promise<Campaign> {
    const { data } = await api.get(`/campaigns/${id}`);
    return data;
  },

  async createCampaign(params: CampaignCreationParams): Promise<Campaign> {
    const { data } = await api.post('/campaigns', params);
    return data;
  },

  async invest(campaignId: string, amount: number): Promise<any> {
    const { data } = await api.post(`/campaigns/${campaignId}/invest`, { amount });
    return data;
  },

  async getCampaignInvestors(id: string): Promise<any[]> {
    const { data } = await api.get(`/campaigns/${id}/investors`);
    return data;
  }
}; 