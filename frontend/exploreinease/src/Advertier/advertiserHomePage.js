import React, { useState, useEffect } from 'react';
import HomePage from './AdvertiserNavbar';
import { FaCar, FaUserCircle, FaTasks, FaRoute } from 'react-icons/fa'; // Example icon library
import { FaChartLine, FaFileInvoiceDollar, FaMoneyBillWave, FaPassport, FaPlaneDeparture, FaGlobeAmericas } from 'react-icons/fa';
import NetworkService from '../NetworkService';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import "../TouristGovernor/GovernorHomePage.css"; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdvertiserHomePage = () => {
  const Userr = JSON.parse(localStorage.getItem('User'));
  const userId = Userr.User?._id || Userr._id;

  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
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
      console.log("heree");

      try {
        const apiPath = `http://localhost:3030/activity/user/${Userr.User?._id}/allActivities`;
        const response = await axios.get(apiPath);
        navigate(`/Activities`, { state: { allActivity: response.data, id: Userr.User?._id } });
      } catch (err) {
        setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
      }
    }
    else if (title == "Tourists Report") {
      try {
        const options = {
          apiPath: `/userReport/${userId}`,
        };

        const response = await NetworkService.get(options);
        const data = response.data.monthlyReport;

        setSuccess(response.message); // Set success message
        const Type = 'tourist';
        const Orders = response.data;
        navigate('/TouristsReport', { state: { Response: data, User: Userr } });
      } catch (err) {
        if (err.response) {
          console.log(err.message);
          setError(err.response.data.message); // Set error message from server response if exists
        } else {
          setError('An unexpected error occurred.'); // Generic error message
        }
      }

    } else if (title == "Sales Report") {
      try {
        const options = {
          apiPath: `/userReport/${userId}`,
        };

        const response = await NetworkService.get(options);
        const data = response.eventObject;
        console.log(data);



        setSuccess(response.message); // Set success message
        const Type = 'tourist';
        const Orders = response.data;
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
      <div className="photo-background-advertiser" />

      <div className="card-container">
        {/* Card 1 - Activity */}
        <div className="card">
          <div className="card-icon">
            <FaTasks /> {/* You can change the icon to suit your needs */}
          </div>
          <button className="card-button" onClick={() => handleRegisterClick("Activities")}>Activities</button>
        </div>

        {/* Card 2 - Transportation */}
        <div className="card">
          <div className="card-icon">
            <FaCar /> {/* Icon for Transportation */}
          </div>
          <button className="card-button" onClick={() => handleRegisterClick("Transportation")}>Transportation</button>
        </div>

        {/* Card 3 - My Profile */}
        <div className="card">
          <div className="card-icon">
            <FaPassport />
          </div>
          <button className="card-button" onClick={() => handleRegisterClick("Tourists Report")}>Tourists Report</button>
        </div>
        <div className="card">
          <div className="card-icon">
            <FaChartLine />
          </div>
          <button className="card-button" onClick={() => handleRegisterClick("Sales Report")}>Sales Report</button>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserHomePage;
