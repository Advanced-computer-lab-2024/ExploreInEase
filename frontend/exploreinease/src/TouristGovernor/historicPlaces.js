import React, { useState, useEffect,useCallback } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Alert,CardActions } from '@mui/material';
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
import NetworkService from '../NetworkService';
import dayjs from 'dayjs';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import axios from 'axios';
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
  const governorId = location.state?.governorId || '';
  const response = location.state?.response || [];  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [historicPlaces, setHistoricPlaces] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mapCenter, setMapCenter] = useState({lat:defaultCenter.lat, lng: defaultCenter.lng});
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [newHistoricPlace, setNewHistoricPlace] = useState({
    name: '',
    description: '',
    location: { latitude: null ,longitude: null, address: '' },
    openingHours: null,
    nativeTicketPrice: '',
    studentTicketPrice: '',
    foreignerTicketPrice: '',
    images: [],
  });

  useEffect(() => {
    // Fetch historical places when the component mounts
    getAllHistoricalPlaces();
  }, []);

  const getAllHistoricalPlaces = async () => {
    try {
      const options = { apiPath: `/historical-places/${governorId}/allHistoricalPlaces` };
      const response = await NetworkService.get(options);
      // console.log(response);
      const tempArray= response.filter(item=>item.created_by.toString()===governorId);
      console.log("temp Array",tempArray);
      
      setHistoricPlaces(tempArray ||[]);
      console.log("Historical Places:",historicPlaces);
      
    } catch (error) {
      console.log('Error fetching historical places:', error);
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
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    setCurrentPlace(null);
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

      // images.forEach((file) => {
      //   historicPlaces.append('images', file);
      // });

      console.log("Hours in normal",newHistoricPlace.openingHours );
      
      const body = {
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
        console.log("create Body:",body);

      try {
        const response = await axios.post(`http://localhost:3030/historical-places`, body);
        console.log(response);
        handleClose();
        getAllHistoricalPlaces();
      } catch (error) {
        console.error('Error creating historical place:', error);
        setErrorMessage('Error: Something went wrong. Please try again.');
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
      handleClose();
    }catch (error) {
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
  }
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
    setHistoricPlaces((prevPlaces) => prevPlaces.filter((p) => p._id !== placeId));

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
    setNewHistoricPlace((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (event) => {
    const { name, value } = event.target;
    setNewHistoricPlace((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));

  };

  return (
    <div>  
    <LoadScript googleMapsApiKey={'AIzaSyBl4qzmCWbzkAdQlzt8hRYrvTfU-LSxWRM'} libraries={["places"]}>
    <div>   
      <Button variant="contained" onClick={handleClickOpen} sx={{ height: 50, marginTop: 2, marginLeft: 2 }}>
        Add Historical Places
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentPlace !== null ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
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
          />
          <TextField
            required
            margin="normal"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newHistoricPlace.description}
            onChange={handleInputChange}
          />
          <GoogleMap
           mapContainerStyle={containerStyle}
           center={{
            lat: markerPosition?.lat|| mapCenter.lat ,
            lng: markerPosition?.lng || mapCenter.lng
             }}
            zoom={10}
            onLoad={onLoad}
            onClick={handleMapClick}
              >
            {markerPosition && (
               <Marker 
               position={markerPosition||HistoricalPlaces.location}
                />
             )}
          </GoogleMap>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SingleInputTimeRangeField
          margin="normal"
          label="openingHours"
          name="openingHours"
          value={newHistoricPlace.openingHours}
          onChange={(newValue) => setNewHistoricPlace((prev) => ({ ...prev, openingHours: newValue }))}
        />
          </LocalizationProvider>
          <TextField
            required
            margin="normal"
            id="nativeTicketPrice"
            name="nativeTicketPrice"
            label="Native Ticket Price"
            type="number"
            fullWidth
            variant="outlined"
            value={newHistoricPlace.nativeTicketPrice}
            onChange={handleInputChange}
          />
          <TextField
            required
            margin="normal"
            id="studentTicketPrice"
            name="studentTicketPrice"
            label="Student Ticket Price"
            type="number"
            fullWidth
            variant="outlined"
            value={newHistoricPlace.studentTicketPrice}
            onChange={handleInputChange}
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
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveHistoricPlaces}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2} style={{ marginTop: 20 }}>

      {Array.isArray(historicPlaces) &&  historicPlaces.map((place,index) => (
          <Card key={place.id||index} sx={{ marginBottom: 2 }}>
            <CardMedia
              component="img"
              height="140"
              image={place.pictures ? place.pictures[0] : '/default-placeholder.png'}
              alt={place.name}
            />
            
            <CardContent>
              <Typography variant="h6" component="div">
                {place.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
               Description: {place.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
               Student Price: {place.ticketPrice?.student }
              </Typography>
              <Typography variant="body2" color="text.secondary">
               Native Price: {place.ticketPrice?.native}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              Foreign Price: {place.ticketPrice?.foreign}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              Opening Hours: {place.openingHours}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              Location: {place.location?.address}
              </Typography>
            </CardContent>
            <CardActions>
                  <Button size="small" onClick={() => handleEditPlace(place)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeletePlace(place)}>Delete</Button>
                </CardActions>
          </Card>
        ))}
        </Grid>
    </div>
    </LoadScript>
    </div>
  );
}

export default HistoricalPlaces;
