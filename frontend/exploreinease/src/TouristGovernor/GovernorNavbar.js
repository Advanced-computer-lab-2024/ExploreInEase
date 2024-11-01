import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; 
import HomePageLogo from '../HomePageLogo.png';
import NetworkService from '../NetworkService';
import { useNavigate, useLocation } from 'react-router-dom';

const GovernorNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tourist } = location.state || {};
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const initialUsername = tourist?.username;
    const governorId = tourist?._id;
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';

    async function handleRegisterClick(title) {
        if (title === "View Created Historical Places and Museums") {
            try {
                const options = {
                    apiPath: `/historical-places/${governorId}/allHistoricalPlaces`,
                    urlParam: governorId,
                };
                const response = await NetworkService.get(options);
                setSuccess(response.message); // Set success message
                console.log(response);
                const Places = response;
                navigate(`/viewAllGovernorCreatedMuseum`, { state: { places: Places, userId: governorId } });
            } catch (err) {
                if (err.response) {
                    console.log(err.message);
                    setError(err.response.data.message); // Set error message from server response if exists
                } else {
                    setError('An unexpected error occurred.'); // Generic error message
                }
            }
        } else if (title === "Create Historical Locations Tags") {
            try {
                const options = {
                    apiPath: `/historical-places/${governorId}/allHistoricalPlaces`,
                    urlParam: governorId,
                };
                const response = await NetworkService.get(options);
                setSuccess(response.message); // Set success message
                console.log(response);
                const Places = response;
                navigate(`/viewHistoricalPlaces`, { state: { Places } });
            } catch (err) {
                if (err.response) {
                    console.log(err.message);
                    setError(err.response.data.message); // Set error message from server response if exists
                } else {
                    setError('An unexpected error occurred.'); // Generic error message
                }
            }
        } else {
            try {
                const options = {
                    apiPath: `/historicalPlacesByTags/${governorId}`,
                };
                const response = await NetworkService.get(options);
                setSuccess(response.message); // Set success message
                console.log(response);
                const tags = response;
                navigate(`/viewHistoricalTags`, { state: { tags } });
            } catch (err) {
                if (err.response) {
                    console.log(err.message);
                    setError(err.response.data.message); // Set error message from server response if exists
                } else {
                    setError('An unexpected error occurred.'); // Generic error message
                }
            }
        }
    }

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
                <div className="nav-links">
                    <button onClick={() => handleRegisterClick("CRUD Historical Places and Museums")}
                        className="small-button">CRUD Historical Places and Museums</button>
                    <button onClick={() => handleRegisterClick("Create Historical Locations Tags")}
                        className="small-button">Create Historical Locations Tags</button>
                    <button onClick={() => handleRegisterClick("View Created Historical Places and Museums")}
                        className="small-button">View Created Historical Places and Museums</button>
                </div>
                <div className="currency-selector">
                    <span className="currency-symbol"></span>
                    <select>
                        <option value="usd">USD ($)</option>
                        <option value="eur">EUR (€)</option>
                        <option value="egp">EGP (ج.م)</option>
                    </select>
                </div>
                <div className="avatar-container">
                    <Avatar
                        sx={{
                            bgcolor: 'darkblue',
                            color: 'white',
                            width: 56,
                            height: 56,
                            fontSize: 24,
                            marginLeft: 2,
                        }}>
                        {firstInitial}
                    </Avatar>
                </div>
            </nav>
            {/* Other homepage content goes here */}
        </div>
    );
};

export default GovernorNavbar;
