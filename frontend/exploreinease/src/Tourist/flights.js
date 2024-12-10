import React, { useState,useEffect } from 'react';
import { Button, TextField, Grid,FormControl, Box,InputLabel,MenuItem, Typography, CardActions, Card, CardContent, CardMedia } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocation } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import NetworkService from '../NetworkService';
import flight from "../Hotels Images/flight.png"
import TouristNavbar from './TouristNavbar';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';


const Flights = () => {
  const User = JSON.parse(localStorage.getItem('User'));
  const location = useLocation();
  const { userId } = location.state || User._id;
  const [iatCodeTo,setIatCodeTo]=useState([]);
  const [iatCodeFrom,setIatCodeFrom]=useState([]);
  const[flightDataa,setFlightDataa]=useState([]);
  const [smessage,setSMessage]=useState('');
  const [emessage,setEMessage]=useState('');
  const [selectCityFrom,setSelectCityFrom]=useState('');
  const [selectCityTo,setSelectCityTo]=useState('');
console.log("IatCode From and IatCode To",iatCodeFrom,iatCodeTo);

  const flightsImage=[flight];
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: null,
    peopleCount: null,
    currency: '',
  });
  useEffect(() => {
    if (smessage || emessage) {
      const timer = setTimeout(() => {
        setSMessage('');
        setEMessage('');
      }, 3000); // Disappear after 3 seconds
  
      return () => clearTimeout(timer); // Cleanup on component unmount
    }
  }, [smessage, emessage]);


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
    } catch (error) {
      console.log('Error fetching cities:', error);
    }
  };
  console.log('iatCodeFrom',iatCodeFrom);
  console.log('iatCodeTo',iatCodeTo);

  
  const handleGetFlightData = async () => {
    try {
      const date = new Date(searchParams.date).toISOString().slice(0, 10);
          const options = { 
            apiPath: `/flightOffers`,
            body: {
              originCode: selectCityFrom,
              destinationCode: selectCityTo,
              dateOfDeparture: date,
              currency: User.currency,
              personCount: searchParams.peopleCount
            }
          };
          console.log("Currency",User.currency);
          
          console.log("Options sent", options);
          console.log("i reached heree");
          // Fetch data for each origin-destination pair
          const response = await NetworkService.post(options);
          console.log("RESOPONSE ALE MSH ZAHR",response); 
          // setSMessage(response.message);
                  if (response !='No flights are available.'){
                    const combinedFlightData = response
                    .filter(result => result.status === 'fulfilled') // Only keep successful responses
                    .map(result => result.value)                     // Extract value from successful responses
                    .flat();                                         // Flatten if responses are arrays
                  console.log("Combined Flight data:", combinedFlightData);
                  setFlightDataa(response);
                  }
  
  
    } catch (error) {
      setEMessage("No flights are available");
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
        currency:User.currency,
        originCode:selectCityFrom,
        destinationCode:selectCityTo
      }
     };
     console.log(options);
    const response = await NetworkService.post(options);
    setSMessage(response.message);
    console.log("Book Flight:",response);
    
  } catch (error) {
    setEMessage('Insufficient Funds');
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
    if(iatCodeFrom.length===0 && iatCodeTo.length ===0){
      handlegetCities();  
    }else {
      handleGetFlightData();
    }
  };
  const handleChangeFrom = (event) => {
    setSelectCityFrom(event.target.value);
  };
  const handleChangeTo = (event) => {
    setSelectCityTo(event.target.value);
  };
console.log(searchParams);

  return (
    <div>
      <TouristNavbar/>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={4} sx={{ mt: 5, px: 3 }}>
      <div style={{ position: 'relative' }}>
      {smessage !== '' && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px', // Adjust this for horizontal positioning
            width: '400px', // Customize the width
            zIndex: 1000, // Ensure it appears above other elements
            marginTop:'40px',
          }}
        >
          <Alert severity="success" style={{ width: '100%' }}>
            {smessage}
          </Alert>
        </div>
      )}
      {emessage !== '' && (
        <div
          style={{
            position: 'fixed',
            top: '60px', // Stack the alerts vertically
            right: '20px',
            width: '300px',
            zIndex: 1000,
          }}
        >
          <Alert severity="error" style={{ width: '100%' }}>
            {emessage}
          </Alert>
        </div>
      )}
    </div>
        {/* Left Column - Flight Search Form */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Flight Search
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
        
              
             
                {iatCodeFrom !=0 && iatCodeTo !=0 ?(
                  <>
                        <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">IatCode Country From</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectCityFrom}
                          label="IatCode Country From"
                          onChange={handleChangeFrom}
                        >
                            {iatCodeFrom.map((city) => (
                                    <MenuItem key={city} value={city}>
                                      {city}
                                    </MenuItem>
                                  ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">IatCode Country To</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectCityTo}
                          label="IatCode Country To"
                          onChange={handleChangeTo}
                        >
                             {iatCodeTo.map((city) => (
                                    <MenuItem key={city} value={city}>
                                      {city}
                                    </MenuItem>
                                  ))}
                        </Select>
                      </FormControl>
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
                </>
                ):(
   
                  <>
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
                  </>
                )}
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
                      <strong>Price:</strong> {flight.price} {User.currency.toUpperCase()}
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
    </div>
  );
};

export default Flights;
