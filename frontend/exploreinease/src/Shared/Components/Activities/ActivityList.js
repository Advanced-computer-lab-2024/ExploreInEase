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

const ActivityList = () => {
  const [activitiesData] = useState([
    {
      id: 1,
      date: "2024-10-01",
      time: "10:00 AM",
      location: { lat: 51.5074, lng: -0.1278 }, // London
      priceRange: "£50 - £100",
      category: "Tour",
      tags: ["Historical", "Outdoor"],
      specialDiscounts: "10% off for groups of 5 or more",
      isBookingOpen: true,
    },
    {
      id: 2,
      date: "2024-10-05",
      time: "2:00 PM",
      location: { lat: 48.8566, lng: 2.3522 }, // Paris
      priceRange: "£30 - £60",
      category: "Adventure",
      tags: ["Climbing", "Nature"],
      specialDiscounts: "15% off for early bookings",
      isBookingOpen: false,
    },
  ]);

  const [locationNames, setLocationNames] = useState({}); // State to store location names

  // Function to get place names from coordinates
  const getLocationName = async (lat, lng, id) => {
    const provider = new OpenStreetMapProvider();
    const result = await provider.search({ query: `${lat}, ${lng}` });
    if (result && result.length > 0) {
      setLocationNames((prev) => ({ ...prev, [id]: result[0].label })); // Save the location name
    }
  };

  // UseEffect to fetch location names
  useEffect(() => {
    activitiesData.forEach((activity) => {
      getLocationName(activity.location.lat, activity.location.lng, activity.id);
    });
  }, [activitiesData]);

  return (
    <div className="activity-list-container">
      <h2>Your Created Activities</h2>
      <div className="activity-cards">
        {activitiesData.map((activity) => (
          <div key={activity.id} className="activity-card">
            <div className="activity-header">
              <h3>{activity.category} Activity</h3>
              <p className="date-time">
                {activity.date} at {activity.time}
              </p>
            </div>
            <div className="activity-details">
              <p>
                <strong>Location:</strong> {locationNames[activity.id] || "Loading..."}
              </p>

              {/* Leaflet Map for each activity */}
              <MapContainer center={activity.location} zoom={12} style={{ height: "200px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={activity.location} icon={redMarkerIcon}>
                  <Popup>{locationNames[activity.id] || "Loading..."}</Popup>
                </Marker>
              </MapContainer>

              {/* GPS Link */}
              <p>
                <strong>GPS Link:</strong>{" "}
                <a
                  href={`https://www.openstreetmap.org/?mlat=${activity.location.lat}&mlon=${activity.location.lng}#map=12/${activity.location.lat}/${activity.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in OpenStreetMap
                </a>
              </p>

              <p><strong>Price Range:</strong> {activity.priceRange}</p>
              <p><strong>Tags:</strong> {activity.tags.join(", ")}</p>
              <p><strong>Special Discounts:</strong> {activity.specialDiscounts}</p>
              <p className={`booking-status ${activity.isBookingOpen ? "open" : "closed"}`}>
                <strong>Booking Status:</strong> {activity.isBookingOpen ? "Open" : "Closed"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;
