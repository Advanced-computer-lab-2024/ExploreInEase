import { React, useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

import FlagIcon from '@mui/icons-material/Flag';

const ActivityCard = ({ item }) => {


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

    const reqBody={
      userType: "admin",
      eventType:"activity",
      "eventID": item._id

    }

    console.log("id ",item._id);

    await axios.put('http://localhost:3030/inappropriate',reqBody).then((res) => {
      // console.log(res);
      console.log("updated : ",res.data);

      setFlag(0);
      setOpenDialog(false);
    }).catch((err) => {
      console.log(err);
    });

  }


  const [addressCache, setAddressCache] = useState({});


  const getAddressFromCoordinates = async (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return 'Location not available';
    }

    const [longitude, latitude] = coordinates;

    // Check cache first
    const cacheKey = `${latitude},${longitude}`;
    if (addressCache[cacheKey]) {
      return addressCache[cacheKey];
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();

      // Create a readable address from the response
      const address = data.display_name.split(',').slice(0, 3).join(',');

      // Cache the result
      setAddressCache(prev => ({
        ...prev,
        [cacheKey]: address
      }));

      return address;
    } catch (error) {
      console.error('Error fetching address:', error);
      // Fallback to coordinate display if geocoding fails
      return `${Math.abs(latitude)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude)}°${longitude >= 0 ? 'E' : 'W'}`;
    }
  };
  const LocationDisplay = ({ coordinates }) => {
    const [address, setAddress] = useState('Loading...');

    useEffect(() => {
      const fetchAddress = async () => {
        const result = await getAddressFromCoordinates(coordinates);
        setAddress(result);
      };
      fetchAddress();
    }, [coordinates]);

    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {address}
        <Button
          size="small"
          onClick=
          {() => {
            const [longitude, latitude] = coordinates;
            window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
          }}
          style={{ minWidth: 'auto', padding: '4px' }}
        >
          🗺️
        </Button>
      </span>
    );
  };

  return (
    <Card sx={{ maxWidth: 345, margin: '16px auto', boxShadow: 3, position: 'relative' }}>
      <Tooltip title={flag === 1 ? "Flag as inappropriate" :  "Item already flagged as inappropriate"} arrow>

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

        <Typography variant="h6" color="text.primary" gutterBottom>
          {item.type}
        </Typography>

        <Typography color="text.secondary">Budget: {item.budget}</Typography>

        <Typography color="text.secondary">
          Date: {format(parseISO(item.date), 'MMMM d, yyyy')}
        </Typography>

        <Typography color="text.secondary">Category: {item.category}</Typography>

        <Typography color="text.secondary">
          Locations: {Array.isArray(item.location[0]) ?
            item.location.map((loc, index) => (
              <span key={index}>
                <LocationDisplay coordinates={loc} />
                {index < item.location.length - 1 ? ', ' : ''}
              </span>
            )) :
            <LocationDisplay coordinates={item.location} />
          }
        </Typography>

        <Typography color="text.secondary">Tags: {item.tags}</Typography>

        {item.specialDiscount && (
          <Typography color="text.secondary">
            Special Discount: {item.specialDiscount}%
          </Typography>
        )}
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

export default ActivityCard;
