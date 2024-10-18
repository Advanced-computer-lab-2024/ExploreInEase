// src/Shared/Components/GuestHP.js
 import React ,{useState}from 'react';
 import Avatar from '@mui/material/Avatar';
 import '../Guest/GuestHP.css'; 
 import HomePageLogo from '../HomePageLogo.png';
 import axios from 'axios'; 
 import NetworkService from '../NetworkService';
 import { useNavigate } from 'react-router-dom';
 import { useLocation } from 'react-router-dom'; 

const GovernorNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tourist } = location.state || {};
    const {error,setError}=useState();
    const {success,setSuccess}=useState();
    const initialUsername = tourist?.username;
    const governorId=tourist?._id;
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    console.log(governorId);
    
    async function handleRegisterClick(title) {
       if (title=="Create Historical Locations Tags") {
          navigate(`/viewHistoricalTags`,{state:{governorId}});          
       }
      else {
        try{
       navigate(`/HistoricalPlaces`,{state:{governorId}});   
        }catch {

        }       
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
          <button onClick={() => handleRegisterClick("CRUD Historical Places and Museums")} 
              className="small-button">CRUD Historical Places and Museums</button>
          <button onClick={() => handleRegisterClick("Create Historical Locations Tags")} 
              className="small-button">Create Historical Locations Tags</button>
          {/* <button onClick={() => handleRegisterClick("View Created Historical Places and Museums")}
            className="small-button" >View Created Historical Places and Museums</button> */}
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

export default GovernorNavbar;