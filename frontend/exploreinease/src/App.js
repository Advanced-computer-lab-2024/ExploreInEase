import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Fix marker icon issues in Leaflet when used with React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker({ setLocation }) {
  const [position, setPosition] = useState(null);

  // This handles the map click event
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      // Update the Google Maps link with the selected lat/lng
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
      setLocation(googleMapsUrl);
    },
  });

  // Render the marker at the selected position
  return position ? <Marker position={position}></Marker> : null;
}

function App() {
  const [locationUrl, setLocationUrl] = useState('');

  return (
    <div>
      <h2>Please Pin Your Organization/Clinic Location & Attach the selected location link in the Address Field below.</h2>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker setLocation={setLocationUrl} />
      </MapContainer>
      <div id="location-info">
        <h3>Selected Location:</h3>
        <p id="selected-location">
          {locationUrl ? (
            <a href={locationUrl} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
          ) : (
            'Click on the map to select a location.'
          )}
        </p>
      </div>
    </div>
  );
}

export default App
