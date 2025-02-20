export interface AnalyticsData {
  totalValue: string;
  changePercentage: number;
  historicalData: DataPoint[];
  assetAllocation: AllocationData[];
  performance: PerformanceMetrics;
}

export interface DataPoint {
  timestamp: string;
  value: string;
}

export interface AllocationData {
  type: string;
  percentage: number;
  value: string;
}

export interface PerformanceMetrics {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  allTime: number;
}

export interface MarketMetrics {
  totalVolume: string;
  activeAssets: number;
  totalInvestors: number;
  averageReturn: number;
  topPerformers: Asset[];
  recentTrades: Trade[];
}

export interface PredictedTrend {
  assetType: string;
  direction: 'up' | 'down' | 'stable';
  confidence: number;
  predictedChange: number;
  timeframe: string;
  factors: string[];
} 