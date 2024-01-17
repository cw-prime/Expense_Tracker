document.addEventListener('DOMContentLoaded', function() {
    loadTotalExpenses();
});

function loadTotalExpenses() {
    fetch('/api/analytics/total-expenses', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.hasOwnProperty('total')) {
            const totalExpensesElement = document.getElementById('totalExpenses');
            totalExpensesElement.textContent = `$${data.total.toFixed(2)}`;
        } else {
            window.location.href = 'index.html';
        }
    })
    .catch(error => {
        console.error('Error loading total expenses:', error);
        window.location.href = 'index.html';
    });
}

