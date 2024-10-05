// src/Shared/Components/Activities/ActivityList.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Import React Leaflet components
import { OpenStreetMapProvider } from 'leaflet-geosearch'; // Import geocoding provider
import L from "leaflet"; // Import Leaflet
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "./ActivityList.css"; // Import the CSS for styling

// Custom red marker icon
const redMarkerIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Map_marker_icon_red.svg/1024px-Map_marker_icon_red.svg.png",
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Anchor point of the icon
  popupAnchor: [1, -34], // Popup anchor point
});

const ActivityList = ({ userId }) => { // Pass userId as a prop
  const [activitiesData] = useState([
    {
      name: "London Historical Tour",
      created_at:"",
      location: "London",
      price: 50, 
      category: "Tour",
      tags: ["Historical", "Outdoor"],
      specialDiscounts: ["10% off for groups of 5 or more"],
      createdBy: "John Doe", // Assume this matches userId
      isOpen: true,
    },
    {
      name: "Paris Climbing Adventure",
      created_at:"",
      location: "Paris",
      price: 30, 
      category: "Adventure",
      tags: ["Climbing", "Nature"],
      specialDiscounts: ["15% off for early bookings", "5% off for students"],
      createdBy: "Jane Smith", // Different advertiser
      isOpen: false,
    },
  ]);

  const [locationNames, setLocationNames] = useState({}); // State to store location names

  // Function to get place names (for Leaflet map)
  const getLocationName = async (location, activityName) => {
    const provider = new OpenStreetMapProvider();
    const result = await provider.search({ query: location });
    if (result && result.length > 0) {
      setLocationNames((prev) => ({ ...prev, [activityName]: result[0].label }));
    }
  };

  // UseEffect to fetch location names
  useEffect(() => {
    activitiesData.forEach((activity) => {
      getLocationName(activity.location, activity.name);
    });
  }, [activitiesData]);

  // Filter activities created by the user (using userId)
  const userActivities = activitiesData.filter(activity => activity.createdBy === userId);

  return (
    <div className="activity-list-container">
      <h2>Your Created Activities</h2>
      <div className="activity-cards">
        {userActivities.length > 0 ? (
          userActivities.map((activity) => (
            <div key={activity.name} className="activity-card">
              <div className="activity-header">
                <h3>{activity.name}</h3>
                <p className="date-time">
                  {activity.created_at}
                </p>
              </div>
              <div className="activity-details">
                <p><strong>Location:</strong> {activity.location}</p>

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

                <p><strong>Price:</strong> £{activity.price}</p>
                <p><strong>Tags:</strong> {activity.tags.join(", ")}</p>
                <p><strong>Special Discounts:</strong> {activity.specialDiscounts.join(", ")}</p>
                <p className={`booking-status ${activity.isOpen ? "open" : "closed"}`}>
                  <strong>Booking Status:</strong> {activity.isOpen ? "Open" : "Closed"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No activities created by you.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
