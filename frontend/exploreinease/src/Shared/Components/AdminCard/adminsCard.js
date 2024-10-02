import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import SettingsApplicationsSharpIcon from '@mui/icons-material/SettingsApplicationsSharp';

interface AdminsCardProps {
    title: string;
    description: string;
    imageUrl: string;
  }
  const AdminsCard: React.FC<AdminsCardProps> = ({ title, description, imageUrl, icon }) => {
    return (
        <Box>
        <Card sx={{ display: 'flex' ,alignItems: 'center',justifyContent: 'center', margin: 2 }}>
        <CardMedia
          component="img"
          sx={{ width: 140 }} 
          image={imageUrl}
          alt="green iguana"
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
          {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
          </Typography>
        </CardContent>
        <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <IconButton color="primary" aria-label="options"    
           sx={{ 
         size: '5rem', // Change this value to increase or decrease the size
        padding: '16px', // Adjust padding for more clickable area
      }}  >
        <SettingsApplicationsSharpIcon sx={{ fontSize:45 }} />
      </IconButton>
        </CardActions>
      </Card>
      </Box>
    )
};
export default AdminsCard;