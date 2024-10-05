import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function HistoricalPlaces() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [historicPlaces, setHistoricPlaces] = useState([]);
  const [open, setOpen] = useState(false);
  const [newHistoricPlace, setNewHistoricPlace] = useState({
    name: '',
    description: '',
    location: '',
    openingHours: null,
    ticketPrice: '',
  });
  const [editingHistoricPlaceIndex, setEditingHistoricPlaceIndex] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewHistoricPlace({ name: '', description: '', location: '', openingHours: null, ticketPrice: '' });
    setImage(null);
    setImagePreview('');
    setEditingHistoricPlaceIndex(null);
  };

  const handleSaveHistoricPlaces = () => {
    if (newHistoricPlace.name.trim()) {
      const newPlace = { ...newHistoricPlace, image };
      if (editingHistoricPlaceIndex !== null) {
        setHistoricPlaces((prevPlaces) => {
          const updatedPlaces = [...prevPlaces];
          updatedPlaces[editingHistoricPlaceIndex] = newPlace;
          return updatedPlaces;
        });
      } else {
        setHistoricPlaces((prevPlaces) => [...prevPlaces, newPlace]);
      }
    }
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewHistoricPlace((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle updating a historic place
  const handleUpdatePlace = (index) => {
    setEditingHistoricPlaceIndex(index);
    setNewHistoricPlace(historicPlaces[index]);
    setImage(historicPlaces[index].image);
    setImagePreview(URL.createObjectURL(historicPlaces[index].image));
    handleClickOpen();
  };

  // Function to handle deleting a historic place
  const handleDeletePlace = (index) => {
    setHistoricPlaces((prevPlaces) => prevPlaces.filter((_, i) => i !== index));
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
            onChange={handleImageChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Upload Image
            </Button>
          </label>
          {imagePreview && (
            <CardMedia
              component="img"
              height="140"
              image={imagePreview}
              alt="Uploaded Image"
            />
          )}
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
              {place.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={URL.createObjectURL(place.image)}
                  alt="Uploaded Image"
                  sx={{ objectFit: 'cover' }}
                />
              )}
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
