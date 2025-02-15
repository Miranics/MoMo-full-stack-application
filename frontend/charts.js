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
