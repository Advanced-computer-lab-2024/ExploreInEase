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
import NetworkService from '../NetworkService';
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
  const [iatCodeTo,setIatCodeTo]=useState([]);
  const [iatCodeFrom,setIatCodeFrom]=useState([]);
  const [iatCode,setIatCode]=useState([]);
  const[flightDataa,setFlightDataa]=useState([]);
    const flightsImage=[flight];
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: null,
    peopleCount: null,
    currency: '',
  });
  const handlegetCities = async () => {
    try {
      // Concurrently fetch data from both endpoints
      const [response1, response2] = await Promise.all([
        NetworkService.get({ apiPath: `/city/${searchParams.from}` }),
        NetworkService.get({ apiPath: `/city/${searchParams.to}` })
      ]);
  
      // Extract iataCodes from each response into separate arrays
      const iataCodesFrom = response1.map(city => city.iataCode);
      const iataCodesTo = response2.map(city => city.iataCode);
  
      // Set each array to its corresponding state
      setIatCodeFrom(iataCodesFrom);
      setIatCodeTo(iataCodesTo);
  
      console.log("IATA Codes from:", iataCodesFrom);
      console.log("IATA Codes to:", iataCodesTo);
  
    } catch (error) {
      console.log('Error fetching cities:', error);
    }
  };
  
  
  const handleGetFlightData = async () => {
    try {
      const date = new Date(searchParams.date).toISOString().slice(0, 10);
  
      // Determine the minimum length between iataCodesFrom and iataCodesTo
      const length = Math.min(iatCodeFrom.length, iatCodeTo.length);
  
      // Fetch data for each pair of origin and destination codes up to the shortest list length
      const allFlightData = await Promise.allSettled(
        Array.from({ length }, async (_, index) => {
          const options = { 
            apiPath: `/flightOffers`,
            body: {
              originCode: iatCodeFrom[index],
              destinationCode: iatCodeTo[index],
              dateOfDeparture: date,
              currency: searchParams.currency,
              personCount: searchParams.peopleCount
            }
          };
  
          console.log("Options sent", options);
  
          // Fetch data for each origin-destination pair
          const response = await NetworkService.post(options);
          console.log(`Flight data for ${iatCodeFrom[index]} to ${iatCodeTo[index]}:`, response);
  
          return response; // Return each response to be collected
        })
      );
  
      // Filter out any rejected promises and keep only successful responses
      const combinedFlightData = allFlightData
        .filter(result => result.status === 'fulfilled') // Only keep successful responses
        .map(result => result.value)                     // Extract value from successful responses
        .flat();                                         // Flatten if responses are arrays
  
      console.log("Combined Flight data:", combinedFlightData);
      setFlightDataa(combinedFlightData);
  
    } catch (error) {
      console.log('Unexpected error fetching Flight data:', error);
    }
  };
const handleBookFlight=async(selected)=>{
  // const { bookedBy, price, departureTime, arrivalTime, personCount,currency,originCode,destinationCode } = req.body;
 const departureTime= formatDate(selected.departure.at);
 const arrivalTime= formatDate(selected.arrival.at);

  try {
    const options = { 
      apiPath: `/bookFlight`,
      body:{
        bookedBy:userId,
        price:selected.price,
        departureTime:departureTime,
        arrivalTime:arrivalTime,
        personCount:searchParams.peopleCount,
        currency:searchParams.currency,
        originCode:selected.departure.iataCode,
        destinationCode:selected.arrival.iataCode
      }
     };
     console.log(options);
     
    const response = await NetworkService.post(options);
    console.log("Book Flight:",response);
    
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  // Get only the 'YYYY-MM-DD' part
  };
  const handleSearch = () => {
      handlegetCities();  
      handleGetFlightData();
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
                    <MenuItem value="EGP">EGP</MenuItem>
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
            {flightDataa.map((flight) => (
              <Grid item xs={12} sm={6} md={4} key={flight.id}>
                <Card sx={{ width: '100%', boxShadow: 3, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardMedia
                    component="img"
                    height="120"
                    sx={{ width: 'auto', maxWidth: '50%' }}  // Optional: controls the width
                    image={flightsImage[0]}
                    alt={`flight`}
                  />
                  <CardContent>
                    <Typography variant="h7" gutterBottom>
                     <strong>Flight from {flight.departure.iataCode} to {flight.arrival.iataCode}</strong> 
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
                      <Box>
                        <Typography variant="h7" color="black">
                          <strong>Departure</strong><br />
                         <strong>Date:</strong> {formatDate(flight.departure.at)} <br />
                         <Typography variant="body1" color="black">
                      <strong>Price:</strong> {flight.price} {searchParams.currency.toUpperCase()}
                    </Typography>
                        </Typography>
                        
                      </Box>
                      <Box>
                        <Typography variant="h7" color="black">
                          <strong>Arrival</strong><br />
                          <strong>Date:</strong>  {formatDate(flight.arrival.at)} <br />
                        </Typography>
                        <Typography variant="body1" color="black">
                    <strong>Terminal: </strong> 
                    {flight.departure.terminal}     
                   </Typography>
                      </Box>
                    </Box>
                  
                 
                  </CardContent>
                  <CardActions >
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <Button   onClick={() =>handleBookFlight(flight)} variant="contained" color="primary">
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
