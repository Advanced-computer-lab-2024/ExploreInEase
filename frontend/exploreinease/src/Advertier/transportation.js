import React, { useState, useCallback,useEffect } from 'react';
import {
  Button,
  Dialog, DialogActions, DialogContent, TextField,DialogTitle,Card, CardContent,Typography,CardActions,ListItemText,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import axios from 'axios'; // Ensure Axios is imported
import { useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import NetworkService from '../NetworkService';

function Transportation() {
    const location = useLocation();
    const [transportation, setTransportion] = useState(null); 
    const [open, setOpen] = useState(false);
    const [transportationForm, setTransportationForm] = useState({
        date: null,
        time: null,
        pickupLocation: '',
        pickoffLocation: '',
        price: '',
        transportationType: '',
      });
      const handleClickOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
        // Handle input change for text fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTransportationForm((prev) => ({ ...prev, [name]: value }));
  };
    // Handle date change
    const handleDateChange = (newDate) => {
        setTransportationForm((prev) => ({ ...prev, date: newDate }));
      };
    
      // Handle time change
      const handleTimeChange = (newTime) => {
        setTransportationForm((prev) => ({ ...prev, time: newTime }));
      };
      const handleSaveTransportation = () => {
        setTransportion((prev) => [...prev, transportationForm]);
        setTransportationForm({
          date: null,
          time: null,
          pickupLocation: '',
          pickoffLocation: '',
          price: '',
          transportationType: '',
        });
        setOpen(false);
      };

  return (
    <div>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Button variant="contained" onClick={handleClickOpen} sx={{ maxWidth: 200, marginTop: 2, marginLeft: 2 }}>
          Add Transportation
        </Button>
        <Dialog open={open} onClose={handleClose} sx={{ minWidth: 1000 }}>
          <DialogTitle>{' Add Transportation'}</DialogTitle>
          <DialogContent>
          <Grid container spacing={1} marginTop={'8px'}>
              <Grid item xs={6} >
                <DatePicker
                  label="Date"
                  value={transportationForm.date ? dayjs(transportationForm.time) : null}
                  onChange={handleDateChange}
                  fullWidth
                />
             </Grid>
          <Grid item xs={6} >
            <TimePicker
              name="time"
              value={transportationForm.time  ? dayjs(transportationForm.time) : null} // Ensure it's a Day.js object
              onChange={handleTimeChange}
              label="Time"
              fullWidth
            />
            </Grid>
              <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              name="Pickup Location"
              label="Pickup Location"
              onChange={handleInputChange}
            />
            </Grid>
            <Grid item xs={12}>
              <TextField
              fullWidth
              margin="normal"
              name="Pickoff Location"
              label="Pickoff Location"
              onChange={handleInputChange}
            />
            </Grid>
            <Grid item xs={12}> 
            <TextField
              fullWidth
              margin="normal"
              type="number"
              name="Price"
              label="Price"
              onChange={handleInputChange}
            />
          </Grid>
             <Grid item xs={12}>
           <TextField
              fullWidth
              margin="normal"
              name="transportationType"
              label="transportationType"
              onChange={handleInputChange}
            />                 
             </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
          <Button onClick={handleSaveTransportation} variant="contained">
              Save
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={2} style={{ marginTop: 20 }}>
          {transportation?.map((transportation, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="body2">Date: {dayjs(transportation.date).format('DD/MM/YYYY')}</Typography>
                  <Typography variant="body2">Time: {transportation.time}</Typography>
                  <Typography variant="body2">Price: {transportation.price}</Typography>
                  <Typography variant="body2">Transportation Type: {transportation.transportationType}</Typography>
                  <Typography variant="body2">PickUp Location: {transportation.pickupLocation}</Typography>
                  <Typography variant="body2">PickOff Location: {transportation.pickoffLocation}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </LocalizationProvider>
    </div>
  );
}

export default Transportation;
