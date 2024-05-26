import { filterData, addCheckboxEventListeners } from './filter.js';

window.addEventListener('load', function() {
  let barChart;

  fetch('data/trend_data.json')
    .then(response => response.json())
    .then(originalData => {
      function updateChart(data) {
        const hourlyTransactions = {};

        // Sum up the transactions for each hour
        data.forEach(item => {
          const hourlyTxns = item.hourlyTransactions;
          for (const hour in hourlyTxns) {
            if (hourlyTransactions[hour]) {
              hourlyTransactions[hour] += hourlyTxns[hour];
            } else {
              hourlyTransactions[hour] = hourlyTxns[hour];
            }
          }
        });

        // Calculate the average transactions per hour
        const averageTransactionsPerHour = {};
        const totalItems = data.length;
        for (const hour in hourlyTransactions) {
          averageTransactionsPerHour[hour] = hourlyTransactions[hour] / totalItems;
        }

        // Sort the hours in ascending order
        const sortedHours = Object.keys(averageTransactionsPerHour).sort((a, b) => parseInt(a) - parseInt(b));

        // Destroy the old chart if it exists
        if (barChart) {
          barChart.destroy();
        }

        // Create the chart
        const ctx = document.getElementById('trendHour');
        barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: sortedHours,
            datasets: [
              {
                label: 'Average Transactions per Hour',
                data: sortedHours.map(hour => averageTransactionsPerHour[hour]),
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Hour'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Average Transactions'
                },
                beginAtZero: true
              }
            },
          }
        });
      }

      // Initial chart creation
      updateChart(originalData);
      addCheckboxEventListeners(updateChart, originalData);
    })
    .catch(error => console.error('Error:', error));
});
