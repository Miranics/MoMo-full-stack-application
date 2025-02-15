document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:5000/api/transactions")  // Use "/api" prefix
        .then(response => response.json())
        .then(data => {
            console.log("Transactions:", data);
            displayTransactions(data);
        })
        .catch(error => console.error("Error fetching transactions:", error));
});

function displayTransactions(transactions) {
    const tableBody = document.getElementById("transaction-table-body");
    tableBody.innerHTML = ""; // Clear previous entries

    transactions.forEach(tx => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tx.id}</td>
            <td>${tx.phone_number}</td>
            <td>${tx.amount} RWF</td>
            <td>${tx.transaction_type}</td>
            <td>${new Date(tx.timestamp).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
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
