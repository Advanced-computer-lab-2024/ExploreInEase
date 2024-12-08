import React, { useState, useEffect } from 'react';
import { Button, Typography, Divider, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';
import TouristNavbar from '../Tourist/TouristNavbar';
const MyBookmarks = () => {
    const { state } = useLocation();
    const { events } = state || {}; // Get events and userId from navigation state

    const [activeCategory, setActiveCategory] = useState('activities'); // Default to 'activities'
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [showSuccessMessage] = useState(false);
    const [showErrorMessage ] = useState(false);
    const [errorMessage] = useState('');
    const [successMessage] = useState('');

    useEffect(() => {
        // Filter events based on the selected category
        if (events) {
            const filtered = events.filter(event => event.category === activeCategory);
            setFilteredEvents(filtered);
            console.log('filteredEvents',filteredEvents);
            
        }
    }, [activeCategory, events]);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    return (
        <div>
            <TouristNavbar/>
        <div style={{ padding: '20px' }}>
        <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    flexDirection: "column",
                }}
                >
                <Typography variant="h4" gutterBottom>
                    My Saved Events
                </Typography>
                </div>


            {/* Buttons for filtering categories */}
            <div style={{ marginBottom: '20px',alignContent:'center',alignItems:'center',display: "flex" }}>
                <Button
                    variant={activeCategory === 'activities' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => handleCategoryChange('activities')}
                    style={{ marginRight: '10px' }}
                >
                    Activities
                </Button>
                <Button
                    variant={activeCategory === 'itineraries' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => handleCategoryChange('itineraries')}
                    style={{ marginRight: '10px' }}
                >
                    Itineraries
                </Button>
                <Button
                    variant={activeCategory === 'historicalPlaces' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => handleCategoryChange('historicalPlaces')}
                >
                    Historical Places
                </Button>
            </div>

            {/* Success and Error Messages */}
            {showSuccessMessage && (
                <Alert severity="success" sx={{ marginBottom: '20px' }}>
                    {successMessage}
                </Alert>
            )}
            {showErrorMessage && (
                <Alert severity="error" sx={{ marginBottom: '20px' }}>
                    {errorMessage}
                </Alert>
            )}

            {/* Events List */}
            <Grid container spacing={3}>
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                                <Typography variant="h6">{event.name}</Typography>
                                <Typography variant="body2">{event.description}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Category: {event.category}
                                </Typography>
                                <Button variant="outlined" color="primary" style={{ marginTop: '10px' }}>
                                    View Details
                                </Button>
                            </div>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" color="textSecondary">
                        No saved events found for this category.
                    </Typography>
                )}
            </Grid>

            {/* Divider */}
            <Divider style={{ margin: '20px 0' }} />
        </div>
        </div>
    );
};

export default MyBookmarks;
