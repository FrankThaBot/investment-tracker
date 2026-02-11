import { NextRequest, NextResponse } from 'next/server';

// Server-side price fetcher - no CORS issues
export async function GET(request: NextRequest) {
  const symbols = request.nextUrl.searchParams.get('symbols');
  if (!symbols) {
    return NextResponse.json({ error: 'symbols parameter required' }, { status: 400 });
  }

  const symbolList = symbols.split(',').map(s => s.trim()).filter(Boolean);
  const results: Record<string, { price: number; change: number; changePercent: number; lastUpdated: string } | null> = {};

  for (const symbol of symbolList) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        },
        next: { revalidate: 300 }, // cache 5 min
      });

      if (!response.ok) {
        results[symbol] = null;
        continue;
      }

      const data = await response.json();
      const result = data.chart?.result?.[0];
      if (!result?.meta) {
        results[symbol] = null;
        continue;
      }

      const meta = result.meta;
      const currentPrice = meta.regularMarketPrice || 0;
      const previousClose = meta.previousClose || 0;
      const change = currentPrice - previousClose;
      const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

      results[symbol] = {
        price: currentPrice,
        change,
        changePercent,
        lastUpdated: new Date().toISOString(),
      };
    } catch {
      results[symbol] = null;
    }
  }

  // Also provide gold price per oz in AUD (for ABC Bullion)
  // Fetch gold spot USD and AUD/USD rate
  try {
    const [goldResp, fxResp] = await Promise.all([
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=1d', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 300 },
      }),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/AUDUSD=X?interval=1d&range=1d', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 300 },
      }),
    ]);

    if (goldResp.ok && fxResp.ok) {
      const goldData = await goldResp.json();
      const fxData = await fxResp.json();
      const goldUSD = goldData.chart?.result?.[0]?.meta?.regularMarketPrice;
      const audRate = fxData.chart?.result?.[0]?.meta?.regularMarketPrice;

      if (goldUSD && audRate) {
        const goldAUD = goldUSD / audRate;
        results['GOLD_OZ_AUD'] = {
          price: goldAUD,
          change: 0,
          changePercent: 0,
          lastUpdated: new Date().toISOString(),
        };
      }
    }
  } catch {
    // gold price fetch failed, skip
  }

  return NextResponse.json(results);
}
