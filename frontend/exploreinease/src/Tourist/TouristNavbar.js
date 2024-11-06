import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; 
import HomePageLogo from '../HomePageLogo.png';
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const TouristNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { User } = location.state || {};
    const [success,setSuccess]=useState();
    const [error,setError]=useState();
    const initialUsername = User?.username;
     const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
     const userId=User?._id;
         async function handleRegisterClick(title) {
        if (title == "View Products") {
            try {
                const options = {
                  apiPath: `/getAvailableProducts/${userId}`,
                };
                
                const response = await NetworkService.get(options);
                setSuccess(response.message); // Set success message
                console.log(response);
                const Product=response.Products;
                const Type='tourist';
                navigate(`/viewProduct`,{ state: { Product, Type ,User:User} });          
              } catch (err) {
                if (err.response) {
                    console.log(err.message);
                  setError(err.response.data.message); // Set error message from server response if exists
                } else {
                  setError('An unexpected error occurred.'); // Generic error message
                }
              }
        }
      else if (title=="My Profile"){
        try {
            const options = {
              apiPath: `/getTourist/${userId}`,
            };
            
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            console.log(response);
            navigate(`/viewTouristProfile`,{state:{Tourist:response}});
          } catch (err) {
            if (err.response) {
                console.log(err.message);
              setError(err.response.data.message); // Set error message from server response if exists
            } else {
              setError('An unexpected error occurred.'); // Generic error message
            }
          }
      }
      else if(title =="View Booked items") {
        try {
          const options = {
            apiPath: `/upcomingEvents`,
          };
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log(response);
          const events=response;
          navigate(`/ViewListofBooked`,{state:{events}});          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      }
      else if(title =="View/Rate Purchased Product") {
        try {
          const options = {
            apiPath: `/getAvailableProducts/${userId}`,
          };
          
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log(response);
          const Product=response.Products;
          const Type='tourist';
          navigate(`/ViewPurchasedProduct`,{ state: { Product, Type ,User:User} });          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      }
      else if(title =="Book Hotels") {
       navigate(`/BookHotel`);          
      }
      else if(title =="Book Flights") {
        navigate(`/BookFlight`);          
      }
      else if(title =="Book transportation") {
        // try {
        //   const options = {
        //     apiPath: `/getAvailableProducts/${userId}`,
        //   };
          
        //   const response = await NetworkService.get(options);
        //   setSuccess(response.message); // Set success message
        //   console.log(response);
        //   const Product=response.Products;
        //   const Type='tourist';
        //   navigate(`/ViewPurchasedProduct`,{ state: { Product, Type ,User:User} });          
        // } catch (err) {
        //   if (err.response) {
        //       console.log(err.message);
        //     setError(err.response.data.message); // Set error message from server response if exists
        //   } else {
        //     setError('An unexpected error occurred.'); // Generic error message
        //   }
        // }
                 navigate(`/BookTransportation`);          

      }
      else {
        try {
            const options = {
              apiPath: `/upcomingEvents`,
            };
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            console.log(response);
            const events=response;
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
      }
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
          <button onClick={() => handleRegisterClick("Explore Activities and Itineraries and Historical Places")}
              className="small-button">Explore Activities and Itineraries and Historical Places</button>
          <button onClick={() => handleRegisterClick("View Products")}
              className="small-button">View Products</button>
          <button 
          onClick={() => handleRegisterClick("Book transportation")}
          className="small-button">Book transportation</button>
          <button 
          onClick={() => handleRegisterClick("View Booked items")}
          className="small-button">View Booked items</button>
          <button 
          onClick={() => handleRegisterClick("View/Rate Purchased Product")}
          className="small-button">View/Rate Purchased Product</button>
                     <button 
          onClick={() => handleRegisterClick("Book Hotels")}
          className="small-button">Book Hotels</button>
                     <button 
          onClick={() => handleRegisterClick("Book Flights")}
          className="small-button">Book Flights</button>
           <button 
          onClick={() => handleRegisterClick("My Profile")}
          className="small-button">My Profile</button>
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
    </div>
  );
};

export default TouristNavbar;