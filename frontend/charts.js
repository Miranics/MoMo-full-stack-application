document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/transactions");
        const transactions = await response.json();

        const ctx = document.getElementById("transactionsChart").getContext("2d");

        const labels = transactions.map(tx => new Date(tx.timestamp).toLocaleDateString());
        const amounts = transactions.map(tx => tx.amount);

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Transaction Amounts (RWF)",
                    data: amounts,
                    backgroundColor: "rgba(0, 0, 0, 0.8)", // Black for MTN branding
                    borderColor: "black",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error fetching transactions for chart:", error);
    }
});
