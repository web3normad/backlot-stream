export function formatCurrency(amount, decimals = 2) {
    if (isNaN(amount)) return '$0.00'
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  
    return formatter.format(amount)
  }
  
  export function formatCrypto(amount, symbol = 'ETH', decimals = 4) {
    if (isNaN(amount)) return `0 ${symbol}`
    
    return `${parseFloat(amount).toFixed(decimals)} ${symbol}`
  }