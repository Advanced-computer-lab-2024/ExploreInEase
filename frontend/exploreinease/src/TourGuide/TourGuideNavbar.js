// src/Shared/Components/TourGuideHP.js
import React from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; 
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom';
const TourGuideHP = () => {
    const navigate = useNavigate();
    const initialUsername ="TAST";
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    function handleClick(title) {
        if (title == "My Profile"){
         navigate('/viewSellerProfile');
       }
       else if(title == 'View My Created Itineraries') {
         navigate('/viewItineraryList');
       }
       else {
        navigate('/viewMyItinerary');

       }
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
        <div className="nav-links">
          <button  onClick={() => handleClick("My Profile")}>My Profile</button>
          <button onClick={() => handleClick("View My Created Itineraries")}>View My Created Itineraries</button>
          <button onClick={() => handleClick("Create/Read/Update/Delete Itineraries")}>Create/Read/Update/Delete Itineraries</button>
        </div>
        <div className="currency-selector">
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
            }}
          >
            {firstInitial}
          </Avatar>
        </div>
      </nav>
      {/* Other homepage content goes here */}
    </div>
  );
};

export default TourGuideHP;