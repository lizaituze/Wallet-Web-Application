let transactions = [
    { account: 'Bank', amount: 200, type: 'income', date: '2025-01-18', category: 'Salary', subcategory: 'Job' },
    { account: 'Mobile', amount: 50, type: 'expense', date: '2025-01-18', category: 'Food', subcategory: 'Lunch' }
];
const budgetLimit = 1000; // Set your budget limit here

// Elements
const transactionForm = document.getElementById('transaction-form');
const transactionsList = document.getElementById('transactions-list');
const budgetStatus = document.getElementById('budget-status');

// Event listener for form submission
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const account = document.getElementById('account').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('transaction-type').value;
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const subcategory = document.getElementById('subcategory').value;

    // Add transaction to array
    transactions.push({ account, amount, type, date, category, subcategory });

    // Clear the form
    transactionForm.reset();

    // Update the transactions list and budget status
    updateTransactions();
    checkBudget();
    updateSummaryChart();
});

// Update transactions list in the UI
function updateTransactions() {
    transactionsList.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const div = document.createElement('div');
        div.classList.add('transaction-item');
        div.innerHTML = `
            <p><strong>${transaction.account}</strong> - ${transaction.type} - $${transaction.amount}</p>
            <p>Date: ${transaction.date}</p>
            <p>Category: ${transaction.category} | Subcategory: ${transaction.subcategory || 'N/A'}</p>
        `;
        transactionsList.appendChild(div);
    });
}

// Check if the budget limit is exceeded
function checkBudget() {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const remainingBudget = budgetLimit - totalExpense;

    if (totalExpense > budgetLimit) {
        budgetStatus.textContent = 'You have exceeded your budget!';
        budgetStatus.style.color = 'red';
    } else {
        budgetStatus.textContent = `Remaining Budget: $${remainingBudget}`;
        budgetStatus.style.color = 'green';
    }
}

// Update the Pie chart summary (income vs expense)
function updateSummaryChart() {
    const incomeTotal = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenseTotal = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // Create or update the Pie chart
    const ctx = document.getElementById('summaryChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Transaction Amount',
                data: [incomeTotal, expenseTotal],
                backgroundColor: ['green', 'red'],
                borderColor: ['darkgreen', 'darkred'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Initial load
updateTransactions();
checkBudget();
updateSummaryChart();
