'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Investment, InvestmentCategory, RiskLevel, MarketScenario, CATEGORY_INFO, RISK_LEVELS, MARKET_SCENARIOS } from '@/types/investment';
import { generateId } from '@/lib/storage';

interface InvestmentFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (investment: Investment) => void;
  editingInvestment?: Investment;
}

export function InvestmentForm({ open, onClose, onSave, editingInvestment }: InvestmentFormProps) {
  const [formData, setFormData] = useState({
    assetName: editingInvestment?.assetName || '',
    ticker: editingInvestment?.ticker || '',
    category: editingInvestment?.category || 'equity' as InvestmentCategory,
    riskLevel: editingInvestment?.riskLevel || 'moderate' as RiskLevel,
    purchaseDate: editingInvestment?.purchaseDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    quantity: editingInvestment?.quantity?.toString() || '',
    purchasePrice: editingInvestment?.purchasePrice?.toString() || '',
    fees: editingInvestment?.fees?.toString() || '0',
    currency: editingInvestment?.currency || 'USD',
    notes: editingInvestment?.notes || ''
  });

  const [marketScenarios, setMarketScenarios] = useState<MarketScenario[]>(
    editingInvestment?.marketScenarios || []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleMarketScenario = (scenario: MarketScenario) => {
    setMarketScenarios(prev => 
      prev.includes(scenario) 
        ? prev.filter(s => s !== scenario)
        : [...prev, scenario]
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.assetName.trim()) {
      newErrors.assetName = 'Asset name is required';
    }

    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (!formData.purchasePrice || isNaN(Number(formData.purchasePrice)) || Number(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Valid purchase price is required';
    }

    if (formData.fees && isNaN(Number(formData.fees))) {
      newErrors.fees = 'Fees must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const quantity = Number(formData.quantity);
    const purchasePrice = Number(formData.purchasePrice);
    const fees = Number(formData.fees) || 0;
    const totalCost = quantity * purchasePrice + fees;

    const investment: Investment = {
      id: editingInvestment?.id || generateId(),
      assetName: formData.assetName.trim(),
      ticker: formData.ticker.trim() || undefined,
      category: formData.category,
      riskLevel: formData.riskLevel,
      marketScenarios,
      purchaseDate: new Date(formData.purchaseDate).toISOString(),
      quantity,
      purchasePrice,
      fees,
      totalCost,
      currency: formData.currency,
      notes: formData.notes.trim() || undefined,
      // Keep existing current price data if editing
      currentPrice: editingInvestment?.currentPrice,
      lastUpdated: editingInvestment?.lastUpdated,
      dataSource: editingInvestment?.dataSource
    };

    onSave(investment);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
          </DialogTitle>
          <DialogDescription>
            {editingInvestment 
              ? 'Update your investment details below.'
              : 'Add a new investment to your portfolio.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetName">Asset Name *</Label>
              <Input
                id="assetName"
                placeholder="e.g., Apple Inc."
                value={formData.assetName}
                onChange={(e) => handleInputChange('assetName', e.target.value)}
                className={errors.assetName ? 'border-red-500' : ''}
              />
              {errors.assetName && (
                <p className="text-sm text-red-500">{errors.assetName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticker">Ticker Symbol</Label>
              <Input
                id="ticker"
                placeholder="e.g., AAPL"
                value={formData.ticker}
                onChange={(e) => handleInputChange('ticker', e.target.value.toUpperCase())}
              />
              <p className="text-xs text-muted-foreground">
                Optional. Used for automatic price updates.
              </p>
            </div>
          </div>

          {/* Category and Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(value: InvestmentCategory) => 
                handleInputChange('category', value)
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CATEGORY_INFO).map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Risk Level *</Label>
              <Select value={formData.riskLevel} onValueChange={(value: RiskLevel) => 
                handleInputChange('riskLevel', value)
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RISK_LEVELS).map(([key, risk]) => (
                    <SelectItem key={key} value={key}>
                      {risk.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Market Scenarios */}
          <div className="space-y-2">
            <Label>Market Scenarios</Label>
            <p className="text-sm text-muted-foreground">
              Select scenarios where this investment typically performs well.
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(MARKET_SCENARIOS).map(([key, scenario]) => (
                <Badge
                  key={key}
                  variant={marketScenarios.includes(key as MarketScenario) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleMarketScenario(key as MarketScenario)}
                >
                  {scenario.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Purchase Details */}
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-medium mb-4">Purchase Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date *</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500">{errors.quantity}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => 
                    handleInputChange('currency', value)
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price *</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.purchasePrice}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    className={errors.purchasePrice ? 'border-red-500' : ''}
                  />
                  {errors.purchasePrice && (
                    <p className="text-sm text-red-500">{errors.purchasePrice}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fees">Fees & Commissions</Label>
                  <Input
                    id="fees"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.fees}
                    onChange={(e) => handleInputChange('fees', e.target.value)}
                    className={errors.fees ? 'border-red-500' : ''}
                  />
                  {errors.fees && (
                    <p className="text-sm text-red-500">{errors.fees}</p>
                  )}
                </div>
              </div>

              {/* Total Cost Calculation */}
              {formData.quantity && formData.purchasePrice && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Quantity × Price:</span>
                      <span>${(Number(formData.quantity) * Number(formData.purchasePrice)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fees:</span>
                      <span>${Number(formData.fees || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1 mt-1">
                      <span>Total Cost:</span>
                      <span>${(Number(formData.quantity) * Number(formData.purchasePrice) + Number(formData.fees || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md resize-vertical"
              placeholder="Additional notes about this investment..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingInvestment ? 'Update Investment' : 'Add Investment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}