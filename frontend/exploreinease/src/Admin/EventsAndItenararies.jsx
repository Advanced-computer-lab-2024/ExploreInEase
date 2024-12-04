import {
  Grid,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import ActivityCard from './Cards/ActivityCard';
import HistoricalPlaceCard from './Cards/HistoricalPlacesCard';
import ItineraryCard from './Cards/ItenraryCard';
import CircularProgress from '@mui/material/CircularProgress';
// Sample data with 'type' field added
const EventsAndItineraries = () => {

  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [currentTab , setCurrentTab] = useState('activities');
  const [loaded,setLoaded] = useState(false);


  useEffect(() => {


      const fetchEvents = async () => {

          const events = axios.get('http://localhost:3030/getAllEvents').then
          (response => {
              console.log(response.data);
              setActivities(response.data.activities);
              setItineraries(response.data.itineraries);
              setHistoricalPlaces(response.data.historicalPlaces);
              setLoaded(true);
          }).catch(error => {
              console.log(error);
          });

          console.log("events",events);
          

      }

      fetchEvents();
  }, []);


  const handleTabChange = (event, newValue) => {
      setCurrentTab(newValue);
      }





  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
   <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2, display: 'flex', justifyContent: 'center' }}>
    <Tabs 
      value={currentTab} 
      onChange={handleTabChange} 
      variant="scrollable" 
      scrollButtons="auto" 
      sx={{ minHeight: 36 }}  // Adjusts tab height
    >
      <Tab label="Itineraries" value="itineraries" sx={{ minWidth: 80 }} />
      <Tab label="Activities" value="activities" sx={{ minWidth: 80 }} />
      <Tab label="Historical Places" value="historicalPlaces" sx={{ minWidth: 80 }} />
    </Tabs>
  </Box>

    

        <Grid container spacing={2} style={{ padding: '20px', flex: 1 }}>
          
            {loaded ?(
              <>
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
                  
                  </>):(<CircularProgress />)}
              
            </Grid>
          
      </div>
    
  );
};
export default EventsAndItineraries;
