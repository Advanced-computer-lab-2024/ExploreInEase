// src/Shared/Components/GuestHP.js
import React,{ useState } from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; // Import the CSS file
import HomePageLogo from '../HomePageLogo.png';
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
    const navigate=useNavigate();
    const location = useLocation();
    const [success,setSuccess]=useState();
    const [error,setError]=useState();
    const { User } = location.state || {};
    
     const initialUsername = User.User?.username;
     console.log(User.User);
     
    const userId=User.User._id;
    console.log(User.User._id);

    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    async function handleRegisterClick(title) {
        if (title == "My profile"){
          try {
            const options = {
              apiPath: `/getAdvertiser/${userId}`,
            };
            
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            console.log(response);
             navigate(`/viewAdvertiserProfile`,{state:{advertiser:response}});          
          } catch (err) {
            if (err.response) {
                console.log(err.message);
              setError(err.response.data.message); // Set error message from server response if exists
            } else {
              setError('An unexpected error occurred.'); // Generic error message
            }
          }
        }
      else if ( title =="View All Activities"){
        try {
          const options = {
            apiPath: `/upcomingEvents`,
          };
          
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log(response);
          const events=response.events;
          navigate(`/explore`,{state:{events}});          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      }
      else {
        try {
          const options = {
            apiPath: `/activity/user/${userId}/allActivities`,
          };

          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log(response);
           navigate(`/Activities`,{state:{allActivity:response}});          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
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
          <button  onClick={() => handleRegisterClick("Activities")}
              style={{width:160}}>Create Activities</button>
          <button  onClick={() => handleRegisterClick("View All Activities")}
               style={{width:160}}>View All Activities</button>
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