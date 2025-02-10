import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, TextField, DialogTitle, Card, CardContent, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import NetworkService from '../NetworkService';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import HomePage from './AdvertiserNavbar';
import NodataFound from '../No data Found.avif';

function Transportation() {
  const location = useLocation();
  const { advertiserId} = location.state||{};
  const [transportation, setTransportion] = useState([]); 
  const [open, setOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [transportationForm, setTransportationForm] = useState({
    date: null,
    time: null,
    pickupLocation: '',
    pickoffLocation: '',
    price: '',
    transportationType: '',
  });
  useEffect(() => {
    getAllTransportation();
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

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTransportationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate) => {
    setTransportationForm((prev) => ({ ...prev, date: newDate }));
  };

  const handleTimeChange = (newTime) => {
    setTransportationForm((prev) => ({ ...prev, time: newTime }));
  };

  const handleSaveTransportation = async () => {
    try {
      const formattedDate = transportationForm.date ? dayjs(transportationForm.date).format('YYYY-MM-DD') : '';
      const formattedTime = transportationForm.time ? dayjs(transportationForm.time).format('HH:mm') : '';
  
      const response = await axios.post('http://localhost:3030/createTransportation', {
        advertiserId,
        pickupLocation: transportationForm.pickupLocation,
        dropoffLocation: transportationForm.pickoffLocation,
        dateAvailable: formattedDate,
        timeAvailable: formattedTime,
        price: transportationForm.price,
        transportationType: transportationForm.transportationType,
      });
  
      console.log(response.data);
      setTransportion([...transportation, response.data.data]); // Add new transportation to list
      setSuccessMessage(response.message||"Created Successfully!");
      setShowSuccessMessage(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'An error occurred');
      setShowErrorMessage(true);
      console.error('Error:', err.response ? err.response.data.message : 'Unexpected error');
    }
  
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
    const getAllTransportation=async()=>{
      try {
        const options = { 
          apiPath: `/getTransportations/EGP`
         };
        const response = await NetworkService.get(options);
        console.log(response);
        setTransportion(response);
        } catch (error) {
        console.log('Error:', error);
      }
    }

  return (
    <div>
    <div>
      <HomePage/>
    </div>
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Button variant="contained" onClick={handleClickOpen} sx={{ maxWidth: 200, marginTop: 2, marginLeft: 2 }}>
          Add Transportation
        </Button>
        <Dialog open={open} onClose={handleClose} sx={{ minWidth: 1000 }}>
          <DialogTitle>{'Add Transportation'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={1} marginTop={'8px'}>
              <Grid item xs={6}>
                <DatePicker
                  label="Date"
                  value={transportationForm.date}
                  onChange={handleDateChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  name="time"
                  value={transportationForm.time}
                  onChange={handleTimeChange}
                  label="Time"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="pickupLocation"
                  label="Pickup Location"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="pickoffLocation"
                  label="Pickoff Location"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  name="price"
                  label="Price"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="transportationType"
                  label="Transportation Type"
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>handleSaveTransportation(transportationForm)} variant="contained">
              Save
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={2} style={{ marginTop: 20 }}>
          {transportation.length>0?(
         transportation.map((trans, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
            <CardContent>
<Typography variant="body2"><strong>Date:</strong> {dayjs(trans.date).format('DD-MM-YYYY')}</Typography>
<Typography variant="body2"><strong>Time: </strong>{dayjs(trans.time).format('HH:mm A')}</Typography>
<Typography variant="body2"><strong>Price:</strong> {trans.price}</Typography>
<Typography variant="body2"><strong>Transportation Type:</strong> {trans.transportationType}</Typography>
<Typography variant="body2"><strong>Pickup Location:</strong> {trans.pickupLocation}</Typography>
<Typography variant="body2"><strong>Dropoff Location:</strong> {trans.dropoffLocation}</Typography>
</CardContent>

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
 
        </Grid>
        <div>
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
        </div>
      </LocalizationProvider>
    </div>
    </div>
  );
}

export default Transportation;
