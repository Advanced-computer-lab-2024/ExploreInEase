import React, { useState, useCallback,useEffect } from 'react';
import {
  Button,
  Dialog, DialogActions, DialogContent, TextField,DialogTitle,Card, CardContent,CardMedia,Typography,CardActions,ListItemText,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import Slider from '@mui/material/Slider';
import dayjs from 'dayjs';
import axios from 'axios'; 
import { useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import NetworkService from '../NetworkService';
import { Alert } from '@mui/material'; 
import Basketball from './ActivityImage/Basketball.jpg';
import Bowling from './ActivityImage/Bowling.jpg';
import Cycling from './ActivityImage/Cycling.webp';
import Fishing from './ActivityImage/Fishing.jpg';
import Football from './ActivityImage/FootBall.jpg';
import Handball from './ActivityImage/Handball.jpg';
import Hiking from './ActivityImage/Hiking.jpg';
import JetSki from './ActivityImage/JetSki.jpg';
import Mountain from './ActivityImage/Mountain.jpg';
import Skater from './ActivityImage/Skater.jpg';
import HomePage from './AdvertiserNavbar';
import NodataFound from '../No data Found.avif';

  const activityImage =[Basketball,Bowling,Fishing,Cycling,Football,Handball,Hiking,JetSki,Mountain,Skater];

  const containerStyle = {
  width: '100%',
  height: '400px',
};
const defaultCenter = {
  lat: 30.033333, // Default to Egypt's latitude
  lng: 31.233334, // Default to Egypt's longitude
};


function Activity() {
  const location = useLocation();
  const { allActivity} = location.state||{};
  const {id}=location.state||{};
  const [mapCenter, setMapCenter] = useState({lat: 0, lng: 0});
  const [activities, setActivities] = useState(allActivity); 
  const [open, setOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [map,setMap] = useState(null);
  const [ placesService,setPlacesService] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [tagsList, setTagsList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
 const [address,setAddress]=useState('');
 const [selectedImage, setSelectedImage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [ searachInput,setSearchInput] = useState('');
  const [ Location,setLocation] = useState('');

  const [ isApiLoaded,setIsApiLoaded] = useState(false);
  const [addresslocation,setAdressLocation]=useState('');
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
    specialDiscounts: null,
    isOpen: true,
    picture: null,
  });


  useEffect(() => {
    getAllTags();
  }, []);
  useEffect(() => {
    getAllCategory();
  }, []);

useEffect(()=>{
  getAllActivities();
},[]);
useEffect(() => {
  if (showSuccessMessage) {
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [showSuccessMessage]);

useEffect(() => {
  if (showErrorMessage) {
    const timer = setTimeout(() => {
      setShowErrorMessage(false);
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [showErrorMessage]);

useEffect(() => {  
  const fetchAddress = async () => {    
    if (activityForm?.location?.latitude && activityForm?.location?.longitude) {
      const fetchedAddress = await fetchAddressFromCoordinates(
        activityForm.location.latitude,
        activityForm.location.longitude
      ).then((address) => {
        setAdressLocation(address);
      });;
    }
  };

  fetchAddress();
},[activities]);


const getAllActivities =async()=>{
  try {
    // Construct the API path
    const apiPath = `http://localhost:3030/activity/user/${id}/allActivities`;  // Ensure this matches your API route
    // Make the GET request using Axios
    const response = await axios.get(apiPath);

    // Log the response data
    // console.log('API Response:', response);

    // Pass the fetched activities to the Activities page
    console.log(response.data);
      const adjustedActivities = response.data.map((activity) => ({
        ...activity,
        picture: localStorage.getItem(`activity-image-${activity._id}`) || null,
      }));

      setActivities(adjustedActivities);



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
      specialDiscounts: null,
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
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]); // Save the selected file to state
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
    // console.log(response);
    
    if (Array.isArray(response.data.tags)) {
      const tags = response.data.tags.map(tag => ({
        id: tag._id,
        name: tag.tags
      }));
      setTagsList(tags);      
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
async function fetchAddressFromCoordinates (  latitude, longitude)  {
  const apiKey = "AIzaSyDifIZGHTwXaBJG610aJc9SWAe6sOAuwZE";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const address = data.results[0]?.formatted_address || "Address not found";
      return address;
    } else {
      throw new Error(data.error_message || "Failed to fetch address");
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address";
  }
};
const getAllCategory=async ()=>{
  try {
    const apiPath = `http://localhost:3030/getAllCategories/advertiser`;  // Ensure this matches your API route
    const response = await axios.get(apiPath);
    // console.log(response);
    
    if (Array.isArray(response.data)) {
      const categories = response.data.map(category => ({
        id: category._id,
        name: category.categoryName
      }));
      setCategoryList(categories);
      // console.log(categories);
      
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
  // console.log("Current Date",currentDate);

  return currentDate;
  
}
// console.log("Data",activities);

const handleSaveActivity = async () => {
  try {        
    const updatedActivity = {
      ...activityForm,
      tags: Array.isArray(activityForm.tags) ? activityForm.tags : [], // Ensure tags is always an array of objects
    };
    
    if (currentActivity !== null) {
      console.log("Activity",updatedActivity);
      
      const tagIds = tagsList.filter(tag => updatedActivity.tags.includes(tag.name)).map(tag => tag.id);
      const rangeArray = updatedActivity.price;
      // const priceObject = rangeArray.join('-');
      // console.log("Activity",currentActivity);
      console.log("Updated activity:",updatedActivity);
      // console.log("priceObject:",priceObject);
            try{
            // Updating existing activity
            const apiPath=`http://localhost:3030/activity/${updatedActivity._id}/${id}`;
            const body= {
                name: updatedActivity.name,
                date: dayjs(updatedActivity.date).format('YYYY-MM-DD'),
                time: typeof updatedActivity.time === 'string' 
                ? updatedActivity.time 
                : dayjs(updatedActivity.time).format('hh:mm'),
                location: updatedActivity.location,
                price:rangeArray,
                category: updatedActivity.categoryId,
                tags: tagIds || [],
                specialDiscounts: updatedActivity.specialDiscounts||0,
                isOpen: updatedActivity.isOpen || false,
              };
              console.log("body:",updatedActivity);

                const response = await axios.put(apiPath,body);
                console.log("response:",response);
                getAllActivities();
                handleClose();
              setSuccessMessage(response.data.message||"Edit Successfully!");
                setShowSuccessMessage(true);
            }catch(error){
              setErrorMessage(error.response?.data?.message || 'An error occurred');
              setShowErrorMessage(true); 
            }
    } else {

      const tagIds = tagsList.filter(tag => updatedActivity.tags.includes(tag.name)).map(tag => tag.id);
      const rangeArray = updatedActivity.price;
      const priceObject = Array.isArray(rangeArray) ? rangeArray.join('-') : "0-0"; // Default to "0-0" or any other fallback
      try {
        const formData = new FormData();
        formData.append("file", selectedImage); 
        formData.append("name", updatedActivity.name);
        formData.append("date", dayjs(updatedActivity.date).format('YYYY-MM-DD'));
        formData.append("time", dayjs(updatedActivity.time).format('hh:mm A'));
        formData.append("latitude", updatedActivity.location.latitude);   
        formData.append("longitude", updatedActivity.location.longitude);     
        formData.append("price", JSON.stringify(priceObject)); // Convert objects to JSON strings
        formData.append("category", updatedActivity.categoryId);
        formData.append("tags", JSON.stringify(tagIds || []));
        formData.append("specialDiscounts", updatedActivity.specialDiscounts || 0);
        formData.append("isOpen", updatedActivity.isOpen || false);
        formData.append("created_by", id);
    
        const response = await axios.post('http://localhost:3030/activity', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
          },
        });
    
        console.log(response.data);
        const uploadedImageUrl = response.data.imageUrl;
        localStorage.setItem(`activity-image-${response.data.finalActivity._id}`, uploadedImageUrl);
        console.log(`activity-image-${response.data.finalActivity._id}`);
        console.log('Image uploaded successfully:', uploadedImageUrl);

        getAllActivities();
        handleClose();
        setSuccessMessage(response.data.message || "Activity Created Successfully!");
        setShowSuccessMessage(true);
      } catch (error) {
        console.error('Error submitting activity:', error);
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);
      }
    }
  } catch (err) {
    if (err.response) {
      console.error('API Error:', err);
      setErrorMessage(err);
      setShowErrorMessage(true);
    } else {
      console.error('Unexpected Error:', err);
      setErrorMessage(err);
      setShowErrorMessage(true);
    }
  }
};

const handleEditActivity = (activity) => {
  console.log("Activity", activity);

  setCurrentActivity(activity);

  // Parse the price range to get min and max values
  const [minPrice, maxPrice] = activity.price.split('-').map(Number);

  setActivityForm({
    ...activity,
    time: convertTimeToFullDate(activity.time),
    category: categoryList.find(item => item.id === activity.category)?.name,
    location: {
      latitude: activity.location?.latitude || mapCenter.lat,
      longitude: activity.location?.longitude || mapCenter.lng,
    },
    tags: Array.isArray(activity.tags)
      ? activity.tags
          .map(tagId => {
            const tag = tagsList.find(t => t.id === tagId);
            return tag ? tag.name : null;
          })
          .filter(Boolean)
      : [],
    minPrice, // Set min value for the slider
    maxPrice, // Set max value for the slider
  });

  setOpen(true); 
};



  const handleDeleteActivity = async (index) => {  
    const activityid=activities[index]._id;
    try {
      const options ={
         apiPath:`/activity/${activityid}/${id}`,
      };
      NetworkService.delete(options);
      setSuccessMessage("Deleted Activity Successfully!");
      setShowSuccessMessage(true);
       setActivities((prevActivities) => prevActivities.filter((_, i) => i !== index));

    } catch (err) {
      if (err.response) {
        console.error('API Error:', err);
        setErrorMessage(err.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);  
      } else {
        console.error('Unexpected Error:', err);
        setErrorMessage(err.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);      }
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

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        setAddress(address);
      }
    })
    setActivityForm((prev) => {
      return {
        ...prev,
        location: {
          latitude: lat,
          longitude: lng
        },
      };
    });
  
 
    setMapCenter({ lat, lng });
    setMarkerPosition({ lat, lng }); // Set the marker position

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
      <div>
        <HomePage/>
      </div>
    <div>
    <LoadScript googleMapsApiKey={'AIzaSyDifIZGHTwXaBJG610aJc9SWAe6sOAuwZE'} libraries={["places"]}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Button variant="contained" onClick={handleClickOpen} sx={{ maxWidth: 150, marginTop: 2, marginLeft: 2 }}>
          Add Activity
        </Button>
        <Dialog open={open} onClose={handleClose} sx={{ minWidth: 1000 }}>
          <DialogTitle>{currentActivity !== null ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
          <DialogContent>
          <FormControl  margin="normal" sx={{ marginTop: 2,marginRight:2 }}>
                <DatePicker
                  labelId="date"
                  id="date"
                  name="date"
                  value={activityForm.date ? dayjs(activityForm.date) : null} // Ensure it's a Day.js object
                  onChange={handleDateChange}
                  label="Date"
                  sx={{ marginTop: 2 }}
                />
              </FormControl>

              <FormControl  margin="normal" sx={{ marginTop: 2 }}>
                <TimePicker
                  name="time"
                  value={activityForm.time ? dayjs(activityForm.time) : null} // Ensure it's a Day.js object
                  onChange={handleTimeChange}
                  label="Time"
                  sx={{ marginTop: 2 }}
                />
              </FormControl>
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
                renderValue={(selected) => selected.join(', ')} // Now selected is an array of tag names
                label="Tags"
              >
                {tagsList.map((tag) => (
                  <MenuItem key={tag.id} value={tag.name}>
                    <Checkbox checked={activityForm.tags.includes(tag.name)} />
                    <ListItemText primary={tag.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Typography>Price Range: {activityForm.price}</Typography>
              <Slider
                value={[activityForm.minPrice, activityForm.maxPrice]}
                onChange={(event, newValue) => {
                  const [newMin, newMax] = newValue;
                  setActivityForm(prev => ({
                    ...prev,
                    minPrice: newMin,
                    maxPrice: newMax,
                    price: `${newMin}-${newMax}`, // Update the price string as well
                  }));
                }}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                name="price"
              />
            </FormControl>

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
                   {markerPosition && (
                        <Marker 
                          position={markerPosition||activityForm.location}
                        />
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
            
       <div>
        <input
        accept="image/*"
        id="raised-button-file"
        type="file"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      {/* Label that triggers the input */}
      <label
        htmlFor="raised-button-file"
        style={{
          display: 'inline-block',
          padding: '5px 5px',
          backgroundColor: 'DarkBlue',
          color: '#fff',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        Upload Image
      </label>    
        </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSaveActivity} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container style={{ marginTop: 10}}>
       {activities.length>0?(
       activities.map((activity, index) => (
            
    <Grid item xs={12} sm={6} md={4} key={index} >
      <Card sx={{width:'400px',height:'470px',marginLeft:5}}>
      <CardMedia
          component="img"
          height="180"
          image={activity.picture}
          alt={activityImage?.name||"Image"}
        />
        <CardContent>
          <Typography variant="h5">{activity.name}</Typography>
          <Typography variant="body2"><strong>Date:</strong> {dayjs(activity.date).format('DD/MM/YYYY')}</Typography>
          <Typography variant="body2"><strong>Time:</strong> {activity.time}</Typography>
          <Typography variant="body2"><strong>Price: </strong>{activity.price}</Typography>
          <Typography variant="body2"><strong>Category:</strong> {categoryList.find(item =>item.id===activity.category)?.name}</Typography> 
          <Typography variant="body2"><strong>Tags:</strong> { activity.tags.map(tagId => { const tag = tagsList.find(t => t.id === tagId); return tag ? tag.name : 'No tag';}).filter(Boolean).join(', ') }</Typography>  
          <Typography variant="body2"><strong>Discounts:</strong> {activity.specialDiscounts}</Typography>
          <Typography variant="body2"><strong>Location:</strong> {addresslocation}</Typography>
          <Typography variant="body2"><strong>Booking:</strong> {activity.isOpen?"true":"false"}</Typography>

        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Button size="meduim" onClick={() => handleEditActivity(activity)}>Edit</Button>
          <Button container='filled' color="error" onClick={() => handleDeleteActivity(index)}>Delete</Button>
        </CardActions>
      </Card>
    </Grid>
  ))
       ):(
        <div
        style={{
          width: "400px", // Set a fixed width for the GIF
          height: "400px", // Set a fixed height to match the width
          position: "relative",
          marginLeft:'600px',
          marginTop:'100px',
          alignContent:'center',
          alignItems:'center'
        }}
      >
        <img
          src={NodataFound}
          width="100%"
          height="100%"

        ></img>
      </div>
       )}
       




        {showSuccessMessage && (
        <Alert severity="success" 
        sx={{
          position: 'fixed',
          top: 80, // You can adjust this value to provide space between success and error alerts
          right: 20,
          width: 'auto',
          fontSize: '1.2rem', // Adjust the size
          padding: '16px',
          zIndex: 9999, // Ensure it's visible above other content
        }}>
          {successMessage}
        </Alert>
      )}
      {showErrorMessage && (
        <Alert severity="error" 
        sx={{
          position: 'fixed',
          top: 60, // You can adjust this value to provide space between success and error alerts
          right: 20,
          width: 'auto',
          fontSize: '1.2rem', // Adjust the size
          padding: '16px',
          zIndex: 9999, // Ensure it's visible above other content
        }}>
          {errorMessage}
        </Alert>
      )}
        </Grid>

      </div>
    </LocalizationProvider>
    </LoadScript>
    </div>
    </div>

  );
}

export default Activity;
