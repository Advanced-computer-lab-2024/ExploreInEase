import React, { useState } from 'react';
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
} from '@mui/material';

// Sample data with 'type' field added
const itemList = [
  {
    id: 1,
    name: 'Activity 1',
    budget: 1000,
    date: '2023-09-01',
    location: 'Loc',
    category: 'Food',
    tags: 'Monuments',
    specialDiscount: '20',
    type: 'Activity',
  },
  {
    id: 2,
    name: 'Activity 2',
    budget: 1500,
    date: '2024-03-08',
    location: 'Loc2',
    category: 'Concert',
    tags: 'sightseeing',
    specialDiscount: '15',
    type: 'Activity',
  },
  {
    id: 3,
    name: 'Itinerary 1',
    activities: ['Activity 1', 'Activity 2'],
    locations: ['Cairo', 'Paris'],
    dateAvailable: '2024-01-15',
    price: 150,
    directions: 'Start at main gate',
    language: 'Spanish',
    accessibility: 'WheelChair Accessible',
    pickupLocation: 'Lobby',
    dropoffLocation: 'Main Square',
    rating: 4.0,
    type: 'Itinerary',
  },
  {
    id: 4,
    name: 'Itinerary 2',
    activities: ['Activity 1', 'Activity 2'],
    locations: ['Prague', 'Madrid'],
    dateAvailable: '2023-06-25',
    price: 270,
    directions: 'Main at square',
    language: 'English',
    accessibility: 'WheelChair Accessible',
    pickupLocation: 'Lobby',
    dropoffLocation: 'Main Square',
    rating: 2.5,
    type: 'Itinerary',
  },
  {
    id: 5,
    name: 'Historical Place 1',
    description: 'Perfect place to relax',
    pictures: ['implement picture'],
    location: 'to be revised',
    openingHours: '6 to 9',
    ticketPrice: 'to be revised',
    tags: ['Museums'],
    type: 'HistoricalPlace',
  },
  {
    id: 6,
    name: 'Historical Place 2',
    description: 'test for museum',
    pictures: ['implement picture'],
    location: 'to be revised',
    openingHours: '3 to 7',
    ticketPrice: 'to be revised',
    tags: ['history'],
    type: 'HistoricalPlace',
  },
];

// Role-based fields
const roleFields = {
  HistoricalPlaces: ['Tag'],
  Activities: ['budget', 'date', 'category', 'rating'],
  Itineraries: ['budget', 'date', 'preferences', 'language'],
};

const Filter = () => {
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

  const [filteredData, setFilteredData] = useState(itemList);
  const [role, setRole] = useState('Main'); // Default to Main to show all
  const [ratingRange, setRatingRange] = useState([0, 5]); // Added state for rating range

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
    setFilters({ budget: '', price: '', date: '', rating: 0, category: '', language: '', preferences: '', Tag: '', search: '', sortBy: '' });
    setFilteredData(itemList);
    // Keep the role the same when resetting
  };

  // Helper function to check if a field should be displayed for the current role
  const shouldDisplayField = (field) => {
    return roleFields[role]?.includes(field);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2, display: 'flex', justifyContent: 'center' }}>
        <Tabs value={role} onChange={handleRoleChange}>
          <Tab label="Main" value="Main" />
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
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {item.name}
                  </Typography>

                  {item.type === 'Activity' && (
                    <>
                      <Typography color="text.secondary">Budget: {item.budget}</Typography>
                      <Typography color="text.secondary">Date: {item.date}</Typography>
                      <Typography color="text.secondary">Category: {item.category}</Typography>
                      <Typography color="text.secondary">Location: {item.location}</Typography>
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
                      <Typography color="text.secondary">Date Available: {item.dateAvailable}</Typography>
                      <Typography color="text.secondary">Price: {item.price}</Typography>
                      <Typography color="text.secondary">Rating: {item.rating}</Typography>
                      <Typography color="text.secondary">Language: {item.language}</Typography>
                      <Typography color="text.secondary">Accessibility: {item.accessibility}</Typography>
                      <Typography color="text.secondary">Dropoff location: {item.dropoffLocation}</Typography>
                      <Typography color="text.secondary">Pickup location: {item.pickupLocation}</Typography>
                      <Typography color="text.secondary">Directions: {item.directions}</Typography>

                    </>
                  )}

                  {item.type === 'HistoricalPlace' && (
                    <>
                      <Typography color="text.secondary">Description: {item.description}</Typography>
                      <Typography color="text.secondary">Location: {item.location}</Typography>
                      <Typography color="text.secondary">Opening Hours: {item.openingHours}</Typography>
                      <Typography color="text.secondary">Ticket Price: {item.ticketPrice}</Typography>
                      <Typography color="text.secondary">Tags: {item.tags}</Typography>
                    </>
                  )}
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


// For picture in Historical Locations

// <img src={item.pictures[0]} alt={item.name} style={{ width: '100%', marginTop: '10px' }} />
