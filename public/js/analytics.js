document.addEventListener('DOMContentLoaded', function() {
  const ctx = document.getElementById('expensesChart').getContext('2d');
  fetch('/api/analytics/summary-by-category', {
    method: 'GET',
    credentials: 'same-origin'
  })
  .then(response => response.json())
  .then(data => {
    const categories = data.map(item => item.category);
    const totals = data.map(item => item.total);
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Total Spending by Category',
          data: totals,
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  })
  .catch(err => console.error('Error fetching summary data:', err));
});

