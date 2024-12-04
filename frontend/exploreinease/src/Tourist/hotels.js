import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, Grid, InputLabel, FormControl, Box, Typography, CardActions, Card, CardContent, CardMedia } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocation } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NetworkService from '../NetworkService';
import Hotel1 from '../Hotels Images/Hotel 1.jpeg';
import Hotel2 from '../Hotels Images/Hotel 2.jpeg';
import Hotel3 from '../Hotels Images/Hotel 3.jpeg';
import Hotel4 from '../Hotels Images/Hotel 4.jpeg';
import Hotel5 from '../Hotels Images/Hotel 5.jpeg';
import Hotel6 from '../Hotels Images/Hotel 6.jpeg';
import Hotel7 from '../Hotels Images/Hotel 7.jpeg';
import Hotel8 from '../Hotels Images/Hotel 8.jpeg';
import Hotel9 from '../Hotels Images/Hotel 9.jpeg';
import Hotel10 from '../Hotels Images/Hotel 10.jpeg';
import Hotel11 from '../Hotels Images/Hotel 11.jpeg';
import Hotel12 from '../Hotels Images/Hotel 12.jpeg';
import Hotel13 from '../Hotels Images/Hotel 13.jpeg';
import Hotel14 from '../Hotels Images/Hotel 14.jpeg';
import Hotel15 from '../Hotels Images/Hotel 15.jpeg';
import Hotel16 from '../Hotels Images/Hotel 16.jpeg';
import TouristNavbar from './TouristNavbar';

const hotelImages =
 [
  Hotel1, Hotel2, Hotel3, Hotel4, Hotel5, Hotel6, Hotel7, Hotel8,
  Hotel9, Hotel10, Hotel11, Hotel12, Hotel13, Hotel14, Hotel15, Hotel16
];

const Hotels = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [iatCode,setIatCode]=useState([]);
  const [hotelDataa,sethotelDataa]=useState([]);
  const [searchParams, setSearchParams] = useState({
    country:"",
    startDate: null,
    endDate: null,
    peopleCount: null,
    currency: "",
  });

const handlegetCities=async()=>{
  console.log("Country",searchParams.country);
  
  try {    
    const options = { 
      apiPath: `/city/${searchParams.country}`,
     };
    const response = await NetworkService.get(options);
      console.log(response);
      setIatCode(response.map(city => city.iataCode));
      
  } catch (error) {
    console.log('Error fetching historical places:', error);
  }
}

const handleGetHotels = async () => {
  try {
    const startDate = new Date(searchParams.startDate).toISOString().slice(0, 10);
    const endDate = new Date(searchParams.endDate).toISOString().slice(0, 10);
    const allHotelData = await Promise.allSettled(
      iatCode.map(async (code) => {
        console.log("seatchParam",searchParams,startDate,endDate);
        
        const options = { 
          apiPath: `/hotels/${code}/${startDate}/${endDate}/${searchParams.currency}/${searchParams.peopleCount}`,
        };
        console.log("options send",options);

        // Fetch data for each iataCode
        const response = await NetworkService.get(options);
        console.log("Hotel data for", code, ":", response);
        
        return response; // Return each response to be collected
      })
    );

    // Filter out any rejected promises and keep only successful responses
    const combinedHotelData = allHotelData
      .filter(result => result.status === 'fulfilled')  // Only keep successful responses
      .map(result => result.value)                      // Extract value from successful responses
      .flat();                                          // Flatten if responses are arrays
    
    console.log("Combined hotel data:", combinedHotelData);
    sethotelDataa(combinedHotelData);

  } catch (error) {
    console.log('Unexpected error fetching hotel data:', error);
  }
};


const handleBookHotels=async(selected)=>{
  // const { bookedBy, price, iataCode, hotelName, hotelId,startDate,endDate,personCount,currency } = req.body;
  try {
    const options = { 
      apiPath: `/bookHotel`,
      body:{
        bookedBy:userId,
        price:selected.price,
        iataCode:selected.iataCode,
        hotelName:selected.name,
        hotelId:selected.hotelId,
        startDate:selected.startDate,
        endDate:selected.endDate,
        personCount:searchParams.peopleCount,
        currency:searchParams.currency,
      }
     };
     console.log(options);
     
    const response = await NetworkService.post(options);
    console.log("Book Hotel:",response);
    
  } catch (error) {
    console.log('Error fetching historical places:', error);
  }

}
  const handleDateChange = (field) => (date) => {
    setSearchParams((prev) => ({ ...prev, [field]: date }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: name === "peopleCount" ? parseInt(value, 10) || 1 : value // Parse as integer or default to 1
    }));
  };

  const handleSearch = () => {
    handlegetCities();
    handleGetHotels();
    // setSearchParams({
    //   country:'',
    //   startDate: null,
    //   endDate: null,
    //   peopleCount: '',
    //   currency: '',
    // });
  };

  const getRandomImage = () => hotelImages[Math.floor(Math.random() * hotelImages.length)];

  return (
    <div>
      <TouristNavbar/>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={4} sx={{ mt: 5, px: 3 }}>
        
        {/* Left Column - Hotel Search Form */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Hotel Search
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                  label="country"
                  name="country"
                  value={searchParams.country}
                  onChange={handleInputChange}
                  fullWidth
                />
                <FormControl fullWidth>
                  <DatePicker
                    label="Start Date"
                    value={searchParams.startDate}
                    onChange={handleDateChange('startDate')}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <DatePicker
                    label="End Date"
                    value={searchParams.endDate}
                    onChange={handleDateChange('endDate')}
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
                    label="Currency"
                    value={searchParams.currency}
                    onChange={handleInputChange}
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
                  Search Hotels
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right Column - Hotel Cards */}
        <Grid item xs={12} md={8}>
  <Grid container spacing={2}>
    {hotelDataa.map((hotel) => (
      <Grid item xs={12} sm={6} md={4} key={hotel.id}>
        <Card sx={{ width: '100%', boxShadow: 3, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <CardMedia
            component="img"
            height="180"
            image={getRandomImage()}
            alt={`${hotel.name} image`}
          />
          <CardContent>
            <Typography variant="h6">{hotel.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              Price: {hotel.price} {searchParams.currency.toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start Date: {hotel.startDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              End Date: {hotel.endDate}
            </Typography>
          </CardContent>
          <CardActions sx={{ paddingBottom: 2 }}> {/* Adjusting paddingBottom here */}
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button onClick={() =>handleBookHotels(hotel)} variant="contained" color="primary">
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

export default Hotels;
