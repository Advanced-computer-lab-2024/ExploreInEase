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
    price: 800,
    date: '2023-09-01',
    rating: 3.5,
    category: 'Food',
    language: 'English',
    preferences: 'Historic Areas',
    Tag: 'Monuments',
    type: 'Activity',
  },
  {
    id: 2,
    name: 'Activity 2',
    budget: 2000,
    price: 1200,
    date: '2024-11-01',
    rating: 2.5,
    category: 'Party',
    language: 'English',
    preferences: 'Historic Areas',
    Tag: 'Monuments',
    type: 'Activity',
  },
  {
    id: 3,
    name: 'Itinerary 1',
    budget: 500,
    price: 400,
    date: '2024-01-15',
    rating: 4.0,
    category: 'Concert',
    language: 'Spanish',
    preferences: 'Shopping',
    Tag: 'Palaces',
    type: 'Itinerary',
  },
  {
    id: 4,
    name: 'Itinerary 2',
    budget: 1500,
    price: 1400,
    date: '2021-02-27',
    rating: 3.2,
    category: 'Food',
    language: 'English',
    preferences: 'Beaches',
    Tag: 'Palaces',
    type: 'Itinerary',
  },
  {
    id: 5,
    name: 'Historical Place 1',
    budget: 2000,
    price: 1500,
    date: '2024-03-10',
    rating: 4.7,
    category: 'Party',
    language: 'English',
    preferences: 'Beaches',
    Tag: 'Museums',
    type: 'HistoricalPlace',
  },
  {
    id: 6,
    name: 'Historical Place 2',
    budget: 300,
    price: 750,
    date: '2022-06-13',
    rating: 3.1,
    category: 'Party',
    language: 'English',
    preferences: 'Beaches',
    Tag: 'Museums',
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
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2, justifyContent: 'center' }}>
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
                  <Typography color="text.secondary">Price: {item.price}</Typography>
                  <Typography color="text.secondary">Budget: {item.budget}</Typography>
                  <Typography color="text.secondary">Date: {item.date}</Typography>
                  <Typography color="text.secondary">Rating: {item.rating}</Typography>
                  <Typography color="text.secondary">Category: {item.category}</Typography>
                  <Typography color="text.secondary">Language: {item.language}</Typography>
                  <Typography color="text.secondary">Preferences: {item.preferences}</Typography>
                  <Typography color="text.secondary">Tag: {item.Tag}</Typography>
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