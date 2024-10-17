import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Alert } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function HistoricalPlaces() {
  const location = useLocation();
  const { userId } = location.state || {};
  const governorId = userId;
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [historicPlaces, setHistoricPlaces] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newHistoricPlace, setNewHistoricPlace] = useState({
    name: '',
    description: '',
    location: '',
    openingHours: null,
    nativeTicketPrice: '',
    studentTicketPrice: '',
    foreignerTicketPrice: '',
    images: [],
  });

  const [editingHistoricPlaceIndex, setEditingHistoricPlaceIndex] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewHistoricPlace({
      name: '',
      description: '',
      location: '',
      openingHours: null,
      nativeTicketPrice: '',
      studentTicketPrice: '',
      foreignerTicketPrice: '',
      images: [],
    });
    setImages([]);
    setImagePreviews([]);
    setEditingHistoricPlaceIndex(null);
    setErrorMessage('');
  };

  const handleSaveHistoricPlaces = async () => {
    if (newHistoricPlace.name.trim()) {
      const body = {
        name: newHistoricPlace.name,
        description: newHistoricPlace.description,
        pictures: images.map((file) => URL.createObjectURL(file)),
        location: {
          address: newHistoricPlace.location,
        },
        openingHours: newHistoricPlace.openingHours ? newHistoricPlace.openingHours.format('hh:mm A') : null,
        ticketPrice: {
          student: newHistoricPlace.studentTicketPrice,
          native: newHistoricPlace.nativeTicketPrice,
          foreign: newHistoricPlace.foreignerTicketPrice,
        },
        created_by: userId,
      };

      const apiPath = `http://localhost:3030/historical-places`;

      try {
        await axios.post(apiPath, body);
        const newPlace = { ...newHistoricPlace, images };
        setHistoricPlaces((prevPlaces) => [...prevPlaces, newPlace]);
        handleClose();
      } catch (error) {
        console.error('Error creating historical place:', error);
        if (error.response) {
          setErrorMessage(`Error: ${error.response.data.message || 'Failed to create historical place'}`);
        } else if (error.request) {
          setErrorMessage('Error: No response from the server. Please try again later.');
        } else {
          setErrorMessage('Error: Something went wrong. Please try again.');
        }
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewHistoricPlace((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages(files);
    setImagePreviews(previews);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        component="span"
        sx={{ height: 50, marginTop: 2, marginLeft: 2 }}
      >
        Add Historical Places
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingHistoricPlaceIndex !== null ? 'Edit Historical Places' : 'Create Historical Places'}</DialogTitle>
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
          <Grid container spacing={2} alignItems="center">
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
            <Button variant="contained" component="span">
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
          <Button type="submit" variant="outlined" onClick={handleSaveHistoricPlaces}>
            {editingHistoricPlaceIndex !== null ? 'Update' : 'Add'}
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {historicPlaces.map((place, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ width: 300, height: 350, display: 'flex', flexDirection: 'column', marginLeft: 2 }}>
              {place.images.map((image, imgIndex) => (
                <CardMedia
                  key={imgIndex}
                  component="img"
                  height="140"
                  image={URL.createObjectURL(image)}
                  alt={`Image ${imgIndex + 1}`}
                />
              ))}
              <CardContent>
                <Typography variant="h6" component="div">
                  {place.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {place.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {place.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ticket Prices: Native - {place.nativeTicketPrice}, Student - {place.studentTicketPrice}, Foreigner - {place.foreignerTicketPrice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default HistoricalPlaces;
