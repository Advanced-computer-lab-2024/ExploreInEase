import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
import PropTypes from 'prop-types';

// GenericCard Component
const GenericCard = ({ title, subtitle, image, description, buttonLabel, onButtonClick }) => {
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
          alt={title}
          sx={{
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        />
      )}
      <CardContent>
        {/* Title */}
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
          {title}
        </Typography>
        
        {/* Subtitle */}
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '12px' }}>
            {subtitle}
          </Typography>
        )}

        {/* Description */}
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
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

  return (
    <GenericCard
      title="Amazing Adventure"
      subtitle="Explore the beauty of nature"
      image="https://via.placeholder.com/345x180" // Replace with an actual image URL
      description="Join us for an unforgettable journey through the world's most beautiful landscapes."
      buttonLabel="Learn More"
      onButtonClick={handleButtonClick}
    />
  );
};

// Define prop types
GenericCard.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  description: PropTypes.node.isRequired,
  image: PropTypes.string,
  buttonLabel: PropTypes.string,
  onButtonClick: PropTypes.func,
};

// Define default prop values (optional)
GenericCard.defaultProps = {
  subtitle: 'Default Subtitle',
  image: 'https://via.placeholder.com/345x180', // Default placeholder image
};

export default ExampleCard;
