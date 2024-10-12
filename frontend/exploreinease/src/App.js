/*

import React, { useState , useEffect } from 'react';
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
const data = {
  activities: [
    {
      id: "607d1e3eab1e3f001fddf72a",
      name: "City Tour",
      date: "2024-10-15",
      time: "10:00 AM",
      location: []
        
      ,
      budget: 50,
      category: []
         
      ,
      tags: [
        "sightseeing"
      ],
      specialDiscounts: [
        "string"
      ],
      created_by: "admin",
      flag: true,
      isOpen: true,
      rating: 4.5,
      comments: [
        "string"
      ],
      createdAt: "2024-08-10T12:00:00Z",
      description: "Explore the city's history and culture."
    }
  ],
  itineraries: [
    {
      id: "607d1e3eab1e3f001fddf72b",
      activities: [
        "string"
      ],
      locations: [
        "string"
      ],
      timeline: "09:00 AM - 05:00 PM",
      directions: "Start at the main square.",
      language: "English",
      price: 150,
      dateAvailable: "2024-10-15",
      accessibility: "Wheelchair accessible",
      pickupLocation: "Hotel Lobby",
      dropoffLocation: "Main Square",
      isActivated: true,
      created_by: "admin",
      flag: false,
      rating: 4,
      comments: [
        "string"
      ]
    }
  ],
  historicalPlaces: [
    {
      id: "607d1e3eab1e3f001fddf72c",
      description: "A beautiful historical site.",
      pictures: [
        "http://example.com/image.jpg"
      ],
      location: "Cairo"
        ,
      openingHours: "9 AM - 6 PM",
      ticketPrice: "40"
        ,
      createdAt: "2024-08-10T12:00:00Z",
      tags: [
        "history"
      ]
    }
  ]
};

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

  const [filteredData, setFilteredData] = useState([]);
  const [role, setRole] = useState('Activities'); // Default to Main to show all
  const [ratingRange, setRatingRange] = useState([0, 5]); // Added state for rating range

  useEffect(() => {
    applyFilters();
  }, [role]);




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
  const applyFilters = () => {
    let filteredItems = [];

    switch (role) {
      case 'Activities':
        filteredItems = data.activities;
        break;
      case 'Itineraries':
        filteredItems = data.itineraries;
        break;
      case 'HistoricalPlaces':
        filteredItems = data.historicalPlaces;
        break;
      default:
        filteredItems = [];
    }

    // Apply filters
    filteredItems = filteredItems.filter(item => {
      if (filters.budget && item.budget > parseFloat(filters.budget)) return false;
      if (filters.price && item.price > parseFloat(filters.price)) return false;
      if (filters.date && item.date !== filters.date && item.dateAvailable !== filters.date) return false;
      if (filters.rating && item.rating < filters.rating) return false;
      if (filters.category && item.category?.name !== filters.category) return false;
      if (filters.language && item.language !== filters.language) return false;
      if (filters.tags && !item.tags.includes(filters.tags)) return false;
      if (filters.search && !item.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
          !item.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });

    // Sort logic
    if (filters.sortBy === 'price') {
      filteredItems.sort((a, b) => (b.price || b.budget) - (a.price || a.budget));
    } else if (filters.sortBy === 'rating') {
      filteredItems.sort((a, b) => b.rating - a.rating);
    }

    setFilteredData(filteredItems);
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
      tags: '',
      search: '',
      sortBy: '',
    });
    applyFilters();
  };

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
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {item.name}
                  </Typography>

                  {role === 'Activities' && (
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

                  {role === 'Itineraries' && (
                    <>
                      <Typography color="text.secondary">Activities: {item.activities}</Typography>
                      <Typography color="text.secondary">Locations: {item.locations}</Typography>
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

                  {role === 'HistoricalPlaces' && (
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

*/




import React, { useState , useEffect } from 'react';
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
const data = {
  activities: [
    {
      id: "607d1e3eab1e3f001fddf72a",
      name: "Disney",
      date: "2024-10-15",
      time: "10:00 AM",
      location: "Paris",
      budget: 50,
      category: "Cultural"
        ,
      tags: [
        "sightseeing"
      ],
      specialDiscounts: [
        "string"
      ],
      created_by: "admin",
      flag: true,
      isOpen: true,
      rating: 4.5,
      comments: [
        "string"
      ],
      createdAt: "2024-08-10T12:00:00Z",
      description: "Explore the city's history and culture."
    }
  ],
  itineraries: [
    {
      id: "607d1e3eab1e3f001fddf72b",
      name: "Paris Tour",
      activities: [
        "string"
      ],
      locations: [
        "string"
      ],
      timeline: "09:00 AM - 05:00 PM",
      directions: "Start at the main square.",
      language: "English",
      price: 150,
      dateAvailable: "2024-10-15",
      accessibility: "Wheelchair accessible",
      pickupLocation: "Hotel Lobby",
      dropoffLocation: "Main Square",
      isActivated: true,
      created_by: "admin",
      flag: false,
      rating: 4,
      comments: [
        "string"
      ]
    }
  ],
  historicalPlaces: [
    {
      id: "607d1e3eab1e3f001fddf72c",
      name: "Egyption Museum",
      description: "A beautiful historical site.",
      pictures: [
        "http://example.com/image.jpg"
      ],
      location: "Cairo"
        ,
      openingHours: "9 AM - 6 PM",
      ticketPrice: "40",
      createdAt: "2024-08-10T12:00:00Z",
      tags: [
        "history"
      ]
    }
  ]
};

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

  const [filteredData, setFilteredData] = useState([]);
  const [role, setRole] = useState('Activities'); // Default to Main to show all
  const [ratingRange, setRatingRange] = useState([0, 5]); // Added state for rating range

  useEffect(() => {
    applyFilters();
  }, [role]);




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
  const applyFilters = () => {
    let filteredItems = [];

    switch (role) {
      case 'Activities':
        filteredItems = data.activities;
        break;
      case 'Itineraries':
        filteredItems = data.itineraries;
        break;
      case 'HistoricalPlaces':
        filteredItems = data.historicalPlaces;
        break;
      default:
        filteredItems = [];
    }

    // Apply filters
    filteredItems = filteredItems.filter(item => {
      if (filters.budget && item.budget > parseFloat(filters.budget)) return false;
      if (filters.price && item.price > parseFloat(filters.price)) return false;
      if (filters.date && item.date !== filters.date && item.dateAvailable !== filters.date) return false;
      if (filters.rating && item.rating < filters.rating) return false;
      if (filters.category && item.category?.name !== filters.category) return false;
      if (filters.language && item.language !== filters.language) return false;
      if (filters.tags && !item.tags.includes(filters.tags)) return false;
      if (filters.search && !item.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
          !item.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });

    // Sort logic
    if (filters.sortBy === 'price') {
      filteredItems.sort((a, b) => (b.price || b.budget) - (a.price || a.budget));
    } else if (filters.sortBy === 'rating') {
      filteredItems.sort((a, b) => b.rating - a.rating);
    }

    setFilteredData(filteredItems);
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
      tags: '',
      search: '',
      sortBy: '',
    });
    applyFilters();
  };

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
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {item.name}
                  </Typography>

                  {role === 'Activities' && (
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

                  {role === 'Itineraries' && (
                    <>
                      <Typography color="text.secondary">Activities: {item.activities}</Typography>
                      <Typography color="text.secondary">Locations: {item.locations}</Typography>
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

                  {role === 'HistoricalPlaces' && (
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