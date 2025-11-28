// ============================================
// TOKEN MONITORING SYSTEM - CONFIGURATION
// ============================================

const CONFIG = {
    // n8n API Base URL
    API_BASE_URL: 'https://neuralstar.ru/webhook',
    
    // Website URL
    SITE_URL: 'https://hocoton.ru',
    
    // API Settings
    API: {
      timeout: 30000,           // 30 seconds
      retryAttempts: 3,
      retryDelay: 1000,         // 1 second
    },
    
    // Auto-refresh intervals (milliseconds)
    REFRESH_INTERVALS: {
      dashboard: 30000,         // 30 seconds
      tokens: 15000,            // 15 seconds
      workflows: 60000,         // 1 minute
      stats: 30000,             // 30 seconds
    },
    
    // UI Settings
    UI: {
      itemsPerPage: 50,
      maxTokensDisplay: 1000,
      
      // Chart colors
      colors: {
        price: '#10b981',       // Green
        liquidity: '#3b82f6',   // Blue
        volume: '#f59e0b',      // Orange
        buys: '#34d399',        // Light green
        sells: '#f87171',       // Red
      },
      
      // Tier colors
      tierColors: {
        1: '#10b981',           // Tier 1 - Green (high priority)
        2: '#3b82f6',           // Tier 2 - Blue (normal)
      },
    },
    
    // Feature flags
    FEATURES: {
      darkMode: true,
      autoRefresh: true,
      notifications: true,
      charts: true,
    },
    
    // Debug mode
    DEBUG: false,
  };
  
  // Export for use in other files
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
  }