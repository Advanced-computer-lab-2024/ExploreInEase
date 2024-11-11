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
import Delete from '@mui/icons-material/Delete';
import '../Guest/GuestHP.css';
import HomePageLogo from '../HomePageLogo.png';
import Drawer from '@mui/material/Drawer';
import axios from 'axios';
import NetworkService from '../NetworkService';
import { useNavigate, useLocation } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const { User, imageUrl } = location.state || {};
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [drawerOpen, setDrawerOpen] = useState(false);
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

    const handleRegisterClick = async (title) => {
        if (title === "My profile") {
            try {
                const options = { apiPath: `/getAdvertiser/${userId}` };
                const response = await NetworkService.get(options);
                setSuccess(response.message);
                navigate(`/viewAdvertiserProfile`, { state: { advertiser: response } });
            } catch (err) {
                setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
            }
        } else if (title === "Transportation") {
            try {
                const apiPath = `http://localhost:3030/activity/user/${userId}/allActivities`;
                const response = await axios.get(apiPath);
                navigate(`/transportion`, { state: { allActivity: response.data ,id:userId} });
            } catch (err) {
                setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
            }
        } else {
            try {
                const apiPath = `http://localhost:3030/activity/user/${userId}/allActivities`;
                const response = await axios.get(apiPath);
                navigate(`/Activities`, { state: { allActivity: response.data, id: userId } });
            } catch (err) {
                setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
            }
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const options = {
                apiPath: `/requestDeletion/${userId}/${userType}`,
            };
            const response = await NetworkService.put(options);

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
                    style={{ position: 'absolute', right: '40px', color: 'white', backgroundColor: '#3f51b5' }}>
                    <MenuIcon />
                </IconButton>
            </nav>
        

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} style={{ width: drawerOpen ? '700px' : '300px' }}>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
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

            {/* Display Error or Success Message */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
        </div>
    );
};

export default HomePage;
