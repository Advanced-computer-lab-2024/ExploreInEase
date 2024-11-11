import { Card, CardContent, Typography } from '@mui/material';

import { React, useState, useEffect } from 'react';
import {  Button, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import debounce from 'lodash/debounce';
import FlagIcon from '@mui/icons-material/Flag';







const HistoricalPlaceCard = ({ item }) => {




  console.log("item : ",item);

  // console.log("tags : ",item.tags);

  // console.log("period : ",item.tags.period);

  // console.log("type : ",item.tags.type);
    
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
      addressCache[cacheKey] = address;

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
  const fetchAddressFromAPI = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
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
      return data.display_name.split(',').slice(0, 3).join(',');
    } catch (error) {
      console.error('Error fetching address:', error);
      return `${Math.abs(latitude)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude)}°${longitude >= 0 ? 'E' : 'W'}`;
    }
  };
  const debouncedFetchAddress = debounce(async (latitude, longitude, setAddress) => {

    console.log(2)
    const cacheKey = `${latitude},${longitude}`;
    console.log(3)
    console.log("cacheKey : ",cacheKey);
  
    if (addressCache[cacheKey]) {
      setAddress(addressCache[cacheKey]);
    } else {
      const address = await fetchAddressFromAPI(latitude, longitude);
      addressCache[cacheKey] = address; 
      setAddress(address);
    }
  }, 300);
  const LocationDisplay = ({ coordinates }) => {
    const [address, setAddress] = useState('Press here to view location...');
  
    useEffect(() => {
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        const { latitude, longitude } = coordinates;
        debouncedFetchAddress(latitude, longitude, setAddress);
      }
    }, [coordinates]);
  
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {address}
        <Button
          size="small"
          onClick={() => {
            const { latitude, longitude } = coordinates;
            window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
          }}
          style={{ minWidth: 'auto', padding: '4px' }}
        >
          🗺️
        </Button>
      </span>
    );
  };

  const location = {
    latitude:item.location.latitude,
    longitude:item.location.longitude
  }
    return (
        <Card sx={{ maxWidth: 345, margin: '16px auto', boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {item.name}
                </Typography>
                <Typography variant="h6" color="text.primary" gutterBottom>
                    Historical Place Details
                </Typography>

                <Typography color="text.secondary">
                    Description: {item.description || 'N/A'}
                </Typography>

                <Typography color="text.secondary">
                    {/* Location: {item.location?.address || 'Location not available'} */}
                    Locations: { 
                              <LocationDisplay coordinates={location} />
                         }
                </Typography>

                <Typography color="text.secondary">
                    Opening Hours: {item.openingHours || 'N/A'}
                </Typography>

                <Typography color="text.secondary">
                    Students Ticket Price: {item.ticketPrice?.student ?? 'N/A'}
                </Typography>

                <Typography color="text.secondary">
                    Native Ticket Price: {item.ticketPrice?.native ?? 'N/A'}
                </Typography>

                <Typography color="text.secondary">
                    Foreign Ticket Price: {item.ticketPrice?.foreign ?? 'N/A'}
                </Typography>

                <Typography color="text.secondary">
                    Tag: {item.tags}
                </Typography>
                {/* <Typography color="text.secondary">
                Period: {item.tags}
                </Typography> */}
            </CardContent>
        </Card>
    );
};

export default HistoricalPlaceCard;
