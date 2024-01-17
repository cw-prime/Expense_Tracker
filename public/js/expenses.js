document.addEventListener('DOMContentLoaded', function() {
    loadExpenses();
});

function loadExpenses() {
    fetch('/api/expenses', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        const expensesElement = document.querySelector('#expensesList');
        if (expensesElement) {
            expensesElement.innerHTML = createExpensesTable(data.expenses);
        } else {
            console.error('Expenses element not found');
        }
    })
    .catch(error => {
        console.error('Error loading expenses:', error);
    });
}

function createExpensesTable(expenses) {
    let tableHTML = '<table class="table"><thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Actions</th></tr></thead><tbody>';
    expenses.forEach(expense => {
        tableHTML += `<tr>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td>${expense.category}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>
                <button class="btn btn-primary btn-sm">Edit</button>
                <button class="btn btn-danger btn-sm">Delete</button>
            </td>
        </tr>`;
    });
    tableHTML += '</tbody></table>';
    return tableHTML;
}
