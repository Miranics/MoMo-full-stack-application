document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:5000/api/transactions")
        .then(response => response.json())
        .then(data => {
            processTransactionData(data);
        })
        .catch(error => console.error("Error loading transactions for chart:", error));
});

function processTransactionData(transactions) {
    const volumeByTypeData = aggregateData(transactions, "type", "count");
    const amountByTypeData = aggregateData(transactions, "type", "amount");
    const monthlyTrendsData = aggregateMonthlyData(transactions);
    const distributionData = aggregateData(transactions, "category", "count");
    const avgTransactionData = calculateAverageTransaction(transactions);

    window.charts.createVolumeByTypeChart(volumeByTypeData);
    window.charts.createAmountByTypeChart(amountByTypeData);
    window.charts.createMonthlyTrendsChart(monthlyTrendsData);
    window.charts.createTransactionDistributionChart(distributionData);
    window.charts.createAverageTransactionChart(avgTransactionData);
}

function aggregateData(transactions, key, metric) {
    const result = {};
    
    transactions.forEach(tx => {
        const category = tx[key] || "Unknown";
        if (!result[category]) {
            result[category] = { count: 0, amount: 0 };
        }
        result[category].count += 1;
        result[category].amount += parseFloat(tx.amount);
    });

    return {
        labels: Object.keys(result),
        values: Object.values(result).map(item => item[metric])
    };
}

function aggregateMonthlyData(transactions) {
    const result = {};

    transactions.forEach(tx => {
        const date = new Date(tx.timestamp);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        
        if (!result[month]) {
            result[month] = { volume: 0, amount: 0 };
        }
        result[month].volume += 1;
        result[month].amount += parseFloat(tx.amount);
    });

    return {
        labels: Object.keys(result),
        volumes: Object.values(result).map(item => item.volume),
        amounts: Object.values(result).map(item => item.amount)
    };
}

function calculateAverageTransaction(transactions) {
    const typeData = {};

    transactions.forEach(tx => {
        const type = tx.type || "Unknown";
        if (!typeData[type]) {
            typeData[type] = { totalAmount: 0, count: 0 };
        }
        typeData[type].totalAmount += parseFloat(tx.amount);
        typeData[type].count += 1;
    });

    return {
        labels: Object.keys(typeData),
        values: Object.values(typeData).map(item => item.totalAmount / item.count)
    };
}

// Chart configurations
const chartColors = {
    background: [
        'rgba(255, 204, 0, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ],
    border: [
        'rgba(255, 204, 0, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ]
};

function createChart(id, type, labels, datasets) {
    const ctx = document.getElementById(id)?.getContext('2d');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: type,
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => value.toLocaleString() + ' RWF'
                    }
                }
            }
        }
    });
}

window.charts = {
    createVolumeByTypeChart: data => createChart("volumeByTypeChart", "bar", data.labels, [{
        label: "Number of Transactions",
        data: data.values,
        backgroundColor: chartColors.background,
        borderColor: chartColors.border,
        borderWidth: 1
    }]),
    
    createAmountByTypeChart: data => createChart("amountByTypeChart", "bar", data.labels, [{
        label: "Total Amount (RWF)",
        data: data.values,
        backgroundColor: chartColors.background,
        borderColor: chartColors.border,
        borderWidth: 1
    }]),
    
    createMonthlyTrendsChart: data => {
        const ctx = document.getElementById("monthlyTrendsChart")?.getContext("2d");
        if (!ctx) return null;
    
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: "Transaction Volume",
                        data: data.volumes,
                        borderColor: chartColors.border[0],
                        backgroundColor: chartColors.background[0],
                        yAxisID: "y1"
                    },
                    {
                        label: "Transaction Amount",
                        data: data.amounts,
                        borderColor: chartColors.border[1],
                        backgroundColor: chartColors.background[1],
                        yAxisID: "y2"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y1: {
                        type: "linear",
                        position: "left",
                        beginAtZero: true,
                        title: { display: true, text: "Number of Transactions" }
                    },
                    y2: {
                        type: "linear",
                        position: "right",
                        beginAtZero: true,
                        title: { display: true, text: "Amount (RWF)" },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    },

    createTransactionDistributionChart: data => createChart("transactionDistributionChart", "pie", data.labels, [{
        data: data.values,
        backgroundColor: chartColors.background,
        borderColor: chartColors.border,
        borderWidth: 1
    }]),

    createAverageTransactionChart: data => createChart("avgTransactionChart", "bar", data.labels, [{
        label: "Average Amount (RWF)",
        data: data.values,
        backgroundColor: chartColors.background,
        borderColor: chartColors.border,
        borderWidth: 1
    }])
};
