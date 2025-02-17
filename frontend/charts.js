document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:5000/api/transactions")
        .then(response => response.json())
        .then(data => {
            generateChart(data);
        })
        .catch(error => console.error("Error loading transactions for chart:", error));
});

function generateChart(transactions) {
    let ctx = document.getElementById("transactionChart").getContext("2d");

    let amounts = transactions.map(tx => tx.amount);
    let timestamps = transactions.map(tx => new Date(tx.timestamp).toLocaleDateString());

    new Chart(ctx, {
        type: "line",
        data: {
            labels: timestamps,
            datasets: [{
                label: "Transaction Amount (RWF)",
                data: amounts,
                borderColor: "#000",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}



// charts.js
const chartColors = {
    background: [
        'rgba(255, 204, 0, 0.2)',   // MTN Yellow
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(199, 199, 199, 0.2)',
        'rgba(83, 102, 255, 0.2)',
        'rgba(40, 159, 64, 0.2)',
        'rgba(210, 199, 199, 0.2)'
    ],
    border: [
        'rgba(255, 204, 0, 1)',     // MTN Yellow
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
        'rgba(40, 159, 64, 1)',
        'rgba(210, 199, 199, 1)'
    ]
};

function createVolumeByTypeChart(data) {
    const ctx = document.getElementById('volumeByTypeChart')?.getContext('2d');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Number of Transactions',
                data: data.values,
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

function createAmountByTypeChart(data) {
    const ctx = document.getElementById('amountByTypeChart')?.getContext('2d');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Total Amount (RWF)',
                data: data.values,
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
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' RWF';
                        }
                    }
                }
            }
        }
    });
}

function createMonthlyTrendsChart(data) {
    const ctx = document.getElementById('monthlyTrendsChart')?.getContext('2d');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Transaction Volume',
                data: data.volumes,
                borderColor: chartColors.border[0],
                backgroundColor: chartColors.background[0],
                yAxisID: 'y1',
            }, {
                label: 'Transaction Amount',
                data: data.amounts,
                borderColor: chartColors.border[1],
                backgroundColor: chartColors.background[1],
                yAxisID: 'y2',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y1: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Transactions'
                    }
                },
                y2: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (RWF)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

function createTransactionDistributionChart(data) {
    const ctx = document.getElementById('transactionDistributionChart')?.getContext('2d');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: chartColors.background,
                borderColor: chartColors.border,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function createAverageTransactionChart(data) {
    const ctx = document.getElementById('avgTransactionChart')?.getContext('2d');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Average Amount (RWF)',
                data: data.values,
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
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' RWF';
                        }
                    }
                }
            }
        }
    });
}

window.charts = {
    createVolumeByTypeChart,
    createAmountByTypeChart,
    createMonthlyTrendsChart,
    createTransactionDistributionChart,
    createAverageTransactionChart
};
