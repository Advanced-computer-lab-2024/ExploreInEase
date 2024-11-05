import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const HistoricalPlaceCard = ({ item }) => {
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
                    Location: {item.location?.address || 'Location not available'}
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
                    Tags: {item.tags || 'N/A'}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default HistoricalPlaceCard;
