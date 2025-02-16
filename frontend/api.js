// API URL Configuration
const API_BASE_URL = 'http://127.0.0.1:5000/api/transactions'; // Update this to your actual API endpoint

// Cache for storing fetched data
let transactionsCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetch all transactions from the API
 * @returns {Promise<Array>} Array of transaction objects
 */
async function fetchAllTransactions() {
    // Check if we have valid cached data
    const now = new Date().getTime();
    if (transactionsCache && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
        return transactionsCache;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update cache
        transactionsCache = data;
        lastFetchTime = now;
        
        return data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}

/**
 * Fetch transactions with pagination
 * @param {number} page - Page number (starting from 1)
 * @param {number} pageSize - Number of items per page
 * @param {Object} filters - Optional filters to apply
 * @returns {Promise<Object>} Object containing transactions and pagination info
 */
async function fetchTransactionsPaginated(page = 1, pageSize = 20, filters = {}) {
    try {
        // Build query parameters
        const queryParams = new URLSearchParams({
            page: page,
            pageSize: pageSize,
            ...filters
        });
        
        const response = await fetch(`${API_BASE_URL}/transactions/paginated?${queryParams}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error fetching paginated transactions:", error);
        throw error;
    }
}

/**
 * Fetch transaction statistics
 * @param {Object} params - Optional parameters like date range
 * @returns {Promise<Object>} Statistics object
 */
async function fetchTransactionStats(params = {}) {
    try {
        const queryParams = new URLSearchParams(params);
        const response = await fetch(`${API_BASE_URL}/transactions/stats?${queryParams}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error fetching transaction stats:", error);
        throw error;
    }
}

/**
 * Fetch monthly transaction data for trends
 * @param {Object} params - Optional parameters
 * @returns {Promise<Array>} Monthly data array
 */
async function fetchMonthlyTrends(params = {}) {
    try {
        const queryParams = new URLSearchParams(params);
        const response = await fetch(`${API_BASE_URL}/transactions/monthly-trends?${queryParams}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error fetching monthly trends:", error);
        throw error;
    }
}

// Helper function for formatting data
function formatCurrency(amount) {
    return amount.toLocaleString('en-RW', { maximumFractionDigits: 0 }) + ' RWF';
}

// Export all functions
window.api = {
    fetchAll