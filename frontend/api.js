// api.js - Complete Version
const API_BASE_URL =  'http://127.0.0.1:5000/api/transactions';
let transactionsCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchAllTransactions() {
    const now = new Date().getTime();
    if (transactionsCache && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
        return transactionsCache;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        transactionsCache = data;
        lastFetchTime = now;
        return data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}

async function fetchTransactionsPaginated(page = 1, pageSize = 20, filters = {}) {
    try {
        const queryParams = new URLSearchParams({
            page: page,
            pageSize: pageSize,
            ...filters
        });
        const response = await fetch(`${API_BASE_URL}/transactions/paginated?${queryParams}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching paginated transactions:", error);
        throw error;
    }
}

async function fetchTransactionStats(params = {}) {
    try {
        const queryParams = new URLSearchParams(params);
        const response = await fetch(`${API_BASE_URL}/transactions/stats?${queryParams}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching transaction stats:", error);
        throw error;
    }
}

async function fetchMonthlyTrends(params = {}) {
    try {
        const queryParams = new URLSearchParams(params);
        const response = await fetch(`${API_BASE_URL}/transactions/monthly-trends?${queryParams}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching monthly trends:", error);
        throw error;
    }
}

function formatCurrency(amount) {
    return amount.toLocaleString('en-RW', { maximumFractionDigits: 0 }) + ' RWF';
}

window.api = {
    fetchAllTransactions,
    fetchTransactionsPaginated,
    fetchTransactionStats,
    fetchMonthlyTrends,
    formatCurrency
};