// src/Shared/Components/ItineraryList.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Import React Leaflet components
import { OpenStreetMapProvider } from 'leaflet-geosearch'; // Import geocoding provider
import L from "leaflet"; // Import Leaflet
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "./ItineraryList.css"; // Import the CSS for styling

// Custom red marker icon
const redMarkerIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Map_marker_icon_red.svg/1024px-Map_marker_icon_red.svg.png",
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Anchor point of the icon
  popupAnchor: [1, -34], // Popup anchor point
});

const ItineraryList = ({ userId }) => { // Pass userId as a prop
  const [itinerariesData, setItinerariesData] = useState([
    {
      _id: 1,
      userId: 1,
      name: "Historical London Tour",
      activities: [
        {
          activityId:"",
          name: "Visit the Tower of London",
          location: "Tower of London", // Changed to string
          duration: "2 hours",
          language: "English",
        },
        {
          activityId:"",
          name: "Walk through Westminster",
          location: "Westminster, London", // Changed to string
          duration: "1 hour",
          language: "English",
        },
      ],
      timeline: "10:00 AM - 1:00 PM",
      price: 100, // Changed to int
      availableDates: ["2024-10-01", "2024-10-02"],
      accessibility: "Wheelchair accessible",
      pickupLocation: "Central London",
      dropOffLocation: "Central London",
      createdBy: "John Doe", // New attribute added
    },
    {
      _id: 2,
      userId: 2,
      name: "Paris Adventure Tour",
      activities: [
        {
          activityId:"",
          name: "Explore the Eiffel Tower",
          location: "Eiffel Tower, Paris", // Changed to string
          duration: "1.5 hours",
          language: "French",
        },
        {
          activityId:"",
          name: "Seine River Cruise",
          location: "Seine River, Paris", // Changed to string
          duration: "1 hour",
          language: "French",
        },
      ],
      timeline: "2:00 PM - 5:00 PM",
      price: 120, // Changed to int
      availableDates: ["2024-10-05", "2024-10-06"],
      accessibility: "Not wheelchair accessible",
      pickupLocation: "Eiffel Tower",
      dropOffLocation: "Louvre Museum",
      createdBy: "Jane Smith", // New attribute added
    },
  ]);

  const [locationNames, setLocationNames] = useState({}); // State to store location names

  // Function to get place names from the location string
  const getLocationName = async (location, _id) => {
    const provider = new OpenStreetMapProvider();
    const result = await provider.search({ query: location });
    if (result && result.length > 0) {
      setLocationNames((prev) => ({ ...prev, [_id]: result[0].label })); // Save the location name
    }
  };

  // UseEffect to fetch location names
  useEffect(() => {
    itinerariesData.forEach((itinerary) => {
      itinerary.activities.forEach((activity) => {
        getLocationName(activity.location, activity.name);
      });
    });
  }, [itinerariesData]);

  // Filter itineraries by userId
  const userItineraries = itinerariesData.filter(itinerary => itinerary.userId === userId);

  return (
    <div className="itinerary-list-container">
      <h2>Your Created Itineraries</h2>
      <div className="itinerary-cards">
        {userItineraries.length > 0 ? (
          userItineraries.map((itinerary) => (
            <div key={itinerary._id} className="itinerary-card">
              <h3>{itinerary.name}</h3>
              <p><strong>Timeline:</strong> {itinerary.timeline}</p>
              <p><strong>Price:</strong> £{itinerary.price}</p>
              <p><strong>Available Dates:</strong> {itinerary.availableDates.join(", ")}</p>
              <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
              <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
              <p><strong>Drop Off Location:</strong> {itinerary.dropOffLocation}</p>
              <p><strong>Created By:</strong> {itinerary.createdBy}</p> {/* New field */}

              <h4>Activities:</h4>
              {itinerary.activities.map((activity, index) => (
                <div key={index} className="activity-detail">
                  <p><strong>Activity:</strong> {activity.name}</p>
                  <p><strong>Duration:</strong> {activity.duration}</p>
                  <p><strong>Language:</strong> {activity.language}</p>
                  <p><strong>Location:</strong> {activity.location}</p> {/* Display location as string */}

                  {/* Leaflet Map for each activity */}
                  <MapContainer center={{ lat: 51.5074, lng: -0.1278 }} zoom={12} style={{ height: "200px", width: "100%" }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={{ lat: 51.5074, lng: -0.1278 }} icon={redMarkerIcon}>
                      <Popup>{activity.location}</Popup>
                    </Marker>
                  </MapContainer>

                  {/* GPS Link */}
                  <p>
                    <strong>GPS Link:</strong>{" "}
                    <a
                      href={`https://www.openstreetmap.org/search?query=${activity.location}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in OpenStreetMap
                    </a>
                  </p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No itineraries found for this tour guide.</p>
        )}
      </div>
    </div>
  );
};

export default ItineraryList;