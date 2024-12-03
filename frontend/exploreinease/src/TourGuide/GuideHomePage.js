import React, { useState, useEffect } from 'react';
import TourGuideHP from '../TourGuide/TourGuideNavbar';
import { FaCar, FaPassport, FaUserCircle, FaTasks, FaChartLine, FaBox, FaTags, FaArchive, FaFolderOpen } from 'react-icons/fa';
import NetworkService from '../NetworkService';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import "../TouristGovernor/GovernorHomePage.css"; // Import CSS file for styling
import { Navigate, useNavigate } from 'react-router-dom';

const GovernorHomePage = () => {
  const Userr = JSON.parse(localStorage.getItem('User'));
  const userId = Userr?.User?._id || Userr?._id;

  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();
  async function handleRegisterClick(title) {
    if (title === "My Profile") {
      try {
        const options = {
          apiPath: `/getTourGuide/${Userr?.User._id}`,
        };
        const response = await NetworkService.get(options);
        setSuccess(response.message); // Set success message
        const TourGuide = response.tourGuide;
        console.log(TourGuide)
        navigate(`/viewTourGuideProfile`, { state: { TourGuide: TourGuide } });
      } catch (err) {
        if (err.response) {
          // console.log(err.message);
          setError(err.response.data.message); // Set error message from server response if exists
        } else {
          setError('An unexpected error occurred.'); // Generic error message
        }
      }
    }
    else if (title === 'View My Created Itineraries') {
      try {
        const options = {
          apiPath: `/itinerary/user/${Userr?.User._id}/allItineraries`,
          urlParam: Userr?.User._id
        };

        const response = await NetworkService.get(options);
        setSuccess(response.message); // Set success message
        const TourGuideItinerary = response;
        console.log(TourGuideItinerary);
        navigate(`/viewCreatedItineraryList`, { state: { TourGuideItinerary: TourGuideItinerary, User: Userr } });
      } catch (err) {
        if (err.response) {
          console.log(err.message);
          setError(err.response.data.message); // Set error message from server response if exists
        } else {
          setError('An unexpected error occurred.'); // Generic error message
        }
      }
    }
    else if (title === 'Sales Report') {
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
    else if (title === 'Tourists Report') {
      try {
        const options = {
          apiPath: `/userReport/${userId}`,
        };

        const response = await NetworkService.get(options);
        const data = response.monthlyReport;
        console.log(data);



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
    }
    else {
      navigate('/createItinerary', { state: { User: Userr } });
    }
  };
  return (
    <div className="HomePage">
      <div>
        <TourGuideHP />
      </div>
      <div className="photo-background-guide" />

      <div className="card-container">
        {/* Card 1 - Activity */}
        <div className="card">
          <div className="card-icon">
            <FaTasks /> {/* You can change the icon to suit your needs */}
          </div>
          <button className="card-button" onClick={() => handleRegisterClick("View My Created Itineraries")}>View My Created Itineraries</button>
        </div>

        {/* Card 2 - Transportation */}
        <div className="card">
          <div className="card-icon">
            <FaFolderOpen /> {/* Icon for Transportation */}
          </div>
          <button className="card-button" onClick={() => handleRegisterClick("createItinerary")}>Create Itinerary</button>
        </div>

        {/* Card 3 - My Profile */}
        <div className="card">
          <div className="card-icon">
            <FaPassport /> {/* Icon for Profile */}
          </div>
          <button className="card-button" onClick={() => handleRegisterClick("Tourists Report")}>Tourists Report</button>
        </div>
        <div className="card">
          <div className="card-icon">
            <FaChartLine /> {/* Icon for Profile */}
          </div>
          <button className="card-button" onClick={() => handleRegisterClick("Sales Report")}>Sales Report</button>
        </div>
      </div>
    </div>
  );
};

export default GovernorHomePage;
