import React, { useEffect, useState } from "react";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { useLocation } from "react-router-dom";
import NetworkService from "../NetworkService"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import { Alert } from '@mui/material'; 
import "react-datepicker/dist/react-datepicker.css"; // Import date picker styles
import TourGuideHP from "./TourGuideNavbar";
import "./ItineraryList.css"; 

const ItineraryList = () => {
  const location = useLocation();
  const { TourGuideItinerary, User } = location.state || {};
  console.log("User", User);
  // console.log(TourGuideItinerary);

  const userId = User._id;
  const [itinerariesData, setItinerariesData] = useState(TourGuideItinerary?.Itineraries);
  const [activitiesData, setActivitiesData] = useState({});
  const [editItineraryData, setEditItineraryData] = useState(null);
  const [newDateModalOpen, setNewDateModalOpen] = useState(false);
  const [newDate, setNewDate] = useState(null);
  const [removeDateModalOpen, setRemoveDateModalOpen] = useState(false);
  const [dateToRemove, setDateToRemove] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  useEffect(() => {
    if (showErrorMessage) {
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorMessage]);

  const getLocationName = async (lat, lng) => {
    const provider = new OpenStreetMapProvider();
    const result = await provider.search({ query: `${lat}, ${lng}` });
    return result && result.length > 0 ? result[0].label : "Unknown location";
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const allActivitiesPromises = [];
      itinerariesData.forEach((itinerary) => {
        if (itinerary.activities && itinerary.activities.length > 0) {
          itinerary.activities.forEach((activityId) => {
             allActivitiesPromises.push(getActivityDetails(activityId, itinerary._id));
          });
        }
      });

      const activities = await Promise.all(allActivitiesPromises);
      activities.forEach(async (activity) => {
        if (activity && activity.location) {
          const locationName = await getLocationName(activity.location.lat, activity.location.lng);
          setActivitiesData((prev) => {
            const currentActivities = prev[activity.itineraryId] || [];
            const isDuplicate = currentActivities.some(
              (a) => a.name === activity.name && a.locationName === locationName
            );

            if (!isDuplicate) {
              return {
                ...prev,
                [activity.itineraryId]: currentActivities.concat({
                  name: activity.name,
                  locationName: locationName,
                  date: activity.duration.date,
                  time: activity.duration.time,
                  price: activity.price,
                }),
              };
            }

            return prev;
          });
        }
      });
    };

    fetchActivities();
  }, [itinerariesData]);

  const getActivityDetails = async (_id, itineraryId) => {
    const options = {
      apiPath: `/activity/${_id}/${userId}`,
      UrlParam: _id,
      userId
    };
    try{
      const response = await NetworkService.get(options);
      console.log("response", response);
      return {
        itineraryId,
        name: response.name,
        location: { lat: response.location.latitude, lng: response.location.longitude },
        duration: { date: response.date, time: response.time },
        price: response.price
      };
    }
   catch(error){
    getActivityDetails(_id, itineraryId);
   }
  };

  const openEditModal = (itinerary) => {
    setEditItineraryData({ 
      ...itinerary, 
      dateTimeAvailable: itinerary.dateTimeAvailable.map(date => new Date(date)) // Convert to Date objects
    });
  };

  const closeEditModal = () => {
    setEditItineraryData(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditItineraryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleAddDate = () => {
    if (newDate) {
      setEditItineraryData((prevData) => ({
        ...prevData,
        dateTimeAvailable: [...prevData.dateTimeAvailable, newDate], // Add new date
      }));
      setNewDateModalOpen(false);
      setNewDate(null);
    }
  };

  const submitEdit = async () => {
      try {
        const options = {
          apiPath: `/itinerary/${editItineraryData._id}/${userId}`,
          UrlParam: editItineraryData._id,
          body: {
            ...editItineraryData,
            dateTimeAvailable: editItineraryData.dateTimeAvailable.map(date => date.toISOString()), // Convert back to ISO string
          },
          userId
        };
        const response = await NetworkService.put(options); // Adjust the API call for updating
        console.log("Itinerary updated successfully", response);
        setSuccessMessage("Itinerary updated successfully!");
        setShowSuccessMessage(true);
        setItinerariesData((prev) => 
          prev.map(itinerary => itinerary._id === editItineraryData._id ? editItineraryData : itinerary)
        );
        closeEditModal();

      } catch (error) {
        setErrorMessage(error.Response.message || 'An error occurred');
        setShowErrorMessage(true);
        console.error("Error updating itinerary", error);
      }
  };

  const handleRemoveDate = () => {
    if (dateToRemove) {
      setEditItineraryData((prevData) => ({
        ...prevData,
        dateTimeAvailable: prevData.dateTimeAvailable.filter(date => date.toISOString() !== dateToRemove),
      }));
      setRemoveDateModalOpen(false);
      setDateToRemove(null); // Reset the selected date
    }
  };

  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const deleteItinerary = async (itineraryId) => {
      try {
        const options = {
          apiPath: `/itinerary/${itineraryId}/${userId}`,
          UrlParam: itineraryId,
          userId
        };
        const response = await NetworkService.delete(options);
        console.log("Itinerary deleted successfully:", response);
        setSuccessMessage("Itinerary deleted successfully");
        setShowSuccessMessage(true);
        setItinerariesData((prev) => prev.filter(itinerary => itinerary._id !== itineraryId));
      } catch (error) {
        setErrorMessage(error.message || 'An error occurred');
        setShowErrorMessage(true);
        console.error("Error deleting itinerary:", error);
      }
  };

  return (
    <div>
      <div>
      <TourGuideHP/>
      </div>
    <div className="itinerary-list-container">
      <h2>Your Created Itineraries</h2>
      <div className="itinerary-cards">
        {itinerariesData.map((itinerary) => (
          <div key={itinerary._id} className="itinerary-card">
            <h3>Itinerary Name: {itinerary.name}</h3>
            <label>
              <strong>Available Dates:</strong>
              <span>
                {itinerary.dateTimeAvailable.map(date => formatDateTime(date)).join(", ")}
              </span>
            </label>
            <p><strong>Language:</strong> {itinerary.language || "Arabic"}</p>
            <p><strong>Directions:</strong> {itinerary.directions}</p>
            <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
            <p><strong>Drop Off Location:</strong> {itinerary.dropoffLocation}</p>
            <p><strong>Price:</strong> {itinerary.price}</p>
            <p><strong>Ratings:</strong> {itinerary.ratings || "0"}</p>
            <p><strong>Active:</strong> {itinerary.isActivated}</p>
            <br />
            <h4>Activities:</h4>
            <div className="activity-details">
              {activitiesData[itinerary._id]?.length > 0 ? (
                activitiesData[itinerary._id].map((activity, index) => (
                  <div key={index} className="activity-entry">
                    <span className="activity-names">{activity.name}</span>
                    <span className="activity-timeline">{" - "}{itinerary.timeline[index] || "No date available"}</span>
                  </div>
                ))
              ) : "Loading..."}
            </div>
            <div className="itinerary-actions">
              <FontAwesomeIcon 
                icon={faEdit} 
                onClick={() => openEditModal(itinerary)} 
                className="itinerary-edit-icon" 
                title="Edit Itinerary"
              />
              <FontAwesomeIcon 
                icon={faTrash} 
                onClick={() => deleteItinerary(itinerary._id)} 
                className="itinerary-delete-icon" 
                title="Delete Itinerary"
              />
            </div>
          </div>
        ))}
      </div>

      {editItineraryData && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeEditModal}>&times;</span>
            <h2>Edit Itinerary</h2>
            <label>
              Itinerary Name:
              <input 
                type="text" 
                name="name" 
                value={editItineraryData.name} 
                onChange={handleInputChange} 
              />
            </label>
            <label>
              Available Dates:
              <input 
                type="text" 
                value={editItineraryData.dateTimeAvailable.map(date => formatDateTime(date)).join(", ")} 
                readOnly 
              />
              <button className="add-date-button" onClick={() => setNewDateModalOpen(true)}>Add New Date</button>
              <button className="remove-date-button" onClick={() => setRemoveDateModalOpen(true)}>Remove Date</button>
            </label>
            <label>
              Language:
              <input 
                type="text" 
                name="language" 
                value={editItineraryData.language} 
                onChange={handleInputChange} 
              />
            </label>
            <label>
              Directions:
              <input 
                type="text" 
                name="directions" 
                value={editItineraryData.directions} 
                onChange={handleInputChange} 
              />
            </label>
            <label>
              Pickup Location:
              <input 
                type="text" 
                name="pickupLocation" 
                value={editItineraryData.pickupLocation} 
                onChange={handleInputChange} 
              />
            </label>
            <label>
              Drop Off Location:
              <input 
                type="text" 
                name="dropoffLocation" 
                value={editItineraryData.dropoffLocation} 
                onChange={handleInputChange} 
              />
            </label>
            <label>
              Price:
              <input 
                type="number" 
                name="price" 
                value={editItineraryData.price} 
                onChange={handleInputChange} 
              />
            </label>
            
<label>
  isActivated:
  <div>
    <label>
      <input
        type="radio"
        name="isActivated"
        value="0"
        checked={editItineraryData.isActivated === "0"}
        onChange={handleInputChange}
      />
      Deactivated
    </label>
    <label>
      <input
        type="radio"
        name="isActivated"
        value="1"
        checked={editItineraryData.isActivated === "1"}
        onChange={handleInputChange}
      />
      Activated
    </label>
  </div>
</label>

            <button onClick={submitEdit}>Submit</button>
          </div>
        </div>
      )}

      {newDateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setNewDateModalOpen(false)}>&times;</span>
            <h2>Add New Date</h2>
            <DatePicker selected={newDate} onChange={date => setNewDate(date)} />
            <button className="add-date-button2" onClick={handleAddDate} disabled={!newDate}>Add Date</button>
          </div>
        </div>
      )}

      {removeDateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setRemoveDateModalOpen(false)}>&times;</span>
            <h2>Remove a Date</h2>
            <label>
              Select a Date to Remove:
              <select onChange={(e) => setDateToRemove(e.target.value)} defaultValue="">
                <option value="" disabled>Select a date</option>
                {editItineraryData.dateTimeAvailable.map((date, index) => (
                  <option key={index} value={date.toISOString()}>{formatDateTime(date)}</option>
                ))}
              </select>
            </label>
            <button onClick={handleRemoveDate} disabled={!dateToRemove}>Remove Date</button>
          </div>
        </div>
      )}
<div>
{showSuccessMessage && (
        <Alert severity="success" 
        sx={{
          position: 'fixed',
          top: 80, // You can adjust this value to provide space between success and error alerts
          right: 20,
          width: 'auto',
          fontSize: '1.2rem', // Adjust the size
          padding: '16px',
          zIndex: 9999, // Ensure it's visible above other content
        }}>
          {successMessage}
        </Alert>
      )}
      {showErrorMessage && (
        <Alert severity="error" 
        sx={{
          position: 'fixed',
          top: 60, // You can adjust this value to provide space between success and error alerts
          right: 20,
          width: 'auto',
          fontSize: '1.2rem', // Adjust the size
          padding: '16px',
          zIndex: 9999, // Ensure it's visible above other content
        }}>
          {errorMessage}
        </Alert>
      )}
</div>
    </div>
    </div>
  );
};

export default ItineraryList;
