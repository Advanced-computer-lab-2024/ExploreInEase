import React, { useState, useEffect } from 'react';
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
    CardMedia,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { format, parseISO } from 'date-fns';
import NetworkService from '../NetworkService'; // Adjust the import if needed
import './GuestHP.css'; // Import the CSS file
import NodataFound from '../No data Found.avif';
import HomePage from './GuestNavbar';
import debounce from 'lodash.debounce';

const Events = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
  const [events, setEvents] = useState([]); // State to store fetched events
  const itemList = events?.flat()||[]; // Flatten the array and ensure it's initialized
  const [role, setRole] = useState('Activities'); // Default to Main to show all
  const [filteredData, setFilteredData] = useState([]);
  const [currency] = useState("EGP");
  const [error, setError] = useState(null); // State to store any error messages
  const [addressCache] = useState({});
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
  const roleFields = {
    HistoricalPlaces: ['Tag'],
    Activities: ['budget', 'date', 'category', 'rating'],
    Itineraries: ['budget', 'date', 'preferences', 'language'],
  };

  const handleRatingChange = (event, newRating) => {
    setFilters({
      ...filters,
      rating: newRating,
    });
  };
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
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  const shouldDisplayField = (field) => {
    return roleFields[role]?.includes(field);
  };
  const handleOpenDialog = (data) => {
    setDialogData(data);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogData(null);
  };
  // Fetch events from the server when component mounts
  useEffect(() => {
    async function fetchEvents() {
      try {
        const options = {
          apiPath: `/upcomingEvents/${currency}`,
          urlParam: { currency },
        };

        const response = await NetworkService.get(options); // Fetch data from NetworkService
        console.log(response);
        
        setEvents(response); // Store events in state
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("An unexpected error occurred.");
      }
    }
    fetchEvents();
    fetchEvents(); // Trigger the fetch on component mount
  },);
  useEffect(() => {
    const initialData = itemList.filter(item =>
      (role === 'Activities' && item.type === 'Activity') ||
      (role === 'Itineraries' && item.type === 'Itinerary') ||
      (role === 'HistoricalPlaces' && item.type === 'HistoricalPlace')
    );
    setFilteredData(initialData);
  }, []);

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
  
  const handleRoleChange = (event, newValue) => {
    setRole(newValue);
    applyFilters(newValue); // Apply filters immediately when changing tabs
  };
  console.log("filteredData",filteredData);
  
  return (
    <div className="homepage">
      <HomePage /> {/* Render the Navbar (HomePage) */}

      <div className="events-list">
        {error && <p className="error-message">{error}</p>} {/* Display error if any */}
        {filteredData.length > 0 ? (
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
         {role ==='Itineraries' && (
           <FormControl fullWidth style={{ marginBottom: '20px' }}>
             <InputLabel>Sort By</InputLabel>
             <Select value={filters.sortBy} onChange={handleFilterChange} name="sortBy">
               <MenuItem value="price">Price</MenuItem>
               <MenuItem value="rating">Rating</MenuItem>
             </Select>
           </FormControl>
         )}
         {role === 'Activities' && (
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
                        width: item.type === 'Activity' ? '300px' : item.type === 'Itinerary' ? '320px' : '340px',
                        height: 'auto',
                        margin: '16px',
                        padding: '16px',
                        border: '1px solid #ddd',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                      }}
               >
                    <CardMedia
                        component="img"
                        height="150"
                        image={item.imageUrl || NodataFound} // Default placeholder if no image URL is provided
                        alt={item.name}
                        style={{ borderRadius: '8px 8px 0 0' }}
                        />

               <CardContent>
                <div style={{ display: 'flex', alignItems: 'center',marginLeft:"120px"}}>  
                 <Typography variant="h5" component="div">
                   {item.name}
                 </Typography>
                 <IconButton onClick={() => handleOpenDialog(item)} style={{ marginTop: '8px' }}>
                    <InfoIcon color="primary" />
                  </IconButton></div>
                 {item.type === 'Activity' && (
                   <>
                     <Typography><strong>Locations:</strong>
                          { 
                             <LocationDisplay coordinates={item.location} />
                        }
                     </Typography> 
                      {item.specialDiscount && (
                       <Typography ><strong>Special Discount:</strong> {item.specialDiscount}%</Typography>
                     )}
                   </>
                 )}
                 {item.type === 'Itinerary' && (
                   <>
                     <Typography ><strong>Activities:</strong> {item.activities.join(', ')}</Typography>
                     <Typography ><strong>Locations:</strong> {item.locations.join(', ')}</Typography>   
                   </>
                 )}
                 {item.type === 'HistoricalPlace' && (
                   <>
                     <Typography><strong>Description:</strong> {item.description}</Typography>
                     <Typography><strong>Locations:</strong>
                         { 
                             <LocationDisplay coordinates={item.location} />
                        }
                     </Typography>
                     {/* <Typography><strong> Tags:</strong>
                         {item.tags ? renderTags(item.tags) : 'No tags available'}
                     </Typography>           */}
                   </>
                 )}
        
                 </CardContent>
                 </Card>   
                 <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>More Details</DialogTitle>
        <DialogContent>
          {dialogData && (
            <div>
              {item.type === 'Activity' && (
                <>
                  <Typography><strong>Budget:</strong> {dialogData.budget}||0</Typography>
                  <Typography><strong>Date:</strong> {dialogData.date}||No Date</Typography>
                  <Typography><strong>Category:</strong> {dialogData.category}||NO Category</Typography>
                  {dialogData.specialDiscount && (
                    <Typography><strong>Special Discount:</strong> {dialogData.specialDiscount}%</Typography>
                  )}
                </>
              )}
              {item.type === 'Itinerary' && (
                <>
                  <Typography><strong>Price:</strong> {dialogData.price}</Typography>
                  <Typography><strong>Rating:</strong> {dialogData.rating.length === 0 ? 0 : dialogData.rating}</Typography>
                  <Typography><strong>Language:</strong> {dialogData.language}</Typography>
                  <Typography><strong>Directions:</strong> {dialogData.directions}</Typography>
                </>
              )}
              {item.type === 'HistoricalPlace' && (
                <>
                  <Typography><strong>Opening Hours:</strong> {dialogData.openingHours}</Typography>
                  <Typography><strong>Students ticket price:</strong> {dialogData.ticketPrice[0]}</Typography>
                  <Typography><strong>Native ticket price:</strong> {dialogData.ticketPrice[1]}</Typography>
                  <Typography><strong>Foreign ticket price:</strong> {dialogData.ticketPrice[2]}</Typography>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog> 
               </Grid>
               
                 ))}

               </Grid>

             </div>
           </div>
        ) : (
            
            <div className="no-data-container">
            <img src={NodataFound} alt="No Data Found" className="no-data-image" />
          </div>
              
        //   <p>No events available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
