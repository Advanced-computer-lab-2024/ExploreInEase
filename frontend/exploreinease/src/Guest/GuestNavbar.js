// src/Shared/Components/GuestHP.js
// import { useState,useEffect } from 'react';
import React from 'react';
import './GuestHP.css'; // Import the CSS file
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
// import NetworkService from '../NetworkService';
import "../TouristGovernor/GovernorHomePage.css"; // Import CSS file for styling
import { FaClipboardList } from 'react-icons/fa';
import {  FaRegCalendarCheck } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate(); // Hook for navigation
  // async function fetchEvents() {
  //   try {
  //     const options = {
  //       apiPath: `/upcomingEvents/${currency}`,
  //       urlParam: { currency: currency },
  //     };
  //     console.log("Request Options:", options);

  //     const response = await NetworkService.get(options);
  //     setEvents(response); // Store the events in the state
  //     console.log(events);
      
  //   } catch (err) {
  //     if (err.response) {
  //       console.log("Error Message:", err.message);
  //       setError(err.message);
  //     } else {
  //       console.log("An unexpected error occurred.");
  //       setError("An unexpected error occurred.");
  //     }

  //     // Clear error after 3 seconds
  //     setTimeout(() => setError(""), 3000);
  //   }
  // }

  async function handleRegisterClick(title){
    if (title === "Register"){
    navigate('/register'); 
  }
  else if (title ==="Login"){
    navigate('/Login');
  }else if (title==="Events") {
    navigate('/Events');
  }else {

  }
  };
  return (
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

  <div className="navbar-center">
    <div className="card-container">
      {/* Tab 3 - Step-by-Step Guide */}
      <div
        className="card-tab"
        onClick={() => handleRegisterClick('View Step-by-Step Guide')}
      >
        <FaClipboardList className="tab-icon" />
        <span>Step-by-Step Guide</span>
      </div>

      {/* Tab 4 - Events */}
      <div className="card-tab" onClick={() => handleRegisterClick('Events')}>
        <FaRegCalendarCheck className="tab-icon" />
        <span>Events</span>
      </div>
    </div>
  </div>

  <div className="navbar-right">
    <button className="navbar-button" onClick={() => navigate('/login')}>
      Login
    </button>
    <button className="navbar-button register-btn" onClick={() => navigate('/register')}>
      Register
    </button>
  </div>
</nav>

  
  );
};

export default HomePage;