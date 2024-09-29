// GenericCard.js
import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
import PropTypes from 'prop-types';

const GenericCard = ({ title, title2, subtitle, image, description, buttonLabel, onButtonClick }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      {image && <CardMedia component="img" height="140" image={image} alt={title} />}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
          
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {title2}
          
        </Typography>
        
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        {buttonLabel && (
          <Button size="small" onClick={onButtonClick}>
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
    subtitle: PropTypes.node,
    description: PropTypes.node.isRequired,
  };
  
  // Define default prop values (optional)
  GenericCard.defaultProps = {
    subtitle: 'Default Subtitle',
  };

export default GenericCard;

