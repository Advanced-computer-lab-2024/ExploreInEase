import React, { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
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
  const[imageUrl,setImageUrl]=useState('');
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
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { User } = location.state || {};
  console.log("User",User);
  
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
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]); // Save the selected file to state
  };
  
  console.log("setImage",Image);
  console.log("imagePreviews",imagePreviews);

  
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

    const formData = new FormData();

    formData.append("name", itineraryName);
    formData.append("activities", selectedActivityIds); // Array as a single index
    formData.append("locations", locations); // Array as a single index
    formData.append("timeline", timeline); // Array as a single index
    formData.append("directions", directions); // Array as a single index
    formData.append("language", language);
    formData.append("price", price);
    formData.append("dateTimeAvailable", availableDates); // Array as a single index
    formData.append("accessibility", accessibility);
    formData.append("pickupLocation", pickupLocation);
    formData.append("dropoffLocation", dropoffLocation);
    formData.append("isActivated", activate ? 1 : 0);
    formData.append("isSpecial", special ? true : false);
    formData.append("created_by", userId);
    formData.append("flag", 1);
    
    if (selectedImage) {
      formData.append("file", selectedImage); // File upload
    }
    

    // Make an API call to create the itinerary
    try{

      const response = await NetworkService.post({
        apiPath: '/itinerary',
        body: formData, // Correct key for sending data
        headers: {
          'Content-Type': 'multipart/form-data', // Ensures proper encoding for file uploads
        },
      });
      
      console.log(response);
      console.log("weslt henaa");

      const uploadedImageUrl = response.imageUrl;
      console.log("Image:  ",uploadedImageUrl);
      localStorage.setItem(`itinerary-image-${response.Itinerary._id}`, uploadedImageUrl);
      console.log(`itinerary-image-${response.Itinerary._id}`);
      console.log('Image uploaded successfully:', uploadedImageUrl);

      setSuccessMessage(response.message||"save Successfully!");
      console.log("weslt henaa");
      setShowSuccessMessage(true);
        console.log("weslt henaa123");
        
    }catch(error){
      console.log("d5alt henaa");
      
      setErrorMessage(error.response?.data?.message || 'An error occurred');
      setShowErrorMessage(true);
    }
  };
  
  return (
    <div >
      <div>
        <TourGuideHP/>
      </div>
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
          <FormControl sx={{  width: 470,height:35 }}>
            {/* <InputLabel id="activity-multiple-select-label">Activities</InputLabel> */}
            <Select
              labelId="activity-multiple-select-label"
              id="activity-multiple-select"
              multiple
              sx={{height:35}}
              value={selectedActivityNames}
              onChange={handleActivityChange}
              // input={<OutlinedInput label="Activities" />}
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
          <button type="button" className="add-date-button" onClick={addDateInput} > 
            +
          </button>
        </div>
        <div>
        <input
        accept="image/*"
        id="raised-button-file"
        type="file"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      {/* Label that triggers the input */}
      <label
        htmlFor="raised-button-file"
        style={{
          display: 'inline-block',
          padding: '5px 5px',
          backgroundColor: 'DarkBlue',
          color: '#fff',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        Upload Image
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
                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '14px 20px',
                        backgroundColor: 'Darkblue', // Updated color for a fresher look
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px', // Fixed typo and added smooth corners
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold', // Makes text bold for better readability
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow for depth
                        transition: 'background-color 0.3s ease, transform 0.2s ease', // Adds hover and click effects
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = 'Darkblue')} // Hover effect
                      onMouseOut={(e) => (e.target.style.backgroundColor = 'Darkblue')} // Revert hover effect
                      onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')} // Click effect
                      onMouseUp={(e) => (e.target.style.transform = 'scale(1)')} // Revert click effect
                    >
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
    </div>
  );
};

export default CreateItinerary;