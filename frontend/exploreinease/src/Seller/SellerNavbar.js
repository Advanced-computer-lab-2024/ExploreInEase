import React, { useState, useEffect } from 'react';
import HomePageLogo from '../HomePageLogo.png';
import '../Guest/GuestHP.css';
import "../TouristGovernor/GovernorHomePage.css"; 
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ListItemIcon from '@mui/material/ListItemIcon';
import UploadIcon from '@mui/icons-material/Upload';
import Divider from '@mui/material/Divider';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Delete from '@mui/icons-material/Delete';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
const SHomePage = () => {
  const Userr = JSON.parse(localStorage.getItem('User'));
  const imageUrll = localStorage.getItem('imageUrl');
  const location = useLocation();
  const { state } = location;
  const [anchorProfileEl, setAnchorProfileEl] = useState(null);
  
  const navigate = useNavigate();
  const [menuItems] = useState([
    { title: 'New Message', body: 'You have received a new message from Alex.' },
    { title: 'Task Update', body: 'Your task "Design Mockup" is due tomorrow.' },
    { title: 'System Alert', body: 'Server maintenance scheduled for tonight.' },
    { title: 'Meeting Reminder', body: 'Team meeting scheduled at 3 PM.' },
    { title: 'Project Deadline', body: 'Project submission is due next week.' },
    { title: 'Event Invitation', body: 'You are invited to the annual gala dinner.' },
    { title: 'Feedback Request', body: 'Please provide feedback on the new design.' }]);
  const [ setSuccess] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ setError] = useState();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [setErrorMessage] = useState('');
  const [setSuccessMessage] = useState('');
  const User = state?.User || Userr|| '';
  const imageUrl = state?.imageUrl || imageUrll;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const [selectedTab, setSelectedTab] = useState("Sales Report");
  const openNotfication = Boolean(anchorEl1);
  const initialUsername = User.User?.username || User.username;
  const userId = User.User?._id || User._id;
  const userType = User.User?.type || User.type;
  const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';

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
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);
  const handleOpenMenu = (event) => {
    setAnchorProfileEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorProfileEl(null);
  };
  useEffect(() => {
    if (showErrorMessage) {
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorMessage]);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (action) => {
    handleMenuClose();
    if (action === 'changePassword') {
      navigate('/change-password', { state: { userId: userId } });;
    } else if (action === 'logout') {
      navigate('/');
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
  const handleClickNotification = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  async function handleClick(title) {
    if (title === "Profile") {
      try {
        const options = {
          apiPath: `/getSeller/${userId}`,
        };

        const response = await NetworkService.get(options);
        setSuccess(response.message); // Set success message
        console.log(response.seller);
        navigate(`/viewSellerProfile`, { state: { tourist: response.seller } });

      } catch (err) {
        if (err.response) {
          console.log(err.message);
          console.log(err.response.data.message); // Set error message from server response if exists
        } else {
          console.log('An unexpected error occurred.'); // Generic error message
        }
      }
    }
    else {
      if (title === "Products") {
        try {
          const options = {
            apiPath: `/getAvailableProducts/${userId}`,
          };
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log(response);
          const Product = response.Products;
          const Type = 'Seller';
          navigate(`/viewProduct`, { state: { Product, Type, User: User } });
        } catch (err) {
          if (err.response) {
            console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      } else if (title === 'Sales Report') {
        try {
          const options = {
            apiPath: `/userReport/${userId}`,
          };
  
          const response = await NetworkService.get(options);
          const data = response.eventObject;
          console.log(data);
  
  
  
          setSuccess(response.message); // Set success message
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
      else if(title==='Log Out'){
        navigate('/');
      }
      else {
        try {
          const options = {
            apiPath: `/getArchivedProducts/${userId}`,
          };
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log(response);
          const Product = response.Products;
          const Type = 'Seller';
          navigate(`/unArchiveProduct`, { state: { Product, Type, User: User } });
        } catch (err) {
          if (err.response) {
            console.log(err.message);
            console.log(err.response.data.message); // Set error message from server response if exists
          } else {
            console.log('An unexpected error occurred.'); // Generic error message
          }
        }
      }
    }
  };

  const handleDeleteAccount = async () => {
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
        setError(response.message || "Account deletion request failed.");
      }
    } catch (err) {
      // Access the error message from the response data
      const errorMessage = err.response?.data?.message || "An error occurred";
      setErrorMessage(errorMessage);
      setShowErrorMessage(true);
      setError(errorMessage);
    }
  };
  const handleClose = () => {
    setAnchorEl1(null);
  };
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
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
      <span className="website-name">ExploreInEase</span>
    </div>
      </div>
    <div className="navbar-right">
                    <Avatar sx={{ bgcolor: 'darkblue', color: 'white',cursor:'pointer' ,marginRight:'25px'}} src={avatarImage || undefined} onClick={handleOpenMenu} >
                        {avatarImage ? '' : initialUsername.charAt(0).toUpperCase()}
                    </Avatar>
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
                            <MenuItem onClick={()=>handleClick('Profile')}>
                           <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <PersonOutlineIcon />
                              </ListItemIcon>Profile</MenuItem>
                            <Divider/>
                            <MenuItem onClick={()=>handleClick('Change Password')}>     
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <PasswordOutlinedIcon />
                              </ListItemIcon>Change Password</MenuItem>
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
                            <MenuItem onClick={()=>handleClick('Delete Account')}>
                            <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <Delete />
                              </ListItemIcon>Delete Account</MenuItem>
                            <Divider/>
                            <MenuItem onClick={()=>handleClick('Log Out m')}>
                            <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <LogoutOutlinedIcon />
                              </ListItemIcon>Log Out</MenuItem>
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
                            }}
                        >
                            <Badge badgeContent={4} color="success">
                                <NotificationsNoneOutlinedIcon sx={{ fontSize:23}} />
                            </Badge>
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
    {["Sales Report","Products","Archieved Products"].map((tab) => (
          <div
            key={tab}
            className={`navbar-tab ${selectedTab === tab ? 'selected' : ''}`}
            onClick={() => handleClick(tab)}
          >
            {tab}
          </div>
        ))}
    </nav>
    </>
  );
};

export default SHomePage;