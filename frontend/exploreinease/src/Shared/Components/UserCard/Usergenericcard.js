import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
import PropTypes from 'prop-types';

const GenericCard = ({ title, title2, subtitle, image, description, buttonLabel, onButtonClick }) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: '16px', // Smooth rounded corners
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
        transition: 'transform 0.3s ease-in-out', // Smooth hover effect
        '&:hover': {
          transform: 'scale(1.05)', // Slight zoom on hover
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)', // Deeper shadow on hover
        },
      }}
    >
      {/* Conditional rendering for image */}
      {image && (
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={title}
          sx={{
            borderTopLeftRadius: '16px', // Match the top corners with card
            borderTopRightRadius: '16px',
          }}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
          {title}
        </Typography>
        {title2 && (
          <Typography gutterBottom variant="h6" component="div" sx={{ color: '#555' }}>
            {title2}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '12px' }}>
            {subtitle}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
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
            }}
          >
            {buttonLabel}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

// Define prop types
GenericCard.propTypes = {
  title: PropTypes.node.isRequired,
  title2: PropTypes.node,
  subtitle: PropTypes.node,
  description: PropTypes.node.isRequired,
  image: PropTypes.string,
  buttonLabel: PropTypes.string,
  onButtonClick: PropTypes.func,
};

// Define default prop values (optional)
GenericCard.defaultProps = {
  subtitle: 'Default Subtitle',
};

export default GenericCard;
