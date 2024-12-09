import React, { useState } from 'react';
import HomePage from './AdvertiserNavbar';
import { FaCar, FaTasks,FaChartLine, FaPassport } from 'react-icons/fa'; // Example icon library
import NetworkService from '../NetworkService';
import "../TouristGovernor/GovernorHomePage.css"; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdvertiserHomePage = () => {
  const Userr = JSON.parse(localStorage.getItem('User'));
  const userId = Userr.User?._id || Userr._id;

  const navigate = useNavigate();
  const [ setSuccess] = useState('');
  const [ setError] = useState('');
  const handleRegisterClick = async (title) => {
    if (title === "Transportation") {
      try {
        const apiPath = `http://localhost:3030/activity/user/${Userr.User?._id}/allActivities`;
        const response = await axios.get(apiPath);
        navigate(`/transportion`, { state: { allActivity: response.data, advertiserId: Userr.User?._id } });
      } catch (err) {
        setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
      }
    } else if (title === "Activities") {
      try {
        const apiPath = `http://localhost:3030/activity/user/${Userr.User?._id}/allActivities`;
        const response = await axios.get(apiPath);
        navigate(`/Activities`, { state: { allActivity: response.data, id: Userr.User?._id } });
      } catch (err) {
        setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
      }
    }
    else if (title === "Tourists Report") {
      try {
        const options = {
          apiPath: `/userReport/${userId}`,
        };
        const response = await NetworkService.get(options);
        const data = response.data.monthlyReport;
        setSuccess(response.message); // Set success message
        navigate('/TouristsReport', { state: { Response: data, User: Userr } });
      } catch (err) {
        if (err.response) {
          console.log(err.message);
          setError(err.response.data.message); // Set error message from server response if exists
        } else {
          setError('An unexpected error occurred.'); // Generic error message
        }
      }

    } else if (title === "Sales Report") {
      try {
        const options = {
          apiPath: `/userReport/${userId}`,
        };

        const response = await NetworkService.get(options);
        const data = response.eventObject;
        console.log(data);



        setSuccess(response.message); // Set success message
        navigate('/SalesReport', { state: { Response: data,User: Userr } });
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
        const options = { apiPath: `/getAdvertiser/${Userr.User?._id}` };
        const response = await NetworkService.get(options);
        setSuccess(response.message);
        navigate(`/viewAdvertiserProfile`, { state: { advertiser: response } });
      } catch (err) {
        setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
      }
    }
  };
  return (
    <div className="HomePage">
      <div>
        <HomePage />
      </div>
    </div>
  );
};

export default AdvertiserHomePage;
