import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import NetworkService from '../NetworkService';
import TourGuideHP from '../TourGuide/TourGuideNavbar';
const MyBookmarks = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);  // Store bookmarked events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categorize events
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);

  useEffect(() => {
    if (userId) {
      const fetchBookmarkedEvents = async () => {
        try {
          const options = { apiPath: `/fetchbookmark/${userId}` };
          const response = await NetworkService.get(options);
          console.log('API Response:', response.data);

          // Initialize arrays for categorized events
          const activities = [];
          const itineraries = [];
          const historicalPlaces = [];

          // Categorize the fetched bookmarks based on their type
          response.data.forEach((event) => {
            if (event.data && event.type && event.type !== 'undefined') {
              if (event.type === 'Activity') {
                activities.push(event);
              } else if (event.type === 'Itinerary') {
                itineraries.push(event);
              } else if (event.type === 'HistoricalPlace') {
                historicalPlaces.push(event);
              }
            }
          });

          // Set the categorized events in state
          setActivities(activities);
          setItineraries(itineraries);
          setHistoricalPlaces(historicalPlaces);

        } catch (err) {
          console.error('Error fetching bookmarks:', err.message);
          setError('Failed to fetch bookmarks');
        } finally {
          setLoading(false);
        }
      };

      fetchBookmarkedEvents();
    } else {
      setError('User ID is missing.');
      setLoading(false);
    }
  }, [userId]);

  // Function to handle button click
  const handleMapClick = (location) => {
    if (location && location.latitude && location.longitude) {
      window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_blank');
    } else if (typeof location === 'string') {
      // If location is a string, open the location in Google Maps as a search query
      window.open(`https://www.google.com/maps?q=${location}`, '_blank');
    } else {
      alert("Location data is not available.");
    }
  };

  return (
    <><TourGuideHP/>
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Bookmarked Events
      </Typography>

      {loading && <Typography variant="body1" color="text.secondary">Loading...</Typography>}

      {error && <Typography variant="body1" color="error">{error}</Typography>}

      <div>
        {/* Activities Section */}
        {activities.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography variant="h5" gutterBottom>Activities</Typography>
            <Grid container spacing={3}>
              {activities.map((event, index) => (
                event.data && (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component="img"
                        alt={event.data.name}
                        height="140"
                        image={event.data.image || '/default-image.jpg'}  // Default image if no image is available
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {event.data.name}
                        </Typography>
                        {/* <Typography variant="body2" color="text.secondary">
  <strong>Locations:</strong> 
  {item.data.locations
    ? item.data.locations.map((loc, idx) => (
        <span key={idx}>
          {typeof loc === 'object' 
            ? loc.address || `${loc.latitude}, ${loc.longitude}`
            : loc}
          {idx < item.data.locations.length - 1 && ', '}
        </span>
      ))
    : 'No locations available'}
</Typography> */}

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleMapClick(event.data.location)}
                          style={{ marginTop: '10px' }}
                        >
                          View on Google Maps
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              ))}
            </Grid>
          </div>
        )}

        {/* Itineraries Section */}
        {itineraries.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography variant="h5" gutterBottom>Itineraries</Typography>
            <Grid container spacing={3}>
              {itineraries.map((item, index) => (
                item.data && (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component="img"
                        alt={item.data.name}
                        height="140"
                        image={item.data.image || '/default-image.jpg'}  // Default image if no image is available
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {item.data.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.data.date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Activities:</strong> {item.data.activities?.join(', ')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Locations:</strong> {item.data.locations?.join(', ')}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleMapClick(item.data.locations?.[0])}  // Assuming the first location is what we want to map
                          style={{ marginTop: '10px' }}
                        >
                          View on Google Maps
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              ))}
            </Grid>
          </div>
        )}

        {/* Historical Places Section */}
        {historicalPlaces.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography variant="h5" gutterBottom>Historical Places</Typography>
            <Grid container spacing={3}>
              {historicalPlaces.map((event, index) => (
                event.data && (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component="img"
                        alt={event.data.name}
                        height="140"
                        image={event.data.image || '/default-image.jpg'}  // Default image if no image is available
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {event.data.name}
                        </Typography>
                        {/* <Typography variant="body2" color="text.secondary">
  {event.data.location
    ? `Location: ${event.data.location.address || `${event.data.location.latitude}, ${event.data.location.longitude}`}`
    : 'Location data is not available'}
</Typography> */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleMapClick(event.data.location)}
                          style={{ marginTop: '10px' }}
                        >
                          View on Google Maps
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              ))}
            </Grid>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default MyBookmarks;
