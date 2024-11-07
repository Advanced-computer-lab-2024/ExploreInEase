import React, { useState, useCallback,useEffect } from 'react';
import {
    Dialog,DialogTitle,DialogContent,DialogActions,Button,Card, CardContent,Typography,CardActions,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import axios from 'axios'; // Ensure Axios is imported
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';  
import { useLocation } from 'react-router-dom';

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
function BookTransportation() {
    const location = useLocation();
    const {userId,transportationData} = location.state || {};
    const [transportation, setTransportion] = useState(transportationData); 
    const [open, setOpen] = useState(false);
    const [success,setSuccess]=useState(false);
    const [error,setError]=useState(false);
    const [selectedTransportation,setSelectedTransportation]=useState();
    const handleClickOpen = (item) => {
      setSelectedTransportation(item);
      setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const handleBookTransportation=async()=>{
      console.log("selected",selectedTransportation);
      try {
        const options = { apiPath: `/bookTransportation`,
        body:{
          touristId:userId,
          transportationId:selectedTransportation._id,
          
        }
        };
        const response = await NetworkService.post(options);
          console.log(response);
          setTransportion(prevData => prevData.filter(item => item._id !== transportation._id));
          setSuccess(true);
          
      } catch (error) {
        console.log('Error fetching historical places:', error);
        setError(true);

      }
      handleClose();
    }
    useEffect(() => {
      if (success) {
        const timer = setTimeout(() => {
          setSuccess(false); // Hide the alert after 3 seconds
        }, 7000);
        return () => clearTimeout(timer); // Clean up the timer on component unmount

      }
      else {
        const timer = setTimeout(() => {
          setError(false); // Hide the alert after 3 seconds
        }, 7000);
        return () => clearTimeout(timer); // Clean up the timer on component unmount
      }
      
    }, [success,error]);
  return (
    <div>
     <div style={{ position: 'absolute', top: '20px', right: '20px', width: '300px' }}>
      {/* Alert component to show success message */}
      {success && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Booked successfully
        </Alert>
      )}
       {error && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Booked Failed
        </Alert>
      )}
    </div>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          {transportation?.map((transportationn, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                <Typography variant="h5" component="div">
                      Transportation {index+1}
                    </Typography>
                  <Typography variant="body2">Date: {dayjs(transportationn.dateAvailable).format('DD/MM/YYYY')}</Typography>
                  <Typography variant="body2">Time: {transportationn.timeAvailable}</Typography>
                  <Typography variant="body2">Price: {transportationn.price}</Typography>
                  <Typography variant="body2">Transportation Type: {transportationn.transportationType}</Typography>
                  <Typography variant="body2">PickUp Location: {transportationn.pickupLocation}</Typography>
                  <Typography variant="body2">PickOff Location: {transportationn.dropoffLocation}</Typography>
                </CardContent>
                <CardActions>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                 <Button variant="contained" color="primary" onClick={() => handleClickOpen(transportationn)}>
                      Book a transportation 
                 </Button> 
                 </div>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
              <Dialog
                open={open}
                onClose={handleClose}>
                  <DialogTitle id="alert-dialog-title">
                  {'Booking a Ticket for transportation'} 
                  </DialogTitle>
                  <DialogContent>
                      <div>
                      <strong>Are you sure you want to book this transportation?</strong>
                      </div>
                  </DialogContent>
                  <DialogActions>
                  <Button onClick={() => handleBookTransportation()} autoFocus>
                    Save   
                 </Button>
                    <Button onClick={handleClose}>Close</Button>
                  </DialogActions>
                </Dialog>

      </div>
  );
}

export default BookTransportation;
