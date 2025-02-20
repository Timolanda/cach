export interface ValuationFactor {
  name: string;
  weight: number;
  value: number;
  confidence: number;
  description: string;
}

export interface MarketData {
  recentSales: {
    price: number;
    date: string;
    condition: string;
  }[];
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  volatility: number;
}

export interface AssetCharacteristics {
  type: string;
  age: number;
  condition: string;
  rarity: number;
  authenticity: number;
  provenance: number;
  location: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
}

export interface ValuationResult {
  estimatedValue: number;
  confidence: number;
  factors: ValuationFactor[];
  marketData: MarketData;
  recommendations: string[];
  timestamp: string;
} 