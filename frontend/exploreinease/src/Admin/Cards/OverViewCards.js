import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const OverviewCards = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const getStats = async () => {
      try {
        const UserId = localStorage.getItem("UserId");
        const response = await axios.get(`http://localhost:3030/fetchUserStats/${UserId}`);

        // Assuming response.data looks like:
        // {
        //   success: true,
        //   data: {
        //     total: 7,
        //     newUsersPerMonth: [{ _id: "2024-12", count: 7 }]
        //   }
        // }

        const { data } = response.data;  // Extract data from response
        const totalUsers = data.total || 0;
        const pendingComplaints = data.pendingComplaints || 0; // If your backend returns something like pendingComplaints

        // Now set stats based on the fetched data
        setStats([
          { label: "Total Users", value: totalUsers },
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    getStats();
  }, []);

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ backgroundColor: "#f5f5f5", textAlign: "center" }}>
            <CardContent>
              <Typography variant="h5">{stat.value}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default OverviewCards;
