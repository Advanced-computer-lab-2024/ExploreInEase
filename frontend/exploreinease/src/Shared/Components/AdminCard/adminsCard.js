import * as React from 'react';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import SettingsApplicationsSharpIcon from '@mui/icons-material/SettingsApplicationsSharp';
import { Box, CardContent, Typography, CardActions, IconButton, Popover, Button, Grid } from '@mui/material';

const AdminsCard = ({ name, email, role, initialStatus, mobileNumber, nationality, dateOfBirth, typeOfLifeLiving, onDelete }) => {
  // State for controlling the popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [status, setStatus] = React.useState(initialStatus); // State for status

  // Function to handle button click to open the popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor element for the popover
  };

  // Function to handle accepting the request
  const handleAccept = () => {
    setStatus('Accepted'); // Change status to 'Accepted'
    setAnchorEl(null); // Close the popover
  };

  const handleDelete = () => {
    onDelete();
    setAnchorEl(null); // Close the popover
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the popover
  };

  // Determine if the popover is open
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Extract the first initial of the name for the avatar
  const firstInitial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <Box>
      <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'darkblue',
            color: 'white',
            width: 56,
            height: 56,
            fontSize: 24,
            margin: 2,
          }}
        >
          {firstInitial}
        </Avatar>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {name || 'ssss'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            E-mail: {email || 'sfgfd'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Role: {role || 'Tourist'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Status: {status || 'Pending'}
          </Typography>
        </CardContent>
        <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <IconButton
            color="primary"
            aria-label="options"
            onClick={handleClick} // Open popover on click
            sx={{
              size: '5rem',
              padding: '16px',
            }}
          >
            <SettingsApplicationsSharpIcon sx={{ fontSize: 45 }} />
          </IconButton>
        </CardActions>
      </Card>

      {/* Popover Component */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          style: {
            width: 'auto', // Make the width fit the content
            maxWidth: 300, // Optional: Set a max width for better readability
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Overlay content */}
          <Typography variant="h5">More Details</Typography>

          {role === 'Tourist' && ( // Conditionally render details if role is "Tourist"
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body1">Mobile Number:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{mobileNumber}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Nationality:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{nationality}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Date of Birth:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{dateOfBirth}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Experience:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{typeOfLifeLiving}</Typography>
              </Grid>
            </Grid>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 2 }}>
            <Button onClick={handleAccept} color="primary" sx={{ marginRight: 1 }}>
              Accept
            </Button>
           
            <Button onClick={handleDelete} color="primary">
              Delete
            </Button>

          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default AdminsCard;
