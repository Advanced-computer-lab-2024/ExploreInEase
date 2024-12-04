import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadIcon from '@mui/icons-material/Upload';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Alert } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import '../Guest/GuestHP.css';
import HomePageLogo from '../HomePageLogo.png';
import Drawer from '@mui/material/Drawer';
import axios from 'axios';
import NetworkService from '../NetworkService';
import { useNavigate, useLocation } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const HomePage = () => {
    const Userr = JSON.parse(localStorage.getItem('User'));
    const imageUrll = JSON.parse(localStorage.getItem('imageUrl'));
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const [ setSuccess] = useState('');
    const [setError] = useState('');
    const User = state?.User || Userr;
    const imageUrl = state?.imageUrl || imageUrll;
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const openNotfication = Boolean(anchorEl1);
    const open = Boolean(anchorEl);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const initialUsername = User.User?.username || User.username;
    const userId = User.User?._id || User._id;
    const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    const userType = User.User?.type || User.type;
    const [menuItems] = useState([
        { title: 'New Message', body: 'You have received a new message from Alex.' },
        { title: 'Task Update', body: 'Your task "Design Mockup" is due tomorrow.' },
        { title: 'System Alert', body: 'Server maintenance scheduled for tonight.' },
        { title: 'Meeting Reminder', body: 'Team meeting scheduled at 3 PM.' },
        { title: 'Project Deadline', body: 'Project submission is due next week.' },
        { title: 'Event Invitation', body: 'You are invited to the annual gala dinner.' },
        { title: 'Feedback Request', body: 'Please provide feedback on the new design.' }]);
    // Retrieve avatar URL from localStorage or fallback to the default avatar
    const savedAvatarUrl = localStorage.getItem(`${userId}`) || '';
    const [avatarImage, setAvatarImage] = useState(savedAvatarUrl || `http://localhost:3030/images/${imageUrl || ''}`);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
    const handleClick = (event) => {
        setAnchorEl1(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl1(null);
    };
    const handleRegisterClick = async (title) => {
        if (title === "Transportation") {
            try {
                const apiPath = `http://localhost:3030/activity/user/${userId}/allActivities`;
                const response = await axios.get(apiPath);
                navigate(`/transportion`, { state: { allActivity: response.data, advertiserId: userId } });
            } catch (err) {
                setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
            }
        } else if (title === "Activities") {
            console.log("heree");

            try {
                const apiPath = `http://localhost:3030/activity/user/${userId}/allActivities`;
                const response = await axios.get(apiPath);
                navigate(`/Activities`, { state: { allActivity: response.data, id: userId } });
            } catch (err) {
                setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
            }
        }
        else if (title === "Tourists Report") {
            try {
                const options = {
                    apiPath: `/userReport/${userId}`,
                };

                const response = await NetworkService.get(options);
                console.log(response);

                setSuccess(response.message); // Set success message
        
                navigate('/TouristsReport', { state: { Response: response, User: Userr } });
            } catch (err) {
                if (err.response) {
                    console.log(err.message);
                    setError(err.response.data.message); // Set error message from server response if exists
                } else {
                    setError('An unexpected error occurred.'); // Generic error message
                }
            }
        } else if (title === "Sales Report") {
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
                  setError(err.response.data.message); // Set error message from server response if exists
                } else {
                  setError('An unexpected error occurred.'); // Generic error message
                }
              }
        }
        else {
            try {
                const options = { apiPath: `/getAdvertiser/${userId}` };
                const response = await NetworkService.get(options);
                setSuccess(response.message);
                navigate(`/viewAdvertiserProfile`, { state: { advertiser: response } });
            } catch (err) {
                setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
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

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    return (
        <div>
            <nav className="navbar">
                <div className="logo-container">
                    <img src={HomePageLogo} alt="ExploreInEase Logo" className="logo" />
                    <span className="website-name">ExploreInEase</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '1450px', alignContent: 'center', alignItems: 'center' }}>
                    <IconButton
                        onClick={handleClick}
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        className="menu-button"
                        style={{
                            position: 'absolute',
                            color: 'blue',      // Change icon color to blue
                            backgroundColor: '#e0f7fa', // Light blue background for contrast
                            right: '100px',
                            alignItems: 'center'
                        }}>
                        <Badge badgeContent={4} color="success">
                            <NotificationsNoneOutlinedIcon sx={{ fontSize: 30 }} />
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
                    <IconButton
                        onClick={toggleDrawer(true)}
                        className="menu-button"
                        style={{ position: 'absolute', right: '40px', color: 'white', backgroundColor: '#3f51b5' }}>
                        <MenuIcon />
                    </IconButton>
                </div>
            </nav>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} sx={{ '& .MuiDrawer-paper': { width: 500, overflowX: 'hidden', } }}>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                    <Avatar sx={{ bgcolor: 'darkblue', color: 'white' }} src={avatarImage || undefined}>
                        {avatarImage ? '' : initialUsername.charAt(0).toUpperCase()}
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
                    <ListItem component="label" sx={{ alignItems: 'center', padding: 0, marginLeft: '8px' }}>
                        <ListItemIcon sx={{ minWidth: 0, marginRight: '8px' }}>
                            <UploadIcon />
                        </ListItemIcon>
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvatarUpload}
                        />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuClick('logout')}>
                        <ListItemIcon style={{ minWidth: '0px', marginRight: '8px' }}>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>

                <Divider />
                <Divider />
                <List>
                    <Typography variant="h6" style={{ padding: '8px 16px' }}><strong>Pages</strong></Typography>
                    {[
                        "Activities",
                        "Transportation",
                        "Tourists Report",
                        "Sales Report",
                        "My Profile",
                    ].map((text) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton onClick={() => handleRegisterClick(text)}>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <div>
                {showSuccessMessage && (
                    <Alert severity="success"
                        sx={{
                            position: 'fixed',
                            top: 80, // You can adjust this value to provide space between success and error alerts
                            right: 20,
                            width: 'auto',
                            fontSize: '1.2rem', // Adjust the size
                            padding: '16px',
                            zIndex: 9999, // Ensure it's visible above other content
                        }}>
                        {successMessage}
                    </Alert>
                )}
                {showErrorMessage && (
                    <Alert severity="error"
                        sx={{
                            position: 'fixed',
                            top: 60, // You can adjust this value to provide space between success and error alerts
                            right: 20,
                            width: 'auto',
                            fontSize: '1.2rem', // Adjust the size
                            padding: '16px',
                            zIndex: 9999, // Ensure it's visible above other content
                        }}>
                        {errorMessage}
                    </Alert>
                )}
            </div>

        </div>
    );
};

export default HomePage;
