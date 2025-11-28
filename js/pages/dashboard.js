// ============================================
// DASHBOARD PAGE - MAIN LOGIC
// ============================================

let refreshInterval;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  debug('Dashboard initialized');
  
  // Load initial data
  loadDashboard();
  
  // Setup event listeners
  setupEventListeners();
  
  // Setup auto-refresh
  if (CONFIG.FEATURES.autoRefresh) {
    setupAutoRefresh();
  }
});

// Load all dashboard data
async function loadDashboard() {
  showLoading('Loading dashboard...');
  
  try {
    // Load in parallel
    await Promise.all([
      loadSystemStats(),
      loadWorkflowsStatus(),
      loadActiveTokens()
    ]);
    
    updateLastUpdateTime();
    hideLoading();
    showSuccess('Dashboard loaded successfully');
    
  } catch (error) {
    hideLoading();
    showError('Failed to load dashboard: ' + error.message);
  }
}

// Load system statistics
async function loadSystemStats() {
  try {
    const stats = await API.stats.getSystem();
    
    // Update stat cards
    document.getElementById('stat-active-tokens').textContent = 
      formatNumber(stats.active_tokens);
    document.getElementById('stat-discovered-today').textContent = 
      formatNumber(stats.discovered_today);
    document.getElementById('stat-died-today').textContent = 
      formatNumber(stats.died_today);
    
    // Health percentage
    const healthPct = stats.overall_health || 0;
    document.getElementById('stat-system-health').textContent = 
      healthPct.toFixed(1) + '%';
    
    const healthStatus = document.getElementById('stat-health-status');
    if (healthPct >= 95) {
      healthStatus.textContent = 'Excellent';
      healthStatus.className = 'stat-change text-green-400';
    } else if (healthPct >= 85) {
      healthStatus.textContent = 'Good';
      healthStatus.className = 'stat-change text-yellow-400';
    } else {
      healthStatus.textContent = 'Issues';
      healthStatus.className = 'stat-change text-red-400';
    }
    
  } catch (error) {
    debug('Failed to load system stats:', error);
    throw error;
  }
}

// Load workflows status
async function loadWorkflowsStatus() {
  try {
    const data = await API.status.getWorkflows();
    const container = document.getElementById('workflows-container');
    container.innerHTML = '';
    
    if (!data.workflows || data.workflows.length === 0) {
      container.innerHTML = '<p class="text-gray-400">No workflows found</p>';
      return;
    }
    
    data.workflows.forEach(workflow => {
      const card = createWorkflowCard(workflow);
      container.appendChild(card);
    });
    
  } catch (error) {
    debug('Failed to load workflows:', error);
    // Don't throw - show empty state instead
    document.getElementById('workflows-container').innerHTML = 
      '<p class="text-red-400">Failed to load workflows status</p>';
  }
}

// Load active tokens
async function loadActiveTokens() {
  const container = document.getElementById('tokens-container');
  const loading = document.getElementById('tokens-loading');
  const empty = document.getElementById('tokens-empty');
  
  // Show loading
  container.classList.add('hidden');
  loading.classList.remove('hidden');
  empty.classList.add('hidden');
  
  try {
    // Get filter values
    const tier = document.getElementById('filter-tier').value;
    const sort = document.getElementById('filter-sort').value;
    
    const data = await API.tokens.getActive({
      tier: tier || undefined,
      sort: sort || 'age',
      order: 'desc',
      limit: 100
    });
    
    // Hide loading
    loading.classList.add('hidden');
    
    if (!data.tokens || data.tokens.length === 0) {
      empty.classList.remove('hidden');
      return;
    }
    
    // Show tokens
    container.classList.remove('hidden');
    container.innerHTML = '';
    
    data.tokens.forEach(token => {
      const card = createTokenCard(token);
      container.appendChild(card);
    });
    
  } catch (error) {
    loading.classList.add('hidden');
    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="col-span-full text-center py-8 text-red-400">
        Failed to load tokens: ${error.message}
      </div>
    `;
  }
}

// Create workflow status card
function createWorkflowCard(workflow) {
  const card = document.createElement('div');
  card.className = 'workflow-card';
  
  const statusIcon = workflow.status === 'running' ? '✅' : 
                     workflow.status === 'paused' ? '⏸️' : '❌';
  
  const successRate = workflow.stats?.success_rate_pct || 0;
  const successClass = successRate >= 95 ? 'text-green-400' :
                       successRate >= 85 ? 'text-yellow-400' : 'text-red-400';
  
  card.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <div>
        <div class="flex items-center space-x-2 mb-1">
          <span class="text-2xl">${statusIcon}</span>
          <h3 class="font-semibold">${workflow.name}</h3>
        </div>
        <p class="text-xs text-gray-400">${workflow.schedule || 'Manual'}</p>
      </div>
    </div>
    
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-400">Last run:</span>
        <span>${formatTimeAgo(workflow.last_execution?.started_at)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Processed:</span>
        <span>${formatNumber(workflow.last_execution?.tokens_processed || 0)} tokens</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Success rate:</span>
        <span class="${successClass}">${successRate.toFixed(1)}%</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Next run:</span>
        <span>${formatTimeAgo(workflow.next_run)}</span>
      </div>
    </div>
  `;
  
  return card;
}

// Create token card
function createTokenCard(token) {
  const card = document.createElement('div');
  card.className = 'token-card';
  card.onclick = () => viewTokenDetails(token.token_address);
  
  const tierColor = token.tier === 1 ? 'bg-green-500' : 'bg-blue-500';
  const tierLabel = token.tier === 1 ? 'High' : 'Normal';
  
  card.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-1">
          <h3 class="font-semibold text-lg">${token.symbol}</h3>
          <span class="tier-badge ${tierColor}">${tierLabel}</span>
        </div>
        <p class="text-xs text-gray-400">${shortenAddress(token.token_address)}</p>
      </div>
    </div>
    
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-400">Price:</span>
        <span class="font-semibold text-green-400">${formatPrice(token.price_usd)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Liquidity:</span>
        <span>${formatUSD(token.liquidity_usd)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Volume 24h:</span>
        <span>${formatUSD(token.volume_24h_usd)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Age:</span>
        <span>${token.age_minutes} min</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Buys/Sells:</span>
        <span class="text-green-400">${token.buys_count || 0}</span> / 
        <span class="text-red-400">${token.sells_count || 0}</span>
      </div>
    </div>
    
    <div class="mt-4 pt-3 border-t border-gray-700">
      <button class="btn-sm btn-primary w-full">
        View Details →
      </button>
    </div>
  `;
  
  return card;
}

// View token details (redirect to token page)
function viewTokenDetails(address) {
  window.location.href = `tokens.html?address=${address}`;
}

// Setup event listeners
function setupEventListeners() {
  // Refresh button
  document.getElementById('refresh-btn').addEventListener('click', () => {
    loadDashboard();
  });
  
  // Filter changes
  document.getElementById('filter-tier').addEventListener('change', () => {
    loadActiveTokens();
  });
  
  document.getElementById('filter-sort').addEventListener('change', () => {
    loadActiveTokens();
  });
}

// Setup auto-refresh
function setupAutoRefresh() {
  refreshInterval = setInterval(() => {
    debug('Auto-refreshing dashboard...');
    loadDashboard();
  }, CONFIG.REFRESH_INTERVALS.dashboard);
}

// Update last update time
function updateLastUpdateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  document.getElementById('update-time').textContent = timeStr;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});