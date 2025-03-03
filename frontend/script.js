let allTransactions = [];

document.addEventListener("DOMContentLoaded", function () {
    const totalTransactions = document.getElementById("total-transactions");
    const totalAmount = document.getElementById("total-amount");
    const mostFrequentType = document.getElementById("most-frequent-type");

    const transactionsTableElement = document.getElementById("transactions-table");
    const transactionsTable = transactionsTableElement ? transactionsTableElement.getElementsByTagName("tbody")[0] : null;

    const typeButtons = document.querySelectorAll(".type-button");

    const barChartElement = document.getElementById("barChart");
    const pieChartElement = document.getElementById("pieChart");

    let barChart, pieChart;
    const barChartCtx = barChartElement ? barChartElement.getContext("2d") : null;
    const pieChartCtx = pieChartElement ? pieChartElement.getContext("2d") : null;

    async function fetchTransactions() {
        try {
            if (transactionsTable) {
                transactionsTable.innerHTML = '<tr><td colspan="5" class="loading">Loading transactions...</td></tr>';
            }

            const data = await window.api.fetchAllTransactions();  // Use api.js function
            allTransactions = data;

            initDashboard();
        } catch (error) {
            console.error("Error fetching data:", error);
            if (transactionsTable) {
                transactionsTable.innerHTML = `<tr><td colspan="5" class="loading">Error loading data: ${error.message}</td></tr>`;
            }
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
        if (!totalTransactions || !totalAmount || !mostFrequentType) return;

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
        if (!transactionsTable) return;

        transactionsTable.innerHTML = "";

        if (data.length === 0) {
            transactionsTable.innerHTML = '<tr><td colspan="5" class="loading">No matching transactions found</td></tr>';
            return;
        }

        data.forEach(transaction => {
            const row = transactionsTable.insertRow();
            row.innerHTML = `
                <td>${transaction.id || 'N/A'}</td>
                <td>${transaction.transaction_type || 'Unknown'}</td>
                <td>${window.api.formatCurrency(transaction.amount)}</td>
                <td>${formatDate(transaction.timestamp)}</td>
                <td class="sms-details">${transaction.sms_body || 'No details available'}</td>
            `;
        });
    }

    function formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function renderCharts(data) {
        if (!barChartCtx || !pieChartCtx) return;

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

    fetchTransactions();
});
