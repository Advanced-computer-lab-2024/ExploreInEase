// src/Shared/Components/TourGuideHP.js
import React,{ useState } from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; 
import NetworkService from '../NetworkService';
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

//
const TourGuideHP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { User } = location.state || {};
    const [success,setSuccess]=useState();
    const [error,setError]=useState();
    const initialUsername = User.username;
    const userId=User._id;
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    async function handleClick(title) {
        if (title == "My Profile"){
          try {
            const options = {
              apiPath: `/getTourGuide/${userId}`,
            };
            //
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            const TourGuide=response.tourGuide;
            console.log(TourGuide)
            navigate(`/viewTourGuideProfile`,{state:{TourGuide:TourGuide}});          
          } catch (err) {
            if (err.response) {
                // console.log(err.message);
              setError(err.response.data.message); // Set error message from server response if exists
            } else {
              setError('An unexpected error occurred.'); // Generic error message
            }
          }
       }
       else if(title == 'View My Created Itineraries') {
        try {
          const options = {
            apiPath: `/itinerary/user/${userId}/allItineraries`,
            urlParam: userId
          };
          
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          const TourGuideItinerary=response;
          console.log(TourGuideItinerary);
          navigate(`/viewCreatedItineraryList`,{state:{TourGuideItinerary, userId}});          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
        //  navigate('/viewCreatedItineraryList');
       }
       else {
        navigate('/createItinerary', {state: { User }});
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
          <button  
          onClick={() => handleClick("My Profile")}
          className="small-button">My Profile</button>
          <button onClick={() => handleClick("View My Created Itineraries")}
              className="small-button">View My Created Itineraries</button>
          <button onClick={() => handleClick("Create/Read/Update/Delete Itineraries")}
              className="small-button">Create an Itinerary</button>
     
        <div style={{marginRight:5,marginTop:30,marginLeft:60}}>
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
  </div>
  );
};

export default TourGuideHP;