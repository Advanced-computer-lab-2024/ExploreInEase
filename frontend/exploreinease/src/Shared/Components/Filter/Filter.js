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
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import React, { useState, useEffect } from "react";

// Sample data with 'type' field added
const itemList = [];

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
                 height: item.type === 'Activity' ? '300px' : item.type === 'Itinerary' ? '400px' : '350px',
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
                        Locations: {Array.isArray(item.location[0]) ? 
                        item.location.map((loc, index) => (
                          <span key={index}>
                            <LocationDisplay coordinates={loc} />
                            {index < item.location.length - 1 ? ', ' : ''}
                          </span>
                        )) : 
                        <LocationDisplay coordinates={item.location} />}
                        </Typography>
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
                      <Typography color="text.secondary">Location: {item.location.join(', ')}</Typography>
                      <Typography color="text.secondary">Opening Hours: {item.openingHours}</Typography>
                      <Typography color="text.secondary">Students ticket price: {item.ticketPrice[0]}</Typography>
                      <Typography color="text.secondary">Native ticket price: {item.ticketPrice[1]}</Typography>
                      <Typography color="text.secondary">Foreign ticket price: {item.ticketPrice[2]}</Typography>

                      <Typography color="text.secondary">Tags: {item.tags}</Typography>
                    </>
                  )}
                 <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                 <Button variant="contained" color="primary" >
                    Book a ticket 
                  </Button> 
            </div>
           </CardContent>
            </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};
export default Filter;


