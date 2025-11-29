# 🪙 Token Monitoring System

Automated monitoring system for Solana pump.fun tokens with real-time tracking, analytics, and strategy testing.

## 🚀 Features

- **Real-time Monitoring** - Track 5,000+ tokens simultaneously
- **Smart Filtering** - Dynamic tier-based tracking (15/30/60/120 min intervals)
- **Auto-cleanup** - Automatic archival of dead tokens
- **ML Ready** - Data collection for machine learning models
- **Scalable** - DMB (Data Mining Blocks) architecture
- **Multi-network** - Ready for Ethereum, Base, Polygon expansion

## 📁 Project Structure
```
token-monitoring-html/
├── index.html              # Dashboard (main page)
├── settings.html           # Settings & configuration
├── analytics.html          # Analytics & backtesting
├── tokens.html             # Token detail view
│
├── css/
│   ├── main.css           # Global styles
│   ├── components.css     # Reusable components
│   └── dashboard.css      # Dashboard-specific styles
│
├── js/
│   ├── config.js          # API configuration
│   ├── api.js             # API client with retry logic
│   ├── utils.js           # Utility functions
│   ├── pages/             # Page-specific logic
│   └── components/        # Reusable UI components
│
└── docs/
    ├── API_CONTRACTS.md   # API endpoint documentation
    ├── SETUP.md           # Setup instructions
    ├── DAILY_LOG.md       # Development log
    └── PROGRESS_TRACKER.md # Feature progress tracking
```

## 🛠️ Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari)
- Local web server (Python, Node.js, or Live Server)
- n8n instance running at neuralstar.ru

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Vitek192/token-monitoring-html.git
cd token-monitoring-html
```

2. Configure API endpoint in `js/config.js`:
```javascript
API_BASE_URL: 'https://neuralstar.ru/webhook'
```

3. Run local server:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

4. Open browser:
```
http://localhost:8000
```

## 🔧 Configuration

Edit `js/config.js` to customize:
- API endpoints
- Refresh intervals
- UI colors and themes
- Feature flags

## 📊 Architecture

### Data Flow
```
HTML Site (hocoton.ru)
    ↓ API calls
n8n Workflows (neuralstar.ru)
    ↓ Read/Write
PostgreSQL Database
    ↓ Fetch data
External APIs (GeckoTerminal, Birdeye)
```

### n8n Workflows
1. **Discovery** - Find new tokens every minute
2. **Tracker** - Update tokens on rolling schedule
3. **Cleanup** - Archive dead/expired tokens
4. **Health Monitor** - System health checks
5. **Dashboard API** - Webhook endpoints for HTML
6. **Config Management** - Settings & configuration

## 📖 Documentation

- [API Contracts](docs/API_CONTRACTS.md) - Complete API documentation
- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Daily Log](docs/DAILY_LOG.md) - Development progress
- [Progress Tracker](docs/PROGRESS_TRACKER.md) - Feature completion status

## 🎨 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Backend**: n8n workflows
- **Database**: PostgreSQL
- **APIs**: GeckoTerminal, Birdeye, DexScreener

## 🚧 Development Status

- [x] Project structure
- [x] Dashboard page
- [x] API client
- [x] Configuration system
- [ ] Settings page
- [ ] Analytics page
- [ ] Token detail page
- [ ] n8n workflows integration
- [ ] Testing & optimization

## 📝 License

Private project - All rights reserved

## 👤 Author

**Vitek192**
- GitHub: [@Vitek192](https://github.com/Vitek192)

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-29