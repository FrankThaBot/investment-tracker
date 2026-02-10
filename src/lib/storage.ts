// Local storage utilities for investment data
import { Investment, Portfolio, HistoricalDataPoint } from '@/types/investment';

const STORAGE_KEYS = {
  INVESTMENTS: 'investment-tracker-investments',
  HISTORICAL_DATA: 'investment-tracker-historical',
  SETTINGS: 'investment-tracker-settings'
} as const;

// Investment CRUD operations
export class InvestmentStorage {
  static getInvestments(): Investment[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading investments:', error);
      return [];
    }
  }

  static saveInvestments(investments: Investment[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));
    } catch (error) {
      console.error('Error saving investments:', error);
    }
  }

  static addInvestment(investment: Investment): void {
    const investments = this.getInvestments();
    investments.push(investment);
    this.saveInvestments(investments);
  }

  static updateInvestment(id: string, updates: Partial<Investment>): void {
    const investments = this.getInvestments();
    const index = investments.findIndex(inv => inv.id === id);
    
    if (index !== -1) {
      investments[index] = { ...investments[index], ...updates };
      this.saveInvestments(investments);
    }
  }

  static deleteInvestment(id: string): void {
    const investments = this.getInvestments();
    const filtered = investments.filter(inv => inv.id !== id);
    this.saveInvestments(filtered);
  }

  static getInvestmentById(id: string): Investment | undefined {
    const investments = this.getInvestments();
    return investments.find(inv => inv.id === id);
  }
}

// Historical data operations
export class HistoricalDataStorage {
  static getHistoricalData(key: string): HistoricalDataPoint[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(`${STORAGE_KEYS.HISTORICAL_DATA}-${key}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading historical data:', error);
      return [];
    }
  }

  static saveHistoricalData(key: string, data: HistoricalDataPoint[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(`${STORAGE_KEYS.HISTORICAL_DATA}-${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving historical data:', error);
    }
  }

  static addHistoricalDataPoint(key: string, dataPoint: HistoricalDataPoint): void {
    const existing = this.getHistoricalData(key);
    
    // Remove duplicate dates and add new point
    const filtered = existing.filter(point => point.date !== dataPoint.date);
    filtered.push(dataPoint);
    
    // Sort by date and keep only last 1000 points to prevent storage bloat
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const trimmed = filtered.slice(-1000);
    
    this.saveHistoricalData(key, trimmed);
  }

  static getPortfolioHistoricalData(): HistoricalDataPoint[] {
    return this.getHistoricalData('portfolio');
  }

  static addPortfolioDataPoint(dataPoint: HistoricalDataPoint): void {
    this.addHistoricalDataPoint('portfolio', dataPoint);
  }
}

// Portfolio calculation utilities
export class PortfolioCalculator {
  static calculatePortfolio(investments: Investment[]): Portfolio {
    const now = new Date().toISOString();
    
    let totalValue = 0;
    let totalCost = 0;
    
    investments.forEach(investment => {
      totalCost += investment.totalCost;
      
      if (investment.currentPrice) {
        totalValue += investment.quantity * investment.currentPrice;
      } else {
        // Use purchase price as fallback if no current price
        totalValue += investment.quantity * investment.purchasePrice;
      }
    });
    
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    
    return {
      investments,
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      lastUpdated: now
    };
  }

  static getCategoryBreakdown(investments: Investment[]) {
    const breakdown: Record<string, { value: number; percentage: number; count: number }> = {};
    const totalValue = investments.reduce((sum, inv) => {
      const value = inv.currentPrice ? inv.quantity * inv.currentPrice : inv.quantity * inv.purchasePrice;
      return sum + value;
    }, 0);

    investments.forEach(investment => {
      const value = investment.currentPrice 
        ? investment.quantity * investment.currentPrice
        : investment.quantity * investment.purchasePrice;
      
      if (!breakdown[investment.category]) {
        breakdown[investment.category] = { value: 0, percentage: 0, count: 0 };
      }
      
      breakdown[investment.category].value += value;
      breakdown[investment.category].count += 1;
    });

    // Calculate percentages
    Object.keys(breakdown).forEach(category => {
      breakdown[category].percentage = totalValue > 0 
        ? (breakdown[category].value / totalValue) * 100
        : 0;
    });

    return breakdown;
  }

  static getRiskBreakdown(investments: Investment[]) {
    const breakdown: Record<string, { value: number; percentage: number; count: number }> = {};
    const totalValue = investments.reduce((sum, inv) => {
      const value = inv.currentPrice ? inv.quantity * inv.currentPrice : inv.quantity * inv.purchasePrice;
      return sum + value;
    }, 0);

    investments.forEach(investment => {
      const value = investment.currentPrice 
        ? investment.quantity * investment.currentPrice
        : investment.quantity * investment.purchasePrice;
      
      if (!breakdown[investment.riskLevel]) {
        breakdown[investment.riskLevel] = { value: 0, percentage: 0, count: 0 };
      }
      
      breakdown[investment.riskLevel].value += value;
      breakdown[investment.riskLevel].count += 1;
    });

    // Calculate percentages
    Object.keys(breakdown).forEach(risk => {
      breakdown[risk].percentage = totalValue > 0 
        ? (breakdown[risk].value / totalValue) * 100
        : 0;
    });

    return breakdown;
  }
}

// Settings management
export interface AppSettings {
  currency: string;
  darkMode: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // minutes
}

export class SettingsStorage {
  static getSettings(): AppSettings {
    if (typeof window === 'undefined') {
      return { currency: 'USD', darkMode: true, autoRefresh: false, refreshInterval: 15 };
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const defaults: AppSettings = {
        currency: 'USD',
        darkMode: true,
        autoRefresh: false,
        refreshInterval: 15
      };
      
      return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
    } catch (error) {
      console.error('Error loading settings:', error);
      return { currency: 'USD', darkMode: true, autoRefresh: false, refreshInterval: 15 };
    }
  }

  static saveSettings(settings: Partial<AppSettings>): void {
    if (typeof window === 'undefined') return;
    
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }
}

// Utility to generate IDs
export function generateId(): string {
  return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}