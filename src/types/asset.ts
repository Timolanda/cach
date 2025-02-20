export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  description: string;
  tokenAddress: string;
  totalSupply: string;
  currentPrice: string;
  marketCap: string;
  imageUrl: string;
  metadata: AssetMetadata;
  createdAt: string;
  updatedAt: string;
}

export type AssetType = 'real_estate' | 'art' | 'collectible' | 'vehicle' | 'other';

export interface AssetMetadata {
  location?: string;
  condition?: string;
  dimensions?: string;
  authenticity?: string;
  history?: string;
  documents?: Document[];
}

export interface Document {
  id: string;
  type: string;
  url: string;
  name: string;
  verified: boolean;
}

export interface AssetCreationParams {
  name: string;
  symbol: string;
  type: AssetType;
  description: string;
  totalSupply: string;
  initialPrice: string;
  metadata: Partial<AssetMetadata>;
  image?: File;
  documents?: File[];
}

export interface AssetValuation {
  currentValue: string;
  historicalValues: {
    timestamp: string;
    value: string;
  }[];
  confidence: number;
  factors: {
    name: string;
    impact: number;
    description: string;
  }[];
}

export interface TokenizationRequest {
  name: string;
  description: string;
  type: Asset['type'];
  totalSupply: number;
  initialPrice: number;
  documents?: string[];
}

export interface Trade {
  id: string;
  assetId: string;
  sellerAddress: string;
  buyerAddress: string;
  amount: number;
  price: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
} 