document.addEventListener("DOMContentLoaded", () => {
    fetchTransactions();
});

async function fetchTransactions() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/transactions");
        const data = await response.json();

        updateSummary(data);
        updateTransactionTable(data);
        renderChart(data);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

function updateSummary(transactions) {
    document.getElementById("total-transactions").textContent = transactions.length;
    
    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    document.getElementById("total-amount").textContent = `${totalAmount.toLocaleString()} RWF`;
}

function updateTransactionTable(transactions) {
    const tbody = document.getElementById("transaction-table-body");
    tbody.innerHTML = "";

    transactions.forEach(tx => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tx.phone_number}</td>
            <td>${tx.amount.toLocaleString()} RWF</td>
            <td>${tx.transaction_type}</td>
            <td>${new Date(tx.timestamp).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderChart(transactions) {
    const ctx = document.getElementById("transactionChart").getContext("2d");
    
    const labels = transactions.map(tx => new Date(tx.timestamp).toLocaleDateString());
    const amounts = transactions.map(tx => tx.amount);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Transaction Amounts (RWF)",
                data: amounts,
                backgroundColor: "gold",
                borderColor: "black",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
