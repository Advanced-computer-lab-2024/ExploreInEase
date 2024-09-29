// adminsCard.tsx
import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

interface AdminsCardProps {
  title: string;
  content: string;
  onActionClick?: () => void; // Optional function for button click
}

const AdminsCard: React.FC<AdminsCardProps> = ({ title, content, onActionClick }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
      {onActionClick && (
        <CardActions>
          <Button size="small" onClick={onActionClick}>Action</Button>
        </CardActions>
      )}
    </Card>
  );
};

export default AdminsCard;
