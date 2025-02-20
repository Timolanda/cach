export interface Campaign {
  id: string;
  assetId: string;
  creator: string;
  title: string;
  description: string;
  targetAmount: string;
  minInvestment: string;
  raisedAmount: string;
  tokenPrice: string;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  investors: Investment[];
  metadata: CampaignMetadata;
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus = 'draft' | 'active' | 'funded' | 'failed' | 'cancelled';

export interface Investment {
  investor: string;
  amount: string;
  timestamp: string;
  transactionHash: string;
}

export interface CampaignMetadata {
  images: string[];
  documents: Document[];
  milestones: Milestone[];
  team: TeamMember[];
  risks: Risk[];
}

export interface Milestone {
  title: string;
  description: string;
  targetDate: string;
  status: 'pending' | 'completed' | 'delayed';
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
}

export interface Risk {
  category: string;
  description: string;
  mitigation: string;
  impact: 'low' | 'medium' | 'high';
}

export interface CampaignCreationParams {
  assetId: string;
  title: string;
  description: string;
  targetAmount: string;
  minInvestment: string;
  tokenPrice: string;
  duration: number;
  metadata: Partial<CampaignMetadata>;
}

export interface CrowdfundingState {
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  investments: Investment[];
  loading: boolean;
  error: string | null;
} 