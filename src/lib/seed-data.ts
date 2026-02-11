import { Investment } from '@/types/investment';

// All 97 historical trades from Sharesight (Jan 2021 - Feb 2026)
export interface Trade {
  date: string;
  type: 'Buy' | 'Sell';
  ticker: string;
  exchange: string;
  name: string;
  qty: number;
  price: number;
  brokerage: number;
  currency: string;
  value: number;
}

// Current holdings with proper cost basis (weighted average method)
// Closed positions: VAS, VAP, VHY, VBND, VBTC, PMGOLD, EBTC (all net 0)
export const CURRENT_HOLDINGS: Investment[] = [
  {
    id: 'sharesight_vgs',
    assetName: 'Vanguard MSCI Index International',
    ticker: 'VGS.AX', // Yahoo Finance: works
    category: 'equity',
    riskLevel: 'moderate',
    marketScenarios: ['growth', 'low-interest'],
    purchaseDate: '2026-02-10T00:00:00.000Z',
    quantity: 40,
    purchasePrice: 149.055,
    fees: 11.00,
    totalCost: 5962.20,
    currency: 'AUD',
    notes: 'Vanguard international shares ETF (ASX). Multiple buys/sells since Mar 2024. Current lot: 40 units bought 10 Feb 2026 @ $148.78.',
    dataSource: 'manual'
  },
  {
    id: 'sharesight_btc',
    assetName: 'Bitcoin',
    ticker: 'BTC-AUD', // Yahoo Finance: works
    category: 'crypto',
    riskLevel: 'speculative',
    marketScenarios: ['inflation', 'growth'],
    purchaseDate: '2026-01-14T00:00:00.000Z',
    quantity: 0.0501,
    purchasePrice: 123793.41,
    fees: 68.18,
    totalCost: 6202.05,
    currency: 'AUD',
    notes: 'Direct BTC holdings via crypto exchange. 9 buys from Jan 14 - Feb 11, 2026. DCA strategy ~$250-$1,500 per buy.',
    dataSource: 'manual'
  },
  {
    id: 'sharesight_ibtc',
    assetName: 'Monochrome Bitcoin ETF',
    ticker: '', // Not on Yahoo Finance (CBOE/CXA) - price manually
    category: 'crypto',
    riskLevel: 'risky',
    marketScenarios: ['inflation', 'growth'],
    purchaseDate: '2025-07-10T00:00:00.000Z',
    quantity: 520,
    purchasePrice: 15.6454,
    fees: 11.00,
    totalCost: 8135.63,
    currency: 'AUD',
    notes: 'Monochrome Bitcoin ETF (CBOE/CXA). First batch (251 units) bought and sold Jun 2025. Current 520 units accumulated Jul 2025 - Feb 2026.',
    dataSource: 'manual'
  },
  {
    id: 'sharesight_gold',
    assetName: 'ABC Bullion - Pool Allocated Gold',
    ticker: '', // ABC Bullion pool allocated gold, priced per oz AUD - not on Yahoo
    category: 'commodity',
    riskLevel: 'moderate',
    marketScenarios: ['inflation', 'stagflation', 'recession', 'high-interest'],
    purchaseDate: '2026-01-29T00:00:00.000Z',
    quantity: 0.9,
    purchasePrice: 7880.7667,
    fees: 0,
    totalCost: 7092.69,
    currency: 'AUD',
    notes: 'Physical gold (pool allocated) via ABC Bullion. 2 buys: 0.75oz Jan 29, 0.15oz Feb 3, 2026. Priced per troy ounce in AUD.',
    dataSource: 'manual'
  },
  {
    id: 'sharesight_cash',
    assetName: 'Cash Reserve',
    ticker: '',
    category: 'cash',
    riskLevel: 'safe',
    marketScenarios: ['high-interest', 'recession'],
    purchaseDate: '2026-02-11T00:00:00.000Z',
    quantity: 1,
    purchasePrice: 4348,
    fees: 0,
    totalCost: 4348,
    currentPrice: 4348,
    currency: 'AUD',
    notes: 'Uninvested cash balance in brokerage account.',
    dataSource: 'manual'
  }
];

// All 97 raw trades for historical record
export const ALL_TRADES: Trade[] = [
  // VAS (closed - net 0)
  {"date":"2021-06-08","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":53,"price":93.59,"brokerage":14.95,"currency":"AUD","value":4975.22},
  {"date":"2021-07-13","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":14,"price":93.73,"brokerage":14.95,"currency":"AUD","value":1327.17},
  {"date":"2021-08-04","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":31,"price":95.93,"brokerage":14.95,"currency":"AUD","value":2988.78},
  {"date":"2021-09-01","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":16,"price":97.214,"brokerage":14.95,"currency":"AUD","value":1570.38},
  {"date":"2021-10-01","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":11,"price":94.119,"brokerage":14.95,"currency":"AUD","value":1050.26},
  {"date":"2021-10-29","type":"Sell","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":-20,"price":94.353,"brokerage":14.95,"currency":"AUD","value":-1872.10},
  {"date":"2021-11-02","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":2,"price":101.775,"brokerage":14.95,"currency":"AUD","value":218.50},
  {"date":"2021-12-17","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":22,"price":95.15,"brokerage":14.95,"currency":"AUD","value":2108.24},
  {"date":"2022-01-04","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":8,"price":96.70,"brokerage":14.95,"currency":"AUD","value":788.55},
  {"date":"2022-01-07","type":"Sell","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":-137,"price":95.034,"brokerage":14.95,"currency":"AUD","value":-13004.75},
  {"date":"2023-03-01","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":44,"price":89.91,"brokerage":13.59,"currency":"AUD","value":3969.63},
  {"date":"2023-10-04","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":24,"price":85.39,"brokerage":14.95,"currency":"AUD","value":2064.31},
  {"date":"2024-03-04","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":24,"price":96.41,"brokerage":14.95,"currency":"AUD","value":2328.79},
  {"date":"2024-03-19","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":58,"price":95.85,"brokerage":14.95,"currency":"AUD","value":5574.25},
  {"date":"2024-04-02","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":60,"price":98.81,"brokerage":14.95,"currency":"AUD","value":5943.55},
  {"date":"2024-07-26","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":43,"price":97.97,"brokerage":14.95,"currency":"AUD","value":4227.66},
  {"date":"2024-08-27","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":81,"price":98.23,"brokerage":14.95,"currency":"AUD","value":7971.58},
  {"date":"2024-09-05","type":"Buy","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":45,"price":98.83,"brokerage":14.95,"currency":"AUD","value":4462.30},
  {"date":"2024-12-10","type":"Sell","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":-29,"price":104.50,"brokerage":14.95,"currency":"AUD","value":-3015.55},
  {"date":"2025-03-18","type":"Sell","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":-77,"price":98.63,"brokerage":14.95,"currency":"AUD","value":-7579.56},
  {"date":"2025-09-26","type":"Sell","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":-50,"price":109.85,"brokerage":19.95,"currency":"AUD","value":-5472.55},
  {"date":"2025-11-28","type":"Sell","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":-169,"price":107.42,"brokerage":14.95,"currency":"AUD","value":-18139.03},
  {"date":"2025-12-04","type":"Sell","ticker":"VAS","exchange":"ASX","name":"Vanguard Australian Shares Index","qty":-54,"price":107.12,"brokerage":19.95,"currency":"AUD","value":-5764.53},
  // VGS
  {"date":"2024-03-19","type":"Buy","ticker":"VGS","exchange":"ASX","name":"Vanguard MSCI Index International","qty":116,"price":122.21,"brokerage":14.95,"currency":"AUD","value":14191.31},
  {"date":"2024-04-02","type":"Buy","ticker":"VGS","exchange":"ASX","name":"Vanguard MSCI Index International","qty":47,"price":125.11,"brokerage":14.95,"currency":"AUD","value":5895.12},
  {"date":"2024-07-31","type":"Buy","ticker":"VGS","exchange":"ASX","name":"Vanguard MSCI Index International","qty":88,"price":125.46,"brokerage":14.95,"currency":"AUD","value":11055.43},
  {"date":"2024-09-05","type":"Buy","ticker":"VGS","exchange":"ASX","name":"Vanguard MSCI Index International","qty":52,"price":124.41,"brokerage":14.95,"currency":"AUD","value":6484.27},
  {"date":"2024-12-10","type":"Sell","ticker":"VGS","exchange":"ASX","name":"Vanguard MSCI Index International","qty":-43,"price":140.96,"brokerage":14.95,"currency":"AUD","value":-6046.33},
  {"date":"2025-03-18","type":"Sell","ticker":"VGS","exchange":"ASX","name":"Vanguard MSCI Index International","qty":-70,"price":135.50,"brokerage":14.95,"currency":"AUD","value":-9470.05},
  {"date":"2025-07-22","type":"Buy","ticker":"VGS","exchange":"ASX","name":"Vanguard MSCI Index International","qty":13,"price":144.06,"brokerage":14.95,"currency":"AUD","value":1887.73},
  {"date":"2025-12-08","type":"Sell","ticker":"VGS","exchange":"ASX","name":"Vanguard MSCI Index International","qty":-203,"price":153.916,"brokerage":14.95,"currency":"AUD","value":-31229.92},
  {"date":"2026-02-10","type":"Buy","ticker":"VGS","exchange":"ASX","name":"Vanguard MSCI Index International","qty":40,"price":148.78,"brokerage":11.00,"currency":"AUD","value":5962.20},
  // VBND (closed - net 0)
  {"date":"2024-11-08","type":"Buy","ticker":"VBND","exchange":"ASX","name":"Vanguard Global Aggregate Bond","qty":311,"price":41.75,"brokerage":14.95,"currency":"AUD","value":12999.20},
  {"date":"2025-07-09","type":"Sell","ticker":"VBND","exchange":"ASX","name":"Vanguard Global Aggregate Bond","qty":-311,"price":41.902,"brokerage":14.95,"currency":"AUD","value":-13016.54},
  // VAP (closed - net 0)
  {"date":"2024-12-06","type":"Buy","ticker":"VAP","exchange":"ASX","name":"Vanguard Australian Property","qty":100,"price":99.64,"brokerage":14.95,"currency":"AUD","value":9978.95},
  {"date":"2025-03-14","type":"Buy","ticker":"VAP","exchange":"ASX","name":"Vanguard Australian Property","qty":11,"price":91.34,"brokerage":14.95,"currency":"AUD","value":1019.69},
  {"date":"2025-07-09","type":"Sell","ticker":"VAP","exchange":"ASX","name":"Vanguard Australian Property","qty":-111,"price":98.45,"brokerage":19.95,"currency":"AUD","value":-10908.00},
  // VHY (closed - net 0)
  {"date":"2025-01-24","type":"Buy","ticker":"VHY","exchange":"ASX","name":"Vanguard Australian Shares High Yield","qty":132,"price":75.53,"brokerage":14.95,"currency":"AUD","value":9984.91},
  {"date":"2025-02-07","type":"Buy","ticker":"VHY","exchange":"ASX","name":"Vanguard Australian Shares High Yield","qty":132,"price":75.49,"brokerage":14.95,"currency":"AUD","value":9979.63},
  {"date":"2025-07-22","type":"Buy","ticker":"VHY","exchange":"ASX","name":"Vanguard Australian Shares High Yield","qty":106,"price":75.20,"brokerage":14.95,"currency":"AUD","value":7986.15},
  {"date":"2025-12-08","type":"Sell","ticker":"VHY","exchange":"ASX","name":"Vanguard Australian Shares High Yield","qty":-170,"price":78.00,"brokerage":14.95,"currency":"AUD","value":-13245.05},
  {"date":"2026-01-16","type":"Sell","ticker":"VHY","exchange":"ASX","name":"Vanguard Australian Shares High Yield","qty":-200,"price":78.323,"brokerage":14.95,"currency":"AUD","value":-15649.60},
  // VBTC (closed - net 0)
  {"date":"2025-04-23","type":"Buy","ticker":"VBTC","exchange":"ASX","name":"VanEck Bitcoin ETF","qty":41,"price":29.58,"brokerage":14.95,"currency":"AUD","value":1227.73},
  {"date":"2025-04-28","type":"Sell","ticker":"VBTC","exchange":"ASX","name":"VanEck Bitcoin ETF","qty":-41,"price":29.78,"brokerage":14.95,"currency":"AUD","value":-1206.03},
  // PMGOLD (closed - net 0)
  {"date":"2026-01-29","type":"Buy","ticker":"PMGOLD","exchange":"ASX","name":"Perth Mint Gold","qty":77,"price":77.75,"brokerage":11.00,"currency":"AUD","value":5997.75},
  {"date":"2026-02-10","type":"Sell","ticker":"PMGOLD","exchange":"ASX","name":"Perth Mint Gold","qty":-77,"price":70.88,"brokerage":11.00,"currency":"AUD","value":-5446.76},
  // BTC (crypto direct)
  {"date":"2026-01-14","type":"Buy","ticker":"BTC","exchange":"CRYPTO","name":"Bitcoin","qty":0.0101,"price":155411.3535,"brokerage":14.85,"currency":"AUD","value":1579.00},
  {"date":"2026-01-21","type":"Buy","ticker":"BTC","exchange":"CRYPTO","name":"Bitcoin","qty":0.011,"price":134815.0781,"brokerage":22.39,"currency":"AUD","value":1507.54},
  {"date":"2026-01-28","type":"Buy","ticker":"BTC","exchange":"CRYPTO","name":"Bitcoin","qty":0.0019,"price":129493.0931,"brokerage":2.48,"currency":"AUD","value":250.00},
  {"date":"2026-02-02","type":"Buy","ticker":"BTC","exchange":"CRYPTO","name":"Bitcoin","qty":0.0086,"price":115083.41,"brokerage":9.98,"currency":"AUD","value":1000.00},
  {"date":"2026-02-04","type":"Buy","ticker":"BTC","exchange":"CRYPTO","name":"Bitcoin","qty":0.0023,"price":109492.7355,"brokerage":2.48,"currency":"AUD","value":250.00},
  {"date":"2026-02-08","type":"Buy","ticker":"BTC","exchange":"CRYPTO","name":"Bitcoin","qty":0.0025,"price":100220.5654,"brokerage":2.48,"currency":"AUD","value":250.00},
  {"date":"2026-02-11","type":"Buy","ticker":"BTC","exchange":"CRYPTO","name":"Bitcoin","qty":0.0025,"price":98789.7973,"brokerage":2.48,"currency":"AUD","value":250.00},
  {"date":"2026-02-11","type":"Buy","ticker":"BTC","exchange":"CRYPTO","name":"Bitcoin","qty":0.005,"price":98849.1722,"brokerage":4.95,"currency":"AUD","value":500.00},
  {"date":"2026-02-11","type":"Buy","ticker":"BTC","exchange":"CRYPTO","name":"Bitcoin","qty":0.0062,"price":98915.0855,"brokerage":6.09,"currency":"AUD","value":615.51},
  // IBTC
  {"date":"2024-12-06","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":61,"price":16.05,"brokerage":9.95,"currency":"AUD","value":989.00},
  {"date":"2025-03-10","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":61,"price":12.88,"brokerage":9.95,"currency":"AUD","value":795.63},
  {"date":"2025-03-14","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":46,"price":12.85,"brokerage":9.95,"currency":"AUD","value":601.05},
  {"date":"2025-04-28","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":83,"price":14.58,"brokerage":14.95,"currency":"AUD","value":1225.09},
  {"date":"2025-06-17","type":"Sell","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":-251,"price":16.30,"brokerage":14.95,"currency":"AUD","value":-4076.35},
  {"date":"2025-07-10","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":44,"price":16.83,"brokerage":0,"currency":"AUD","value":740.52},
  {"date":"2025-07-11","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":55,"price":17.47,"brokerage":0,"currency":"AUD","value":960.85},
  {"date":"2025-07-11","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":108,"price":17.49,"brokerage":11.00,"currency":"AUD","value":1899.92},
  {"date":"2025-07-30","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":11,"price":17.96,"brokerage":0,"currency":"AUD","value":197.56},
  {"date":"2025-08-01","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":8,"price":17.86,"brokerage":0,"currency":"AUD","value":142.88},
  {"date":"2025-10-01","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":42,"price":17.31,"brokerage":0,"currency":"AUD","value":727.02},
  {"date":"2025-10-31","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":20,"price":16.65,"brokerage":0,"currency":"AUD","value":333.00},
  {"date":"2025-11-18","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":3,"price":13.94,"brokerage":0,"currency":"AUD","value":41.82},
  {"date":"2025-11-28","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":10,"price":13.85,"brokerage":0,"currency":"AUD","value":138.50},
  {"date":"2025-12-04","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":64,"price":14.09,"brokerage":0,"currency":"AUD","value":901.76},
  {"date":"2025-12-12","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":52,"price":13.76,"brokerage":0,"currency":"AUD","value":715.52},
  {"date":"2025-12-30","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":3,"price":12.96,"brokerage":0,"currency":"AUD","value":38.88},
  {"date":"2026-01-05","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":30,"price":13.71,"brokerage":0,"currency":"AUD","value":411.30},
  {"date":"2026-01-15","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":18,"price":14.47,"brokerage":0,"currency":"AUD","value":260.46},
  {"date":"2026-01-21","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":32,"price":13.22,"brokerage":0,"currency":"AUD","value":423.04},
  {"date":"2026-02-09","type":"Buy","ticker":"IBTC","exchange":"CXA","name":"Monochrome Bitcoin ETF","qty":20,"price":10.13,"brokerage":0,"currency":"AUD","value":202.60},
  // EBTC (closed - net 0)
  {"date":"2025-05-07","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":38,"price":14.46,"brokerage":0,"currency":"AUD","value":549.48},
  {"date":"2025-07-10","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":8,"price":16.49,"brokerage":0,"currency":"AUD","value":131.92},
  {"date":"2025-07-11","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":107,"price":17.09,"brokerage":11.00,"currency":"AUD","value":1839.63},
  {"date":"2025-07-11","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":61,"price":17.04,"brokerage":11.00,"currency":"AUD","value":1050.44},
  {"date":"2025-07-30","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":12,"price":17.46,"brokerage":0,"currency":"AUD","value":209.52},
  {"date":"2025-10-01","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":42,"price":16.76,"brokerage":0,"currency":"AUD","value":703.92},
  {"date":"2025-10-10","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":2,"price":17.91,"brokerage":0,"currency":"AUD","value":35.82},
  {"date":"2025-10-31","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":9,"price":16.00,"brokerage":0,"currency":"AUD","value":144.00},
  {"date":"2025-11-03","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":21,"price":15.98,"brokerage":0,"currency":"AUD","value":335.58},
  {"date":"2025-11-18","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":3,"price":13.57,"brokerage":0,"currency":"AUD","value":40.71},
  {"date":"2025-11-28","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":10,"price":13.46,"brokerage":0,"currency":"AUD","value":134.60},
  {"date":"2025-12-04","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":66,"price":13.69,"brokerage":0,"currency":"AUD","value":903.54},
  {"date":"2025-12-12","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":52,"price":13.42,"brokerage":0,"currency":"AUD","value":697.84},
  {"date":"2025-12-30","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":3,"price":12.59,"brokerage":0,"currency":"AUD","value":37.77},
  {"date":"2026-01-05","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":29,"price":13.38,"brokerage":0,"currency":"AUD","value":388.02},
  {"date":"2026-01-13","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":4,"price":13.10,"brokerage":0,"currency":"AUD","value":52.40},
  {"date":"2026-01-15","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":17,"price":14.03,"brokerage":0,"currency":"AUD","value":238.51},
  {"date":"2026-01-21","type":"Buy","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":16,"price":12.83,"brokerage":0,"currency":"AUD","value":205.28},
  {"date":"2026-01-29","type":"Sell","ticker":"EBTC","exchange":"CXA","name":"Global X 21Shares Bitcoin ETF","qty":-500,"price":12.00,"brokerage":11.00,"currency":"AUD","value":-5989.00},
  // GOLD (ABC Bullion)
  {"date":"2026-01-29","type":"Buy","ticker":"GOLD","exchange":"OTHER","name":"ABC Bullion - Pool Allocated","qty":0.75,"price":8018.80,"brokerage":0,"currency":"AUD","value":6014.10},
  {"date":"2026-02-03","type":"Buy","ticker":"GOLD","exchange":"OTHER","name":"ABC Bullion - Pool Allocated","qty":0.15,"price":7190.60,"brokerage":0,"currency":"AUD","value":1078.59},
];

const TRADES_STORAGE_KEY = 'investment-tracker-trades';

export function seedPortfolio(): void {
  // Save current holdings as investments
  localStorage.setItem('investment-tracker-investments', JSON.stringify(CURRENT_HOLDINGS));
  // Save all trades for historical reference
  localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(ALL_TRADES));
  // Clear old historical portfolio data
  localStorage.removeItem('investment-tracker-historical-portfolio');
}

export function getStoredTrades(): Trade[] {
  try {
    const stored = localStorage.getItem(TRADES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
