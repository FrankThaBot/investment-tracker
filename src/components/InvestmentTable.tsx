'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { Investment, CATEGORY_INFO, RISK_LEVELS } from '@/types/investment';
import { InvestmentForm } from './InvestmentForm';

interface InvestmentTableProps {
  investments: Investment[];
  onUpdate: (id: string, updates: Partial<Investment>) => void;
  onDelete: (id: string) => void;
}

export function InvestmentTable({ investments, onUpdate, onDelete }: InvestmentTableProps) {
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setShowEditDialog(true);
  };

  const handleEditSave = (updatedInvestment: Investment) => {
    if (editingInvestment) {
      // Preserve original ID when updating
      onUpdate(editingInvestment.id, { ...updatedInvestment, id: editingInvestment.id });
    }
    setShowEditDialog(false);
    setEditingInvestment(null);
  };

  const handleEditCancel = () => {
    setShowEditDialog(false);
    setEditingInvestment(null);
  };

  const handleDelete = (investment: Investment) => {
    if (window.confirm(`Are you sure you want to delete "${investment.assetName}"? This action cannot be undone.`)) {
      onDelete(investment.id);
    }
  };

  const calculateInvestmentMetrics = (investment: Investment) => {
    const currentValue = investment.currentPrice 
      ? investment.quantity * investment.currentPrice
      : investment.quantity * investment.purchasePrice;
    
    const gainLoss = currentValue - investment.totalCost;
    const gainLossPercent = (gainLoss / investment.totalCost) * 100;

    return {
      currentValue,
      gainLoss,
      gainLossPercent
    };
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (investments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Investments</CardTitle>
          <CardDescription>No investments found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No investments yet</p>
            <p className="text-muted-foreground">Add your first investment to get started tracking your portfolio.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Investments</CardTitle>
        <CardDescription>
          {investments.length} investment{investments.length !== 1 ? 's' : ''} in your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Gain/Loss</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => {
                const { currentValue, gainLoss, gainLossPercent } = calculateInvestmentMetrics(investment);
                const categoryInfo = CATEGORY_INFO[investment.category];
                const riskInfo = RISK_LEVELS[investment.riskLevel];

                return (
                  <TableRow key={investment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{investment.assetName}</div>
                        {investment.ticker && (
                          <div className="text-sm text-muted-foreground">{investment.ticker}</div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        style={{ borderColor: categoryInfo.color, color: categoryInfo.color }}
                      >
                        {categoryInfo.label}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="outline"
                        style={{ borderColor: riskInfo.color, color: riskInfo.color }}
                      >
                        {riskInfo.label}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      {investment.quantity.toLocaleString('en-US', { 
                        minimumFractionDigits: investment.quantity < 1 ? 4 : 0,
                        maximumFractionDigits: investment.quantity < 1 ? 4 : 2
                      })}
                    </TableCell>
                    
                    <TableCell>
                      {formatCurrency(investment.purchasePrice, investment.currency)}
                    </TableCell>
                    
                    <TableCell>
                      {investment.currentPrice ? (
                        <div>
                          <div>{formatCurrency(investment.currentPrice, investment.currency)}</div>
                          {investment.lastUpdated && (
                            <div className="text-xs text-muted-foreground">
                              {new Date(investment.lastUpdated).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {formatCurrency(investment.totalCost, investment.currency)}
                    </TableCell>
                    
                    <TableCell>
                      {formatCurrency(currentValue, investment.currency)}
                    </TableCell>
                    
                    <TableCell>
                      <div className={`${
                        gainLoss > 0 
                          ? 'text-green-600' 
                          : gainLoss < 0 
                            ? 'text-red-600' 
                            : 'text-muted-foreground'
                      }`}>
                        <div className="flex items-center gap-1">
                          {gainLoss > 0 && <TrendingUp className="h-3 w-3" />}
                          {gainLoss < 0 && <TrendingDown className="h-3 w-3" />}
                          {gainLoss === 0 && <Minus className="h-3 w-3" />}
                          {formatCurrency(Math.abs(gainLoss), investment.currency)}
                        </div>
                        <div className="text-xs">
                          {gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {formatDate(investment.purchaseDate)}
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleEdit(investment)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(investment)}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {investments.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Investments</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatCurrency(
                investments.reduce((sum, inv) => sum + inv.totalCost, 0)
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total Invested</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatCurrency(
                investments.reduce((sum, inv) => {
                  const currentValue = inv.currentPrice 
                    ? inv.quantity * inv.currentPrice
                    : inv.quantity * inv.purchasePrice;
                  return sum + currentValue;
                }, 0)
              )}
            </div>
            <div className="text-sm text-muted-foreground">Current Value</div>
          </div>
        </div>
      </CardContent>

      {/* Edit Investment Dialog */}
      {showEditDialog && editingInvestment && (
        <InvestmentForm
          open={showEditDialog}
          onClose={handleEditCancel}
          onSave={handleEditSave}
          editingInvestment={editingInvestment}
        />
      )}
    </Card>
  );
}