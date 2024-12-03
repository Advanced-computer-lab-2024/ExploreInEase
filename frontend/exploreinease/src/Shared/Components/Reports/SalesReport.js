import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Container, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useLocation } from 'react-router-dom';
import TourGuideHP from '../../../TourGuide/TourGuideNavbar';
import HomePage from '../../../Advertier/AdvertiserNavbar';

const SalesReport = () => {
  const location = useLocation();
  const {Response,User}=location.state||{};
  console.log(User);
  console.log(Response);
  console.log("Sales Report Page:",User.type);
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [selectedItinerary, setSelectedItinerary] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);

  const itineraries = ['Hiking', 'Camping', 'City Tour', 'Beach Trip'];
  const activities = ['Weekend Package', 'Day Trip', 'Full Week Tour'];
  
  const data = Response ;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const filterData = () => {
    let filteredData = [...data];
    
    if (selectedMonth !== 'all') {
      filteredData = filteredData.filter(item => item.month === selectedMonth);
    }
    
    if (selectedActivity !== 'all') {
      filteredData = filteredData.map(item => ({
        ...item,
        totalRevenue: item.itineraries[selectedActivity]
      }));
    }
    
    return filteredData;
  };

  const calculateMetrics = (filteredData) => {
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.totalRevenue, 0);
    const avgRevenue = Math.round(totalRevenue / filteredData.length);
    const bestMonth = filteredData.reduce((max, item) => item.totalRevenue > max.totalRevenue ? item : max);
    
    return { totalRevenue, avgRevenue, bestMonth };
  };

  const filteredData = filterData();
  const { totalRevenue, avgRevenue, bestMonth } = calculateMetrics(filteredData);

  const pieData = itineraries.map(activity => ({
    name: activity,
    value: data.reduce((sum, month) => sum + month.itineraries[activity], 0)
  }));

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
          <Card sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Activity</InputLabel>
                  <Select
                    value={selectedActivity}
                    label="Activity"
                    onChange={(e) => setSelectedActivity(e.target.value)}
                  >
                    <MenuItem value="all">All Activities</MenuItem>
                    {itineraries.map(activity => (
                      <MenuItem key={activity} value={activity}>{activity}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Itinerary</InputLabel>
                  <Select
                    value={selectedItinerary}
                    label="Itinerary"
                    onChange={(e) => setSelectedItinerary(e.target.value)}
                  >
                    <MenuItem value="all">All Itineraries</MenuItem>
                    {itineraries.map(itinerary => (
                      <MenuItem key={itinerary} value={itinerary}>{itinerary}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    label="Month"
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <MenuItem value="all">All Months</MenuItem>
                    {data.map(item => (
                      <MenuItem key={item.month} value={item.month}>{item.month}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">
                ${totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Monthly Revenue
              </Typography>
              <Typography variant="h4">
                ${avgRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Best Performing Month
              </Typography>
              <Typography variant="h4">
                {bestMonth.month}
              </Typography>
              <Typography color="textSecondary">
                ${bestMonth.totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalRevenue" stroke="#1976d2" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue by Activity
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
    </Container>
    </div>
  );
};

export default SalesReport;