import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';
import TourGuideHP from '../../../TourGuide/TourGuideNavbar';
import HomePage from '../../../Advertier/AdvertiserNavbar';

const TouristDashboard = () => {
  const location = useLocation();
  const { Response, User } = location.state || {};
  console.log(User);
  console.log(Response);

  const eventObject = Response?.eventObject || []; // Default to empty array if undefined
  const totalRevenue = Response?.totalRevenue || 0;
  const monthlyReport = Response?.monthlyReport || []; // Ensure monthlyReport exists and is an array

  const [selectedMonth, setSelectedMonth] = useState('all');

  const fullData = Array.isArray(monthlyReport) ? monthlyReport : [];
  console.log(fullData);

  const data =
    selectedMonth === 'all'
      ? fullData
      : fullData.filter((item) => item.Month === selectedMonth);

  const isDataArray = Array.isArray(data) && data.length > 0;

  const totalTourists = isDataArray
    ? data.reduce((sum, item) => sum + item.Tourists, 0)
    : 0;
  const avgTourists = isDataArray
    ? Math.round(totalTourists / data.length)
    : 0;
  const peakMonth = isDataArray
    ? data.reduce(
        (max, item) =>
          item.Tourists > max.Tourists ? item : max,
        { Month: 'N/A', Tourists: 0 }
      )
    : { Month: 'N/A', Tourists: 0 };

  return (
    <div>
      <div>
        {User?.type === 'advertiser' ? <HomePage /> : <TourGuideHP />}
      </div>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Filter by Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Filter by Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <MenuItem value="all">All Months</MenuItem>
                {fullData.map((item) => (
                  <MenuItem key={item.Month} value={item.Month}>
                    {item.Month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Tourists
                </Typography>
                <Typography variant="h4" component="div">
                  {totalTourists.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Monthly Visitors
                </Typography>
                <Typography variant="h4" component="div">
                  {avgTourists.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Peak Month
                </Typography>
                <Typography variant="h4" component="div">
                  {peakMonth.Month}
                </Typography>
                <Typography color="textSecondary">
                  {peakMonth.Tourists.toLocaleString()} visitors
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Tourist Distribution
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="Month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Tourists" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default TouristDashboard;