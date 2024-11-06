// src/Shared/Components/TourGuideHP.js
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import '../Guest/GuestHP.css'; 
import NetworkService from '../NetworkService';
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const TourGuideHP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { User } = location.state || {};
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    console.log(User)
    const initialUsername = User.username;
    const userId = User._id;
    const userType = User.type;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    async function handleClick(title) {
        if (title === "My Profile") {
            try {
                const options = {
                    apiPath: `/getTourGuide/${userId}`,
                };
                const response = await NetworkService.get(options);
                setSuccess(response.message);
                const TourGuide = response.tourGuide;
                navigate(`/viewTourGuideProfile`, { state: { TourGuide } });
            } catch (err) {
                setError(err.response?.data?.message || 'An unexpected error occurred.');
            }
        } else if (title === 'View My Created Itineraries') {
            try {
                const options = {
                    apiPath: `/itinerary/user/${userId}/allItineraries`,
                };
                const response = await NetworkService.get(options);
                setSuccess(response.message);
                const TourGuideItinerary = response;
                navigate(`/viewCreatedItineraryList`, { state: {TourGuideItinerary: TourGuideItinerary, User:User } });
            } catch (err) {
                setError(err.response?.data?.message || 'An unexpected error occurred.');
            }
        } else {
            navigate('/createItinerary', { state: { User } });
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

    return (
        <div className="homepage">
            <nav className="navbar">
                <div className="logo-container">
                    <img
                        src={HomePageLogo}
                        alt="ExploreInEase Logo"
                        className="logo"
                    />
                    <span className="website-name">ExploreInEase</span>
                </div>
                <div className="nav-links">
                    <button onClick={() => handleClick("My Profile")} className="small-button">
                        My Profile
                    </button>
                    <button onClick={() => handleClick("View My Created Itineraries")} className="small-button">
                        View My Created Itineraries
                    </button>
                    <button onClick={() => handleClick("Create/Read/Update/Delete Itineraries")} className="small-button">
                        Create an Itinerary
                    </button>
                    <div style={{ marginRight: 5, marginTop: 30, marginLeft: 60 }}>
                        <select>
                            <option value="usd">USD ($)</option>
                            <option value="eur">EUR (€)</option>
                            <option value="egp">EGP (ج.م)</option>
                        </select>
                    </div>
                </div>
                <div className="avatar-container">
                    <Avatar
                        sx={{
                            bgcolor: 'darkblue',
                            color: 'white',
                            width: 56,
                            height: 56,
                            fontSize: 24,
                            cursor: 'pointer',
                            marginLeft: 2,
                        }}
                        onClick={handleAvatarClick}
                    >
                        {firstInitial}
                    </Avatar>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleDeleteAccount}>Delete My Account</MenuItem>
                    </Menu>
                </div>
            </nav>
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default TourGuideHP;
