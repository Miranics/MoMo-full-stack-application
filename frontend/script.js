// let allTransactions = [];
// const API_URL = 'http://127.0.0.1:5000/api/transactions';


// const totalTransactions = document.getElementById("total-transactions");
// const totalAmount = document.getElementById("total-amount");
// const mostFrequentType = document.getElementById("most-frequent-type");
// const transactionsTable = document.getElementById("transactions-table").getElementsByTagName("tbody")[0];
// const typeButtons = document.querySelectorAll(".type-button");


// let barChart, pieChart;
// const barChartCtx = document.getElementById("barChart").getContext("2d");
// const pieChartCtx = document.getElementById("pieChart").getContext("2d");


// async function fetchTransactions() {
//     try {
//         transactionsTable.innerHTML = '<tr><td colspan="5" class="loading">Loading transactions...</td></tr>';
        
//         const response = await fetch(API_URL);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
        
//         const data = await response.json();
//         allTransactions = data;
        
//         initDashboard();
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         transactionsTable.innerHTML = `<tr><td colspan="5" class="loading">Error loading data: ${error.message}</td></tr>`;
//     }
// }


// function initDashboard() {
//     updateOverview(allTransactions);
//     renderTable(allTransactions);
//     renderCharts(allTransactions);
    
  
//     typeButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const type = button.getAttribute('data-type');
            
          
//             typeButtons.forEach(btn => btn.classList.remove('active'));
//             button.classList.add('active');
            
//             const filteredData = type ? 
//                 allTransactions.filter(transaction => transaction.type === type) : 
//                 allTransactions;
            
//             renderTable(filteredData);
//             // Don't update charts when clicking on type buttons
//             // This keeps the overview charts showing all data
//         });
//     });
// }


// function updateOverview(data) {
//     totalTransactions.textContent = data.length;
    
//     const total = data.reduce((sum, transaction) => sum + transaction.amount, 0);
//     totalAmount.textContent = `${total.toLocaleString()} RWF`;
    
//     const types = data.map(transaction => transaction.type);
//     const frequency = types.reduce((acc, type) => {
//         acc[type] = (acc[type] || 0) + 1;
//         return acc;
//     }, {});
    
//     let mostFrequent = 'N/A';
//     let maxCount = 0;
    
//     for (const type in frequency) {
//         if (frequency[type] > maxCount) {
//             maxCount = frequency[type];
//             mostFrequent = type;
//         }
//     }
    
//     mostFrequentType.textContent = mostFrequent;
// }

// function renderTable(data) {
//     transactionsTable.innerHTML = "";
    
//     if (data.length === 0) {
//         transactionsTable.innerHTML = '<tr><td colspan="5" class="loading">No matching transactions found</td></tr>';
//         return;
//     }
    
//     data.forEach(transaction => {
//         const row = transactionsTable.insertRow();
//         row.innerHTML = `
//             <td>${transaction.id}</td>
//             <td>${transaction.type}</td>
//             <td>${transaction.amount.toLocaleString()}</td>
//             <td>${formatDate(transaction.date)}</td>
//             <td>${transaction.details}</td>
//         `;
//     });
// }
// function formatDate(dateStr) {
//     const date = new Date(dateStr);
//     if (isNaN(date.getTime())) {
//         return dateStr; // Return original if invalid
//     }
//     return date.toLocaleDateString();
// }

// function renderCharts(data) {
//     const types = data.map(transaction => transaction.type);
//     const frequency = types.reduce((acc, type) => {
//         acc[type] = (acc[type] || 0) + 1;
//         return acc;
//     }, {});
    
//     const typeLabels = Object.keys(frequency);
//     const typeCounts = Object.values(frequency);
    
//     // Destroy existing charts if they exist
//     if (barChart) barChart.destroy();
//     if (pieChart) pieChart.destroy();
    
//     // Bar Chart
//     barChart = new Chart(barChartCtx, {
//         type: "bar",
//         data: {
//             labels: typeLabels,
//             datasets: [{
//                 label: "Transaction Volume",
//                 data: typeCounts,
//                 backgroundColor: "#ffcc00",
//                 borderColor: "#e6b800",
//                 borderWidth: 1
//             }],
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: {
//                     display: false
//                 },
//                 title: {
//                     display: true,
//                     text: 'Transaction Volume by Type'
//                 }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
    
//     // Pie Chart
//     pieChart = new Chart(pieChartCtx, {
//         type: "pie",
//         data: {
//             labels: typeLabels,
//             datasets: [{
//                 label: "Transaction Distribution",
//                 data: typeCounts,
//                 backgroundColor: [
//                     "#ffcc00", "#ffd633", "#ffe066", "#ffeb99", 
//                     "#fff5cc", "#e6b800", "#ccaa00", "#b38f00", 
//                     "#997a00", "#806600"
//                 ],
//                 borderColor: "#fff",
//                 borderWidth: 1
//             }],
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: {
//                     position: 'right'
//                 },
//                 title: {
//                     display: true,
//                     text: 'Transaction Distribution by Type'
//                 }
//             }
//         }
//     });
// }

// function applyFilters() {
//     const search = document.getElementById("search").value.toLowerCase();
//     const typeSelect = document.getElementById("type-filter").value;
//     const dateStr = document.getElementById("date-filter").value;
    
//     typeButtons.forEach(btn => btn.classList.remove('active'));
    
//     const filteredData = allTransactions.filter(transaction => {
//         // Search filter
//         const searchMatch = 
//             transaction.id.toString().toLowerCase().includes(search) ||
//             transaction.amount.toString().includes(search) ||
//             transaction.details.toLowerCase().includes(search);
        
//         // Type filter
//         const typeMatch = typeSelect === "" || transaction.type === typeSelect;
        
//         // Date filter (compare dates by their date part only)
//         let dateMatch = true;
//         if (dateStr) {
//             const filterDate = new Date(dateStr).toDateString();
//             const transactionDate = new Date(transaction.date).toDateString();
//             dateMatch = filterDate === transactionDate;
//         }
        
//         return searchMatch && typeMatch && dateMatch;
//     });
    
//     renderTable(filteredData);
//     // We're not updating charts here to keep the overview consistent
// }

// // Initialize Dashboard on Load
// window.onload = fetchTransactions;

// Global variables
let currentPage = 1;
const pageSize = 20;
let activeFilters = {};
let charts = {};

// Initialization functions
async function initializeDashboard() {
    try {
        const stats = await api.fetchTransactionStats();
        updateDashboardStats(stats);
        const recentTransactions = await api.fetchTransactionsPaginated(1, 5);
        updateRecentTransactions(recentTransactions.data);
        await loadDashboardCharts();
    } catch (error) {
        console.error("Error initializing dashboard:", error);
        showError("Failed to load dashboard data");
    }
}

async function initializeTransactions() {
    try {
        await loadTransactions();
        initializeTypeButtons();
        initializeFilterListeners();
    } catch (error) {
        console.error("Error initializing transactions:", error);
        showError("Failed to initialize transactions view");
    }
}

async function initializeVisualizations() {
    try {
        const [volumeData, amountData, monthlyData] = await Promise.all([
            api.fetchTransactionStats({ groupBy: 'type' }),
            api.fetchTransactionStats({ groupBy: 'type', metric: 'amount' }),
            api.fetchMonthlyTrends()
        ]);

        charts.volumeByType = window.charts.createVolumeByTypeChart(volumeData);
        charts.amountByType = window.charts.createAmountByTypeChart(amountData);
        charts.monthlyTrends = window.charts.createMonthlyTrendsChart(monthlyData);
        charts.distribution = window.charts.createTransactionDistributionChart(volumeData);
        charts.avgTransaction = window.charts.createAverageTransactionChart({
            labels: volumeData.labels,
            values: volumeData.values.map((v, i) => amountData.values[i] / v)
        });

        initializeDateRangeListeners();
    } catch (error) {
        console.error("Error initializing visualizations:", error);
        showError("Failed to load visualization data");
    }
}

// Data loading functions
async function loadTransactions() {
    try {
        showLoading();
        const result = await api.fetchTransactionsPaginated(currentPage, pageSize, activeFilters);
        updateTransactionsTable(result.data);
        updatePagination(result.total);
        hideLoading();
    } catch (error) {
        console.error("Error loading transactions:", error);
        showError("Failed to load transactions");
        hideLoading();
    }
}

async function loadDashboardCharts() {
    try {
        const monthlyData = await api.fetchMonthlyTrends();
        const volumeData = await api.fetchTransactionStats({ groupBy: 'type' });
        
        updateDashboardCharts(monthlyData, volumeData);
    } catch (error) {
        console.error("Error loading dashboard charts:", error);
        showError("Failed to load chart data");
    }
}

// UI update functions
function updateDashboardStats(stats) {
    document.getElementById('total-transactions').textContent = stats.totalTransactions.toLocaleString();
    document.getElementById('total-amount').textContent = api.formatCurrency(stats.totalAmount);
    document.getElementById('most-frequent-type').textContent = stats.mostFrequentType;
}

function updateTransactionsTable(transactions) {
    const tbody = document.querySelector('#transactions-table tbody');
    if (!tbody) return;

    tbody.innerHTML = transactions.map(t => `
        <tr>
            <td>${t.id}</td>
            <td>${t.type}</td>
            <td>${api.formatCurrency(t.amount)}</td>
            <td>${new Date(t.date).toLocaleDateString()}</td>
            <td>${t.details}</td>
        </tr>
    `).join('');
}

function updateRecentTransactions(transactions) {
    const tbody = document.querySelector('#recent-transactions-table tbody');
    if (!tbody) return;

    tbody.innerHTML = transactions.map(t => `
        <tr>
            <td>${t.id}</td>
            <td>${t.type}</td>
            <td>${api.formatCurrency(t.amount)}</td>
            <td>${new Date(t.date).toLocaleDateString()}</td>
            <td>${t.details}</td>
        </tr>
    `).join('');
}

function updatePagination(total) {
    const totalPages = Math.ceil(total / pageSize);
    const pagination = document.getElementById('pagination-controls');
    if (!pagination) return;

    let html = '';
    if (currentPage > 1) {
        html += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
    }

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    if (currentPage < totalPages) {
        html += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
    }

    pagination.innerHTML = html;
}

function updateDashboardCharts(monthlyData, volumeData) {
    const barCtx = document.getElementById('dashboardBarChart')?.getContext('2d');
    const pieCtx = document.getElementById('dashboardPieChart')?.getContext('2d');

    if (barCtx) {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: volumeData.labels,
                datasets: [{
                    label: 'Transaction Volume',
                    data: volumeData.values,
                    backgroundColor: chartColors.background,
                    borderColor: chartColors.border,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    if (pieCtx) {
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: volumeData.labels,
                datasets: [{
                    data: volumeData.values,
                    backgroundColor: chartColors.background,
                    borderColor: chartColors.border,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Event handlers and initialization
function initializeFilterListeners() {
    const searchInput = document.getElementById('search');
    const typeFilter = document.getElementById('type-filter');
    const dateFilter = document.getElementById('date-filter');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            activeFilters.search = searchInput.value;
            currentPage = 1;
            loadTransactions();
        }, 500));
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', () => {
            activeFilters.type = typeFilter.value;
            currentPage = 1;
            loadTransactions();
        });
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', () => {
            activeFilters.date = dateFilter.value;
            currentPage = 1;
            loadTransactions();
        });
    }
}

function initializeTypeButtons() {
    const buttons = document.querySelectorAll('.type-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            activeFilters.type = button.dataset.type;
            currentPage = 1;
            loadTransactions();
        });
    });
}

function initializeDateRangeListeners() {
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const applyButton = document.getElementById('apply-date-range');

    if (applyButton) {
        applyButton.addEventListener('click', async () => {
            try {
                const dateRange = {
                    start: startDate?.value,
                    end: endDate?.value
                };

                const [volumeData, amountData, monthlyData] = await Promise.all([
                    api.fetchTransactionStats({ ...dateRange, groupBy: 'type' }),
                    api.fetchTransactionStats({ ...dateRange, groupBy: 'type', metric: 'amount' }),
                    api.fetchMonthlyTrends(dateRange)
                ]);

                updateAllCharts(volumeData, amountData, monthlyData);
            } catch (error) {
                console.error("Error updating charts:", error);
                showError("Failed to update charts with date range");
            }
        });
    }
}

// Utility functions
function changePage(page) {
    currentPage = page;
    loadTransactions();
}

function applyFilters() {
    currentPage = 1;
    loadTransactions();
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.textContent = 'Loading...';
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.querySelector('.loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

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

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('dashboard.html')) {
        initializeDashboard();
    } else if (currentPath.includes('transactions.html')) {
        initializeTransactions();
    } else if (currentPath.includes('visualizations.html')) {
        initializeVisualizations();
    }
});
