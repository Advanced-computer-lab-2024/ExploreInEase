import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, Grid, InputLabel, FormControl, Box, Typography, CardActions, Card, CardContent, CardMedia } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import flight from "../Hotels Images/flight.png"
const flightData = [
  {
    id: 1,
    departure: {
      country: "USA",
      city: "New York",
      date: "2024-11-10",
      terminal: "A1",
    },
    arrival: {
      country: "France",
      city: "Paris",
      date: "2024-11-10",
      terminal: "B2",
    },
    price: 500,
  },
  {
    id: 2,
    departure: {
      country: "USA",
      city: "Los Angeles",
      date: "2024-11-12",
      terminal: "C3",
    },
    arrival: {
      country: "UK",
      city: "London",
      date: "2024-11-12",
      terminal: "D4",
    },
    price: 600,
  },
  {
    id: 3,
    departure: {
      country: "USA",
      city: "Chicago",
      date: "2024-11-15",
      terminal: "B1",
    },
    arrival: {
      country: "Japan",
      city: "Tokyo",
      date: "2024-11-15",
      terminal: "E5",
    },
    price: 700,
  },
  {
    id: 4,
    departure: {
      country: "USA",
      city: "San Francisco",
      date: "2024-11-18",
      terminal: "A2",
    },
    arrival: {
      country: "UAE",
      city: "Dubai",
      date: "2024-11-18",
      terminal: "F6",
    },
    price: 800,
  },
  {
    id: 5,
    departure: {
      country: "USA",
      city: "Boston",
      date: "2024-11-20",
      terminal: "D2",
    },
    arrival: {
      country: "Italy",
      city: "Rome",
      date: "2024-11-20",
      terminal: "C7",
    },
    price: 650,
  },
];

const Flights = () => {
  const location = useLocation();
  const { userId } = location.state || {};

    const flightsImage=[flight];
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: null,
    peopleCount: null,
    currency: '',
  });
  const handlegetCities=async()=>{
    try {
      // touristId, productIds, quantities
      
      const options = { 
        apiPath: `/city/${searchParams.from}`,
       };
       
      const response = await NetworkService.get(options);
    
        console.log(response);
    
        setIatCode(response.iatCode);
    } catch (error) {
      console.log('Error fetching historical places:', error);
    }
  }
  const handlegetCities2=async()=>{
    try {
      // touristId, productIds, quantities
      
      const options = { 
        apiPath: `/city/${searchParams.to}`,
       };
       
      const response = await NetworkService.get(options);
    
        console.log(response);
    
        setIatCode(response.iatCode);
    } catch (error) {
      console.log('Error fetching historical places:', error);
    }
  }
  const handleDateChange = (date) => {
    setSearchParams((prev) => ({ ...prev, date }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log("Search parameters:", searchParams);
    setSearchParams({
      from: '',
      to: '',
      date: null,
      peopleCount: null,
      currency: '',
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={4} sx={{ mt: 5, px: 3 }}>

        {/* Left Column - Flight Search Form */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Flight Search
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="From"
                  name="from"
                  value={searchParams.from}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <FlightTakeoffIcon sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                />
                <TextField
                  label="To"
                  name="to"
                  value={searchParams.to}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <FlightLandIcon sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                />
                <FormControl fullWidth>
                  <DatePicker
                    label="Date of Departure"
                    value={searchParams.date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </FormControl>
                <TextField
                  label="Number of People"
                  type="number"
                  name="peopleCount"
                  value={searchParams.peopleCount}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    inputProps: { min: 1 },
                    startAdornment: <PeopleIcon sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    name="currency"
                    value={searchParams.currency}
                    onChange={handleInputChange}
                    fullWidth
                    startAdornment={<AttachMoneyIcon sx={{ color: 'action.active', mr: 1 }} />}
                  >
                    <MenuItem value="dollar">USD</MenuItem>
                    <MenuItem value="euro">EUR</MenuItem>
                    <MenuItem value="egp">EGP</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSearch}
                  sx={{ mt: 2, p: 1.5 }}
                >
                  Search Flights
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Flight Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2} marginBottom={3}>
            {flightData.map((flight) => (
              <Grid item xs={12} sm={6} md={4} key={flight.id}>
                <Card sx={{ width: '100%', boxShadow: 3, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardMedia
                    component="img"
                    height="120"
                    sx={{ width: 'auto', maxWidth: '50%' }}  // Optional: controls the width
                    image={flightsImage[0]}
                    alt={`${flight.departure.city} to ${flight.arrival.city} flight`}
                  />
                  <CardContent>
                    <Typography variant="h7" gutterBottom>
                     <strong>Flight from {flight.departure.city} to {flight.arrival.city}</strong> 
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
                      <Box>
                        <Typography variant="body2" color="black">
                          <strong>Departure</strong><br />
                         <strong>Country:</strong> {flight.departure.city}, {flight.departure.country} <br />
                         <strong>Date:</strong> {flight.departure.date} <br />
                         <strong>Terminal: </strong> {flight.departure.terminal}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="black">
                          <strong>Arrival</strong><br />
                          <strong>Country:</strong>  {flight.arrival.city}, {flight.arrival.country} <br />
                          <strong>Date:</strong>   {flight.arrival.date} <br />
                          <strong>Terminal: </strong> {flight.arrival.terminal}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" color="black">
                      <strong>Price:</strong> {flight.price} {searchParams.currency.toUpperCase()}
                    </Typography>
                  </CardContent>
                  <CardActions >
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <Button variant="contained" color="primary">
                        Book Now
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

      </Grid>
    </LocalizationProvider>
  );
};

export default Flights;
