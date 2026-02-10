// Investment data types and enums

export type InvestmentCategory = 
  | 'equity' 
  | 'commodity' 
  | 'crypto' 
  | 'fixed-income' 
  | 'real-estate' 
  | 'cash';

export type RiskLevel = 'safe' | 'moderate' | 'risky' | 'speculative';

export type MarketScenario = 
  | 'inflation' 
  | 'deflation' 
  | 'stagflation' 
  | 'recession' 
  | 'growth' 
  | 'high-interest' 
  | 'low-interest';

export interface Investment {
  id: string;
  assetName: string;
  ticker?: string;
  category: InvestmentCategory;
  riskLevel: RiskLevel;
  marketScenarios: MarketScenario[]; // scenarios this asset thrives in
  
  // Purchase details
  purchaseDate: string; // ISO date string
  quantity: number;
  purchasePrice: number; // price per unit at purchase
  fees: number; // brokerage fees, transaction costs
  totalCost: number; // quantity * purchasePrice + fees
  
  // Current data (fetched from APIs)
  currentPrice?: number;
  lastUpdated?: string;
  currency: string; // USD, EUR, etc.
  
  // Additional metadata
  notes?: string;
  dataSource?: 'yahoo' | 'alphavantage' | 'manual'; // where price comes from
}

export interface Portfolio {
  investments: Investment[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  lastUpdated: string;
}

export interface HistoricalDataPoint {
  date: string;
  value: number;
}

export interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

// Category metadata for UI and analysis
export interface CategoryInfo {
  name: InvestmentCategory;
  label: string;
  color: string;
  description: string;
  typicalScenarios: MarketScenario[];
}

export const CATEGORY_INFO: Record<InvestmentCategory, CategoryInfo> = {
  equity: {
    name: 'equity',
    label: 'Stocks & Equity',
    color: 'hsl(221, 83%, 53%)',
    description: 'Stocks, ETFs, and equity investments',
    typicalScenarios: ['growth', 'low-interest']
  },
  commodity: {
    name: 'commodity',
    label: 'Commodities',
    color: 'hsl(36, 84%, 55%)',
    description: 'Gold, silver, oil, agricultural products',
    typicalScenarios: ['inflation', 'stagflation']
  },
  crypto: {
    name: 'crypto',
    label: 'Cryptocurrency',
    color: 'hsl(270, 95%, 60%)',
    description: 'Bitcoin, Ethereum, and other cryptocurrencies',
    typicalScenarios: ['inflation', 'growth']
  },
  'fixed-income': {
    name: 'fixed-income',
    label: 'Fixed Income',
    color: 'hsl(142, 76%, 36%)',
    description: 'Bonds, CDs, treasury securities',
    typicalScenarios: ['deflation', 'high-interest']
  },
  'real-estate': {
    name: 'real-estate',
    label: 'Real Estate',
    color: 'hsl(24, 100%, 50%)',
    description: 'REITs, property investments',
    typicalScenarios: ['inflation', 'growth']
  },
  cash: {
    name: 'cash',
    label: 'Cash & Cash Equivalents',
    color: 'hsl(210, 40%, 50%)',
    description: 'Savings accounts, money market funds',
    typicalScenarios: ['high-interest', 'recession']
  }
};

export const RISK_LEVELS: Record<RiskLevel, { label: string; color: string; description: string }> = {
  safe: {
    label: 'Safe',
    color: 'hsl(142, 76%, 36%)',
    description: 'Low volatility, capital preservation'
  },
  moderate: {
    label: 'Moderate',
    color: 'hsl(36, 84%, 55%)',
    description: 'Balanced risk and return'
  },
  risky: {
    label: 'Risky',
    color: 'hsl(25, 95%, 53%)',
    description: 'Higher volatility, potential for good returns'
  },
  speculative: {
    label: 'Speculative',
    color: 'hsl(0, 84%, 60%)',
    description: 'Very high risk, potential for large gains or losses'
  }
};

export const MARKET_SCENARIOS: Record<MarketScenario, { label: string; description: string }> = {
  inflation: {
    label: 'High Inflation',
    description: 'Rising prices, devaluing currency'
  },
  deflation: {
    label: 'Deflation',
    description: 'Falling prices, strengthening currency'
  },
  stagflation: {
    label: 'Stagflation',
    description: 'High inflation with economic stagnation'
  },
  recession: {
    label: 'Recession',
    description: 'Economic downturn, reduced spending'
  },
  growth: {
    label: 'Economic Growth',
    description: 'Expanding economy, increasing corporate profits'
  },
  'high-interest': {
    label: 'High Interest Rates',
    description: 'Central bank raising rates to control inflation'
  },
  'low-interest': {
    label: 'Low Interest Rates',
    description: 'Central bank lowering rates to stimulate growth'
  }
};