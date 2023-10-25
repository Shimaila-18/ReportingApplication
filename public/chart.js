// Define a function to create and update the chart
function createOrUpdateChart(data) {
  const { dates, department, jobSatisfactionRating, communicationRating, leadershipRating, workLifeBalanceRating, overallSatisfactionRating, month, avgOverallRating, departmentr, avgOverallRatingByDepartment, avgJobSatisfactionRating, avgCommunicationRating, avgLeadershipRating, avgWorkLifeBalanceRating, dep1, AvgJobSatisfactionRatingperdep } = data;
  // Check if the line chart instance already exists
  if (window.myLineChart) {
    // If it exists, update the chart data
    window.myLineChart.data.labels = month;
    window.myLineChart.data.data = avgOverallRating;
    window.myLineChart.update();
  } else {
    // If it doesn't exist, create a new chart instance
    const chart1Ctx = document.getElementById('chart1').getContext('2d');
    window.myLineChart = new Chart(chart1Ctx, {
      type: 'line',
      data: {
        labels: month,
        datasets: [
          {
            label: 'Avg Overall Satisfaction Rating',
            data: avgOverallRating,
            fill: false,
            borderColor: 'rgb(229, 114, 0)',
            tension: 0.1,
          },
        ],
      },
      options: {
        // Chart options
      },
    });
  }
  // Check if the bar chart instance already exists
  if (window.myBarChart) {
    // If it exists, update the chart data
    window.myBarChart.data.labels = departmentr;
    window.myBarChart.data.data = avgOverallRatingByDepartment;
    window.myBarChart.update();
  } else {
    // If it doesn't exist, create a new chart instance
    const chart2Ctx = document.getElementById('chart2').getContext('2d');
    window.myBarChart = new Chart(chart2Ctx, {
      type: 'bar',
      data: {
        labels: departmentr, // Use department names for the x-axis labels
        datasets: [
          {
            label: 'Average Overall Satisfaction Rating by Department',
            data: avgOverallRatingByDepartment, // Use average ratings for the bar heights
            backgroundColor: 'rgba(38, 132, 173, 0.6)', // Bar color
            borderColor: 'rgba(38, 132, 173, 1)', // Border color
            borderWidth: 1, // Border width
          },
        ],
      },
      options: {
        // Chart options
      },
    });
  }
  // Check if the pie chart instance already exists
  if (window.myPieChart) {
    // If it exists, update the chart data
    window.myPieChart.data.labels =['Job Satisfaction', 'Communication', 'Leadership', 'Work-Life Balance'];
    window.myPieChart.data.data = [avgJobSatisfactionRating, avgCommunicationRating, avgLeadershipRating, avgWorkLifeBalanceRating];
    window.myPieChart.update();
  } else {
    // If it doesn't exist, create a new chart instance
    const chart3Ctx = document.getElementById('chart3').getContext('2d');
    window.myPieChart = new Chart(chart3Ctx, {
      type: 'pie',
      data: {
        labels: ['Job Satisfaction', 'Communication', 'Leadership', 'Work-Life Balance'],
        datasets: [
          {
            data: [avgJobSatisfactionRating, avgCommunicationRating, avgLeadershipRating, avgWorkLifeBalanceRating],
            backgroundColor: [
              'rgba(125, 158, 173, 0.6)', // Red
              'rgba(11, 105, 154, 0.6)', // Yellow
              'rgba(194, 196, 197, 0.6)', // Green
              'rgba(12, 61, 96, 0.6)', // Blue
            ],
            borderColor: [
              'rgba(125, 158, 173, 1)',
              'rgba(11, 105, 154, 1)',
              'rgba(194, 196, 197, 1)',
              'rgba(12, 61, 96, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        // Chart options
      },
    });
  }

}

// Fetch and create/update the charts
fetch('http://localhost:5001/auth/charts') // URL with port 5001
  .then((response) => response.json())
  .then((data) => {
    createOrUpdateChart(data);
  })
  .catch((error) => console.error(error));