'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Plus, RefreshCw, DollarSign, Target, AlertTriangle, Activity, Upload } from 'lucide-react';
import { Investment, Portfolio, CATEGORY_INFO, RISK_LEVELS, MARKET_SCENARIOS } from '@/types/investment';
import { InvestmentStorage, PortfolioCalculator, HistoricalDataStorage } from '@/lib/storage';
import { PriceService } from '@/lib/api';
import { InvestmentForm } from './InvestmentForm';
import { InvestmentTable } from './InvestmentTable';
import { MarketScenarioAnalysis } from './MarketScenarioAnalysis';
import { seedPortfolio } from '@/lib/seed-data';

interface DashboardProps {
  initialInvestments?: Investment[];
}

export function Dashboard({ initialInvestments = [] }: DashboardProps) {
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [seeded, setSeeded] = useState(false);

  // Load investments on component mount - auto-seed if empty
  useEffect(() => {
    let loadedInvestments = InvestmentStorage.getInvestments();
    if (loadedInvestments.length === 0 && !seeded) {
      seedPortfolio();
      loadedInvestments = InvestmentStorage.getInvestments();
      setSeeded(true);
    }
    setInvestments(loadedInvestments);
    calculatePortfolio(loadedInvestments);
  }, [seeded]);

  // Calculate portfolio metrics
  const calculatePortfolio = (invs: Investment[]) => {
    const calculatedPortfolio = PortfolioCalculator.calculatePortfolio(invs);
    setPortfolio(calculatedPortfolio);
    setLastUpdated(new Date().toLocaleString());
    
    // Save historical data point
    if (calculatedPortfolio.totalValue > 0) {
      HistoricalDataStorage.addPortfolioDataPoint({
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        value: calculatedPortfolio.totalValue
      });
    }
  };

  // Refresh prices from APIs
  const refreshPrices = async () => {
    setIsRefreshing(true);
    
    try {
      // Re-read from storage to avoid stale closure
      const currentInvestments = InvestmentStorage.getInvestments();
      if (currentInvestments.length === 0) {
        setIsRefreshing(false);
        return;
      }
      
      const updatedInvestments = [...currentInvestments];
      
      // Get symbols that have tickers
      const symbolsToFetch = currentInvestments
        .filter(inv => inv.ticker)
        .map(inv => PriceService.normalizeSymbol(inv.ticker!, inv.category));
      
      if (symbolsToFetch.length === 0) {
        // No tickers to fetch, just recalculate
        setInvestments(updatedInvestments);
        calculatePortfolio(updatedInvestments);
        setIsRefreshing(false);
        return;
      }
      
      const priceData = await PriceService.fetchMultiplePrices(symbolsToFetch);
      
      // Update investments with new prices
      updatedInvestments.forEach((investment, index) => {
        if (investment.ticker) {
          const normalizedSymbol = PriceService.normalizeSymbol(investment.ticker, investment.category);
          const priceInfo = priceData[normalizedSymbol];
          
          if (priceInfo) {
            updatedInvestments[index] = {
              ...investment,
              currentPrice: priceInfo.price,
              lastUpdated: priceInfo.lastUpdated,
              dataSource: 'yahoo'
            };
          }
        }
      });
      
      // Save and update state
      InvestmentStorage.saveInvestments(updatedInvestments);
      setInvestments(updatedInvestments);
      calculatePortfolio(updatedInvestments);
      
    } catch (error) {
      console.error('Error refreshing prices:', error);
      // Still reload from storage even on error
      try {
        const fallback = InvestmentStorage.getInvestments();
        setInvestments(fallback);
        calculatePortfolio(fallback);
      } catch (_) {
        // ignore
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Add new investment
  const handleAddInvestment = (newInvestment: Investment) => {
    InvestmentStorage.addInvestment(newInvestment);
    const updatedInvestments = [...investments, newInvestment];
    setInvestments(updatedInvestments);
    calculatePortfolio(updatedInvestments);
    setShowAddInvestment(false);
  };

  // Update existing investment
  const handleUpdateInvestment = (id: string, updates: Partial<Investment>) => {
    InvestmentStorage.updateInvestment(id, updates);
    const updatedInvestments = investments.map(inv => 
      inv.id === id ? { ...inv, ...updates } : inv
    );
    setInvestments(updatedInvestments);
    calculatePortfolio(updatedInvestments);
  };

  // Delete investment
  const handleDeleteInvestment = (id: string) => {
    InvestmentStorage.deleteInvestment(id);
    const updatedInvestments = investments.filter(inv => inv.id !== id);
    setInvestments(updatedInvestments);
    calculatePortfolio(updatedInvestments);
  };

  // Memoized calculations for charts
  const categoryData = useMemo(() => {
    if (!portfolio) return [];
    
    const breakdown = PortfolioCalculator.getCategoryBreakdown(investments);
    return Object.entries(breakdown).map(([category, data]) => ({
      name: CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]?.label || category,
      value: data.value,
      percentage: data.percentage,
      color: CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]?.color || '#8884d8',
      count: data.count
    }));
  }, [portfolio, investments]);

  const riskData = useMemo(() => {
    if (!portfolio) return [];
    
    const breakdown = PortfolioCalculator.getRiskBreakdown(investments);
    return Object.entries(breakdown).map(([risk, data]) => ({
      name: RISK_LEVELS[risk as keyof typeof RISK_LEVELS]?.label || risk,
      value: data.value,
      percentage: data.percentage,
      color: RISK_LEVELS[risk as keyof typeof RISK_LEVELS]?.color || '#8884d8',
      count: data.count
    }));
  }, [portfolio, investments]);

  const historicalData = useMemo(() => {
    const data = HistoricalDataStorage.getPortfolioHistoricalData();
    return data.map(point => ({
      date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: point.value
    }));
  }, [portfolio]);

  const performanceData = useMemo(() => {
    return investments.map(inv => {
      const currentValue = inv.currentPrice ? inv.quantity * inv.currentPrice : inv.quantity * inv.purchasePrice;
      const gainLoss = currentValue - inv.totalCost;
      const gainLossPercent = (gainLoss / inv.totalCost) * 100;
      
      return {
        name: inv.assetName.length > 15 ? inv.assetName.substring(0, 15) + '...' : inv.assetName,
        gainLoss: gainLoss,
        gainLossPercent: gainLossPercent,
        value: currentValue
      };
    });
  }, [investments]);

  if (!portfolio) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              {lastUpdated && `Updated ${lastUpdated}`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            {portfolio.totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolio.totalGainLoss >= 0 ? '+' : ''}${portfolio.totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className={`text-xs ${portfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolio.totalGainLoss >= 0 ? '+' : ''}{portfolio.totalGainLossPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolio.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              {investments.length} investment{investments.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
            <div className="flex space-x-1">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  if (window.confirm('Re-import Sharesight data? This replaces all current investments.')) {
                    seedPortfolio();
                    const fresh = InvestmentStorage.getInvestments();
                    setInvestments(fresh);
                    calculatePortfolio(fresh);
                  }
                }}
                title="Re-import Sharesight data"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={refreshPrices}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                size="sm" 
                onClick={() => setShowAddInvestment(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">—</div>
            <p className="text-xs text-muted-foreground">
              Refresh prices & add investments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Value Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value Over Time</CardTitle>
            <CardDescription>Track your portfolio growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number | undefined) => value ? [`$${value.toLocaleString()}`, 'Portfolio Value'] : ['--', 'Portfolio Value']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(221, 83%, 53%)" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Categories</CardTitle>
            <CardDescription>Portfolio breakdown by asset type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => percent && percent > 0.05 ? `${name}: ${(percent * 100).toFixed(1)}%` : ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number | undefined, name) => [
                      value ? `$${value.toLocaleString()}` : '--',
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Allocation</CardTitle>
            <CardDescription>Portfolio breakdown by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => percent && percent > 0.05 ? `${name}: ${(percent * 100).toFixed(1)}%` : ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number | undefined, name) => [
                      value ? `$${value.toLocaleString()}` : '--',
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance by Asset */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Asset</CardTitle>
            <CardDescription>Gain/loss for each investment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number | undefined) => [
                      value !== undefined ? `${value >= 0 ? '+' : ''}$${value.toLocaleString()}` : '--',
                      'Gain/Loss'
                    ]}
                  />
                  <Bar dataKey="gainLoss" fill="hsl(221, 83%, 53%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Scenario Analysis */}
      <MarketScenarioAnalysis investments={investments} />

      {/* Investments Table */}
      <InvestmentTable 
        investments={investments}
        onUpdate={handleUpdateInvestment}
        onDelete={handleDeleteInvestment}
      />

      {/* Add Investment Dialog */}
      {showAddInvestment && (
        <InvestmentForm
          open={showAddInvestment}
          onClose={() => setShowAddInvestment(false)}
          onSave={handleAddInvestment}
        />
      )}
    </div>
  );
}