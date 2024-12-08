import { Grid, Card, CardContent, Typography } from '@mui/material';
import {useState,useEffect} from 'react';
import axios from 'axios';

const OverviewCards = () => {
  const stats = [
    { label: "Total Users", value: 1200 },
    { label: "Pending Complaints", value: 34 },
    { label: "Total Events", value: 50 },
    { label: "Archived Products", value: 15 },
  ];

  useEffect(() => {

    const getStats = async () => {
      try {
         let UserId = localStorage.getItem("UserId");

        const response = await axios.get(`http://localhost:3030/fetchUserStats/${UserId}`);
        console.log(response.data);
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
