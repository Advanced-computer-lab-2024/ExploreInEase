import React, { useState, useEffect,useCallback } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Alert,CardActions,Select,MenuItem,FormControl,InputLabel,InputAdornment} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { LoadScript, GoogleMap, Marker} from '@react-google-maps/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocation } from 'react-router-dom';
import {Box} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import NetworkService from '../NetworkService';
import dayjs from 'dayjs';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import AccessAlarmsOutlinedIcon from '@mui/icons-material/AccessAlarmsOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import GovernorNavbar from './GovernorNavbar';
import NodataFound from '../No data Found.avif';  

const containerStyle = {
  width: '100%',
  height: '400px',
};
const defaultCenter = {
  lat: 30.033333, 
  lng: 31.233334, 
};
function HistoricalPlaces() {
  const location = useLocation();
  const governorId = localStorage.getItem('UserId') || '';
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [historicPlaces, setHistoricPlaces] = useState([{}]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({lat:defaultCenter.lat, lng: defaultCenter.lng});
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map,setMap] = useState(null);
  const [placeService, setPlacesService] = useState(null);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [tags, setTags] = React.useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [newHistoricPlace, setNewHistoricPlace] = useState({
    name: '',
    description: '',
    location: { latitude: null ,longitude: null, address: '' },
    openingHours: null,
    nativeTicketPrice: '',
    studentTicketPrice: '',
    foreignerTicketPrice: '',
    images: [],
    tagId:[],
  });

  useEffect(() => {
    getAllHistoricalPlaces();
    getAllTags();
  }, []);
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
  const getAllHistoricalPlaces = async () => {
    setLoading(true); 
    try {
      const options = { apiPath: `/historical-places/${governorId}/allHistoricalPlaces` };
      const response = await NetworkService.get(options);
      // console.log(response);
      const tempArray= response.filter(item=>item.created_by.toString()===governorId);
      console.log("temp Array",tempArray);

      const adjustedHistorical = tempArray.map((place) => ({
        ...place,
        picture: localStorage.getItem(`historical-image-${place._id}`) || null,
      }));
      
      setHistoricPlaces(adjustedHistorical ||[]);
      console.log("Historical Places:",historicPlaces);
      
    } catch (error) {
      console.log('Error fetching historical places:', error);
    } finally {
      setLoading(false); // End loading
    }
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
      setLoading(true)
      console.error('Google Maps API not loaded properly');
    }
  };
  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
  
        // Update the location in newHistoricPlace
        setNewHistoricPlace((prev) => ({
          ...prev,
          location: {
            latitude: lat,
            longitude: lng,
            address: address,
          },
        }));
        
        setMarkerPosition({ lat, lng });
        setMapCenter({ lat, lng });
      } else {
        setLoading(true)
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    setCurrentPlace(null);
  };
  const handleToggleInfo = (place) => {        
    setSelectedPlace(place);
  };
  const handleClose = () => {
    setOpen(false);
    setNewHistoricPlace({
      name: '',
      description: '',
      location: { latitude: '', longitude: '', address: '' },
      openingHours: null,
      nativeTicketPrice: '',
      studentTicketPrice: '',
      foreignerTicketPrice: '',
      images: [],
      tagId:[],
    });
    setImages([]);
    setImagePreviews([]);
    setErrorMessage('');
  };

  const handleSaveHistoricPlaces = async () => {
    try {
  if (currentPlace==null){
    if (newHistoricPlace.name.trim()) {
      console.log("New Historical Place",newHistoricPlace);
      const formattedOpeningHours = newHistoricPlace.openingHours 
      ? `${newHistoricPlace.openingHours[0].format("hh:mm a")} - ${newHistoricPlace.openingHours[1].format("hh:mm a")}` 
      : '';

      console.log("Hours in normal",newHistoricPlace.openingHours );
      
      const formData = new FormData();

      formData.append('name', newHistoricPlace.name);
      formData.append('description', newHistoricPlace.description);
      
      // Add location fields
      formData.append('latitude', newHistoricPlace.location.latitude);
      formData.append('longitude', newHistoricPlace.location.longitude);
      formData.append('address', newHistoricPlace.location.address);
      
      // Add openingHours (formattedOpeningHours is assumed to be a string or JSON string)
      formData.append('openingHours', JSON.stringify(formattedOpeningHours));
      
      // Add ticketPrice fields
      formData.append('ticketPrice_student', newHistoricPlace.studentTicketPrice);
      formData.append('ticketPrice_native', newHistoricPlace.nativeTicketPrice);
      formData.append('ticketPrice_foreign', newHistoricPlace.foreignerTicketPrice);
      
      // Add created_by field
      formData.append('created_by', governorId);
      
      // Add tags (assuming it's an array, convert it to JSON string)
      formData.append('tags', JSON.stringify(newHistoricPlace.tagId));

      formData.append('file', selectedImage);
      
        console.log("create Body:",formData);

      try {
        const response = await axios.post(`http://localhost:3030/historical-places`, formData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Important for file uploads
            },
          }
        );
        console.log(response.data.historicalPlace);
        const uploadedImageUrl = response.data.imageUrl;
        localStorage.setItem(`historical-image-${response.data.historicalPlace.savedPlace._id}`, uploadedImageUrl);
        console.log(`historical-image-${response.data.historicalPlace.savedPlace._id}`);
        console.log('Image uploaded successfully:', uploadedImageUrl);

        setSuccessMessage(response.data.historicalPlace.message||"Edit Successfully!");
        setShowSuccessMessage(true);

        handleClose();
        getAllHistoricalPlaces();
      } catch (error) {
        console.error('Error creating historical place:', error);
        setErrorMessage( 'An error occurred');
        setShowErrorMessage(true);
      }
    }
    
  }
  else {
    console.log("current place",currentPlace);
    
    try{
          const formattedOpeningHours = newHistoricPlace.openingHours 
      ? `${newHistoricPlace?.openingHours[0].format("hh:mm a")} - ${newHistoricPlace?.openingHours[1].format("hh:mm a")}` 
      : '';
      const updateValues =
      {
        name: newHistoricPlace.name,
        description: newHistoricPlace.description,
        pictures: images.map((file) => URL.createObjectURL(file)),
        location: {
          latitude: newHistoricPlace.location.latitude,
          longitude: newHistoricPlace.location.longitude,
          address: newHistoricPlace.location.address,
        },
        openingHours: formattedOpeningHours ,
        ticketPrice: {
          student: newHistoricPlace.studentTicketPrice,
          native: newHistoricPlace.nativeTicketPrice,
          foreign: newHistoricPlace.foreignerTicketPrice,
        },
        created_by: governorId,
      };
      const body={updateValues: {updateValues}};
      console.log(updateValues);
      
      console.log("Body sent:",body);
      const response = await axios.put(`http://localhost:3030/historical-places/${currentPlace._id}/${governorId}`, body);
    
      console.log(response);
      getAllHistoricalPlaces();
      setSuccessMessage(response.data.message||"Create Successfully!");
      setShowSuccessMessage(true);
      handleClose();
    }catch (error) {
      setErrorMessage( 'An error occurred');
      setShowErrorMessage(true);
      console.error('Error creating historical place:', error);
      setErrorMessage('Error: Something went wrong. Please try again.');
    }
  }
  }catch (err){
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
  function convertTimeRangeToDate(timeRange) {
    const [startTime, endTime] = timeRange.split(' - ').map(time => time.trim());
  
    // Get the current date
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
    // Parse the start time
    const [startHours, startMinutesWithAmpm] = startTime.split(':');
    const startMinutes = startMinutesWithAmpm.slice(0, 2); // Extract minutes
    const isStartPm = startMinutesWithAmpm.includes('pm');
    
    const startDate = dayjs(currentDate).hour(parseInt(startHours) + (isStartPm ? 12 : 0)).minute(parseInt(startMinutes));
  
    // Parse the end time
    const [endHours, endMinutesWithAmpm] = endTime.split(':');
    const endMinutes = endMinutesWithAmpm.slice(0, 2); // Extract minutes
    const isEndPm = endMinutesWithAmpm.includes('pm');
  
    const endDate = dayjs(currentDate).hour(parseInt(endHours) + (isEndPm ? 12 : 0)).minute(parseInt(endMinutes));
  
    return [startDate, endDate];
  };
  const handleEditPlace = (place) => {
    setCurrentPlace(place);

     const formattedOpeningHours = convertTimeRangeToDate(place?.openingHours); 
   
    console.log("Place",formattedOpeningHours);
    
    if (place.location) {        
      setNewHistoricPlace({
        name: place.name,
        description: place.description,
        location: {
          latitude: place.location.latitude || mapCenter.lat,
          longitude: place.location.longitude || mapCenter.lng,
          address: place.location.address || '',
        },
         openingHours: formattedOpeningHours ,
        nativeTicketPrice: place.ticketPrice.native || '',
        studentTicketPrice: place.ticketPrice.student || '',
        foreignerTicketPrice: place.ticketPrice.foreign || '',
        images: place.pictures || [],
        tagId:place.tagId||[]
      });
      setOpen(true);
    
 }
 else {
    console.error('Activity location is undefined');

  }
};

const handleDeletePlace = async (place) => {  
   const placeId=place._id;
   console.log("Place Id :",place);
   console.log(governorId);
  try {
    const options ={
       apiPath:`/historical-places/${placeId}/${governorId}`,
    };
    const response = NetworkService.delete(options);
      console.log(response);
      setSuccessMessage("Delete Successfully!");
      setShowSuccessMessage(true);
    setHistoricPlaces((prevPlaces) => prevPlaces.filter((p) => p._id !== placeId));

  } catch (err) {
    if (err.response) {
      setSuccessMessage("Delete Successfully!");
      setShowSuccessMessage(true);
      console.error('API Error:', err);
      
    } else {
      setErrorMessage(err.response?.data?.message || 'An error occurred');
      setShowErrorMessage(true);
      console.error('Unexpected Error:', err);
      // setError('An unexpected error occurred.');
    }
  }
};

const getAllTags=async ()=>{
  try {
    const apiPath = `http://localhost:3030/getAllHistoricalTags/${governorId}`;  // Ensure this matches your API route
    const response = await axios.get(apiPath);
    console.log(response.data.tags);
    
    if (Array.isArray(response.data.tags)) {
      const tags = response.data.tags.map(tag => ({
        id: tag._id,
        tagType: tag.type,
      period:tag.period
      }));
      setTags(tags);    
        
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
};

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewHistoricPlace((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]); // Save the selected file to state
  };
  const handleTagChange = (event) => {
    const selectedTagId = event.target.value;
    setNewHistoricPlace((prev) => ({
      ...prev,
      tagId: [selectedTagId]
    }));
  };
  return (
    <div>
      <div>
        <GovernorNavbar />
      </div>
       
        { loading ?
        (
          <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Adjust as needed
          }}
        >
          <iframe src="https://giphy.com/embed/ZO9b1ntYVJmjZlsWlm" width="480" height="360"  class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/shop-loading-reparexshop-ZO9b1ntYVJmjZlsWlm">via GIPHY</a></p>
        </Box>
      
        ):
        (
          <LoadScript googleMapsApiKey={'AIzaSyDifIZGHTwXaBJG610aJc9SWAe6sOAuwZE'} libraries={["places"]}>
          <div>
            <Button variant="contained" onClick={handleClickOpen} sx={{ height: 50, marginTop: 2, marginLeft: 2 }}>
              Add Historical Places
            </Button>
            <Dialog open={open} onClose={handleClose} >
              <DialogTitle>{currentPlace !== null ? 'Edit Historical Place' : 'Add Historical Place'}</DialogTitle>
              <DialogContent>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                
                <TextField
                  autoFocus
                  required
                  margin="normal"
                  id="name"
                  name="name"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={newHistoricPlace.name}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "50px", // Makes the corners oval
                    },
                  }}
                />
                <TextField
                  required
                  margin="normal"
                  id="description"
                  name="description"
                  fullWidth
                  label="Description"
                  type="text"
                  variant="outlined"
                  value={newHistoricPlace.description}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "50px", // Makes the corners oval
                    },
                  }}
                />
                <GoogleMap
                 mapContainerStyle={containerStyle}
                 center={{
                  lat: markerPosition?.lat || mapCenter.lat ,
                  lng: markerPosition?.lng || mapCenter.lng
                 }}
                  zoom={10}
                  onLoad={onLoad}
                  onClick={handleMapClick}
                >
                  {markerPosition && (
                    <Marker 
                      position={markerPosition || HistoricalPlaces.location}
                    />
                  )}
                </GoogleMap>
  
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <SingleInputTimeRangeField
                      margin="normal"
                      label="openingHours"
                      name="openingHours"
                      value={newHistoricPlace.openingHours}
                      onChange={(newValue) => setNewHistoricPlace((prev) => ({ ...prev, openingHours: newValue }))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessAlarmsOutlinedIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "50px", // Makes the corners oval
                        },
                      }}
                    />
                  </LocalizationProvider>
  
                  <FormControl sx={{
                        width:'150px',
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "50px", // Makes the corners oval
                        },
                      }}>
                    <InputLabel id="tags-label">Tags</InputLabel>
                    <Select
                      labelId="tags-label"
                      id="tags-select"
                      name="Tags"
                      label="Tags"
                      value={newHistoricPlace.tagId}
                      onChange={handleTagChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <LocalOfferOutlinedIcon />
                        </InputAdornment>
                      }
                    >
                      {tags.map((tag) => (
                        <MenuItem key={tag.id} value={tag.id}>
                          {tag.period}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>  
                </Box>
  
                <TextField
                  required
                  margin="normal"
                  id="nativeTicketPrice"
                  name="nativeTicketPrice"
                  label="Native Ticket Price"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={newHistoricPlace.nativeTicketPrice}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PriceChangeOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "50px", // Makes the corners oval
                    },
                  }}
                />
                <TextField
                  required
                  margin="normal"
                  id="studentTicketPrice"
                  name="studentTicketPrice"
                  label="Student Ticket Price"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={newHistoricPlace.studentTicketPrice}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PriceChangeOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "50px", // Makes the corners oval
                    },
                  }}
                />  
                <TextField
                  required
                  margin="normal"
                  id="foreignerTicketPrice"
                  name="foreignerTicketPrice"
                  label="Foreigner Ticket Price"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={newHistoricPlace.foreignerTicketPrice}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PriceChangeOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "50px", // Makes the corners oval
                    },
                  }}
                />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="contained" component="span" sx={{ marginTop: 2 }}>
                    Upload Images
                  </Button>
                </label>
                {imagePreviews.map((preview, index) => (
                  <CardMedia
                    key={index}
                    component="img"
                    height="140"
                    image={preview}
                    alt={`Uploaded Image ${index + 1}`}
                    sx={{ objectFit: 'cover', marginTop: 1 }}
                  />
                ))}
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color='purple' onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSaveHistoricPlaces}>
                  Save
                </Button>
              </DialogActions>
            </Dialog>
            {historicPlaces.length>0?(
     <Grid container >
     {Array.isArray(historicPlaces) && historicPlaces.map((place, index) => (
       <Card key={place.id || index} sx={{ 
             margin: 2, 
             boxShadow: 3, 
             borderRadius: 2, 
             '&:hover': { 
               boxShadow: 6, 
               transform: 'scale(1.02)', 
               transition: 'transform 0.3s ease, box-shadow 0.3s ease' 
             },
       }}>
         <CardMedia
           component="img"
           height="200"
           image={place.picture ? place.picture : '/default-placeholder.png'}
           alt={place.name}
         />
         <CardContent>
           <Box sx={{  justifyContent: 'center', marginLeft: 40 }}>
           <Tooltip title="Create a Tag" arrow>
             <IconButton onClick={() => handleToggleInfo(place)}>
               <InfoIcon fontSize="large" sx={{ color: '#00008B' }} />
             </IconButton>
             </Tooltip>
           </Box>
           <Typography variant="h5">
             <strong>{place.name}</strong>
           </Typography>
           <Typography variant="body1">
             <strong>Description:</strong> {place.description}
           </Typography>
         </CardContent>
         <CardActions sx={{ 
           display: 'flex', 
           justifyContent: 'center', 
           alignItems: 'center', 
           gap: 2, 
           paddingBottom: 2 
         }}>
           <Button size="small" variant="contained" onClick={() => handleEditPlace(place)}>Edit</Button>
           <Button size="small" variant="contained" color="error" onClick={() => handleDeletePlace(place)}>Delete</Button>
         </CardActions>
       </Card>
     ))}
   </Grid>
            ):(
              <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh", // Full viewport height, adjust as needed
              }}
            >
              <img
                src={NodataFound}
                alt="Centered Image"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div> 
            )}
       
            <Dialog open={selectedPlace !== null} onClose={() => setSelectedPlace(null)}>
              <DialogTitle><strong>{selectedPlace ? selectedPlace.name +' Details' : ''}</strong></DialogTitle>
              <DialogContent>
                {selectedPlace && (
                  <>
                    <Typography variant="body1">
                      <strong>Student Price:</strong> {selectedPlace?.ticketPrice?.student}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Native Price:</strong> {selectedPlace?.ticketPrice?.native}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Foreign Price:</strong> {selectedPlace?.ticketPrice?.foreign}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Opening Hours:</strong> {selectedPlace?.openingHours}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Location:</strong> {selectedPlace?.location?.address}
                    </Typography>
                    <Typography variant="body1  ">
                      <strong>Tag:</strong> {tags?.find(tag=>tag?.id=== selectedPlace?.tags)?.period}
                    </Typography>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedPlace(null)} color="primary">Close</Button>
              </DialogActions>
            </Dialog>
          </div>
        </LoadScript>
        )}

      </div>
  );
  
}

export default HistoricalPlaces;
