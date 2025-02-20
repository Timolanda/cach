export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  walletAddress?: string;
  kycStatus: KYCStatus;
  verificationLevel: VerificationLevel;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}

export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted';
export type VerificationLevel = 'basic' | 'verified' | 'premium';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  currency: string;
  language: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  priceAlerts: boolean;
  newAssets: boolean;
  campaignUpdates: boolean;
  marketingUpdates: boolean;
}

export interface UserStats {
  totalInvestments: string;
  portfolioValue: string;
  assetsOwned: number;
  campaignsParticipated: number;
  successfulTrades: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'asset_update'
  | 'price_alert'
  | 'campaign_update'
  | 'trade_executed'
  | 'kyc_status'
  | 'system'; 