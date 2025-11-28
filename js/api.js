// ============================================
// TOKEN MONITORING SYSTEM - API CLIENT
// ============================================

// Helper: Make API request with retry logic
async function apiRequest(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: CONFIG.API.timeout
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    let lastError;
    
    for (let attempt = 1; attempt <= CONFIG.API.retryAttempts; attempt++) {
      try {
        debug(`API Request [Attempt ${attempt}]:`, url);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          finalOptions.timeout
        );
        
        const response = await fetch(url, {
          ...finalOptions,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Unknown API error');
        }
        
        debug('API Response:', result);
        return result.data;
        
      } catch (error) {
        lastError = error;
        
        if (attempt < CONFIG.API.retryAttempts) {
          debug(`Request failed, retrying in ${CONFIG.API.retryDelay * attempt}ms...`);
          await new Promise(resolve => 
            setTimeout(resolve, CONFIG.API.retryDelay * attempt)
          );
        }
      }
    }
    
    throw new Error(`API request failed after ${CONFIG.API.retryAttempts} attempts: ${lastError.message}`);
  }
  
  // ============================================
  // API METHODS
  // ============================================
  
  const API = {
    
    // ========== TOKENS ==========
    
    tokens: {
      // Get active tokens
      getActive: async (filters = {}) => {
        const params = new URLSearchParams();
        
        if (filters.tier) params.append('tier', filters.tier);
        if (filters.minLiquidity) params.append('min_liquidity', filters.minLiquidity);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.order) params.append('order', filters.order);
        
        return await apiRequest(`/api/tokens/active?${params}`);
      },
      
      // Get token history
      getHistory: async (address, filters = {}) => {
        const params = new URLSearchParams();
        
        if (filters.from) params.append('from', filters.from);
        if (filters.to) params.append('to', filters.to);
        if (filters.interval) params.append('interval', filters.interval);
        
        return await apiRequest(`/api/tokens/${address}/history?${params}`);
      },
    },
    
    // ========== STATS ==========
    
    stats: {
      // Get system statistics
      getSystem: async () => {
        return await apiRequest('/api/stats/system');
      },
      
      // Get top performers
      getTopPerformers: async (period = '24h') => {
        return await apiRequest(`/api/stats/top-performers?period=${period}`);
      },
    },
    
    // ========== STATUS ==========
    
    status: {
      // Get workflows status
      getWorkflows: async () => {
        return await apiRequest('/api/status/workflows');
      },
      
      // Get DMB blocks status
      getDMB: async () => {
        return await apiRequest('/api/status/dmb');
      },
      
      // Get overall health
      getHealth: async () => {
        return await apiRequest('/api/status/health');
      },
    },
    
    // ========== CONFIGURATION ==========
    
    config: {
      // Get configuration
      get: async (category = null) => {
        const params = category ? `?category=${category}` : '';
        return await apiRequest(`/api/config/get${params}`);
      },
      
      // Update configuration
      update: async (category, key, value) => {
        return await apiRequest('/api/config/update', {
          method: 'POST',
          body: JSON.stringify({ category, key, value })
        });
      },
      
      // Test configuration
      test: async (category, key) => {
        return await apiRequest('/api/config/test', {
          method: 'POST',
          body: JSON.stringify({ category, key })
        });
      },
    },
    
    // ========== ANALYTICS ==========
    
    analytics: {
      // Get correlations
      getCorrelations: async (target, variables) => {
        return await apiRequest('/api/analytics/correlations', {
          method: 'POST',
          body: JSON.stringify({ target, variables })
        });
      },
      
      // Run backtest
      backtest: async (strategy, periodDays) => {
        return await apiRequest('/api/analytics/backtest', {
          method: 'POST',
          body: JSON.stringify({ 
            strategy, 
            period_days: periodDays 
          })
        });
      },
      
      // Get live signals
      getSignals: async () => {
        return await apiRequest('/api/signals');
      },
    },
  };
  
  // Export for use in other files
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  }