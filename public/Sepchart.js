
function createOrUpdateChart(data) {
    const { dates, department, jobSatisfactionRating, communicationRating, leadershipRating, workLifeBalanceRating, overallSatisfactionRating, month, avgOverallRating, departmentr, avgOverallRatingByDepartment, avgJobSatisfactionRating, avgCommunicationRating, avgLeadershipRating, avgWorkLifeBalanceRating, dep1, AvgJobSatisfactionRatingperdep,dep2,AvgCommunicationRatingperdep ,dep3,AvgLeadershipRatingperdep,dep4,AvgWorkLifeBalanceRatingperdep} = data;
  console.log(data);
// Check if the bar chart 1 instance already exists
if (window.myChart4) {
    // If it exists, update the chart data
    window.myChart4.data.labels = dep1;
    window.myChart4.data.data = AvgJobSatisfactionRatingperdep;
    window.myChart4.update();
  } else {
    // If it doesn't exist, create a new chart instance
    const chart4Ctx = document.getElementById('chart4').getContext('2d');
    window.myChart4 = new Chart(chart4Ctx, {
      type: 'bar',
      data: {
        labels: dep1, // Use department names for the x-axis labels
        datasets: [
          {
            label: 'Department-wise Job Satisfaction Ratings',
            data: AvgJobSatisfactionRatingperdep, // Use average ratings for the bar heights
            backgroundColor: 'rgba(229, 114, 0, 0.6)', // Bar color
            borderColor: 'rgba(229, 114, 0, 1)', // Border color
            borderWidth: 1, // Border width
          },
        ],
      },
      options: {
        // Chart options
      },
    });
  }

  // Check if the bar chart 1 instance already exists
if (window.myChart5) {
    // If it exists, update the chart data
    window.myChart5.data.labels = dep2;
    window.myChart5.data.data = AvgCommunicationRatingperdep;
    window.myChart5.update();
  } else {
    // If it doesn't exist, create a new chart instance
    const chart5Ctx = document.getElementById('chart5').getContext('2d');
    window.myChart5 = new Chart(chart5Ctx, {
      type: 'bar',
      data: {
        labels: dep2, // Use department names for the x-axis labels
        datasets: [
          {
            label: 'Department-wise Communication Ratings',
            data: AvgCommunicationRatingperdep, // Use average ratings for the bar heights
            backgroundColor: 'rgba(11, 105, 154, 0.6)', // Bar color
            borderColor: 'rgba(11, 105, 154, 1)', // Border color
            borderWidth: 1, // Border width
          },
        ],
      },
      options: {
        // Chart options
      },
    });
  }

  // Check if the bar chart 1 instance already exists
if (window.myChart6) {
  // If it exists, update the chart data
  window.myChart6.data.labels = dep3;
  window.myChart6.data.data = AvgLeadershipRatingperdep;
  window.myChart6.update();
} else {
  // If it doesn't exist, create a new chart instance
  const chart6Ctx = document.getElementById('chart6').getContext('2d');
  window.myChart6 = new Chart(chart6Ctx, {
    type: 'bar',
    data: {
      labels: dep3, // Use department names for the x-axis labels
      datasets: [
        {
          label: 'Department-wise Leadership Ratings',
          data: AvgLeadershipRatingperdep, // Use average ratings for the bar heights
          backgroundColor: 'rgba(12, 61, 96, 0.6)', // Bar color
          borderColor: 'rgba(12, 61, 96, 1)', // Border color
          borderWidth: 1, // Border width
        },
      ],
    },
    options: {
      // Chart options
    },
  });
}

// Check if the bar chart 1 instance already exists
if (window.myChart7) {
  // If it exists, update the chart data
  window.myChart7.data.labels = dep4;
  window.myChart7.data.data = AvgWorkLifeBalanceRatingperdep;
  window.myChart7.update();
} else {
  // If it doesn't exist, create a new chart instance
  const chart7Ctx = document.getElementById('chart7').getContext('2d');
  window.myChart7 = new Chart(chart7Ctx, {
    type: 'bar',
    data: {
      labels: dep4, // Use department names for the x-axis labels
      datasets: [
        {
          label: 'Department-wise WorkLife Balance Ratings',
          data: AvgWorkLifeBalanceRatingperdep, // Use average ratings for the bar heights
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
}
// Fetch and create/update the charts
fetch('http://localhost:5001/auth/charts') // URL with port 5001
  .then((response) => response.json())
  .then((data) => {
    createOrUpdateChart(data);
  })
  .catch((error) => console.error(error));