// src/Shared/Components/GuestHP.js
import React from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; 
import HomePageLogo from '../HomePageLogo.png';

const HomePage = () => {
    const initialUsername ="TAST";
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    function handleRegisterClick(title) {
        if (title == "View Created Historical Places and Museums"){
            navigate('/viewAllGovernorCreatedMuseum');
        }
      else if (title=="Create Historical Locations Tags"){
        navigate('/viewHistoricalTags');
      }
      else {
        navigate('/viewHistoricalPlaces');
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
          <button onClick={() => handleRegisterClick("CRUD Historical Places and Museums")} >CRUD Historical Places and Museums</button>
          <button onClick={() => handleRegisterClick("Create Historical Locations Tags")} >Create Historical Locations Tags</button>
          <button onClick={() => handleRegisterClick("View Created Historical Places and Museums")} >View Created Historical Places and Museums</button>
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
            }} >
            {firstInitial}
          </Avatar> 
        </div>
      </nav>
      {/* Other homepage content goes here */}
    </div>
  );
};

export default HomePage;