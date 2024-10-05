// src/Shared/Components/GuestHP.js
import React from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; // Import the CSS file
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
    const navigate=useNavigate();
    const initialUsername ="TAST";
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    function handleRegisterClick(title) {
        if (title == "My profile"){
            navigate('/viewAdvertiserProfile');
        }
      else if (title=="View Created Activities"){
          navigate('/viewAllCreatedActivities');
      }
      else {
        navigate('/explore`');
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
          <button  onClick={() => handleRegisterClick("Create Activities")}>Create Activities</button>
          <button  onClick={() => handleRegisterClick("Delete Activities")}>Delete Activities</button>
          <button  onClick={() => handleRegisterClick("Update Activities")}>Update Activities</button>
          <button  onClick={() => handleRegisterClick("View All Activities")}>View All Activities</button>
          <button  onClick={() => handleRegisterClick("View Created Activities")}>View Created Activities</button>
          <button  onClick={() => handleRegisterClick("My profile")}>My profile</button>
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

export default HomePage;