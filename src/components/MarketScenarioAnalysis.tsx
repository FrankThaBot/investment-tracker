'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, Shield, Activity } from 'lucide-react';
import { Investment, MarketScenario, MARKET_SCENARIOS } from '@/types/investment';

interface MarketScenarioAnalysisProps {
  investments: Investment[];
}

interface ScenarioAnalysis {
  scenario: MarketScenario;
  label: string;
  description: string;
  exposure: number; // percentage of portfolio value exposed to this scenario
  exposureValue: number; // dollar value
  investmentCount: number; // number of investments that thrive in this scenario
  strengthScore: number; // 0-100, how well prepared the portfolio is for this scenario
}

export function MarketScenarioAnalysis({ investments }: MarketScenarioAnalysisProps) {
  const scenarioAnalysis = useMemo(() => {
    if (investments.length === 0) return [];

    // Calculate total portfolio value
    const totalValue = investments.reduce((sum, inv) => {
      const currentValue = inv.currentPrice 
        ? inv.quantity * inv.currentPrice
        : inv.quantity * inv.purchasePrice;
      return sum + currentValue;
    }, 0);

    if (totalValue === 0) return [];

    // Analyze each market scenario
    const scenarios: ScenarioAnalysis[] = Object.entries(MARKET_SCENARIOS).map(([scenarioKey, scenarioInfo]) => {
      const scenario = scenarioKey as MarketScenario;
      
      // Find investments that thrive in this scenario
      const relevantInvestments = investments.filter(inv => 
        inv.marketScenarios.includes(scenario)
      );

      // Calculate exposure
      const exposureValue = relevantInvestments.reduce((sum, inv) => {
        const currentValue = inv.currentPrice 
          ? inv.quantity * inv.currentPrice
          : inv.quantity * inv.purchasePrice;
        return sum + currentValue;
      }, 0);

      const exposure = totalValue > 0 ? (exposureValue / totalValue) * 100 : 0;

      // Calculate strength score based on exposure and diversity
      let strengthScore = 0;
      if (exposure > 0) {
        // Base score from exposure (0-70)
        strengthScore += Math.min(exposure * 1.4, 70);
        
        // Bonus for having multiple different investments (0-30)
        const uniqueCategories = new Set(relevantInvestments.map(inv => inv.category));
        const diversityBonus = Math.min(uniqueCategories.size * 10, 30);
        strengthScore += diversityBonus;
      }

      return {
        scenario,
        label: scenarioInfo.label,
        description: scenarioInfo.description,
        exposure: Math.round(exposure * 100) / 100,
        exposureValue,
        investmentCount: relevantInvestments.length,
        strengthScore: Math.min(Math.round(strengthScore), 100)
      };
    });

    // Sort by strength score (highest first)
    return scenarios.sort((a, b) => b.strengthScore - a.strengthScore);
  }, [investments]);

  const getStrengthColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrengthIcon = (score: number) => {
    if (score >= 70) return <Shield className="h-4 w-4 text-green-600" />;
    if (score >= 40) return <Activity className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const getStrengthLabel = (score: number) => {
    if (score >= 70) return 'Strong';
    if (score >= 40) return 'Moderate';
    if (score >= 15) return 'Weak';
    return 'None';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (investments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Scenario Analysis
          </CardTitle>
          <CardDescription>
            Analyze how your portfolio performs in different market conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No investments to analyze</p>
            <p className="text-muted-foreground">Add investments to see how your portfolio performs in different market scenarios.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const strongScenarios = scenarioAnalysis.filter(s => s.strengthScore >= 70);
  const weakScenarios = scenarioAnalysis.filter(s => s.strengthScore < 15);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Scenario Analysis
          </CardTitle>
          <CardDescription>
            How well your portfolio is positioned for different market conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{strongScenarios.length}</div>
              <div className="text-sm text-muted-foreground">Strong Scenarios</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {scenarioAnalysis.filter(s => s.strengthScore >= 40 && s.strengthScore < 70).length}
              </div>
              <div className="text-sm text-muted-foreground">Moderate Scenarios</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{weakScenarios.length}</div>
              <div className="text-sm text-muted-foreground">Weak/No Coverage</div>
            </div>
          </div>

          {/* Scenario Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium">Scenario Strength Breakdown</h4>
            <div className="space-y-3">
              {scenarioAnalysis.map((analysis) => (
                <div key={analysis.scenario} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStrengthIcon(analysis.strengthScore)}
                      <span className="font-medium">{analysis.label}</span>
                      <Badge variant="outline" className={getStrengthColor(analysis.strengthScore)}>
                        {getStrengthLabel(analysis.strengthScore)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {analysis.exposure.toFixed(1)}% • {analysis.investmentCount} investments
                    </div>
                  </div>
                  
                  <Progress 
                    value={analysis.strengthScore} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{analysis.description}</span>
                    {analysis.exposureValue > 0 && (
                      <span>{formatCurrency(analysis.exposureValue)} exposed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Recommendations</CardTitle>
          <CardDescription>Suggestions to improve your market scenario coverage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Strong Areas */}
            {strongScenarios.length > 0 && (
              <div>
                <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Strong Coverage
                </h4>
                <div className="text-sm text-muted-foreground mb-2">
                  Your portfolio is well-positioned for these scenarios:
                </div>
                <div className="flex flex-wrap gap-2">
                  {strongScenarios.map((scenario) => (
                    <Badge key={scenario.scenario} variant="outline" className="text-green-600 border-green-600">
                      {scenario.label} ({scenario.exposure.toFixed(1)}%)
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Weak Areas */}
            {weakScenarios.length > 0 && (
              <div>
                <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Areas for Improvement
                </h4>
                <div className="text-sm text-muted-foreground mb-2">
                  Consider adding investments that perform well in these scenarios:
                </div>
                <div className="space-y-2">
                  {weakScenarios.map((scenario) => (
                    <div key={scenario.scenario} className="flex items-center justify-between">
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        {scenario.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {scenario.strengthScore}% coverage
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Tips */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">General Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Diversify across different asset categories to improve scenario coverage</li>
                <li>• Consider adding assets that thrive in scenarios where you're underexposed</li>
                <li>• Regularly review and rebalance your portfolio as market conditions change</li>
                <li>• Remember that no portfolio can be perfectly prepared for all scenarios</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}