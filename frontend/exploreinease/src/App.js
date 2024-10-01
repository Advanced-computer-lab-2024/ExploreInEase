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
} from '@mui/material';

// Sample data
const itemList = [
  {
    id: 1,
    name: 'Package 1',
    budget: 1000,
    price: 800,
    date: '2023-09-01',
    rating: 3.5,
    category: 'Food',
    language: 'English',
    preferences: 'Historic Areas',
    Tag: 'Monuments',
  },
  {
    id: 2,
    name: 'Package 2',
    budget: 500,
    price: 400,
    date: '2024-01-15',
    rating: 4.0,
    category: 'Concert',
    language: 'Spanish',
    preferences: 'Shopping',
    Tag: 'Palaces',
  },
  {
    id: 3,
    name: 'Package 3',
    budget: 2000,
    price: 1500,
    date: '2024-03-10',
    rating: 4.7,
    category: 'Party',
    language: 'English',
    preferences: 'Beaches',
    Tag: 'Museums',
  },
];

// Role-based fields
const roleFields = {
  HistoricalPlaces: ['Tag'],
  Activities: ['budget', 'date', 'category', 'rating'],
  Itineraries: ['budget', 'date', 'preferences', 'language'],
};

function App() {
  const [filters, setFilters] = useState({
    budget: '',
    price: '',
    date: '',
    rating: 0,
    category: '',
    language: '',
    preferences: '',
    Tag: '',
  });

  const [filteredData, setFilteredData] = useState(itemList);
  const [role, setRole] = useState('Activities'); // Simulate user role

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

  // Apply Filters
  const applyFilters = () => {
    let data = itemList;

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
      data = data.filter((item) => item.rating >= filters.rating);
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

    setFilteredData(data);
  };

  // Reset Filters
  const resetFilters = () => {
    setFilters({ budget: '', price: '', date: '', rating: 0, category: '', language: '', preferences: '', Tag: '' });
    setFilteredData(itemList);
  };

  // Helper function to check if a field should be displayed for the current role
  const shouldDisplayField = (field) => {
    return roleFields[role].includes(field);
  };
  const dateObject = new Date('2022-5-3');
  console.log(dateObject);
  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      <div style={{ width: '300px', padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h3>Filters</h3>


        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Select Type</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <MenuItem value="HistoricalPlaces">Historical Places</MenuItem>
            <MenuItem value="Activities">Activities</MenuItem>
            <MenuItem value="Itineraries">Itineraries</MenuItem>
          </Select>
        </FormControl>


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
                <MenuItem value="Palaces">Palaces</MenuItem>
                <MenuItem value="Museums">Museums</MenuItem>
              </Select>
            </FormControl>
          )}


          {shouldDisplayField('date') && (
            <TextField
              label="Date"
              variant="outlined"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          )}
         



          {shouldDisplayField('rating') && (
            <div>
              <label>Rating</label>
              <Rating
                name="rating"
                value={filters.rating}
                onChange={handleRatingChange}
              />
            </div>
          )}


          {shouldDisplayField('category') && (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Concert">Concert</MenuItem>
                <MenuItem value="Party">Party</MenuItem>
              </Select>
            </FormControl>
          )}


          {shouldDisplayField('preferences') && (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Preferences</InputLabel>
              <Select
                label="Preferences"
                name="preferences"
                value={filters.preferences}
                onChange={handleFilterChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Historic Areas">Historic Areas</MenuItem>
                <MenuItem value="Shopping">Shopping</MenuItem>
                <MenuItem value="Beaches">Beaches</MenuItem>
                <MenuItem value="Family-Friendly">Family-Friendly</MenuItem>
                <MenuItem value="Budget-Friendly">Budget-Friendly</MenuItem>
              </Select>
            </FormControl>
          )}


          {shouldDisplayField('language') && (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Language</InputLabel>
              <Select
                label="Language"
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="Arabic">Arabic</MenuItem>
                <MenuItem value="French">French</MenuItem>
              </Select>
            </FormControl>
          )}


          <Button variant="contained" color="primary" onClick={applyFilters} fullWidth>
            Apply Filters
          </Button>
          <Button variant="outlined" color="secondary" onClick={resetFilters} fullWidth>
            Reset Filters
          </Button>
        </div>
      </div>


      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Packages List</h2>

        {/* Grid layout for cards */}
        <Grid container spacing={2}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Budget:</strong> ${item.budget}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Price:</strong> ${item.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Date:</strong> {item.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Rating:</strong>
                      <Rating value={item.rating} readOnly precision={0.1} />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Category:</strong> {item.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Tag:</strong> {item.Tag}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Language:</strong> {item.language}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Preferences:</strong> {item.preferences}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography style={{ color: 'red' }}>No items found</Typography>
          )}
        </Grid>
      </div>
    </div>
  );
}

export default App;
