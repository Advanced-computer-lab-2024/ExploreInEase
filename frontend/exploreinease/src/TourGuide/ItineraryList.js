// src/Shared/Components/ItineraryList.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Import React Leaflet components
import { OpenStreetMapProvider } from 'leaflet-geosearch'; // Import geocoding provider
import { useLocation } from "react-router-dom";
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

const ItineraryList = () => {
  const location=useLocation();
  // const TourGuideItinerary=location.useState()||'';
  // console.log(TourGuideItinerary);
  
  const [itinerariesData]=useState([]);

  // const [itinerariesData] = useState([
  //   {
  //     id: 1,
  //     title: "Historical London Tour",
  //     activities: [
  //       {
  //         name: "Visit the Tower of London",
  //         location: { lat: 51.5081, lng: -0.0759 },
  //         duration: "2 hours",
  //         language: "English",
  //       },
  //       {
  //         name: "Walk through Westminster",
  //         location: { lat: 51.4995, lng: -0.1248 },
  //         duration: "1 hour",
  //         language: "English",
  //       },
  //     ],
  //     timeline: "10:00 AM - 1:00 PM",
  //     price: "£100",
  //     availableDates: ["2024-10-01", "2024-10-02"],
  //     accessibility: "Wheelchair accessible",
  //     pickupLocation: "Central London",
  //     dropOffLocation: "Central London",
  //   },
  //   {
  //     id: 2,
  //     title: "Paris Adventure Tour",
  //     activities: [
  //       {
  //         name: "Explore the Eiffel Tower",
  //         location: { lat: 48.8584, lng: 2.2941 },
  //         duration: "1.5 hours",
  //         language: "French",
  //       },
  //       {
  //         name: "Seine River Cruise",
  //         location: { lat: 48.8566, lng: 2.3522 },
  //         duration: "1 hour",
  //         language: "French",
  //       },
  //     ],
  //     timeline: "2:00 PM - 5:00 PM",
  //     price: "€120",
  //     availableDates: ["2024-10-05", "2024-10-06"],
  //     accessibility: "Not wheelchair accessible",
  //     pickupLocation: "Eiffel Tower",
  //     dropOffLocation: "Louvre Museum",
  //   },
  // ]);

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
    itinerariesData.forEach((itinerary) => {
      itinerary.activities.forEach((activity) => {
        getLocationName(activity.location.lat, activity.location.lng, activity.name);
      });
    });
  }, [itinerariesData]);

  return (
    <div className="itinerary-list-container">
      <h2>Your Created Itineraries</h2>
      <div className="itinerary-cards">
        {itinerariesData.map((itinerary) => (
          <div key={itinerary.id} className="itinerary-card">
            <h3>{itinerary.title}</h3>
            <p><strong>Timeline:</strong> {itinerary.timeline}</p>
            <p><strong>Price:</strong> {itinerary.price}</p>
            <p><strong>Available Dates:</strong> {itinerary.availableDates.join(", ")}</p>
            <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
            <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
            <p><strong>Drop Off Location:</strong> {itinerary.dropOffLocation}</p>

            <h4>Activities:</h4>
            {itinerary.activities.map((activity, index) => (
              <div key={index} className="activity-detail">
                <p><strong>Activity:</strong> {activity.name}</p>
                <p><strong>Duration:</strong> {activity.duration}</p>
                <p><strong>Language:</strong> {activity.language}</p>
                
                {/* Leaflet Map for each activity */}
                <MapContainer center={activity.location} zoom={12} style={{ height: "200px", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={activity.location} icon={redMarkerIcon}>
                    <Popup>{locationNames[activity.name] || "Loading..."}</Popup>
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
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryList;