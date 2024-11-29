import React, { useEffect, useState } from "react";
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Alert } from '@mui/material'; 
import NetworkService from "../NetworkService";
import { useLocation } from "react-router-dom";
import TourGuideHP from "./TourGuideNavbar";
 import "./CreateItinerary.css"; // Import your CSS for styling
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (name, selectedActivities, theme) => {
  return {
    fontWeight: selectedActivities.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
};

const CreateItinerary = () => {
  const theme = useTheme();
  const [itineraryName, setItineraryName] = useState("");
  const [activities, setActivities] = useState([]); // List of all activities from backend
  const [selectedActivityNames, setSelectedActivityNames] = useState([]); // Store selected activity names
  const [selectedActivityIds, setSelectedActivityIds] = useState([]); // Store corresponding selected activity IDs
  const [locations, setLocations] = useState([]); // Store locations for activities
  const [durations, setDurations] = useState([]); // Store durations for activities
  const [language, setLanguage] = useState("");
  const [price, setPrice] = useState("");
  const [availableDates, setAvailableDates] = useState([]); // Store selected dates
  const [accessibility, setAccessibility] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [timeline, setTimeline] = useState("");
  const [directions, setDirections] = useState("");
  const [activate, setActivate] = useState(false);
  const [special, setSpecial] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const { User } = location.state || {};
  const userId = User._id;
  console.log(userId);

  // Fetch activities from backend on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try{
        const response = await NetworkService.get({ apiPath: '/getAllActivities' });
        console.log(response.activities);
      setActivities(response.activities); 
      }      
      catch(error){

      }
        // Store the full activity objects, including id and name
    };

    fetchActivities();
  }, []);

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

  // Handle selection of activities by names
  const handleActivityChange = (event) => {
    const {
      target: { value },
    } = event;
  
    const selectedNames = typeof value === 'string' ? value.split(',') : value;
    setSelectedActivityNames(selectedNames);
  
    // Get the corresponding activity IDs for the selected names
    const selectedIds = selectedNames.map(name => {
      const activity = activities.find(activity => activity.name === name);
      return activity ? activity._id : null; // Change 'id' to '_id'
    }).filter(id => id !== null); // Filter out any null values
    setSelectedActivityIds(selectedIds);
    
    // Reset locations and durations based on the number of selected activities
    const updatedLocations = Array(selectedNames.length).fill("");
    const updatedDurations = Array(selectedNames.length).fill("");
  
    setLocations(updatedLocations);
    setDurations(updatedDurations);
  };
  

  // Handle input changes for locations and durations
  const handleLocationChange = (index, value) => {
    const updatedLocations = [...locations];
    updatedLocations[index] = value;
    setLocations(updatedLocations);
  };

  const handleDurationChange = (index, value) => {
    const updatedDurations = [...durations];
    updatedDurations[index] = value;
    setDurations(updatedDurations);
  };

  // Handle available date changes
  const handleDateChange = (index, value) => {
    const updatedDates = [...availableDates];
    updatedDates[index] = value;
    setAvailableDates(updatedDates);
  };

  const addDateInput = () => {
    setAvailableDates([...availableDates, ""]); // Add an empty string for the new date input
  };

  const removeDateInput = (index) => {
    const updatedDates = availableDates.filter((_, i) => i !== index);
    setAvailableDates(updatedDates);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const itineraryData = {
      name: itineraryName,
      activities: selectedActivityIds, // Send the activity IDs instead of names
      locations,
      durations,
      language,
      price,
      dateTimeAvailable: availableDates,
      accessibility,
      pickupLocation,
      dropoffLocation,
      timeline,
      directions,
      isActivated: activate ? 1 : 0,
      isSpecial: special ? true : false,
      created_by: userId,
      flag: 1,
    };

    // Make an API call to create the itinerary
    try{

      const response = await NetworkService.post({ apiPath: '/itinerary', body: itineraryData });
      console.log(response);
      console.log("weslt henaa");

      setSuccessMessage(response.message||"save Successfully!");
      console.log("weslt henaa");
      setShowSuccessMessage(true);
        console.log("weslt henaa123");
        
    }catch(error){
      console.log("d5alt henaa");
      
      setErrorMessage(error.response?.data?.message || 'An error occurred');
      setShowErrorMessage(true);
    }

    // Handle success/failure here
  };

  return (
    <div className="create-itinerary-container">
      <h2>Create Itinerary</h2>
      <form onSubmit={handleSubmit} className="itinerary-form">
        <div className="form-group">
          <label>
            Itinerary Name:
            <input
              type="text"
              value={itineraryName}
              onChange={(e) => setItineraryName(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>Select Activities:</label>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="activity-multiple-select-label">Activities</InputLabel>
            <Select
              labelId="activity-multiple-select-label"
              id="activity-multiple-select"
              multiple
              value={selectedActivityNames}
              onChange={handleActivityChange}
              input={<OutlinedInput label="Activities" />}
              MenuProps={MenuProps}
            >
              {activities?.map((activity) => (
                <MenuItem
                  key={activity.id}
                  value={activity.name}
                  style={getStyles(activity.name, selectedActivityNames, theme)}
                >
                  {activity.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {selectedActivityNames.map((activity, index) => (
          <div key={activity} className="activity-fields">
            <h4>{activity}</h4>
            <div className="form-group">
              <label>
                Location:
                <input
                  type="text"
                  value={locations[index] || ""}
                  onChange={(e) => handleLocationChange(index, e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                Duration:
                <input
                  type="text"
                  value={durations[index] || ""}
                  onChange={(e) => handleDurationChange(index, e.target.value)}
                  required
                />
              </label>
            </div>
          </div>
        ))}

        <div className="form-group">
          <label>Available Dates:</label>
          {availableDates.map((date, index) => (
            <div key={index} className="date-input-group">
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => handleDateChange(index, e.target.value)}
                required
              />
              <button type="button" className="remove-date-button" onClick={() => removeDateInput(index)}>
                x
              </button>
            </div>
          ))}
          <button type="button" className="add-date-button" onClick={addDateInput}>
            +
          </button>
        </div>

        <div className="form-group">
          <label>
            Language of Tour:
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Price of Tour:
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Timeline:
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Directions:
            <input
              type="text"
              value={directions}
              onChange={(e) => setDirections(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Pickup Location:
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Dropoff Location:
            <input
              type="text"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Accessibility:
            <input
              type="checkbox"
              checked={accessibility}
              onChange={(e) => setAccessibility(e.target.checked)}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Activate:
            <input
              type="checkbox"
              checked={activate}
              onChange={(e) => setActivate(e.target.checked)}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Special:
            <input
              type="checkbox"
              checked={special}
              onChange={(e) => setSpecial(e.target.checked)}
            />
          </label>
        </div>

        <div className="form-group">
          <button type="submit" className="submit-button">
            Create Itinerary
          </button>
        </div>
      </form>
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
    
  );
};

export default CreateItinerary;
