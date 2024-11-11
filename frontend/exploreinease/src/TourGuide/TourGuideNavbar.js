// src/Shared/Components/TourGuideHP.js
import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import UploadIcon from '@mui/icons-material/Upload';
import Delete from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import '../Guest/GuestHP.css'; 
import NetworkService from '../NetworkService';
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

//
const TourGuideHP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { User, imageUrl } = location.state || {};
    const [success,setSuccess]=useState();
    const [error,setError]=useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const open = Boolean(anchorEl);
    
    const initialUsername = User.User?.username || User.username;
    const userId = User.User?._id || User._id;
    const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    const userType = User.User?.type || User.type;

    // Retrieve avatar URL from localStorage or fallback to the default avatar
    const savedAvatarUrl = localStorage.getItem(`${userId}`) || '';
    const [avatarImage, setAvatarImage] = useState(savedAvatarUrl || `http://localhost:3030/images/${imageUrl || ''}`);

    useEffect(() => {
      // Update the avatar URL when the component mounts if a new image URL exists
      if (savedAvatarUrl || imageUrl) {
          setAvatarImage(savedAvatarUrl || `http://localhost:3030/images/${imageUrl}`);
      } else {
          setAvatarImage(defaultAvatarUrl);
      }
  }, [imageUrl, savedAvatarUrl, defaultAvatarUrl]);

    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
   };

   const handleMenuClick = (action) => {
      handleMenuClose();
      if (action === 'changePassword') {
         navigate('/change-password', { state: { userId: userId } });;
      } else if (action === 'logout') {
         navigate('/login');
      }
   };


   const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`http://localhost:3030/uploadImage/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Image uploaded successfully:', response);
            const uploadedImageUrl = response.data.imageUrl;
            
            // Update avatarImage and save the URL in localStorage
            setAvatarImage(uploadedImageUrl);
            localStorage.setItem(`${userId}`, uploadedImageUrl);
            setSuccess('Image uploaded successfully!');
        } catch (err) {
            console.error('Error uploading image:', err);
            setError(err.response ? err.response.data.error : 'Failed to upload image. Please try again.');
        }
    }
};

    async function handleRegisterClick(title) {
        if (title == "My Profile"){
          try {
            const options = {
              apiPath: `/getTourGuide/${userId}`,
            };
            //
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            const TourGuide=response.tourGuide;
            console.log(TourGuide)
            navigate(`/viewTourGuideProfile`,{state:{TourGuide:TourGuide}});          
          } catch (err) {
            if (err.response) {
                // console.log(err.message);
              setError(err.response.data.message); // Set error message from server response if exists
            } else {
              setError('An unexpected error occurred.'); // Generic error message
            }
          }
       }
       else if(title == 'View My Created Itineraries') {
        try {
          const options = {
            apiPath: `/itinerary/user/${userId}/allItineraries`,
            urlParam: userId
          };
          
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          const TourGuideItinerary=response;
          console.log(TourGuideItinerary);
          navigate(`/viewCreatedItineraryList`,{state:{TourGuideItinerary:TourGuideItinerary, User:User}});          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
        //  navigate('/viewCreatedItineraryList');
       }
       else {
        navigate('/createItinerary', {state: { User }});
       }
    };

    const handleDeleteAccount = async () => {
      try {
          console.log(userId,userType);

          const options = {
              apiPath: `/requestDeletion/${userId}/${userType}`,
              useParams:userId,userType,
            };
          const response = await NetworkService.put(options);
          console.log(response);

          if (response.success) {
              setSuccess("Account deletion requested successfully.");
          } else {
              setError(response.message || "Account deletion request failed.");
          }
      } catch (err) {
          setError(err.response?.data?.message || "An error occurred while requesting account deletion.");
      }

  };
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
};
  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo-container">
          <img
            src={HomePageLogo} // Use the imported logo
            alt="ExploreInEase Logo"
            className="logo"
          />
          <span className="website-name">ExploreInEase</span>
        </div>
        <div 
                    className="currency-selector" 
                    style={{ 
                        position: 'absolute', 
                        left: '70%', 
                        transform: 'translateX(-50%)' 
                    }}
                >
                        <label htmlFor="currency-select" style={{ marginRight: '8px' }}><strong>Choose Currency:</strong></label>

                    <select id="currency-select" className="currency-dropdown">
                        <option value="usd">USD ($)</option>
                        <option value="eur">EUR (€)</option>
                        <option value="egp">EGP (ج.م)</option>
                    </select>
                </div>
          <IconButton 
  onClick={toggleDrawer(true)} 
  className="menu-button" 
  style={{ 
    position: 'absolute', 
    right: '40px', 
    color: 'white',      // Icon color
    backgroundColor: '#3f51b5' // Background color
  }}
>
<MenuIcon />
</IconButton>
</nav>
<Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} style={{width: drawerOpen ? '700px' : '300px'}}>
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'darkblue', color: 'white' }} src={avatarImage || undefined}>
                  {avatarImage ? '' :defaultAvatarUrl }
              </Avatar>
              <Typography variant="h6" style={{ marginLeft: '10px' }}>{initialUsername}</Typography>
          </div>
          <Divider />
          <List>
  <Typography variant="h6" style={{ padding: '8px 16px' }}><strong>Account</strong></Typography>
  <ListItem button onClick={() => handleMenuClick('changePassword')}>
    <ListItemIcon style={{ minWidth: '0px', marginRight: '8px' }}>
      <LockIcon fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Change Password" />
  </ListItem>
  <ListItem button onClick={handleDeleteAccount}>
    <ListItemIcon style={{ minWidth: '0px', marginRight: '8px' }}>
      <Delete fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Delete Account" />
  </ListItem>
  <ListItem button onClick={() => handleMenuClick('logout')}>
    <ListItemIcon style={{ minWidth: '0px', marginRight: '8px' }}>
      <LogoutIcon fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Logout" />
  </ListItem>
</List>

          <Divider />
          <List>
              <Typography variant="h6" style={{ padding: '8px 16px' }}><strong>Pages</strong></Typography>
              {[
                  "Create an Itinerary",
                  "View My Created Itineraries",
                  "My Profile"
              ].map((text) => (
                  <ListItem key={text} disablePadding>
                      <ListItemButton onClick={() => handleRegisterClick(text)}>
                          <ListItemText primary={text} />
                      </ListItemButton>
                  </ListItem>
              ))}
          </List>
      </Drawer>
  </div>
  );
};

export default TourGuideHP;