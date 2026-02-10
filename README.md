# Investment Tracker 📈

A modern, local-first investment portfolio tracker built with Next.js. Track your investments, analyze performance, and prepare for different market scenarios without sharing your financial data with third parties.

![Investment Tracker Dashboard](./docs/dashboard-preview.png)

## Features ✨

### Core Portfolio Management
- **Investment CRUD**: Add, edit, and delete investments with detailed information
- **Real-time Pricing**: Automatic price updates from Yahoo Finance and Alpha Vantage APIs
- **Multiple Asset Classes**: Stocks, ETFs, crypto, commodities, real estate, fixed income
- **Risk Assessment**: Categorize investments by risk level (safe, moderate, risky, speculative)
- **Portfolio Analytics**: Calculate gains/losses, total value, and performance metrics

### Visual Dashboard
- **Portfolio Value Over Time**: Line chart tracking your portfolio growth
- **Category Breakdown**: Pie chart showing investment distribution by asset type
- **Risk Allocation**: Visual representation of your risk exposure
- **Performance by Asset**: Bar chart showing individual investment performance
- **Responsive Design**: Works perfectly on desktop and mobile devices

### Market Scenario Analysis
- **Scenario Planning**: Tag investments with market scenarios they thrive in
- **Portfolio Strength**: Analyze how well your portfolio performs in different market conditions
- **Recommendations**: Get suggestions for improving scenario coverage
- **Risk Assessment**: Identify potential vulnerabilities in your portfolio

### Technical Features
- **Local Storage**: All data stored locally in your browser (privacy-first)
- **Dark Mode**: Beautiful dark theme optimized for financial dashboards
- **Progressive Web App**: Install and use like a native app
- **No Authentication**: Start using immediately without accounts or sign-ups
- **Export/Import**: Backup your data easily (planned feature)

## Getting Started 🚀

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/FrankThaBot/investment-tracker.git
cd investment-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide 📊

### Adding Your First Investment

1. Click the **"+" button** in the top-right corner of the dashboard
2. Fill in the investment details:
   - **Asset Name**: The name of your investment (e.g., "Apple Inc.")
   - **Ticker Symbol**: Optional, used for automatic price updates (e.g., "AAPL")
   - **Category**: Select the asset type (equity, crypto, commodity, etc.)
   - **Risk Level**: Assess the investment's risk profile
   - **Market Scenarios**: Tag scenarios where this investment typically performs well
   - **Purchase Details**: Date, quantity, price, and fees

3. Click **"Add Investment"** to save

### Managing Investments

- **Edit**: Click the three dots menu next to any investment and select "Edit"
- **Delete**: Click the three dots menu and select "Delete" (confirmation required)
- **Refresh Prices**: Click the refresh button to update current market prices

### Understanding Your Dashboard

#### Portfolio Overview Cards
- **Total Value**: Current worth of all investments
- **Total Gain/Loss**: How much you've gained or lost since purchase
- **Total Invested**: Amount of money you've put into investments
- **Actions**: Quick access to refresh prices and add investments

#### Charts
- **Portfolio Value Over Time**: Shows your portfolio's growth trajectory
- **Investment Categories**: Breakdown of your investments by asset type
- **Risk Allocation**: How your investments are distributed across risk levels
- **Performance by Asset**: Individual investment performance comparison

#### Market Scenario Analysis
- **Scenario Strength**: How well-prepared your portfolio is for different market conditions
- **Strong Coverage**: Scenarios where you have good exposure
- **Weak Coverage**: Areas where you might want to consider additional investments
- **Recommendations**: Suggestions for improving portfolio resilience

## API Configuration 🔧

### Yahoo Finance (Default, Free)
The app uses Yahoo Finance by default for stock and crypto prices. No setup required.

### Alpha Vantage (Optional, Enhanced Features)
For additional features and more reliable data:

1. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. The app will prompt you to enter the key when needed
3. Provides access to:
   - More reliable stock data
   - Additional technical indicators
   - Better rate limits

**Note**: API keys are stored locally in your browser and never shared.

## Supported Assets 💎

### Stocks & ETFs
- US stocks (AAPL, MSFT, GOOGL, etc.)
- ETFs (SPY, QQQ, VTI, etc.)
- International stocks with Yahoo Finance tickers

### Cryptocurrencies
- Bitcoin (BTC-USD)
- Ethereum (ETH-USD)
- Other major cryptocurrencies
- Automatic conversion to USD pricing

### Commodities
- Gold (GLD)
- Silver (SLV)
- Oil (USO)
- Other commodity ETFs

### Fixed Income
- Treasury ETFs (TLT, IEF, SHY)
- Corporate bond ETFs (LQD, HYG)
- International bonds

### Real Estate
- REIT ETFs (VNQ, REIT)
- Real estate focused investments

## Data Privacy & Security 🔒

### Local-First Architecture
- **All data stored locally** in your browser's localStorage
- **No server dependencies** for core functionality
- **No user accounts** or personal data collection
- **No tracking** or analytics

### API Usage
- Price data fetched directly from public APIs
- **No data sent to our servers**
- API keys (if used) stored locally only

### Data Backup
Your data is stored locally, so consider:
- Regular browser data backups
- Export functionality (coming soon)
- Manual data recording for important investments

## Tech Stack ⚙️

- **Frontend**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts
- **Data Storage**: Browser localStorage
- **APIs**: Yahoo Finance, Alpha Vantage (optional)
- **Icons**: Lucide React

## Development 🛠️

### Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── Dashboard.tsx   # Main dashboard component
│   ├── InvestmentForm.tsx
│   └── InvestmentTable.tsx
├── lib/                # Utility functions
│   ├── api.ts         # Price fetching APIs
│   └── storage.ts     # Local storage utilities
└── types/             # TypeScript type definitions
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Roadmap 🗺️

### Planned Features
- [ ] Data export/import functionality
- [ ] Portfolio sharing (read-only links)
- [ ] More detailed analytics and charts
- [ ] Dividend tracking
- [ ] Tax reporting assistance
- [ ] Mobile app (React Native)
- [ ] Backup to cloud storage (optional)
- [ ] Advanced portfolio optimization suggestions

### API Integrations
- [ ] Additional price data sources
- [ ] Economic indicators integration
- [ ] News sentiment analysis
- [ ] Fundamental data (P/E ratios, etc.)

## Troubleshooting 🔧

### Price Updates Not Working
1. Check if the ticker symbol is correct
2. Try refreshing the page
3. Some symbols may not be available on Yahoo Finance
4. Consider adding an Alpha Vantage API key for better coverage

### Data Not Persisting
1. Ensure browser localStorage is enabled
2. Check if you're in private/incognito mode
3. Browser extensions might block localStorage

### Performance Issues
1. Try refreshing the page
2. Clear browser data and re-add investments
3. Reduce the number of historical data points

## Support 💬

- **Issues**: [GitHub Issues](https://github.com/FrankThaBot/investment-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FrankThaBot/investment-tracker/discussions)
- **Documentation**: Check this README and inline help

## License 📄

MIT License - see [LICENSE](LICENSE) file for details.

## Disclaimer ⚠️

This tool is for educational and informational purposes only. It is not financial advice. Always consult with qualified financial advisors before making investment decisions. Past performance does not guarantee future results.

---

Built with ❤️ by [FrankThaBot](https://github.com/FrankThaBot)