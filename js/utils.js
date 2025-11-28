// ============================================
// TOKEN MONITORING SYSTEM - UTILITIES
// ============================================

// Format number with commas (1234567 -> 1,234,567)
function formatNumber(num) {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString('en-US');
  }
  
  // Format USD price (0.00045 -> $0.00045)
  function formatPrice(price) {
    if (price === null || price === undefined) return 'N/A';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    
    if (num >= 1) {
      return '$' + num.toFixed(2);
    } else if (num >= 0.01) {
      return '$' + num.toFixed(4);
    } else {
      return '$' + num.toFixed(8);
    }
  }
  
  // Format USD amount (12345.67 -> $12,345.67)
  function formatUSD(amount) {
    if (amount === null || amount === undefined) return 'N/A';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  // Format time ago (2025-01-15T10:30:00Z -> "5 minutes ago")
  function formatTimeAgo(timestamp) {
    if (!timestamp) return 'N/A';
    
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
  
  // Format datetime (2025-01-15T10:30:00Z -> "Jan 15, 10:30")
  function formatDateTime(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    
    return date.toLocaleString('en-US', options);
  }
  
  // Format percentage (0.15 -> "+15.0%", -0.05 -> "-5.0%")
  function formatPercent(value) {
    if (value === null || value === undefined) return 'N/A';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    const sign = num >= 0 ? '+' : '';
    return sign + num.toFixed(1) + '%';
  }
  
  // Shorten address (ABC123...XYZ789 -> ABC...XYZ)
  function shortenAddress(address) {
    if (!address || address.length < 10) return address;
    return address.substring(0, 6) + '...' + address.substring(address.length - 4);
  }
  
  // Copy to clipboard
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard!', 'success');
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      showNotification('Failed to copy', 'error');
      return false;
    }
  }
  
  // Show notification
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // Show loading spinner
  function showLoading(message = 'Loading...') {
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.querySelector('.loader-text').textContent = message;
      loader.classList.add('show');
    }
  }
  
  // Hide loading spinner
  function hideLoading() {
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.classList.remove('show');
    }
  }
  
  // Show error message
  function showError(message) {
    showNotification(message, 'error');
    console.error('Error:', message);
  }
  
  // Show success message
  function showSuccess(message) {
    showNotification(message, 'success');
  }
  
  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Get tier badge HTML
  function getTierBadge(tier) {
    const color = tier === 1 ? 'bg-green-500' : 'bg-blue-500';
    const label = tier === 1 ? 'High' : 'Normal';
    return `<span class="tier-badge ${color}">${label}</span>`;
  }
  
  // Get status badge HTML
  function getStatusBadge(status) {
    const colors = {
      'active': 'bg-green-500',
      'dead': 'bg-red-500',
      'archived': 'bg-gray-500',
    };
    return `<span class="status-badge ${colors[status] || 'bg-gray-500'}">${status}</span>`;
  }
  
  // Log debug info (only if DEBUG mode enabled)
  function debug(...args) {
    if (CONFIG.DEBUG) {
      console.log('[DEBUG]', ...args);
    }
  }