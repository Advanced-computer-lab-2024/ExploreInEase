// src/Login/TermsAcceptance.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NetworkService from './NetworkService';

import './TermsAcceptance.css';

const TermsAcceptance = ({userId,userType}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {registerResponse}= location.state || {};
  console.log(registerResponse);
  // const { userId, userType } = location.state || {}; // Extract userId and userType from location state
  console.log(registerResponse.User._id);
  console.log(registerResponse.User.type);
  const _id = registerResponse.User._id;
  const type = registerResponse.User.type;
  console.log(_id)
  console.log(type)



  // Redirect to login if userId or userType is missing
  // useEffect(() => {
  //   if (!userId || !userType) {
  //     console.error('User ID or User Type is missing, redirecting to login.');
  //     // navigate('/Login');
  //   }
  // }, [userId, userType, navigate]);

  const handleAccept = async () => {
    try {
      const options = {
        apiPath: `/acceptTerms/${_id}/${type}`,
        useParams:_id,type,
      };
      const response =await NetworkService.put(options);
      console.log(response)


      // After successful API call, redirect to login page
      navigate('/Login');
    } catch (error) {
      console.error('Error accepting terms:', error);
      alert('Failed to accept terms. Please try again.');
    }
  };

  return (
    <div className="terms-container">
      <h2>Terms and Conditions</h2>
      <div className="terms-content">
        <p>
          Welcome to ExploreInEase! Before you can use the system, please review
          and accept the following terms and conditions.
        </p>
        <p>
          By accepting, you agree to comply with all policies and conditions
          outlined here. This agreement is mandatory for Tour Guides,
          Advertisers, and Sellers.
        </p>
        <p>[  If the traveller is under the age of 18 and without a guardian, it must be specified at the time of the booking. Certain trips may require the traveller to be 18 or older. This information shall be provided at the time of the booking.]</p>
        <p>[The times of departure and return in the booking confirmation are only for indicative purposes. The Organizer shall confirm said information immediately, and if possible 20 days prior to departure.]</p>
        <p>[The Organizer shall always provide general information about terms regarding passports and visa.]</p>
        <p>[The main traveller shall immediately report any change of address, email, phone number or other relevant information which may prevent The Organizer from being able to contact the traveller.]</p>
        <p>[The price for the whole trip shall be clearly stated. The price shall include all services and mandatory additional costs, taxes and fees. The Organizer has the right to claim an initial down payment (booking fee). The requested amount shall be reasonable in relation to the cost of the whole trip and general circumstances.]</p>
      </div>
      <button className="accept-button" onClick={handleAccept}>
        Accept
      </button>
    </div>
  );
};

export default TermsAcceptance;
