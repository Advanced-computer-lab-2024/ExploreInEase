import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Container, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';
import TourGuideHP from '../../../TourGuide/TourGuideNavbar';
import HomePage from '../../../Advertier/AdvertiserNavbar';
const TouristDashboard = () => {
  const location = useLocation();
  const {User}=location.state||{};
  const [selectedMonth, setSelectedMonth] = useState('all');

  const fullData = [
    { month: 'Jan', tourists: 45000 },
    { month: 'Feb', tourists: 52000 },
    { month: 'Mar', tourists: 58000 },
    { month: 'Apr', tourists: 49000 },
    { month: 'May', tourists: 63000 },
    { month: 'Jun', tourists: 75000 },
    { month: 'Jul', tourists: 89000 },
    { month: 'Aug', tourists: 92000 },
    { month: 'Sep', tourists: 78000 },
    { month: 'Oct', tourists: 66000 },
    { month: 'Nov', tourists: 54000 },
    { month: 'Dec', tourists: 71000 }
  ];

  const data = selectedMonth === 'all' 
    ? fullData 
    : fullData.filter(item => item.month === selectedMonth);

  const totalTourists = data.reduce((sum, item) => sum + item.tourists, 0);
  const avgTourists = Math.round(totalTourists / data.length);
  const peakMonth = data.reduce((max, item) => item.tourists > max.tourists ? item : max);

  return (
    <div>
      <div>
        {User.type==="advertiser"?(
          <HomePage/>
        ):(
        <TourGuideHP/>
        )}
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
              {fullData.map(item => (
                <MenuItem key={item.month} value={item.month}>{item.month}</MenuItem>
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
                {peakMonth.month}
              </Typography>
              <Typography color="textSecondary">
                {peakMonth.tourists.toLocaleString()} visitors
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
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tourists" fill="#1976d2" />
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