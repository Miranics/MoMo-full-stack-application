document.addEventListener("DOMContentLoaded", function () {
    fetchTransactions();
});

const API_BASE_URL = "http://127.0.0.1:5000"; // Adjust this if backend runs on a different port

async function fetchTransactions() {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayTransactions(data);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        document.getElementById("transactions-list").innerHTML = "<p>Error loading transactions.</p>";
    }
}

function displayTransactions(transactions) {
    const transactionsList = document.getElementById("transactions-list");
    transactionsList.innerHTML = ""; // Clear existing content

    transactions.forEach(txn => {
        const txnItem = document.createElement("div");
        txnItem.classList.add("transaction-item");
        txnItem.innerHTML = `
            <p><strong>Amount:</strong> ${txn.amount} RWF</p>
            <p><strong>Type:</strong> ${txn.type}</p>
            <p><strong>Sender:</strong> ${txn.sender}</p>
            <p><strong>Receiver:</strong> ${txn.receiver}</p>
            <p><strong>Date:</strong> ${new Date(txn.timestamp).toLocaleString()}</p>
        `;
        transactionsList.appendChild(txnItem);
    });
}
