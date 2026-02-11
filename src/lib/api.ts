// API utilities for fetching stock and crypto prices
import { PriceData } from '@/types/investment';

// Fetch prices via our own Next.js API route (avoids CORS)
class YahooFinanceAPI {
  static async fetchPrice(symbol: string): Promise<PriceData | null> {
    const results = await this.fetchMultiplePrices([symbol]);
    return results[symbol] || null;
  }

  static async fetchMultiplePrices(symbols: string[]): Promise<Record<string, PriceData | null>> {
    const results: Record<string, PriceData | null> = {};
    
    try {
      const response = await fetch(`/api/prices?symbols=${encodeURIComponent(symbols.join(','))}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      for (const symbol of symbols) {
        const info = data[symbol];
        if (info) {
          results[symbol] = {
            symbol,
            price: info.price,
            change: info.change,
            changePercent: info.changePercent,
            lastUpdated: info.lastUpdated,
          };
        } else {
          results[symbol] = null;
        }
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      for (const symbol of symbols) {
        results[symbol] = null;
      }
    }
    
    return results;
  }
}

// Alpha Vantage API (requires API key)
class AlphaVantageAPI {
  private static readonly BASE_URL = 'https://www.alphavantage.co/query';
  private static apiKey: string | null = null;
  
  static setApiKey(key: string) {
    this.apiKey = key;
  }
  
  static async fetchPrice(symbol: string): Promise<PriceData | null> {
    if (!this.apiKey) {
      console.warn('Alpha Vantage API key not set');
      return null;
    }
    
    try {
      const url = `${this.BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        throw new Error(data['Error Message'] || data['Note']);
      }
      
      const quote = data['Global Quote'];
      if (!quote) {
        throw new Error('No quote data returned');
      }
      
      const price = parseFloat(quote['05. price']) || 0;
      const change = parseFloat(quote['09. change']) || 0;
      const changePercent = parseFloat(quote['10. change percent']?.replace('%', '')) || 0;
      
      return {
        symbol,
        price,
        change,
        changePercent,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching price from Alpha Vantage for ${symbol}:`, error);
      return null;
    }
  }
}

// Main price fetching service with fallback
export class PriceService {
  private static alphaVantageKey: string | null = null;
  
  static setAlphaVantageKey(key: string) {
    this.alphaVantageKey = key;
    AlphaVantageAPI.setApiKey(key);
  }
  
  static async fetchPrice(symbol: string, preferredSource?: 'yahoo' | 'alphavantage'): Promise<PriceData | null> {
    // Try preferred source first
    if (preferredSource === 'alphavantage' && this.alphaVantageKey) {
      const result = await AlphaVantageAPI.fetchPrice(symbol);
      if (result) return result;
    }
    
    // Try Yahoo Finance (default)
    const yahooResult = await YahooFinanceAPI.fetchPrice(symbol);
    if (yahooResult) return yahooResult;
    
    // Fallback to Alpha Vantage if Yahoo failed and we have a key
    if (preferredSource !== 'alphavantage' && this.alphaVantageKey) {
      return await AlphaVantageAPI.fetchPrice(symbol);
    }
    
    return null;
  }
  
  static async fetchMultiplePrices(symbols: string[]): Promise<Record<string, PriceData | null>> {
    // Use Yahoo Finance for batch requests as it's more lenient with rate limiting
    return await YahooFinanceAPI.fetchMultiplePrices(symbols);
  }
  
  // Utility to normalize ticker symbols for different APIs
  static normalizeSymbol(symbol: string, category: string): string {
    // Convert common symbols to Yahoo Finance format
    const normalized = symbol.toUpperCase().trim();
    
    // Crypto symbols for Yahoo Finance
    if (category === 'crypto') {
      const cryptoMapping: Record<string, string> = {
        'BTC': 'BTC-USD',
        'BITCOIN': 'BTC-USD',
        'ETH': 'ETH-USD',
        'ETHEREUM': 'ETH-USD',
        'XRP': 'XRP-USD',
        'RIPPLE': 'XRP-USD',
        'SOL': 'SOL-USD',
        'SOLANA': 'SOL-USD',
        'ADA': 'ADA-USD',
        'CARDANO': 'ADA-USD',
        'DOT': 'DOT1-USD',
        'POLKADOT': 'DOT1-USD',
        'MATIC': 'MATIC-USD',
        'POLYGON': 'MATIC-USD',
        'AVAX': 'AVAX-USD',
        'AVALANCHE': 'AVAX-USD'
      };
      
      return cryptoMapping[normalized] || `${normalized}-USD`;
    }
    
    // For stocks, return as-is (Yahoo Finance usually handles them correctly)
    return normalized;
  }
  
  // Test connection to APIs
  static async testConnections(): Promise<{ yahoo: boolean; alphavantage: boolean }> {
    const results = { yahoo: false, alphavantage: false };
    
    // Test Yahoo Finance with a common stock
    try {
      const yahooTest = await YahooFinanceAPI.fetchPrice('AAPL');
      results.yahoo = yahooTest !== null;
    } catch (error) {
      console.error('Yahoo Finance test failed:', error);
    }
    
    // Test Alpha Vantage if we have a key
    if (this.alphaVantageKey) {
      try {
        const alphaTest = await AlphaVantageAPI.fetchPrice('AAPL');
        results.alphavantage = alphaTest !== null;
      } catch (error) {
        console.error('Alpha Vantage test failed:', error);
      }
    }
    
    return results;
  }
}

// Rate limiting utility
export class RateLimiter {
  private static requestTimes: Map<string, number[]> = new Map();
  
  static async waitIfNeeded(key: string, maxRequests: number, windowMs: number): Promise<void> {
    const now = Date.now();
    const requests = this.requestTimes.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    // If we've hit the limit, wait
    if (validRequests.length >= maxRequests) {
      const oldestRequest = validRequests[0];
      const waitTime = windowMs - (now - oldestRequest);
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    // Add current request
    validRequests.push(now);
    this.requestTimes.set(key, validRequests);
  }
}

// Market data utilities
export class MarketDataUtils {
  // Common ticker symbols by category
  static readonly COMMON_TICKERS = {
    equity: [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'BRK-B',
      'SPY', 'QQQ', 'VTI', 'VOO', 'IVV', 'VEA', 'VWO'
    ],
    crypto: [
      'BTC-USD', 'ETH-USD', 'XRP-USD', 'SOL-USD', 'ADA-USD', 'DOT1-USD',
      'MATIC-USD', 'AVAX-USD', 'LINK-USD', 'UNI7083-USD'
    ],
    commodity: [
      'GLD', 'SLV', 'USO', 'GDX', 'PDBC', 'DJP', 'DBB', 'DBA'
    ],
    'fixed-income': [
      'TLT', 'IEF', 'SHY', 'BND', 'AGG', 'LQD', 'HYG', 'TIP'
    ],
    'real-estate': [
      'VNQ', 'REIT', 'IYR', 'XLRE', 'REM', 'MORT', 'REZ', 'VNQI'
    ]
  };
  
  static getCommonTickersForCategory(category: string): string[] {
    return this.COMMON_TICKERS[category as keyof typeof this.COMMON_TICKERS] || [];
  }
  
  static isValidTicker(ticker: string): boolean {
    // Basic validation for ticker symbols
    if (!ticker || typeof ticker !== 'string') return false;
    
    const cleaned = ticker.trim().toUpperCase();
    
    // Should be 1-5 characters, possibly with suffixes like -USD
    return /^[A-Z0-9]{1,5}(-[A-Z]{3})?$/.test(cleaned);
  }
}