import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Container, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SalesReport = () => {
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [selectedItinerary, setSelectedItinerary] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);

  const [chartData, setChartData] = useState([]);
  const [productNames, setProductNames] = useState([]);

  useEffect(() => {
    let UserId = localStorage.getItem("UserId");

    const getSalesReport = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/adminReport/${UserId}`);
        const data = response.data;

        // Extract productRevenueByMonth
        const { productRevenueByMonth } = data;

        // Transform productRevenueByMonth into a chart-friendly format
        // productRevenueByMonth might look like:
        // {
        //   "Saif Topppp": { "November": 3434.3, "December": 30 },
        //   "Saif Top": { "November": 3434.3, "December": 30 }
        // }

        const products = Object.keys(productRevenueByMonth); 
        setProductNames(products);

        // Get all unique months
        const monthsSet = new Set();
        products.forEach(product => {
          const months = Object.keys(productRevenueByMonth[product]);
          months.forEach(m => monthsSet.add(m));
        });

        const allMonths = Array.from(monthsSet); // e.g. ["November", "December"]

        // Build an array of objects for the chart
        // Each object: { month: 'November', 'Saif Topppp': 3434.3, 'Saif Top': 3434.3 }
        const transformedData = allMonths.map(month => {
          const monthData = { month };
          products.forEach(product => {
            monthData[product] = productRevenueByMonth[product][month] || 0;
          });
          return monthData;
        });

        setChartData(transformedData);
      } catch (error) {
        console.log(error);
      }
    };

    getSalesReport();
  }, []);

  // You can implement filtering logic similar to your original code if needed.
  // For now, we'll just display the transformed data in a line chart.

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Filters (if needed, adjust as you integrate real data for activities, itineraries, etc.) */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* ... Filter UI ... */}
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
                    {/* Map activities from your data if needed */}
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
                    {/* Map itineraries if needed */}
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
                    {chartData.map(item => (
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

        {/* Example showing a line chart with multiple products as separate lines */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Revenue by Month
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {productNames.map((product, index) => (
                      <Line
                        key={product}
                        type="monotone"
                        dataKey={product}
                        stroke={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SalesReport;
