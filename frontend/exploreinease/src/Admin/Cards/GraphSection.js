import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraphSection = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Users Registered per month',
        data: [],
        backgroundColor: '#3895d3',
        maxBarThickness: 50, // Set the maximum bar width here
      },
    ],
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        let UserId = localStorage.getItem("UserId");

        const response = await axios.get(`http://localhost:3030/fetchUserStats/${UserId}`);
        const data = response.data?.data;

        // data.newUsersPerMonth might look like:
        // [{ _id: '2024-12', count: 7 }, { _id: '2024-11', count: 10 }, ...]
        const newUsersPerMonth = data?.newUsersPerMonth || [];

        // Extract labels (month identifiers) and data (counts)
        const labels = newUsersPerMonth.map((item) => item._id);
        const counts = newUsersPerMonth.map((item) => item.count);

        // Update state with fetched data
        setChartData({
          labels,
          datasets: [
            {
              label: 'Users Registered per month',
              data: counts,
              backgroundColor: '#3895d3',
              maxBarThickness: 50, // Set max thickness for bars
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    };

    getStats();
  }, []);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <Box sx={{ height: 300 }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default GraphSection;
