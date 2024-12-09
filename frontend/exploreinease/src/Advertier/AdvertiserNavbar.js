import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import '../Guest/GuestHP.css';
import HomePageLogo from '../HomePageLogo.png';
import axios from 'axios';
import NetworkService from '../NetworkService';
import { useNavigate, useLocation } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import "../TouristGovernor/GovernorHomePage.css"; 
import ListItemIcon from '@mui/material/ListItemIcon';
import UploadIcon from '@mui/icons-material/Upload';
import Delete from '@mui/icons-material/Delete';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';

const HomePage = () => {
    const Userr = JSON.parse(localStorage.getItem('User'));
    const imageUrll = localStorage.getItem('imageUrl');
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const [ setSuccess] = useState('');
    const [setError] = useState(null);
    const User = state?.User || Userr;
    const imageUrl = state?.imageUrl || imageUrll;
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const [anchorProfileEl, setAnchorProfileEl] = useState(null);
    const openNotfication = Boolean(anchorEl1);
    const open = Boolean(anchorEl);    
    const initialUsername = User.User?.username || User.username;
    const userId = User.User?._id || User._id;
    const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    const userType = User.User?.type || User.type;
    const [selectedTab, setSelectedTab] = useState("Sales Report");
    const [menuItems,setMenuItem] = useState([]);
    // Retrieve avatar URL from localStorage or fallback to the default avatar
    const savedAvatarUrl = localStorage.getItem(`${userId}`) || '';
    const [avatarImage, setAvatarImage] = useState(savedAvatarUrl || `http://localhost:3030/images/${imageUrl || ''}`);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [setErrorMessage] = useState('');
    const [ setSuccessMessage] = useState('');

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

    useEffect(() => {
        const savedTab = localStorage.getItem('selectedTab');
        if (savedTab) {
          setSelectedTab(savedTab); // Restore the selected tab
        }
      }, []);

      // useEffect(()=>{
      //     checkPromoCode();
      //   },[]);
      //   const checkPromoCode=async()=>{
      //     const options = {
      //       apiPath: '/updatePromoCode',
      //     };
      //     await NetworkService.put(options);
      //   }
    const handleOpenMenu = (event) => {
        setAnchorProfileEl(event.currentTarget);
      };
      const handleTabClick = (tabName) => {
        setSelectedTab(tabName);
      };

      const handleCloseMenu = () => {
        setAnchorProfileEl(null);
      };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (action) => {
        handleMenuClose();
        if (action === 'changePassword') {
            navigate('/change-password', { state: { userId: userId } });
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
                const uploadedImageUrl = response.data.imageUrl;

                // Update avatarImage and save the URL in localStorage
                setAvatarImage(uploadedImageUrl);
                localStorage.setItem(`${userId}`, uploadedImageUrl);
            } catch (err) {
                console.error('Error uploading image:', err);
            }
        }
    };
    const handleClick = async(event) => {
        setAnchorEl1(event.currentTarget);
        const options = { 
          apiPath: `/getAllNotifications/${Userr._id}`
         };
        const response =await NetworkService.get(options);
        setMenuItem(response);
        console.log(response);
        console.log(menuItems);
      

    };
    const handleClose = () => {
        setAnchorEl1(null);
    };
    const handleRegisterClick = async (title) => {
        if (title === "Transportation") {
            try {
                const apiPath = `http://localhost:3030/activity/user/${userId}/allActivities`;
                const response = await axios.get(apiPath);
                setSelectedTab(title);
                localStorage.setItem('selectedTab', title); // Save selected tab
                navigate(`/transportion`, { state: { allActivity: response.data, advertiserId: userId } });
            } catch (err) {
                console.log(err.response ? err.response.data.message : 'An unexpected error occurred.');
            }
        } else if (title === "Activities") {
            console.log("heree");

            try {
                const apiPath = `http://localhost:3030/activity/user/${userId}/allActivities`;
                const response = await axios.get(apiPath);
                setSelectedTab(title);
                localStorage.setItem('selectedTab', title); // Save selected tab
                navigate(`/Activities`, { state: { allActivity: response.data, id: userId } });
            } catch (err) {
                console.log(err.response ? err.response.data.message : 'An unexpected error occurred.');
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
        else if(title==='profile'){
            try {
                // const options = { apiPath: `/getAdvertiser/${userId}` };
                // const response = await NetworkService.get(options);
                // setSuccess(response.message);
                navigate(`/viewAdvertiserProfile`, { state: { advertiser: Userr } });
            } catch (err) {
                console.log(err.response ? err.response.data.message : 'An unexpected error occurred.');
            }
        }
       else if(title==='Log Out'){
            console.log('yes here');
            localStorage.removeItem('User');
            localStorage.removeItem('imageUrl');
            localStorage.removeItem('UserId');
            localStorage.removeItem('UserType');
            navigate('/');
           }
       else if(title==='password'){
            navigate('/change-password', { state: { userId: Userr._id } });

           }
  else if(title==='Delete Account'){
            console.log('hereee');
            try {
              console.log(userId, userType);
              const options = {
                apiPath: `/requestDeletion/${Userr._id}/${Userr.type}`,
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
            //   setErrorMessage(errorMessage);
            //   setShowErrorMessage(true);
              console.log(err);
            }
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
      <span className="website-name">ExploreInEase/Advertiser</span>
    </div>
      </div>
    <div className="navbar-right">
                <Tooltip title="Options">
                    <Avatar sx={{ bgcolor: 'darkblue', color: 'white',cursor:'pointer' ,marginRight:'20px',cursor:'pointer'}} src={avatarImage || undefined} onClick={handleOpenMenu} >
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
                            sx={{height:'700px'}}
                        >
                            <MenuItem onClick={()=>handleRegisterClick('profile')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <PersonOutlineIcon />
                              </ListItemIcon>
                              profile
                       </MenuItem>
                        <Divider/>
                            <MenuItem onClick={()=>handleRegisterClick('password')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
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
                            onClick={handleClick}
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            style={{
                                position: 'absolute', // Keeps the button positioned relative to its parent
                                color: 'blue',        // Icon color
                                backgroundColor: '#e0f7fa', // Light blue background
                                right: '100px',       // Distance from the right of the parent
                                alignItems: 'center',
                                margin:'2px'
                            }}
                        >
                            <Tooltip title="Notification">
                                <NotificationsNoneOutlinedIcon sx={{ fontSize:23}} />
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
              {[  "Sales Report","Tourists Report","Activities", "Transportation"].map((tab) => (
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

export default HomePage;
