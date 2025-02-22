import axios from 'axios';
import { Campaign, Investment } from '@/types/crowdfunding';

export class CrowdfundingService {
  private static readonly API_URL = process.env.NEXT_PUBLIC_API_URL;

  static async createCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    const response = await axios.post(`${this.API_URL}/crowdfunding/campaigns`, campaign);
    return response.data;
  }

  static async invest(campaignId: string, amount: number): Promise<Investment> {
    const response = await axios.post(`${this.API_URL}/crowdfunding/campaigns/${campaignId}/invest`, {
      amount,
    });
    return response.data;
  }

  static async getCampaigns(): Promise<Campaign[]> {
    const response = await axios.get(`${this.API_URL}/crowdfunding/campaigns`);
    return response.data;
  }

  static async getCampaignDetails(campaignId: string): Promise<Campaign> {
    const response = await axios.get(`${this.API_URL}/crowdfunding/campaigns/${campaignId}`);
    return response.data;
  }
} 