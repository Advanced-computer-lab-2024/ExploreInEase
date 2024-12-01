import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText, Typography, Divider, Grid } from '@mui/material';
import NetworkService from '../NetworkService';
import { useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';

const MyBookmarks = () => {
    const { state } = useLocation();
    const { events, userId } = state || {}; // Get events and userId from navigation state

    const [activeCategory, setActiveCategory] = useState('activities'); // Default to 'activities'
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Filter events based on the selected category
        if (events) {
            const filtered = events.filter(event => event.category === activeCategory);
            setFilteredEvents(filtered);
        }
    }, [activeCategory, events]);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                My Saved Events
            </Typography>

            {/* Buttons for filtering categories */}
            <div style={{ marginBottom: '20px' }}>
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
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                                <Typography variant="h6">{event.title}</Typography>
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
    );
};

export default MyBookmarks;
