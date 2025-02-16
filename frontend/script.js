let allTransactions = [];

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
        
        const data = await window.api.fetchAllTransactions();  // Use api.js function
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
        });
    });
}

function updateOverview(data) {
    totalTransactions.textContent = data.length;
    
    const total = data.reduce((sum, transaction) => sum + transaction.amount, 0);
    totalAmount.textContent = window.api.formatCurrency(total);
    
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
            <td>${window.api.formatCurrency(transaction.amount)}</td>
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.details}</td>
        `;
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return dateStr;
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
    
    if (barChart) barChart.destroy();
    if (pieChart) pieChart.destroy();
    
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
                legend: { display: false },
                title: { display: true, text: 'Transaction Volume by Type' }
            },
            scales: { y: { beginAtZero: true } }
        }
    });

    pieChart = new Chart(pieChartCtx, {
        type: "pie",
        data: {
            labels: typeLabels,
            datasets: [{
                label: "Transaction Distribution",
                data: typeCounts,
                backgroundColor: ["#ffcc00", "#ffd633", "#ffe066", "#ffeb99"],
                borderColor: "#fff",
                borderWidth: 1
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Transaction Distribution by Type' }
            }
        }
    });
}

window.onload = fetchTransactions;
