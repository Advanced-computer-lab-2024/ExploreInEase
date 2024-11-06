import { React, useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { format, parseISO } from 'date-fns';
import FlagIcon from '@mui/icons-material/Flag';
import axios from 'axios';







const ItineraryCard = ({ item }) => {

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [flag, setFlag] = useState(item.flag);

  const handleFlagClick = () => {
    if (flag === 1) {
      // Show dialog with message that item is already flagged
      setDialogMessage("Item is already flagged as inappropriate.");
      setOpenDialog(true);
    } else {
      // Show dialog confirming flagging action
      setDialogMessage(`Are you sure you want to flag this activity as inappropriate?`);
      setOpenDialog(true);

      // Add flagging logic here, e.g., call an API or update state
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async () => {

    const reqBody = {
      userType: "admin",
      eventType: "itinerary",
      "eventID": item._id

    }

    console.log("id ", item._id);

    await axios.put('http://localhost:3030/inappropriate', reqBody).then((res) => {
      // console.log(res);
      console.log("updated : ", res.data);

      setFlag(0);
      setOpenDialog(false);
    }).catch((err) => {
      console.log(err);
    });

  }






  return (
    <Card sx={{ maxWidth: 345, margin: '16px auto', boxShadow: 3, position: 'relative' }}>
      <Tooltip title={flag === 1 ? "Flag as inappropriate" : "Item already flagged as inappropriate"} arrow>

        {flag === 1 ? (
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'transparent',
              transition: 'box-shadow 0.3s ease-in-out',
              '& .MuiSvgIcon-root': {
                fill: 'white',        // White fill when not flagged
                stroke: 'black',      // Black outline when not flagged
                strokeWidth: 2        // Adjusts the border thickness for hollow effect
              }
            }}
            onClick={handleFlagClick}
          >
            <FlagIcon />
          </IconButton>
        ) : (
          <FlagIcon
            sx={{
              color: 'red',
              position: 'absolute',
              top: 8,
              right: 8,
              transition: 'box-shadow 0.3s ease-in-out'
            }}
          />
        )}



      </Tooltip>
      <CardContent>
        <Typography variant="h5" component="div">
          {item.name}
        </Typography>
        <Typography variant="h6" color="text.primary" gutterBottom>
          Itinerary Details
        </Typography>

        <Typography color="text.secondary">
          {/* Activities: {item.activities.join(', ')} */}
          Activities: {item.activities.map((activity, index) => (
            <span key={activity._id}>
              {activity.name}
              {index < item.activities.length - 1 && ', '}
            </span>
          ))}
        </Typography>

        <Typography color="text.secondary">
          Locations: {item.locations.join(', ')}
        </Typography>

        <Typography color="text.secondary">
          Date Available: {item.dateAvailable && item.dateAvailable.length > 0 ? (
            item.dateAvailable.map(date => format(parseISO(date), 'dd/MM/yyyy')).join(' - ')
          ) : (
            'No dates available'
          )}
        </Typography>

        <Typography color="text.secondary">
          Price: {item.price}
        </Typography>

        <Typography color="text.secondary">
          Rating: {item.rating.length === 0 ? 0 : item.rating}
        </Typography>

        <Typography color="text.secondary">
          Language: {item.language}
        </Typography>

        <Typography color="text.secondary">
          Dropoff location: {item.dropoffLocation}
        </Typography>

        <Typography color="text.secondary">
          Pickup location: {item.pickupLocation}
        </Typography>

        <Typography color="text.secondary">
          Directions: {item.directions}
        </Typography>
      </CardContent>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary">Confirm</Button>
          <Button onClick={handleCloseDialog} color="primary">Close</Button>

        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ItineraryCard;
