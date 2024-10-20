import React, { useEffect, useState } from "react";
import Select from 'react-select';
import NetworkService from "../NetworkService";
import "./CreateItinerary.css"; // Import your CSS for styling

const CreateItinerary = ({ userId }) => {
  const [itineraryName, setItineraryName] = useState("");
  const [activities, setActivities] = useState([]); // List of activities
  const [selectedActivities, setSelectedActivities] = useState([]); // Selected activities
  const [locations, setLocations] = useState([]); // Store locations for activities
  const [durations, setDurations] = useState([]); // Store durations for activities
  const [language, setLanguage] = useState("");
  const [price, setPrice] = useState("");
  const [availableDates, setAvailableDates] = useState([]); // Store selected dates
  const [accessibility, setAccessibility] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [timeline, setTimeline] = useState("");
  const [directions, setDirections] = useState("");
  const [activate, setActivate] = useState(false); // Change to boolean state
  const [special, setSpecial] = useState(false); // Change to boolean state
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track if the dropdown is open

  // Fetch activities from backend on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      const response = await NetworkService.get({ apiPath: '/getAllActivities' });
      const formattedActivities = response.map(activity => ({
        value: activity.id,
        label: activity.name, // Ensure this is the correct property for activity name
      }));
      setActivities(formattedActivities); // Set formatted activities
    };

    fetchActivities();
  }, []);

  // Handle selection of activities
  const handleActivityChange = (selectedOptions) => {
    const newSelectedActivities = selectedOptions || [];
    setSelectedActivities(newSelectedActivities);
    
    // Update locations and durations based on the new selected activities
    const updatedLocations = Array(newSelectedActivities.length).fill("");
    const updatedDurations = Array(newSelectedActivities.length).fill("");
    
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
      userId,
      name: itineraryName,
      activities: selectedActivities.map(activity => activity.value), // Extracting activity values
      locations,
      durations,
      language,
      price,
      availableDates,
      accessibility,
      pickupLocation,
      dropoffLocation,
      timeline,
      directions,
      isActivated: activate ? 1 : 0,
      isSpecial: special ? true: false,
      createdBy: userId,
      flag: 1,
    };

    // Make an API call to create the itinerary
    const response = await NetworkService.post({ apiPath: '/itinerary', body: itineraryData });
    console.log(response);
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
          <label>
            Select Activities:
            <Select
              isMulti
              options={activities.filter(activity => 
                !selectedActivities.some(selected => selected.value === activity.value)
              )}
              onChange={handleActivityChange}
              onMenuOpen={() => setIsMenuOpen(true)} // Open the menu
              onMenuClose={() => setIsMenuOpen(false)} // Close the menu
              menuIsOpen={isMenuOpen} // Control the visibility of the menu
              className="react-select"
              classNamePrefix="select"
              placeholder="Choose activities..."
              required
            />
          </label>
        </div>

        {/* Dynamically generate fields based on selected activities */}
        {selectedActivities.map((activity, index) => (
            <div key={activity.value} className="activity-fields">
                <h4>{activity.label}</h4>
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
            <div key={date + index} className="date-input-group"> {/* Use a combination of date and index as key */}
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
            Drop Off Location:
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

        <button type="submit" className="submit-button">
          Create Itinerary
        </button>
      </form>
    </div>
  );
};

export default CreateItinerary;
