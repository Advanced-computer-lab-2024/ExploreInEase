// src/Shared/Components/TourGuideHP.js
import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import { Alert } from '@mui/material'; 
import '../Guest/GuestHP.css'; 
import NetworkService from '../NetworkService';
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import "../TouristGovernor/GovernorHomePage.css"; 
import UploadIcon from '@mui/icons-material/Upload';
import Delete from '@mui/icons-material/Delete';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Tooltip from '@mui/material/Tooltip';
import NodataFound from '../No data Found.avif';  

const TourGuideHP = () => {
  const Userr = JSON.parse(localStorage.getItem('User'));
  console.log("User",Userr);
  const imageUrl=localStorage.getItem('imageUrl');
 const navigate = useNavigate();
    const location = useLocation();
    const [menuItems,setMenuItem]=useState( []);
    
      const [anchorProfileEl, setAnchorProfileEl] = useState(null);
    const [selectedTab, setSelectedTab] = useState("Sales Report");  
    const { state } = location;
    const User = state?.User || Userr;    
    const [setSuccess]=useState();
    const [setError]=useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const open = Boolean(anchorEl);
    const openNotfication = Boolean(anchorEl1);
    const initialUsername = User?.User?.username || User?.username;
    const userId = User?.User?._id || User?._id;
    const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    const userType = User?.User?.type || User?.type;
    // Retrieve avatar URL from localStorage or fallback to the default avatar
    const savedAvatarUrl = localStorage.getItem(`${userId}`) || '';
    const [avatarImage, setAvatarImage] = useState(savedAvatarUrl || `http://localhost:3030/images/${imageUrl || ''}`);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
      const savedTab = localStorage.getItem('selectedTab');
      if (savedTab) {
        setSelectedTab(savedTab); // Restore the selected tab
      }
    }, []);
    useEffect(() => {
      // Update the avatar URL when the component mounts if a new image URL exists
      if (savedAvatarUrl || imageUrl) {
          setAvatarImage(savedAvatarUrl || `http://localhost:3030/images/${imageUrl}`);
      } else {
          setAvatarImage(defaultAvatarUrl);
      }
  }, [imageUrl, savedAvatarUrl, defaultAvatarUrl]);
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);
  
  useEffect(() => {
    if (showErrorMessage) {
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorMessage]);

  const handleOpenMenu = (event) => {
    setAnchorProfileEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl1(null);
  };
  const handleCloseMenu = () => {
    setAnchorProfileEl(null);
  };

   const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
          setError(null);
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
    }else {
      setError('No file selected.');
      return; 
    }
};
    // useEffect(()=>{
        //   checkPromoCode();
        // },[]);
        // const checkPromoCode=async()=>{
        //   const options = {
        //     apiPath: '/updatePromoCode',
        //   };
        //   await NetworkService.put(options);
        // }
const handleClickNotification = async(event) => {
  setAnchorEl1(event.currentTarget);
  const options = { 
    apiPath: `/getAllNotifications/${Userr._id}`
   };
  const response =await NetworkService.get(options);
  setMenuItem(response);
  console.log(response);
  console.log(menuItems);

};

 async function handleRegisterClick(title) {
        if (title === "profile"){
          console.log("here");
          console.log("userId",userId);
          try {
            navigate(`/viewTourGuideProfile`,{state:{TourGuide:User}});          
          } catch (err) {
            if (err.response) {
                // console.log(err.message);
              console.log(err.response.data.message); // Set error message from server response if exists
            } else {
              console.log('An unexpected error occurred.'); // Generic error message
            }
          }
       }
       else if(title === 'View Itinerary') {
        try {
          const options = {
            apiPath: `/itinerary/user/${Userr._id}/allItineraries`,
            urlParam: Userr._id
          };
          const response = await NetworkService.get(options);
          console.log(response.message); // Set success message
          const TourGuideItinerary=response||[];
          console.log(TourGuideItinerary);
          setSelectedTab(title);
          localStorage.setItem('selectedTab', title); // Save selected tab
          navigate(`/viewCreatedItineraryList`,{state:{TourGuideItinerary:TourGuideItinerary, User:Userr}});          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            console.log(err.response.data.message); // Set error message from server response if exists
          } else {
            console.log('An unexpected error occurred.',err); // Generic error message
          }
        }
       }
       else if (title === 'Sales Report'){
        try {
          const options = {
            apiPath: `/userReport/${userId}`,
          };
          const response = await NetworkService.get(options);
          const data = response.eventObject;
          console.log(data);
          console.log(response.message); // Set success message
          setSelectedTab(title);
          localStorage.setItem('selectedTab', title); // Save selected tab
          navigate('/SalesReport', { state: { Response: data,User: Userr } });
        } catch (err) {
          if (err.response) {
            console.log(err.message);
            console.log(err.response.data.message); // Set error message from server response if exists
          } else {
            console.log('An unexpected error occurred.'); // Generic error message
          }
        }
       }
       else if (title==='Tourists Report'){
        try {
          const options = {
            apiPath: `/userReport/${userId}`,
          };
  
          const response = await NetworkService.get(options);
          console.log(response);
  
          console.log(response.message); // Set success message
          setSelectedTab(title);
          localStorage.setItem('selectedTab', title); // Save selected tab
          navigate('/TouristsReport', { state: { Response: response,User: Userr } });
        } catch (err) {
          if (err.response) {
            console.log(err.message);
            console.log(err.response.data.message); // Set error message from server response if exists
          } else {
            console.log('An unexpected error occurred.'); // Generic error message
          }
        }
       }
       else if(title==='Itinerary') {
        setSelectedTab(title);
        localStorage.setItem('selectedTab', title); // Save selected tab
        navigate('/createItinerary', {state: { User }});
       }
       else if(title==='Log Out'){
        console.log('yes here');
        localStorage.removeItem('User');
        localStorage.removeItem('imageUrl');
        localStorage.removeItem('UserId');
        localStorage.removeItem('UserType');
        navigate('/');
       }
       else if(title==='Change Password'){
        navigate('/change-password', { state: { userId: userId } });;
       }
       else if(title==='Delete Account'){
        try {
          console.log(userId, userType);
          const options = {
            apiPath: `/requestDeletion/${userId}/${userType}`,
            useParams: userId,
            userType,
          };
          const response = await NetworkService.put(options);
          console.log(response);
      
          setSuccessMessage(response.message || "Delete Successfully!");
          setShowSuccessMessage(true);
      
          if (response.success) {
            setSuccess("Account deletion requested successfully.");
          } else {
            console.log(response.message || "Account deletion request failed.");
          }
        } catch (err) {
          // Access the error message from the response data
          const errorMessage = err.response?.data?.message || "An error occurred";
          setErrorMessage(errorMessage);
          setShowErrorMessage(true);
          console.log(errorMessage);
        }
       }
       else{
        console.log('yes here');
       }
    };
  return (
    <>
    <nav className="navbarMain">
    <div className="navbar-left">
    <div className="logo-container">
      <img
        src={HomePageLogo} // Replace with your logo's import
        alt="ExploreInEase Logo"
        className="logo"
      />
      <span className="website-name">ExploreInEase/TourGuide</span>
    </div>
      </div>
    <div className="navbar-right">
             <Tooltip title="Options">
                    <Avatar sx={{ bgcolor: 'darkblue', color: 'white',cursor:'pointer' ,marginRight:'25px'}} src={avatarImage || undefined} onClick={handleOpenMenu} >
                        {avatarImage ? '' : initialUsername.charAt(0).toUpperCase()}
                    </Avatar>
                    </Tooltip>
                    <Menu
                            anchorEl={anchorProfileEl}
                            open={Boolean(anchorProfileEl)}
                            onClose={handleCloseMenu}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                        >
                            <MenuItem onClick={()=>handleRegisterClick('profile')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <PersonOutlineIcon />
                              </ListItemIcon>
                              profile
                       </MenuItem>
                        <Divider/>
                            <MenuItem onClick={()=>handleRegisterClick('Change Password')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <PasswordOutlinedIcon />
                              </ListItemIcon>
                              Change Password
                       </MenuItem>
                            <Divider/>
                            <MenuItem onClick={()=>handleRegisterClick('Delete Account')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <Delete />
                              </ListItemIcon>
                              Delete Account  
                            </MenuItem>
                            <Divider/>
                            
                            <MenuItem component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <UploadIcon />
                              </ListItemIcon>
                                Upload Profile Picture
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleAvatarUpload}
                                />
                            </MenuItem>
                            <Divider/>
                            <MenuItem onClick={()=>handleRegisterClick('Log Out')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <LogoutOutlinedIcon />
                              </ListItemIcon>
                              Log Out
                            </MenuItem>
                        </Menu>
                        <IconButton
                            onClick={handleClickNotification}
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            style={{
                                position: 'absolute', // Keeps the button positioned relative to its parent
                                color: 'blue',        // Icon color
                                backgroundColor: '#e0f7fa', // Light blue background
                                right: '100px',       // Distance from the right of the parent
                                alignItems: 'center',
                                margin:'3px'
                            }}>
                          <Tooltip title="Notification">
                          <Badge badgeContent={value} color="success">
                                <NotificationsNoneOutlinedIcon sx={{ fontSize:23}} />
                            </Badge>
                          </Tooltip>
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl1}
                            open={openNotfication}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            PaperProps={{
                                style: {
                                    maxHeight: '300px', // Set the maximum height for the menu
                                    overflow: 'auto',   // Enable scrolling
                                },
                            }}
                        >
                            {menuItems && menuItems.length > 0 ? (
                                        menuItems.map((item, index) => (
                                            <MenuItem key={index}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <strong>{item.title}</strong>
                                                    <span style={{ fontSize: '0.875rem', color: 'gray' }}>{item.body}</span>
                                                </div>
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No notifications available</MenuItem>
                                    )}
                        </Menu>
     </div>
    </nav>
    <nav className="navbarSecondary">
    {["Sales Report","Tourists Report","Itinerary","View Itinerary"].map((tab) => (
          <div
            key={tab}
            className={`navbar-tab ${selectedTab === tab ? 'selected' : ''}`}
            onClick={() => handleRegisterClick(tab)}
          >
            {tab}
          </div>
        ))}
    </nav>
    </>
  );
};

export default TourGuideHP;