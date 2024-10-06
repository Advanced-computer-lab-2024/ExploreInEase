// src/Shared/Components/GuestHP.js
import React from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; // Import the CSS file
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
    const navigate=useNavigate();
    const location = useLocation();
    const { tourist } = location.state || {};
    const initialUsername = tourist?.username;
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    function handleRegisterClick(title) {
        if (title == "My profile"){
            navigate('/viewAdvertiserProfile');
        }
      else if (title=="View Created Activities"){
          navigate('/viewAllCreatedActivities');
      }
      else if ( title =="View All Activities"){
            navigate('/explore')
      }
      else {
        navigate('/Activities');
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
          <button  onClick={() => handleRegisterClick("Activities")}
              style={{width:160}}>Create Activities</button>
          <button  onClick={() => handleRegisterClick("View All Activities")}
               style={{width:160}}>View All Activities</button>
          <button  onClick={() => handleRegisterClick("View Created Activities")}
               style={{width:190}}>View Created Activities</button>
          <button  onClick={() => handleRegisterClick("My profile")}
               style={{width:160}}>My profile</button>
 
        <div style={{marginRight:5,marginTop:30,marginLeft:30}}>
          <span className="currency-symbol"></span>
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