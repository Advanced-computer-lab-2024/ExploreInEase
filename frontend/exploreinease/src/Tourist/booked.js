import {
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Rating,
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Tabs,
    Tab,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
  } from "@mui/material";
  import { useLocation } from "react-router-dom";
  import { format, parseISO } from 'date-fns';
  import React, { useState, useEffect } from "react";
  import axios from "axios";
  
  // Sample data with 'type' field added
  const itemList = [];
  
  // Role-based fields
  const roleFields = {
    HistoricalPlaces: ['Tag'],
    Activities: ['budget', 'date', 'category', 'rating'],
    Itineraries: ['budget', 'date', 'preferences', 'language'],
  };
  
  const Booked = () => {
    const location = useLocation();
    const { events } = location.state || {};
    const itemList = events?.flat() || []; // Flatten the array and ensure it's initialized
    console.log(events);
    console.log(itemList);

    const [role, setRole] = useState('Activities'); // Default to Main to show all
    const [addressCache, setAddressCache] = useState({});
    const [historicalTags, setHistoricalTags] = useState({});
    const [open, setOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [type, setType] = useState(''); // State to store the selected item
    const [budget, setBudget] = useState('');
  
    const getAddressFromCoordinates = async (coordinates) => {
      if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
        return 'Location not available';
      }
      const [longitude, latitude] = coordinates;
  
      // Check cache first
      const cacheKey = `${latitude},${longitude}`;
      if (addressCache[cacheKey]) {
        return addressCache[cacheKey];
      }
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Geocoding failed');
        }
  
        const data = await response.json();
        
        // Create a readable address from the response
        const address = data.display_name.split(',').slice(0, 3).join(',');
        
        // Cache the result
        setAddressCache(prev => ({
          ...prev,
          [cacheKey]: address
        }));
  
        return address;
      } catch (error) {
        console.error('Error fetching address:', error);
        // Fallback to coordinate display if geocoding fails
        return `${Math.abs(latitude)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude)}°${longitude >= 0 ? 'E' : 'W'}`;
      }
    };
    
    const LocationDisplay = ({ coordinates }) => {
      const [address, setAddress] = useState('Loading...');
  
        useEffect(() => {
          const fetchAddress = async () => {
            const result = await getAddressFromCoordinates(coordinates);
            console.log(result);
            
            setAddress(result);
          };
          fetchAddress();
        }, [coordinates]);
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {address}
          <Button
            size="small"
            onClick= 
            {() => {
              const [longitude,latitude] = coordinates;
              window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
            }}
            style={{ minWidth: 'auto', padding: '4px' }}
          >
            🗺️
          </Button>
        </span>
      );
    };
  
    useEffect(() => {
      const initialData = itemList.filter(item =>
        (role === 'Activities' && item.type === 'Activity') ||
        (role === 'Itineraries' && item.type === 'Itinerary') ||
        (role === 'HistoricalPlaces' && item.type === 'HistoricalPlace')
      );
    }, []);
  
  
    // Helper function to check if a field should be displayed for the current role
    const shouldDisplayField = (field) => {
      return roleFields[role]?.includes(field);
    };
    const handleRoleChange = (event, newValue) => {
        setRole(newValue);
      };

    const getHistoricalTags = async (tagId) => {
      try {
        const apiPath = `http://localhost:3030/getHistoricalTagDetails/${tagId}`;
        const response = await axios.get(apiPath);
        const tagsArray = response.data.tags.map((tag) => `${tag.period} ${tag.type}`);
        setHistoricalTags((prevTags) => ({ ...prevTags, [tagId]: tagsArray }));
      } catch (err) {
        console.log(err.response ? err.message : 'An unexpected error occurred.');
      }
    }; 
    const handleClickOpen = (item) => {
       setSelectedItem(item);   
      setOpen(true);
    };
    const handleTypeChange = (event) => {
      setType(event.target.value);
    };
    const handleBudgetChange = (event) => {
      setBudget(event.target.value);
    };
    const handleClose = () => {
        setOpen(false);
        setType(null);
        setBudget(null);
         setSelectedItem(null); 
        
      };

    return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2, display: 'flex', justifyContent: 'center' }}>
          <Tabs value={role} onChange={handleRoleChange}>
            <Tab label="Activities" value="Activities" />
            <Tab label="Itineraries" value="Itineraries" />
            <Tab label="Historical Places" value="HistoricalPlaces" />
          </Tabs>
        </Box>
  
        <div style={{ display: 'flex', flex: 1 }}>
          <Grid container spacing={2} style={{ padding: '20px', flex: 1 }}>
            {itemList.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card    
                 style={{
                   width: item.type === 'Activity' ? '300px' : item.type === 'Itinerary' ? '320px' : '380px',
                   height: item.type === 'Activity' ? '300px' : item.type === 'Itinerary' ? '400px' : '340px',
                  }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {item.name}
                    </Typography>
                    {item.type === 'Activity' && (
                      <>
                        <Typography color="text.secondary">Budget: {item.budget}</Typography>
                        <Typography color="text.secondary">Date: {format(parseISO(item.date), 'MMMM d, yyyy')}</Typography>
                        <Typography color="text.secondary">Category: {item.category}</Typography>
                        {/* <Typography color="text.secondary">
                            Locations: {Array.isArray(item.location[0]) ? 
                            item.location.map((loc, index) => (
                              <span key={index}>
                                <LocationDisplay coordinates={loc} />
                                {index < item.location.length - 1 ? ', ' : ''}
                              </span>
                            )) : 
                            <LocationDisplay coordinates={item.location} />}
                        </Typography> */}
                        <Typography color="text.secondary">Tags: {item.tags}</Typography>
                        {item.specialDiscount && (
                          <Typography color="text.secondary">Special Discount: {item.specialDiscount}%</Typography>
                        )}
                      </>
                    )}
                    {item.type === 'Itinerary' && (
                      <>
                        <Typography color="text.secondary">Activities: {item.activities.join(', ')}</Typography>
                        <Typography color="text.secondary">Locations: {item.locations.join(', ')}</Typography>
                        <Typography color="text.secondary">
                              Date Available: {item.dateAvailable.length > 0 ? (
                                item.dateAvailable.map(date => format(parseISO(date), 'dd/MM/yyyy')).join('-')
                              ) : (
                                'No dates available'
                              )}
                         </Typography>  
                        <Typography color="text.secondary">Price: {item.price}</Typography>
                        <Typography color="text.secondary">Rating: {item.rating.length ==0 ?0:item.rating}</Typography>
                        <Typography color="text.secondary">Language: {item.language}</Typography>
                        <Typography color="text.secondary">Dropoff location: {item.dropoffLocation}</Typography>
                        <Typography color="text.secondary">Pickup location: {item.pickupLocation}</Typography>
                        <Typography color="text.secondary">Directions: {item.directions}</Typography>
                      </>
                    )}
                    {item.type === 'HistoricalPlace' && (
                      <>
                        <Typography color="text.secondary">Description: {item.description}</Typography>
                        {/* <Typography color="text.secondary">
                            Locations: {Array.isArray(item.location[0]) ? 
                            item.location.map((loc, index) => (
                              <span key={index}>
                                <LocationDisplay coordinates={loc} />
                                {index < item.location.length - 1 ? ', ' : ''}
                              </span>
                            )) : 
                            <LocationDisplay coordinates={item.location} />}
                        </Typography> */}
                        <Typography color="text.secondary">Opening Hours: {item.openingHours}</Typography>
                        <Typography color="text.secondary">Students ticket price: {item.ticketPrice[0]}</Typography>
                        <Typography color="text.secondary">Native ticket price: {item.ticketPrice[1]}</Typography>
                        <Typography color="text.secondary">Foreign ticket price: {item.ticketPrice[2]}</Typography>
  
                        Tags: {historicalTags[item.tags] ? historicalTags[item.tags].join(', ') : 'No tag selected'}
                        </>
                    )}
                   <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                   <Button style={{height:"50px",width:"80px",marginRight: '7px'}} variant="contained" color="primary" onClick={() => handleClickOpen(item)} >
                   Cancel Booking
                    </Button> 
                    <Button style={{width:"80px",marginRight: '7px'}} variant="contained" color="primary" onClick={() => handleClickOpen(item)}>
                    Comment 
                    </Button> 
                    <Button style={{width:"20px"}}  variant="contained" color="primary" onClick={() => handleClickOpen(item)}>
                    Rate 
                    </Button> 
                     </div>
                    </CardContent>
                    </Card>    
                  </Grid>
                    ))}
                  </Grid>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    disableBackdropClick
                    disableEscapeKeyDown
                 >
                  <DialogTitle id="alert-dialog-title">
                  {'Book a Ticket for '} {selectedItem?.name}
                  </DialogTitle>
                  <DialogContent>
                  {selectedItem && (
          <>
            {selectedItem.type === 'Activity' && (
              <>
                <Typography>Budget for Activity: {selectedItem.budget}</Typography>
                <div  style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ marginRight: '8px',marginTop:'10px' }}>Write your Budget for the Activity:</span>
                       <TextField id="standard-basic" label="budget" type="number" variant="standard" style={{ width: '150px' }}
                         required value={budget} onChange={handleBudgetChange}  />  
                      </div>
              </>
            )}
            {selectedItem.type === 'Itinerary' && (
              <>
                <Typography>Activities: {selectedItem.activities.join(', ')}</Typography>
                {/* Add more Itinerary-specific fields here */}
              </>
            )}
            {selectedItem.type === 'HistoricalPlace' && (
              <>
                       <div style={{ display: 'flex', alignItems: 'center',  }}>
                      <span style={{ marginRight: '8px',marginTop:'10px' }}>Choose your Type:</span>
                      <FormControl variant="standard" style={{ minWidth: '165px',}}>
                     <InputLabel id="demo-simple-select-label">Type</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            label="Type"
                            onChange={handleTypeChange}
                            required
                          >
                            <MenuItem value={'native'}>Native</MenuItem>
                            <MenuItem value={'student'}>Student</MenuItem>
                            <MenuItem value={'foreigner'}>Foreigner</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
              </>
            )}
          </>
        )}
                      <div>
                      <strong>Important Note:</strong>
                      <p>*Please note that you must bring a Student ID/Passport/National ID to the location*</p>
                      </div>
                  </DialogContent>
                  <DialogActions>
                  <Button onClick={handleClose} autoFocus>
                      Book
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                  </DialogActions>
                </Dialog>
                </div>
              </div>
            );
          };
  export default Booked;
  
  
  