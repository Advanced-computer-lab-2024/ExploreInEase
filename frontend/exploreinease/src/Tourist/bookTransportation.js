import React, { useState, useCallback,useEffect } from 'react';
import {
    Dialog,DialogTitle,DialogContent,DialogActions,Button,Card, CardContent,Typography,CardActions,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import axios from 'axios'; // Ensure Axios is imported
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
    const [transportation, setTransportion] = useState(null); 
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

  return (
    <div>
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
                <CardActions>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                 <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
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
                  <Button onClick={handleClose} autoFocus>
                    Save   
                 </Button>
                    <Button onClick={handleClose}>Close</Button>
                  </DialogActions>
                </Dialog>

      </div>
  );
}

export default BookTransportation;
