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
import "../TouristGovernor/GovernorHomePage.css"; // Import CSS file for styling
import { FaCar, FaUserCircle, FaTasks, FaChartLine, FaBox, FaTags, FaArchive, FaFolderOpen, FaCalendarAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { FaBookOpen, FaClipboardList, FaListOl, FaHandsHelping } from 'react-icons/fa';
import { FaRegUser, FaRegCalendarCheck } from 'react-icons/fa';

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


  async function handleRegisterClick(title){
    if (title === "Register"){
    navigate('/register'); 
  }
  else if (title ==="Login"){
    navigate('/Login');
  }else if (title==="Events") {
    
  }else {

  }
  };
  return (
    <div>
      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}
      <nav className="navbarMain">
        <div className="logo-container">
          <img
            src={HomePageLogo} // Use the imported logo
            alt="ExploreInEase Logo"
            className="logo"
          />
          <span className="website-name">ExploreInEase</span>
        </div>
      </nav>
      <div className="photo-background-guest" />
      <div className="card-container">
        {/* Card 1 - Activity */}
        <div className="card">
          <div className="card-icon">
            <FaRegUser /> {/* You can change the icon to suit your needs */}
          </div>
          <button className="card-button" onClick={()=>handleRegisterClick("Register")}>Register</button>
        </div>

        {/* Card 2 - Transportation */}
        <div className="card">
          <div className="card-icon">
            <FaSignInAlt /> {/* Icon for Transportation */}
          </div>
          <button className="card-button" onClick={()=>handleRegisterClick("Login")}>Login</button>
        </div>

        {/* Card 3 - My Profile */}
        <div className="card">
          <div className="card-icon">
            <FaClipboardList /> 
          </div>
          <button className="card-button" onClick={()=>handleRegisterClick("View Step-by-Step Guide")}>View Step-by-Step Guide</button>
        </div>
        <div className="card">
          <div className="card-icon">
            <FaRegCalendarCheck /> 
          </div>
          <button className="card-button" onClick={()=>handleRegisterClick("Events")}>View Events</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;