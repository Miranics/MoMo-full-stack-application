let allTransactions = [];
const API_URL = 'http://127.0.0.1:5000/api/transactions';


const totalTransactions = document.getElementById("total-transactions");
const totalAmount = document.getElementById("total-amount");
const mostFrequentType = document.getElementById("most-frequent-type");
const transactionsTable = document.getElementById("transactions-table").getElementsByTagName("tbody")[0];
const typeButtons = document.querySelectorAll(".type-button");


let barChart, pieChart;
const barChartCtx = document.getElementById("barChart").getContext("2d");
const pieChartCtx = document.getElementById("pieChart").getContext("2d");


async function fetchTransactions() {
    try {
        transactionsTable.innerHTML = '<tr><td colspan="5" class="loading">Loading transactions...</td></tr>';
        
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        allTransactions = data;
        
        initDashboard();
    } catch (error) {
        console.error("Error fetching data:", error);
        transactionsTable.innerHTML = `<tr><td colspan="5" class="loading">Error loading data: ${error.message}</td></tr>`;
    }
}


function initDashboard() {
    updateOverview(allTransactions);
    renderTable(allTransactions);
    renderCharts(allTransactions);
    
  
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.getAttribute('data-type');
            
          
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filteredData = type ? 
                allTransactions.filter(transaction => transaction.type === type) : 
                allTransactions;
            
            renderTable(filteredData);
            // Don't update charts when clicking on type buttons
            // This keeps the overview charts showing all data
        });
    });
}


function updateOverview(data) {
    totalTransactions.textContent = data.length;
    
    const total = data.reduce((sum, transaction) => sum + transaction.amount, 0);
    totalAmount.textContent = `${total.toLocaleString()} RWF`;
    
    const types = data.map(transaction => transaction.type);
    const frequency = types.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    
    let mostFrequent = 'N/A';
    let maxCount = 0;
    
    for (const type in frequency) {
        if (frequency[type] > maxCount) {
            maxCount = frequency[type];
            mostFrequent = type;
        }
    }
    
    mostFrequentType.textContent = mostFrequent;
}

function renderTable(data) {
    transactionsTable.innerHTML = "";
    
    if (data.length === 0) {
        transactionsTable.innerHTML = '<tr><td colspan="5" class="loading">No matching transactions found</td></tr>';
        return;
    }
    
    data.forEach(transaction => {
        const row = transactionsTable.insertRow();
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.type}</td>
            <td>${transaction.amount.toLocaleString()}</td>
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.details}</td>
        `;
    });
}
function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return dateStr; // Return original if invalid
    }
    return date.toLocaleDateString();
}

function renderCharts(data) {
    const types = data.map(transaction => transaction.type);
    const frequency = types.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    
    const typeLabels = Object.keys(frequency);
    const typeCounts = Object.values(frequency);
    
    // Destroy existing charts if they exist
    if (barChart) barChart.destroy();
    if (pieChart) pieChart.destroy();
    
    // Bar Chart
    barChart = new Chart(barChartCtx, {
        type: "bar",
        data: {
            labels: typeLabels,
            datasets: [{
                label: "Transaction Volume",
                data: typeCounts,
                backgroundColor: "#ffcc00",
                borderColor: "#e6b800",
                borderWidth: 1
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Transaction Volume by Type'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Pie Chart
    pieChart = new Chart(pieChartCtx, {
        type: "pie",
        data: {
            labels: typeLabels,
            datasets: [{
                label: "Transaction Distribution",
                data: typeCounts,
                backgroundColor: [
                    "#ffcc00", "#ffd633", "#ffe066", "#ffeb99", 
                    "#fff5cc", "#e6b800", "#ccaa00", "#b38f00", 
                    "#997a00", "#806600"
                ],
                borderColor: "#fff",
                borderWidth: 1
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Transaction Distribution by Type'
                }
            }
        }
    });
}

function applyFilters() {
    const search = document.getElementById("search").value.toLowerCase();
    const typeSelect = document.getElementById("type-filter").value;
    const dateStr = document.getElementById("date-filter").value;
    
    typeButtons.forEach(btn => btn.classList.remove('active'));
    
    const filteredData = allTransactions.filter(transaction => {
        // Search filter
        const searchMatch = 
            transaction.id.toString().toLowerCase().includes(search) ||
            transaction.amount.toString().includes(search) ||
            transaction.details.toLowerCase().includes(search);
        
        // Type filter
        const typeMatch = typeSelect === "" || transaction.type === typeSelect;
        
        // Date filter (compare dates by their date part only)
        let dateMatch = true;
        if (dateStr) {
            const filterDate = new Date(dateStr).toDateString();
            const transactionDate = new Date(transaction.date).toDateString();
            dateMatch = filterDate === transactionDate;
        }
        
        return searchMatch && typeMatch && dateMatch;
    });
    
    renderTable(filteredData);
    // We're not updating charts here to keep the overview consistent
}

// Initialize Dashboard on Load
window.onload = fetchTransactions;