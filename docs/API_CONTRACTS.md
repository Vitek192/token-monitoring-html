# API CONTRACTS - Token Monitoring System

**Last Updated:** 2025-01-29  
**Base URL:** `https://neuralstar.ru/webhook`

---

## 📋 Table of Contents

1. [General Rules](#general-rules)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [Tokens](#tokens)
   - [Statistics](#statistics)
   - [Status](#status)
   - [Configuration](#configuration)
   - [Analytics](#analytics)

---

## General Rules

### Response Format

All endpoints return JSON in this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-01-29T10:30:00Z"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error description",
  "code": 400,
  "timestamp": "2025-01-29T10:30:00Z"
}
```

### CORS Headers

All endpoints must include:
```
Access-Control-Allow-Origin: https://hocoton.ru
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Naming Convention

- **snake_case** for all fields
- Timestamps in ISO 8601 format (UTC)
- Decimal numbers as strings for precision

### Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Database/API error |

---

## Authentication

Currently: **No authentication required**

Future: API key in header `X-API-Key: your-key-here`

---

## Endpoints

### TOKENS

#### 1. Get Active Tokens
```
GET /api/tokens/active
```

**Description:** Retrieve list of currently monitored tokens

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| tier | integer | No | all | Filter by tier (1 or 2) |
| min_liquidity | integer | No | 0 | Minimum liquidity in USD |
| limit | integer | No | 100 | Max results (1-1000) |
| offset | integer | No | 0 | Pagination offset |
| sort | string | No | age | Sort by: age/liquidity/price |
| order | string | No | desc | Order: asc/desc |

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 15,
    "total": 1234,
    "offset": 0,
    "limit": 100,
    "tokens": [
      {
        "token_address": "ABC123...XYZ789",
        "symbol": "PUMP",
        "name": "Pump Token",
        "price_usd": "0.00045000",
        "liquidity_usd": "12500.00",
        "mcap_usd": "450000.00",
        "volume_24h_usd": "5600.00",
        "age_minutes": 45,
        "tier": 1,
        "status": "active",
        "discovered_at": "2025-01-29T09:45:00Z",
        "last_updated_at": "2025-01-29T10:15:00Z",
        "next_update_at": "2025-01-29T10:45:00Z",
        "buys_count": 234,
        "sells_count": 156
      }
    ]
  },
  "timestamp": "2025-01-29T10:30:00Z"
}
```

**Example Requests:**
```bash
# All active tokens
GET /api/tokens/active

# High priority only
GET /api/tokens/active?tier=1

# High liquidity, sorted
GET /api/tokens/active?min_liquidity=20000&sort=liquidity&order=desc&limit=50
```

---

#### 2. Get Token History
```
GET /api/tokens/:address/history
```

**Description:** Retrieve historical data for a specific token

**Path Parameters:**
- `address` - Token address (required)

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| from | datetime | No | 7 days ago | Start date (ISO 8601) |
| to | datetime | No | now | End date (ISO 8601) |
| interval | string | No | 30m | Data interval: 15m/30m/1h/6h |

**Response:**
```json
{
  "success": true,
  "data": {
    "token": {
      "address": "ABC123...XYZ789",
      "symbol": "PUMP",
      "name": "Pump Token",
      "status": "active"
    },
    "history": [
      {
        "timestamp": "2025-01-29T10:00:00Z",
        "price_usd_open": "0.00045",
        "price_usd_close": "0.00047",
        "price_usd_high": "0.00048",
        "price_usd_low": "0.00044",
        "volume_usd": "5600.00",
        "liquidity_usd": "12500.00",
        "buys_count": 45,
        "sells_count": 32,
        "age_minutes": 30
      }
    ],
    "count": 336,
    "period": {
      "from": "2025-01-22T10:00:00Z",
      "to": "2025-01-29T10:00:00Z"
    }
  },
  "timestamp": "2025-01-29T10:30:00Z"
}
```

---

### STATISTICS

#### 3. Get System Statistics
```
GET /api/stats/system
```

**Description:** Overall system statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "active_tokens": 4567,
    "discovered_today": 1234,
    "died_today": 987,
    "archived_total": 45678,
    "database_size_mb": 2340,
    "workflows": {
      "total": 6,
      "running": 5,
      "failed": 1
    },
    "dmb_blocks": {
      "total": 3,
      "healthy": 2,
      "unhealthy": 1
    },
    "api_stats": {
      "requests_per_minute": 78,
      "avg_response_time_ms": 450,
      "success_rate_pct": 98.5
    },
    "overall_health": 95.5
  },
  "timestamp": "2025-01-29T10:30:00Z"
}
```

---

### STATUS

#### 4. Get Workflows Status
```
GET /api/status/workflows
```

**Description:** Status of all n8n workflows

**Response:**
```json
{
  "success": true,
  "data": {
    "workflows": [
      {
        "id": "workflow_1",
        "name": "Discovery & Initial Tracking",
        "status": "running",
        "last_execution": {
          "started_at": "2025-01-29T10:29:00Z",
          "finished_at": "2025-01-29T10:29:15Z",
          "status": "success",
          "tokens_processed": 15
        },
        "stats": {
          "total_executions": 14400,
          "success_count": 14350,
          "failed_count": 50,
          "success_rate_pct": 99.65,
          "avg_duration_seconds": 12
        },
        "schedule": "Every 1 minute",
        "next_run": "2025-01-29T10:31:00Z"
      }
    ],
    "overall_health": 98.5
  },
  "timestamp": "2025-01-29T10:30:00Z"
}
```

---

#### 5. Get DMB Blocks Status
```
GET /api/status/dmb
```

**Description:** Status of Data Mining Blocks

**Response:**
```json
{
  "success": true,
  "data": {
    "blocks": [
      {
        "dmb_id": 1,
        "name": "DMB-GeckoTerminal-1",
        "status": "active",
        "is_healthy": true,
        "rate_limit_usage_pct": 75,
        "tokens_assigned": 2345,
        "avg_response_ms": 450,
        "last_heartbeat": "2025-01-29T10:29:50Z",
        "uptime_pct": 99.8
      }
    ]
  },
  "timestamp": "2025-01-29T10:30:00Z"
}
```

---

### CONFIGURATION

#### 6. Get Configuration
```
GET /api/config/get
```

**Parameters:**
- `category` (optional) - Filter by category: api/network/proxy/ai/system

**Response:**
```json
{
  "success": true,
  "data": {
    "api": {
      "geckoterminal_endpoint": {
        "value": "https://api.geckoterminal.com/api/v2",
        "is_secret": false,
        "validation_status": "valid",
        "last_tested_at": "2025-01-29T09:00:00Z"
      },
      "birdeye_api_key": {
        "value": "sk_***************",
        "is_secret": true,
        "validation_status": "untested"
      }
    },
    "network": {
      "active_network": {
        "value": "solana",
        "is_secret": false
      }
    }
  },
  "timestamp": "2025-01-29T10:30:00Z"
}
```

---

#### 7. Update Configuration
```
POST /api/config/update
```

**Request Body:**
```json
{
  "category": "api",
  "key": "birdeye_api_key",
  "value": "sk_new_key_12345"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updated": true,
    "category": "api",
    "key": "birdeye_api_key",
    "requires_test": true
  },
  "timestamp": "2025-01-29T10:30:00Z"
}
```

---

#### 8. Test Configuration
```
POST /api/config/test
```

**Request Body:**
```json
{
  "category": "api",
  "key": "birdeye_api_key"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "validation_status": "valid",
    "test_result": "API key is valid. Rate limit: 50 req/min",
    "response_time_ms": 234
  },
  "timestamp": "2025-01-29T10:30:00Z"
}
```

---

### ANALYTICS

#### 9. Get Correlations
```
POST /api/analytics/correlations
```

**Request Body:**
```json
{
  "target": "pump",
  "variables": ["liquidity", "buy_sell_ratio", "unique_wallets"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "correlations": [
      {
        "variable": "buy_sell_ratio_first_hour",
        "correlation": 0.78,
        "found_in_percent": 72,
        "sample_size": 892
      }
    ]
  },
  "timestamp": "2025-01-29T10:30:00Z"
}
```

---

#### 10. Run Backtest
```
POST /api/analytics/backtest
```

**Request Body:**
```json
{
  "strategy": {
    "name": "Pump Early Detector",
    "entry_conditions": {
      "buy_sell_ratio": "> 2.5",
      "liquidity": "> 20000"
    },
    "exit_conditions": {
      "roi": "> 300%",
      "stop_loss": "-20%"
    }
  },
  "period_days": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_trades": 456,
    "wins": 312,
    "losses": 144,
    "win_rate_pct": 68.4,
    "avg_profit_per_trade": 45.2,
    "total_roi_pct": 234.5,
    "max_drawdown_pct": -15.3
  },
  "timestamp": "2025-01-29T10:30:00Z"
}
```

---

## 📝 Notes

- All timestamps are in UTC (ISO 8601 format)
- Decimal values are returned as strings to preserve precision
- Rate limits apply per endpoint (check workflow configuration)
- CORS must be configured for cross-origin requests

---

**Version:** 1.0  
**Maintained by:** Vitek192