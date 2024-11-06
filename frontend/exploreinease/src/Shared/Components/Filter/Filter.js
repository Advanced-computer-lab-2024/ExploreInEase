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
import debounce from 'lodash.debounce';

// Sample data with 'type' field added
const itemList = [];
const addressCache = {};

// Role-based fields
const roleFields = {
  HistoricalPlaces: ['Tag'],
  Activities: ['budget', 'date', 'category', 'rating'],
  Itineraries: ['budget', 'date', 'preferences', 'language'],
};

const Filter = () => {
  const location = useLocation();
  const { events } = location.state || {};
  const itemList = events?.flat() || []; // Flatten the array and ensure it's initialized
  console.log(events);
  console.log(itemList);

  const [filters, setFilters] = useState({
    budget: '',
    price: '',
    date: '',
    rating: 0,
    category: '',
    language: '',
    preferences: '',
    Tag: '',
    search: '',
    sortBy: '',
  });
  const [filteredData, setFilteredData] = useState([]);
  const [role, setRole] = useState('Activities'); // Default to Main to show all
  const [ratingRange, setRatingRange] = useState([0, 5]); // Added state for rating range
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
      addressCache[cacheKey] = address;

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
  const fetchAddressFromAPI = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
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
      return data.display_name.split(',').slice(0, 3).join(',');
    } catch (error) {
      console.error('Error fetching address:', error);
      return `${Math.abs(latitude)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude)}°${longitude >= 0 ? 'E' : 'W'}`;
    }
  };
  const debouncedFetchAddress = debounce(async (latitude, longitude, setAddress) => {
    const cacheKey = `${latitude},${longitude}`;
  
    if (addressCache[cacheKey]) {
      setAddress(addressCache[cacheKey]);
    } else {
      const address = await fetchAddressFromAPI(latitude, longitude);
      addressCache[cacheKey] = address; 
      setAddress(address);
    }
  }, 300);
  const LocationDisplay = ({ coordinates }) => {
    const [address, setAddress] = useState('Press here to view location...');
  
    useEffect(() => {
      if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
        const [longitude, latitude] = coordinates;
        debouncedFetchAddress(latitude, longitude, setAddress);
      }
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
    setFilteredData(initialData);
  }, []);

  // Handle Input Change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Rating Change
  const handleRatingChange = (event, newRating) => {
    setFilters({
      ...filters,
      rating: newRating,
    });
  };

  const handleRoleChange = (event, newValue) => {
    setRole(newValue);
    applyFilters(newValue); // Apply filters immediately when changing tabs
  };

  // Apply Filters
  const applyFilters = (roleToFilter = role) => {
    let data = itemList;

    // Filter by role-specific type
    if (roleToFilter === 'Activities') {
      data = data.filter((item) => item.type === 'Activity');
    } else if (roleToFilter === 'Itineraries') {
      data = data.filter((item) => item.type === 'Itinerary');
    } else if (roleToFilter === 'HistoricalPlaces') {
      data = data.filter((item) => item.type === 'HistoricalPlace');
    }

    // Apply other filters
    if (filters.budget) {
      data = data.filter((item) => item.budget <= parseFloat(filters.budget));
    }

    if (filters.price) {
      data = data.filter((item) => item.price.toString() === filters.price);
    }

    if (filters.date) {
      data = data.filter((item) => item.date === filters.date);
    }

    if (filters.rating) {
      data = data.filter((item) => item.rating >= filters.rating && item.rating <= 5);
    }

    if (filters.category) {
      data = data.filter((item) => item.category === filters.category);
    }

    if (filters.language) {
      data = data.filter((item) => item.language === filters.language);
    }

    if (filters.preferences) {
      data = data.filter((item) => item.preferences === filters.preferences);
    }

    if (filters.Tag) {
      data = data.filter((item) => item.Tag === filters.Tag);
    }

    // Search by name
    if (filters.search) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Sort logic
    if (filters.sortBy === 'price') {
      data.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      data.sort((a, b) => b.rating - a.rating);
    }

    setFilteredData(data);
  };


  // Reset Filters
  const resetFilters = () => {
    setFilters({
      budget: '',
      price: '',
      date: '',
      rating: 0,
      category: '',
      language: '',
      preferences: '',
      Tag: '',
      search: '',
      sortBy: '',
    });

    // Filter items based on the current role
    const resetData = itemList.filter(item => {
      if (role === 'Activities') return item.type === 'Activity';
      if (role === 'Itineraries') return item.type === 'Itinerary';
      if (role === 'HistoricalPlaces') return item.type === 'HistoricalPlace';
      return false;
    });

    setFilteredData(resetData);
  };

  // Helper function to check if a field should be displayed for the current role
  const shouldDisplayField = (field) => {
    return roleFields[role]?.includes(field);
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
  const renderTags = (tagId) => {
    if (!historicalTags[tagId]) {
      // Fetch tags only if they haven't been fetched yet
      getHistoricalTags(tagId);
      return 'Loading...';
    }
    // Display the cached tags
    return historicalTags[tagId].join(', ');
  };
  const handleClose = () => {
    setOpen(false);
    setType(null);
    setBudget(null);
     setSelectedItem(null); 
    
  };

  const handleClickOpen = (item) => {
     setSelectedItem(item);   
    setOpen(true);
  };
  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleBudgetChange = (event) => {
    setBudget(event.target.value);
  };
  // useEffect(() => {
  //   filteredData.forEach((item) => {
  //     if (item.type === 'HistoricalPlace' && item.tags && !historicalTags[item.tags]) {
  //       getHistoricalTags(item.tags);
  //     }
  //   });
  // }, [filteredData, historicalTags]);
// getHistoricalTags('66ffdb0eb9e6b2a03ef530cc');
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
        <div style={{ width: '300px', padding: '20px', backgroundColor: '#f5f5f5' }}>
          <h3>Filters</h3>
          <TextField
            label="Search by Name"
            variant="outlined"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          {role == 'Itineraries' && (
            <FormControl fullWidth style={{ marginBottom: '20px' }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={filters.sortBy} onChange={handleFilterChange} name="sortBy">
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
          )}
          {role == 'Activities' && (
            <FormControl fullWidth style={{ marginBottom: '20px' }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={filters.sortBy} onChange={handleFilterChange} name="sortBy">
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {shouldDisplayField('budget') && (
              <TextField
                label="Budget"
                variant="outlined"
                name="budget"
                value={filters.budget}
                onChange={handleFilterChange}
                fullWidth
              />
            )}

            {shouldDisplayField('Tag') && (
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tag</InputLabel>
                <Select
                  label="Tag"
                  name="Tag"
                  value={filters.Tag}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Monuments">Monuments</MenuItem>
                  <MenuItem value="Museums">Museums</MenuItem>
                  <MenuItem value="Palaces">Palaces</MenuItem>
                </Select>
              </FormControl>
            )}

            {shouldDisplayField('preferences') && (
              <TextField
                label="Preferences"
                variant="outlined"
                name="preferences"
                value={filters.preferences}
                onChange={handleFilterChange}
                fullWidth
              />
            )}

            {shouldDisplayField('category') && (
              <TextField
                label="Category"
                variant="outlined"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                fullWidth
              />
            )}

            {shouldDisplayField('language') && (
              <TextField
                label="Language"
                variant="outlined"
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
                fullWidth
              />
            )}

            {shouldDisplayField('date') && (
              <TextField
                label="Date"
                variant="outlined"
                name="date"
                type="date"
                value={filters.date}
                onChange={handleFilterChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}

            {shouldDisplayField('rating') && (
              <div>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={filters.rating}
                  onChange={handleRatingChange}
                  precision={0.5}
                />
              </div>
            )}

            <Button variant="contained" color="primary" onClick={() => applyFilters()}>
              Apply Filters
            </Button>
            <Button variant="outlined" color="secondary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>

        <Grid container spacing={2} style={{ padding: '20px', flex: 1 }}>
          {filteredData.map((item) => (
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
                      <Typography color="text.secondary">
                          Locations: { 
                              <LocationDisplay coordinates={item.location} />
                         }
                      </Typography> 
                      <Typography color="text.secondary">
                        Tags: {item.tags[0] ? renderTags(item.tags[0]) : 'No tags available'}
                      </Typography>                        {item.specialDiscount && (
                        <Typography color="text.secondary">Special Discount: {item.specialDiscount}%</Typography>
                      )}
                    </>
                  )}
                  {item.type === 'Itinerary' && (
                    <>
                      <Typography color="text.secondary">Activities: {item.activities.join(', ')}</Typography>
                      <Typography color="text.secondary">Locations: {item.locations.join(', ')}</Typography>
                      <Typography color="text.secondary">
                        Tags: {item.tags ? renderTags(item.tags) : 'No tags available'}
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
                      <Typography color="text.secondary">
                          Locations: { 
                              <LocationDisplay coordinates={item.location} />
                         }
                      </Typography>
                      <Typography color="text.secondary">Opening Hours: {item.openingHours}</Typography>
                      <Typography color="text.secondary">Students ticket price: {item.ticketPrice[0]}</Typography>
                      <Typography color="text.secondary">Native ticket price: {item.ticketPrice[1]}</Typography>
                      <Typography color="text.secondary">Foreign ticket price: {item.ticketPrice[2]}</Typography>
                      <Typography color="text.secondary">
                          Tags: {item.tags ? renderTags(item.tags) : 'No tags available'}
                      </Typography>                      </>
                  )}
                 <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                 <Button variant="contained" color="primary" onClick={() => handleClickOpen(item)}>
                 Book a ticket 
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
                          onChange={handleChange}
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
export default Filter;


