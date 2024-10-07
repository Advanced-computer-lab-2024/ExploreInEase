import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import NetworkService from '../NetworkService';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocation } from 'react-router-dom';
function HistoricalPlaces() {
  const location=useLocation();
  const { places,userId } = location.state || {};
  const governorId=userId;
  const [images, setImages] = useState([]);  // Store multiple images
  const [imagePreviews, setImagePreviews] = useState([]);  // Store image previews
  const [historicPlaces, setHistoricPlaces] = useState([]);
  const [open, setOpen] = useState(false);
  const [newHistoricPlace, setNewHistoricPlace] = useState({
    name: '',
    description: '',
    location: '',
    openingHours: null,
    ticketPrice: '',
    images: [], // Add images field for each place
  });
  const [editingHistoricPlaceIndex, setEditingHistoricPlaceIndex] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewHistoricPlace({ name: '', description: '', location: '', openingHours: null, ticketPrice: '', images: [] });
    setImages([]);
    setImagePreviews([]);
    setEditingHistoricPlaceIndex(null);
  };

  const handleSaveHistoricPlaces = () => {
    if (newHistoricPlace.name.trim()) {
      // Prepare the payload for the POST request
      const payload = {
        description: newHistoricPlace.description,
        pictures: images.map((file) => URL.createObjectURL(file)), // Convert files to URLs or handle actual uploads
        location: newHistoricPlace.location,
        openingHours: newHistoricPlace.openingHours ? newHistoricPlace.openingHours.format('hh:mm A') : null,
        ticketPrice: newHistoricPlace.ticketPrice,
        type: '',  // Send empty string for type
        period: '',  // Send empty string for period
        created_by: places._id // Example user ID, you can replace with actual data
      };
        NetworkService.post('/historical-places', payload)
        .then((response) => {
          // Handle success
          console.log(response.data.message);
          const newPlace = { ...newHistoricPlace, images }; // Keep the images
          setHistoricPlaces((prevPlaces) => [...prevPlaces, newPlace]);
          handleClose();  // Close the dialog
        })
        .catch((error) => {
          // Handle errors
          console.error('Error creating historical place:', error);
        });
    }
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewHistoricPlace((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multiple images upload
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setImages(files);
    setImagePreviews(previews);
  };

  // Function to handle updating a historic place
  const handleUpdatePlace = async (index) => {
    try {
      const placeId = historicPlaces[index]._id;
  
      // Construct the API path using your NetworkService logic
      const endpoint = `/historical-places/${placeId}/${governorId}`;
      
      const response = await NetworkService.get({ endpoint });
        if (response) {
        setEditingHistoricPlaceIndex(index);
        setNewHistoricPlace(response.historicalPlace);
        setImages(response.historicalPlace.pictures);
        
        const previews = response.historicalPlace.pictures.map((image) => image);
        setImagePreviews(previews);
        handleClickOpen(); 
      } else {
        console.error('Failed to fetch the historical place');
      }
    } catch (error) {
      console.error('Error fetching historical place:', error);
    }
  };
  
  

  // Function to handle deleting a historic place
  const handleDeletePlace = async (index) => {
    try {
      const placeId = historicPlaces[index]._id;  
      // Use NetworkService to delete the historical place
      const response = await NetworkService.delete({
        path: `/historical-places/${placeId}/${governorId}`,
      });
  
      if (response) {
        // Update the state to remove the deleted place from the list
        setHistoricPlaces((prevPlaces) => prevPlaces.filter((_, i) => i !== index));
        console.log('Historical Place deleted successfully');
      } else {
        console.error('Failed to delete the historical place');
      }
    } catch (error) {
      console.error('Error deleting historical place:', error);
    }
  };
  

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} component="span" sx={{ height: 50, marginTop: 2, marginLeft: 2 }}>
        Add Historical Places
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingHistoricPlaceIndex !== null ? 'Edit Historical Places' : 'Create Historical Places'}</DialogTitle>
        <DialogContent>
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
          <Grid container spacing={9} alignItems="center">
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
          </Grid>
          <TextField
            required
            margin="normal"
            id="location"
            name="location"
            label="Location"
            type="text"
            fullWidth
            variant="outlined"
            value={newHistoricPlace.location}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopTimePicker
              label="Opening Hours"
              value={newHistoricPlace.openingHours}
              onChange={(newValue) => setNewHistoricPlace((prev) => ({ ...prev, openingHours: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" required />}
            />
          </LocalizationProvider>
          <TextField
            required
            margin="normal"
            id="ticketPrice"
            name="ticketPrice"
            label="Ticket Price"
            type="number"
            fullWidth
            variant="outlined"
            value={newHistoricPlace.ticketPrice}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            multiple  // Allow multiple image uploads
            onChange={handleImageChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Upload Images
            </Button>
          </label>
          {/* Display multiple image previews */}
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
          <Button sx={{ gap: 2 }} type="submit" variant="outlined" onClick={handleSaveHistoricPlaces}>
            {editingHistoricPlaceIndex !== null ? 'Update' : 'Add'}
          </Button>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {historicPlaces.map((place, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ width: 300, height: 350, display: 'flex', flexDirection: 'column', marginLeft: 2 }}>
              {/* Display all uploaded images for each historical place */}
              {place.images.map((image, idx) => (
                <CardMedia
                  key={idx}
                  component="img"
                  height="140"
                  image={URL.createObjectURL(image)}
                  alt={`Uploaded Image ${idx + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
              ))}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div">
                  {place.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {place.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {place.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Opening Hours: {place.openingHours ? place.openingHours.format('hh:mm A') : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ticket Price: {place.ticketPrice}
                </Typography>
              </CardContent>
              <DialogActions>
                <Button variant="contained" onClick={() => handleUpdatePlace(index)}>
                  Update
                </Button>
                <Button variant="contained" onClick={() => handleDeletePlace(index)}>
                  Delete
                </Button>
              </DialogActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default HistoricalPlaces;
