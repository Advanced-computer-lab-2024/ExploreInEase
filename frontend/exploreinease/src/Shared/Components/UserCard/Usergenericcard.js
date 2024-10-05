import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';

// GenericCard Component
const GenericCard = ({ image, labelValuePairs, buttonLabel, onButtonClick }) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      {/* Image rendering */}
      {image && (
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt="Card image"
          sx={{
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        />
      )}
      <CardContent>
        {/* Rendering label-value pairs */}
        {labelValuePairs.map((pair, index) => (
          <Grid container key={index} spacing={2} sx={{ marginBottom: '10px' }}>
            <Grid item xs={6}>
              <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                {pair.label}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" color="text.secondary">
                {pair.value}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </CardContent>

      {/* Button actions */}
      <CardActions sx={{ justifyContent: 'center' }}>
        {buttonLabel && (
          <Button
            size="medium"
            onClick={onButtonClick}
            sx={{
              backgroundColor: '#007bff',
              color: '#fff',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#0056b3',
              },
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            {buttonLabel}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

// Example usage of the GenericCard
const ExampleCard = () => {
  const handleButtonClick = () => {
    alert('Button clicked!');
  };

  const labelValuePairs = [
    { label: 'Location', value: 'Paris, France' },
    { label: 'Duration', value: '5 Days' },
    { label: 'Price', value: '$1200' },
    { label: 'Category', value: 'Adventure' },
  ];

  return (
    <GenericCard
      image="https://via.placeholder.com/345x180" // Replace with an actual image URL
      labelValuePairs={labelValuePairs}
      buttonLabel="Book Now"
      onButtonClick={handleButtonClick}
    />
  );
};

// Define prop types
GenericCard.propTypes = {
  image: PropTypes.string,
  labelValuePairs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  buttonLabel: PropTypes.string,
  onButtonClick: PropTypes.func,
};

// Define default prop values (optional)
GenericCard.defaultProps = {
  image: 'https://via.placeholder.com/345x180', // Default placeholder image
};

export default ExampleCard;
