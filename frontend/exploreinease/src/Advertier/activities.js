import React, { useState, useCallback,useEffect } from 'react';
import {
  Button,
  Dialog, DialogActions, DialogContent, TextField,DialogTitle,Card, CardContent,Typography,CardActions,ListItemText,
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
import axios from 'axios'; // Ensure Axios is imported
import { useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import NetworkService from '../NetworkService';
const containerStyle = {
  width: '100%',
  height: '400px',
};
const defaultCenter = {
  lat: 30.033333, // Default to Egypt's latitude
  lng: 31.233334, // Default to Egypt's longitude
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function Activity() {
  const location = useLocation();
  const { allActivity} = location.state||{};
  const {id}=location.state||{};
  const [mapCenter, setMapCenter] = useState({lat: 0, lng: 0});
  const [activities, setActivities] = useState(allActivity); 
  const [open, setOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [map, setMap] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [tagsList, setTagsList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [activityForm, setActivityForm] = useState({
    _id: '',
    name: '',
    date: null,
    time: null,
    location: {
      latitude: null,
      longitude: null
    },
    price: [0, 100],
    category: '',
    categoryId: '',
    tags: [],
    specialDiscounts: 0,
    isOpen: true,
  });
  const [searchInput, setSearchInput] = useState('');
  const [isApiLoaded, setIsApiLoaded] = useState(false);
console.log(id);

  useEffect(() => {
    getAllTags();
  }, []);
  useEffect(() => {
    getAllCategory();
  }, []);

useEffect(()=>
{
  getAllActivities();
},[]
);

const getAllActivities =async()=>{
  try {
    // Construct the API path
    const apiPath = `http://localhost:3030/activity/user/${id}/allActivities`;  // Ensure this matches your API route
    // Make the GET request using Axios
    const response = await axios.get(apiPath);

    // Log the response data
    console.log('API Response:', response);

    // Pass the fetched activities to the Activities page
        setActivities(response.data);
        console.log(activities);
            
  } catch (err) {
    // Check if there is a response from the server and handle error
    if (err.response) {
      console.error('API Error:', err.message);
    } else {
      console.error('Unexpected Error:', err);
    }
  }
} 
  const handleClickOpen = () => {
    setActivityForm({
      name:"",
      date: null,
      time: null,
      location:{
        latitude: defaultCenter.lat,
        longitude: defaultCenter.lng
      },
      price: [0, 100],
      category: '',
      tags: [],
      specialDiscounts: 0,
      isOpen: false,
    });
    setCurrentActivity(null);
    setIsApiLoaded(false); // Reset API loaded state
    setMapCenter(defaultCenter);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchInput('');
  };

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
    if(window.google){
      console.log(1)

    } if(window.google.maps){
      console.log(2)

    }if(!window.google.maps.places){
      console.log(3)

    }
    // Check if window.google is defined
    if (window.google && window.google.maps && window.google.maps.places) {
      const service = new window.google.maps.places.PlacesService(mapInstance);
      setPlacesService(service);
    } else {
      console.error('Google Maps API not loaded properly');
    }
  };

const getAllTags=async ()=>{
  try {
    const apiPath = `http://localhost:3030/getAllPreferenceTags/${id}`;  // Ensure this matches your API route
    const response = await axios.get(apiPath);
    if (Array.isArray(response.data.tags)) {
      setTagsList(response.data.tags);

    } else {
      console.error('Unexpected data format from API');
    }
    
  } catch (err) {
    // Check if there is a response from the server and handle error
    if (err.response) {
      console.error('API Error:', err.message);
      // setError(err.response.data.message);  // Display error message from the server
    } else {
      console.error('Unexpected Error:', err);
      // setError('An unexpected error occurred.');  // Display generic error message
    }
  }
}

const getAllCategory=async ()=>{
  try {
    const apiPath = `http://localhost:3030/getAllCategories/advertiser`;  // Ensure this matches your API route
    const response = await axios.get(apiPath);
    console.log(response);
    
    if (Array.isArray(response.data)) {
      const categories = response.data.map(category => ({
        id: category._id,
        name: category.categoryName
      }));
      setCategoryList(categories);
      console.log(categories);
      
    } else {
      console.error('Unexpected data format from API');
    }
    
  } catch (err) {
    // Check if there is a response from the server and handle error
    if (err.response) {
      console.error('API Error:', err.message);
      // setError(err.response.data.message);  // Display error message from the server
    } else {
      console.error('Unexpected Error:', err);
      // setError('An unexpected error occurred.');  // Display generic error message
    }
  }
}


function convertTimeToFullDate(timeString) {
  // Step 1: Get the current date
  const currentDate = new Date(); // This gives us the current date

  // Step 2: Extract hours and minutes from the time string
  const [hoursString, minutesString] = timeString.split(':');
  let hours = parseInt(hoursString, 10); // Parse the hours
  const minutes = parseInt(minutesString, 10); // Parse the minutes

  // Step 3: Adjust the time for AM/PM if necessary (optional, assuming 24-hour format for now)
  // Example: if you're dealing with 12-hour AM/PM format, handle conversion here

  // Step 4: Set the time on the current date
  currentDate.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

  return currentDate;
}

const handleSaveActivity = async () => {

  try {
    const updatedPrice =
      activityForm.price[0] === activityForm.price[1]
        ? [activityForm.price[0]]
        : activityForm.price;
    const updatedActivity = {
      ...activityForm,
      price: updatedPrice,
      tags: Array.isArray(activityForm.tags) ? activityForm.tags : [], // Ensure tags is always an array of objects
    };
    if (currentActivity !== null) {
      // console.log("Activity",currentActivity);
      console.log("Id of activity",currentActivity._id);
      // Updating existing activity
      const apiPath=`http://localhost:3030/activity/${currentActivity._id}/${id}`;
      const body= {
          date: dayjs(currentActivity.date).format('YYYY-MM-DD'),
          time: currentActivity.time,
          location: currentActivity.location,
          price: currentActivity.price[1],
          category: categoryList.find(item => item.id === currentActivity.category)?.id,
          tags: currentActivity.tags || [],
          specialDiscounts: currentActivity.specialDiscounts,
          isOpen: currentActivity.isOpen || false,
        };
        
        const response = await axios.put(apiPath,body);
        console.log(response.data.activity);
        
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.id === activityForm.id ? response.data.activity : activity
        )
      );
    } else {
      
      // Creating new activity
      const apiPath = `http://localhost:3030/activity`;
      const body = {
        name: updatedActivity.name,
        date: dayjs(updatedActivity.date).format('YYYY-MM-DD'),
        time: dayjs(updatedActivity.time).format('HH:mm'),
        location: updatedActivity.location,
        price: updatedActivity.price[1],
        category: updatedActivity.categoryId,
        tags: updatedActivity.tags,
        specialDiscounts: updatedActivity.specialDiscounts,
        isOpen: updatedActivity.isOpen || false,
        created_by: id
      }
      console.log(updatedActivity.time);
      
      console.log(body);
      
      const response = await axios.post(apiPath, body);
      console.log(response);

      // Add the new activity to the state
      setActivities((prevActivities) => [...prevActivities, response.data]);
    }

    handleClose();
  } catch (err) {
    if (err.response) {
      console.error('API Error:', err);
      // You might want to set an error state here to display to the user
      // setError(err.response.data.message);
    } else {
      console.error('Unexpected Error:', err);
      // setError('An unexpected error occurred.');
    }
  }
};

  const handleEditActivity = (activity) => {
    console.log('Editing activity:', activity); // Log the activity being edited
console.log("Activity to show",activity);
      setCurrentActivity(activity);
      if (activity.location) {        
      setActivityForm({
        ...activity,
        time:convertTimeToFullDate(activity.time),
        category: categoryList.find(item =>item.id===activity.category)?.name,
          location:{
          latitude:activity.location.latitude||mapCenter.lat,
          longitude:activity.location.longitude||mapCenter.lng
        },
        tags: Array.isArray(activity.tags) ? activity.tags : [], // Ensure tags is always an array of objects

      });     
    }else {
      console.error('Activity location is undefined');

    }
       setOpen(true); 
  };

  const handleDeleteActivity = async (index) => {
    
    const activityid=activities[index]._id;
    console.log(activityid);
    console.log(id);
    console.log(allActivity);
    
    try {
      const options ={
         apiPath:`/activity/${activityid}/${id}`,
      };
      const response = NetworkService.delete(options);
      setActivities((prevActivities) => prevActivities.filter((_, i) => i !== index));
    } catch (err) {
      if (err.response) {
        console.error('API Error:', err);
        // You might want to set an error state here to display to the user
        // setError(err.response.data.message);
      } else {
        console.error('Unexpected Error:', err);
        // setError('An unexpected error occurred.');
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'tags') {
      setActivityForm((prev) => ({ ...prev, 
        [name]: Array.isArray(value) ? value : []
      }));
    } else if (name === 'specialDiscounts') {
      setActivityForm((prev) => ({ ...prev, [name]: Number(value) })); // Ensure specialDiscounts is a number
    } else if (name === 'category') {
      const selectedCategory = categoryList.find(cat => cat.name === value);
      setActivityForm((prev) => ({ 
        ...prev, 
        [name]: value,
        categoryId: selectedCategory ? selectedCategory.id : ''
      }))} 
    else {
      setActivityForm((prev) => ({ ...prev, [name]: value }));
    }
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
          location: {
            latitude: lat,
            longitude: lng
          },
        }));
        setMapCenter({ lat, lng });

      } else {
        console.log('Place search failed due to: ' + status);
      }
    });
  };

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const geocoder = new window.google.maps.Geocoder();
    
    setActivityForm((prev) => {
      console.log('Updating activityForm:', { lat, lng }); // Debug log
      return {
        ...prev,
        location: {
          latitude: lat,
          longitude: lng
        },
      };
    });
    console.log(activityForm.location);
    console.log(activityForm.location.latitude);
    console.log(activityForm.location.longitude);
 
    setMapCenter({ lat, lng });
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
    setActivityForm((prev) => ({ ...prev, isOpen: event.target.checked }));
  };

  return (
    <div>
    <LoadScript googleMapsApiKey={'AIzaSyBl4qzmCWbzkAdQlzt8hRYrvTfU-LSxWRM'} libraries={["places"]}>
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
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Name"
              value={activityForm.name}
              onChange={handleInputChange}
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
                {categoryList.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
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
                multiple
                value={activityForm.tags}
                onChange={handleInputChange}
                renderValue={(selected) => selected.map(tag => tag).join(', ')}
                label="Tags"
              >
                {tagsList.map((tag,index) => (
                  <MenuItem key={index} value={tag}>
                  <Checkbox checked={activityForm.tags.indexOf(tag) > -1} />
                        <ListItemText primary={tag} />
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
                  checked={activityForm.isOpen}
                  onChange={handleCheckboxChange}
                />
              }
              label="Booking Available"
            />
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                  lat: activityForm.location.latitude|| mapCenter.lat ,
                  lng: activityForm.location.longitude || mapCenter.lng
                }}
              zoom={10}
                onLoad={onLoad}
                onClick={handleMapClick}
              >
          {activityForm.location.latitude && activityForm.location.longitude && (
              <Marker position={{ lat: activityForm.location.latitude, lng: activityForm.location.longitude }} />
            )}
              </GoogleMap>

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
                  <Typography variant="h5">{activity.name}</Typography>
                  <Typography variant="body2">Date: {dayjs(activity.date).format('DD/MM/YYYY')}</Typography>
                  <Typography variant="body2">Time: {activity.time}</Typography>
                  <Typography variant="body2">Price: {activity.price}</Typography>
                  <Typography variant="body2">Category: {categoryList.find(item =>item.id===activity.category)?.name}</Typography>
                  <Typography variant="body2"> Tags: {activity.tags}</Typography>  
                    <Typography variant="body2">Discounts: {activity.specialDiscounts}</Typography>
                  <Typography variant="body2">Location longitude: {activity.location?.longitude || mapCenter.lng}</Typography>
                  <Typography variant="body2">Location latitude: {activity.location?.latitude|| mapCenter.lat}</Typography>

                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleEditActivity(activity)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteActivity(index)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </LocalizationProvider>
    </LoadScript>
    </div>
  );
}

export default Activity;
