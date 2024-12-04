import React, { useState,useEffect } from 'react';
import {
    Dialog,DialogTitle,DialogContent,DialogActions,Button,Card, CardContent,Typography,CardActions,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';  
import { useLocation } from 'react-router-dom';
import TouristNavbar from './TouristNavbar';
import NetworkService from '../NetworkService';
function BookTransportation() {
    const location = useLocation();
    const {userId,transportationData} = location.state || {};
    const [transportation, setTransportion] = useState(transportationData); 
    const [open, setOpen] = useState(false);
    const [success,setSuccess]=useState(false);
    const [error,setError]=useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedTransportation,setSelectedTransportation]=useState();
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
    const handleClickOpen = (item) => {
      setSelectedTransportation(item);
      setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const handleBookTransportation = async () => {
      console.log("selected", selectedTransportation);
      try {
        const options = {
          apiPath: `/bookTransportation`,
          body: {
            touristId: userId,
            transportationId: selectedTransportation._id,
          }
        };
        
        const response = await NetworkService.post(options);
        console.log(response);
    
        // Remove the booked transportation from the list
        setTransportion(prevData => prevData.filter(item => item._id !== selectedTransportation._id));
        setSuccessMessage("Booked Successfully!");
        setSuccess(true);
        
      } catch (error) {
        console.log('Error booking transportation:', error);
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);
      }
      
      handleClose();
    };
    
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
      <TouristNavbar/>
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
