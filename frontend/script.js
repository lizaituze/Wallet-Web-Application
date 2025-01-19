let transactions = [];
const budgetLimit = 1000;

// Elements
const transactionForm = document.getElementById('transaction-form');
const reportForm = document.getElementById('report-form');
const transactionsList = document.getElementById('transactions-list');
const reportResults = document.getElementById('report-results');
const budgetStatus = document.getElementById('budget-status');
const reportTimeGap = document.getElementById('report-time-gap');
const customRange = document.getElementById('custom-range');
const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');

// Show/Hide Custom Range Inputs
reportTimeGap.addEventListener('change', () => {
    if (reportTimeGap.value === 'custom') {
        customRange.style.display = 'block';
    } else {
        customRange.style.display = 'none';
    }
});

// Form Submission: Add Transactions
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const account = document.getElementById('account').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('transaction-type').value;
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const subcategory = document.getElementById('subcategory').value;

    transactions.push({ account, amount, type, date, category, subcategory });

    transactionForm.reset();
    updateTransactions();
    checkBudget();
    updateChart();
});

// Update Transactions List
function updateTransactions() {
    transactionsList.innerHTML = '';

    transactions.forEach(transaction => {
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

// Check Budget
function checkBudget() {
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const remainingBudget = budgetLimit - totalExpenses;

    if (totalExpenses > budgetLimit) {
        budgetStatus.textContent = 'You have exceeded your budget!';
        budgetStatus.style.color = 'red';
    } else {
        budgetStatus.textContent = `Remaining Budget: $${remainingBudget}`;
        budgetStatus.style.color = 'darkgreen';
    }
}

// Report Form Submission
reportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let filteredTransactions;
    const selectedGap = reportTimeGap.value;

    if (selectedGap === 'custom') {
        const customStartDate = new Date(startDate.value);
        const customEndDate = new Date(endDate.value);

        filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= customStartDate && transactionDate <= customEndDate;
        });
    } else {
        const daysAgo = new Date();
        daysAgo.setDate(new Date().getDate() - selectedGap);

        filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= daysAgo;
        });
    }

    generateReport(filteredTransactions);
});

// Generate Report
function generateReport(filteredTransactions) {
    reportResults.innerHTML = '';

    if (filteredTransactions.length === 0) {
        reportResults.innerHTML = '<p>No transactions found for the selected period.</p>';
        return;
    }

    let incomeTotal = 0;
    let expenseTotal = 0;

    filteredTransactions.forEach(t => {
        if (t.type === 'income') incomeTotal += t.amount;
        else if (t.type === 'expense') expenseTotal += t.amount;
    });

    reportResults.innerHTML = `
        <p><strong>Total Income:</strong> $${incomeTotal}</p>
        <p><strong>Total Expenses:</strong> $${expenseTotal}</p>
        <p><strong>Balance:</strong> $${incomeTotal - expenseTotal}</p>
    `;
}

// Initialize Chart
const ctx = document.getElementById('pieChart').getContext('2d');
const transactionChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['green', 'red'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});

// Update Chart
function updateChart() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    transactionChart.data.datasets[0].data = [income, expenses];
    transactionChart.update();
}
