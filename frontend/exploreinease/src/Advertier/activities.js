import React, { useState, useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  Card,
  CardContent,
  Typography,
  CardActions,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LoadScript, GoogleMap, Marker,PlacesService } from '@react-google-maps/api';
import Slider from '@mui/material/Slider';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 30.033333, // Default to Egypt's latitude
  lng: 31.233334, // Default to Egypt's longitude
};

function Activity() {
  const [activities, setActivities] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [map, setMap] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [activityForm, setActivityForm] = useState({
    date: null,
    time: null,
    location: '',
    price: [0, 100],
    category: '',
    tags: '',
    specialDiscounts: '',
    booking: true,
    lat: null,
    lng: null,
  });

  const categoryList = ['Category 1', 'Category 2', 'Category 3'];
  const tagsList = ['Tag 1', 'Tag 2', 'Tag 3'];
  const [searchInput, setSearchInput] = useState('');
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  const handleClickOpen = () => {
    setActivityForm({
      date: null,
      time: null,
      location: '',
      price: [0, 100],
      category: '',
      tags: '',
      specialDiscounts: '',
      booking: false,
      lat: null,
      lng: null,
    });
    setCurrentActivity(null);
    setIsApiLoaded(false); // Reset API loaded state

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchInput('');
  };

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
    
    // Check if window.google is defined
    if (window.google && window.google.maps && window.google.maps.places) {
      const service = new window.google.maps.places.PlacesService(mapInstance);
      setPlacesService(service);
    } else {
      console.error('Google Maps API not loaded properly');
    }
  };

  const handleSaveActivity = () => {
    const updatedPrice =
      activityForm.price[0] === activityForm.price[1]
        ? [activityForm.price[0]]
        : activityForm.price;

    let updatedDiscount = activityForm.specialDiscounts;
    if (updatedDiscount && !updatedDiscount.includes('%')) {
      updatedDiscount = `${updatedDiscount}%`;
    }

    const updatedActivity = {
      ...activityForm,
      price: updatedPrice,
      specialDiscounts: updatedDiscount,
    };

    if (currentActivity !== null) {
      setActivities((prevActivities) =>
        prevActivities.map((activity, index) =>
          index === currentActivity ? updatedActivity : activity
        )
      );
    } else {
      setActivities((prevActivities) => [...prevActivities, updatedActivity]);
    }

    handleClose();
  };

  const handleEditActivity = (index) => {
    setCurrentActivity(index);
    setActivityForm(activities[index]);
    setOpen(true);
  };

  const handleDeleteActivity = (index) => {
    setActivities((prevActivities) => prevActivities.filter((_, i) => i !== index));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setActivityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (event, newValue) => {
    setActivityForm((prev) => ({ ...prev, price: newValue }));
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      query: searchInput,
      fields: ['name', 'geometry'],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const place = results[0]; // Get the first result
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setActivityForm((prev) => ({
          ...prev,
          lat: lat,
          lng: lng,
          location: place.name, // Use the place name
        }));
      } else {
        console.log('Place search failed due to: ' + status);
      }
    });
  };

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const address = results[0].formatted_address;

          setActivityForm((prev) => ({
            ...prev,
            lat: lat,
            lng: lng,
            location: address, // Use the human-readable address
          }));
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }, []);

  // Handle Date change
  const handleDateChange = (newDate) => {
    setActivityForm((prev) => ({ ...prev, date: newDate }));
  };

  // Handle Time change
  const handleTimeChange = (newTime) => {
    setActivityForm((prev) => ({ ...prev, time: newTime }));
  };

  const handleCheckboxChange = (event) => {
    setActivityForm((prev) => ({ ...prev, booking: event.target.checked }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
   
        <Button variant="contained" onClick={handleClickOpen} sx={{ maxWidth: 150, marginTop: 2, marginLeft: 2 }}>
          Add Activity
        </Button>
        <Dialog open={open} onClose={handleClose} sx={{ minWidth: 1000 }}>
          <DialogTitle>{currentActivity !== null ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
          <DialogContent>
            <DatePicker
              labelId="date"
              id="date"
              name="date"
              value={activityForm.date ? dayjs(activityForm.date) : null} // Ensure it's a Day.js object
              onChange={handleDateChange}
              label="Date"
            />
            <TimePicker
              name="time"
              value={activityForm.time ? dayjs(activityForm.time) : null} // Ensure it's a Day.js object
              onChange={handleTimeChange}
              label="Time"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={activityForm.category}
                onChange={handleInputChange}
                label="Category"
              >
                {categoryList.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="tags-label">Tags</InputLabel>
              <Select
                labelId="tags-label"
                id="tags"
                name="tags"
                value={activityForm.tags}
                onChange={handleInputChange}
                label="Tags"
              >
                {tagsList.map((tag, index) => (
                  <MenuItem key={index} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={activityForm.price}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              name="price"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={activityForm.booking}
                  onChange={handleCheckboxChange}
                />
              }
              label="Booking Available"
            />
            <TextField
              fullWidth
              margin="normal"
              name="location"
              label="Location"
              value={activityForm.location}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>


            <LoadScript googleMapsApiKey={'AIzaSyBl4qzmCWbzkAdQlzt8hRYrvTfU-LSxWRM'}>

              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onClick={handleMapClick}
              >
                {activityForm.lat && activityForm.lng && (
                  <Marker position={{ lat: activityForm.lat, lng: activityForm.lng }} />
                )}
              </GoogleMap>
            </LoadScript>

            <TextField
              fullWidth
              margin="normal"
              name="specialDiscounts"
              label="Special Discounts"
              value={activityForm.specialDiscounts}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSaveActivity} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={2} style={{ marginTop: 20 }}>
          {activities.map((activity, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{activity.location}</Typography>
                  <Typography variant="body2">Date: {dayjs(activity.date).format('DD/MM/YYYY')}</Typography>
                  <Typography variant="body2">Time: {activity.time ? dayjs(activity.time).format('HH:mm') : ''}</Typography>
                  <Typography variant="body2">Price: {activity.price.join(' - ')}</Typography>
                  <Typography variant="body2">Category: {activity.category}</Typography>
                  <Typography variant="body2">Tags: {activity.tags}</Typography>
                  <Typography variant="body2">Discounts: {activity.specialDiscounts}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleEditActivity(index)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteActivity(index)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </LocalizationProvider>
  );
}

export default Activity;
