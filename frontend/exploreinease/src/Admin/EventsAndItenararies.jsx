import {
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Rating,
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Tabs,
    Tab,
  } from "@mui/material";
import { useLocation } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import React, { useState, useEffect } from "react";
import axios from 'axios';

import ActivityCard from './Cards/ActivityCard';
import HistoricalPlaceCard from './Cards/HistoricalPlacesCard';
import ItineraryCard from './Cards/ItenraryCard';
  
  // Sample data with 'type' field added

  

  const EventsAndItineraries = () => {

    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [historicalPlaces, setHistoricalPlaces] = useState([]);

    const [currentTab , setCurrentTab] = useState('activities');


    useEffect(() => {


        const fetchEvents = async () => {

            const events = axios.get('http://localhost:3030/getAllEvents').then
            (response => {
                console.log(response.data);
                setActivities(response.data.activities);
                setItineraries(response.data.itineraries);
                setHistoricalPlaces(response.data.historicalPlaces);
            }).catch(error => {
                console.log(error);
            });

            

        }

        fetchEvents();
    }, []);
  

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        }

  
 

  
    return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2, display: 'flex', justifyContent: 'center' }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Activities" value="activities" />
            <Tab label="Itineraries" value="itineraries" />
            <Tab label="Historical Places" value="historicalPlaces" />
          </Tabs>
        </Box>
  
      
  
          <Grid container spacing={2} style={{ padding: '20px', flex: 1 }}>
            
              
                {currentTab === 'activities' &&
                activities.map(item => (
                    
                    <ActivityCard item={item} />
                    ))}
                
                
                
                {currentTab === 'itineraries' &&  itineraries.map(item => (
                    <ItineraryCard item={item} />
                    ))}

                {currentTab === 'historicalPlaces' && historicalPlaces.map(item => (
                    <HistoricalPlaceCard item={item} />
                    ))}
              </Grid>
            
        </div>
      
    );
  };
  export default EventsAndItineraries;
  
  
  