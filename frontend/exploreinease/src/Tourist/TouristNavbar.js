import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import '../Guest/GuestHP.css'; 
import HomePageLogo from '../HomePageLogo.png';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';

import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import axios from 'axios';
const TouristNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tourist, imageUrl } = location.state || {};
    const [success,setSuccess]=useState();
    const [error,setError]=useState();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const initialUsername = tourist?.username;
     const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
     const userId=tourist._id;
     const userType = tourist.tourist?.type || tourist.type;

     const savedAvatarUrl = localStorage.getItem(`${userId}`) || '';
     const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
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

    async function handleRegisterClick(title) {
        if (title == "View Products") {
            try {
                const options = {
                  apiPath: `/getAvailableProducts/${userId}`,
                };
                
                const response = await NetworkService.get(options);
                setSuccess(response.message); // Set success message
                console.log(response);
                const Product=response.Products;
                const Type='tourist';
                navigate(`/viewProduct`,{ state: { Product, Type ,User:tourist} });          
              } catch (err) {
                if (err.response) {
                    console.log(err.message);
                  setError(err.response.data.message); // Set error message from server response if exists
                } else {
                  setError('An unexpected error occurred.'); // Generic error message
                }
              }
        }
      else if (title=="My Profile"){
        try {
            const options = {
              apiPath: `/getTourist/${userId}`,
              
            };
            
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            console.log(response);
            navigate(`/viewTouristProfile`,{state:{Tourist:response}});
          } catch (err) {
            if (err.response) {
                console.log(err.message);
              setError(err.response.data.message); // Set error message from server response if exists
            } else {
              setError('An unexpected error occurred.'); // Generic error message
            }
          }
      }      else if(title =="View Booked items") {
        try {
          const touristId=userId;
          const options = { 
            apiPath: `/bookedEvents/${touristId}`
           };
          const response = await NetworkService.get(options);
          navigate(`/ViewListofBooked`,{state:{events:response,userId:userId}});          
  
        } catch (error) {
          console.log('Error:', error);
        }
      }
      else if(title =="View/Rate Purchased Product") {
        try {
          const options = {
            apiPath: `/getOrders/${userId}`,
          };
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log("get Purchased Product",response);
          const Product=response.orders;
          console.log("get Purchased Product",Product);

          const Type='tourist';
          navigate(`/ViewPurchasedProduct`,{ state: { Product:Product, Type:Type ,userId:userId} });          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      }
      else if(title =="Book Hotels") {
       navigate(`/BookHotel`,{state:{userId}});          
      }
      else if(title =="Book Flights") {
        navigate(`/BookFlight`,{state:{userId}});          
      }
      else if(title =="Book transportation") {
        try {
          const touristId=userId;
          const options = { 
            apiPath: `/getTransportations/EGP`
           };
          const response = await NetworkService.get(options);
          console.log(response);
          
           const transportationData=response;
          navigate(`/BookTransportation`,{state:{userId:userId,transportationData:transportationData}});          
          } catch (error) {
          console.log('Error:', error);
        }
      }
      else if (title =="Complaints"){
        try { 
          const options = {
            apiPath: `/myComplaints/${userId}`,
            urlParam:userId

          };
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log(response);
          const events=response.data;
          console.log(events)
          navigate(`/Complaints`,{state:{events,userId:userId}});          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      }
      else {
        console.log("heree");
        
        try {
            const options = {
              apiPath: `/upcomingEvents`,
            };
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            console.log("response",response);
            const events=response;
            console.log(userId);
            
            navigate(`/explore`,{state:{events:events,userId:userId}});          
          } catch (err) {
            if (err.response) {
                console.log(err.message);
              setError(err.response.data.message); // Set error message from server response if exists
            } else {
              setError('An unexpected error occurred.'); // Generic error message
            }
          }
        // navigate('/explore');
      }
      }

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

    const handleAvatarUpload = async (event) => {
      const file = event.target.files[0];
      if (file) {
          const formData = new FormData();
          formData.append('image', file);
          console.log('Uploading image:', formData);
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
          } catch (err) {
              console.error('Error uploading image:', err);
          }
      }
  };
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
};
return (
  <div className="homepage">
      <nav className="navbar">
          <div className="logo-container">
              <img src={HomePageLogo} alt="ExploreInEase Logo" className="logo" />
              <span className="website-name">ExploreInEase</span>
          </div>
          <div 
                    className="currency-selector" 
                    style={{ 
                        position: 'absolute', 
                        left: '80%', 
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
                  {avatarImage ? '' : firstInitial}
              </Avatar>
              <Typography variant="h6" style={{ marginLeft: '10px' }}>{tourist.username}</Typography>
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
                  "Explore Activities",
                  "View Products",
                  "Book Transportation",
                  "View Booked items",
                  "View/Rate Products",
                  "Book Hotels",
                  "Book Flights",
                  "Complaints",
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
export default TouristNavbar;