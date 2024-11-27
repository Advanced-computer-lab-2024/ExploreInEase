// src/Shared/Components/GuestHP.js
import { useState, useEffect } from 'react';
import React from 'react';
import './GuestHP.css'; // Import the CSS file
import Avatar from '@mui/material/Avatar';
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import NetworkService from '../NetworkService';
import Filter from '../Shared/Components/Filter/Filter';
import Alert from '@mui/material/Alert';
import { Login } from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate(); // Hook for navigation
  const initialUsername ="TAST";
  const [currency, setCurrency] = useState("EGP"); // default currency
  const [events, setEvents] = useState([]); // State for storing events
  const [error,setError]=useState();
  const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
  async function fetchEvents() {
    try {
      const options = {
        apiPath: `/upcomingEvents/${currency}`,
        urlParam: { currency: currency },
      };
      console.log("Request Options:", options);

      const response = await NetworkService.get(options);
      console.log("Response:", response);

      setEvents(response); // Store the events in the state
      console.log(events);
      
    } catch (err) {
      if (err.response) {
        console.log("Error Message:", err.message);
        setError(err.message);
      } else {
        console.log("An unexpected error occurred.");
        setError("An unexpected error occurred.");
      }

      // Clear error after 3 seconds
      setTimeout(() => setError(""), 3000);
    }
  }
  useEffect(() => {
    fetchEvents();
  }, [currency]); // Re-fetch events if currency changes
  function handleLoginClick(){
    navigate('/Login');
  }
  async function handleRegisterClick(title){
    if (title == "Register"){
    navigate('/register'); 
  }
  };
  return (

    <div className="homepage">
      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}
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
        <button
         onClick={() => handleLoginClick()}
          className="small-button" >
          Login
        </button>
        <button 
         onClick={() => handleRegisterClick("Register")}
          className="small-button">
            Register</button>
          <button 
           className="small-button">Upload Required Documents</button>
          <button  className="small-button">View Step-by-Step Guide</button>
        </div>
        <div className="currency-selector">
          <span className="currency-symbol"></span>
          <select>
            <option value="usd">USD ($)</option>
            <option value="eur">EUR (€)</option>
            <option value="egp">EGP (ج.م)</option>
          </select>
        </div>
  
      </nav>
      <Filter eventsG={events} typeeG={"guest"} />
      {/* Other homepage content goes here */}
    </div>
  );
};

export default HomePage;