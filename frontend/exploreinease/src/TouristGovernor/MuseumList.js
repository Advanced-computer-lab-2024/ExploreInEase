// src/Shared/Components/MuseumList.js
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Import Leaflet components
import L from "leaflet"; // Import Leaflet
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "./MuseumList.css"; // Add custom styles here

// Custom red marker icon
const redMarkerIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Map_marker_icon_red.svg/1024px-Map_marker_icon_red.svg.png",
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Anchor point of the icon
  popupAnchor: [1, -34], // Popup anchor point
});

const museumsData = [
  {
    id: 1,
    name: "National Museum of History",
    description: "Explore artifacts from the past.",
    image: "https://via.placeholder.com/300",
    location: {
      address: "123 History St",
      city: "London",
      county: "Greater London", // Include county
      country: "UK",
    },
    openingHours: "10:00 AM - 5:00 PM",
    ticketPrices: {
      foreigner: "£15",
      native: "£10",
      student: "£7",
    },
    additionalDetails: "This museum houses a vast collection of historical artifacts from around the world.",
    coordinates: { lat: 51.505, lng: -0.09 },
  },
  {
    id: 2,
    name: "Art Gallery of Modern Art",
    description: "Discover contemporary artworks.",
    image: "https://via.placeholder.com/300",
    location: {
      address: "456 Art Ave",
      city: "London",
      county: "Greater London", // Include county
      country: "UK",
    },
    openingHours: "11:00 AM - 6:00 PM",
    ticketPrices: {
      foreigner: "£20",
      native: "£15",
      student: "£10",
    },
    additionalDetails: "The gallery features rotating exhibitions of modern art and photography.",
    coordinates: { lat: 51.507, lng: -0.08 },
  },
  // Add more museum data as needed
];

const MuseumList = () => {
  const [open, setOpen] = useState(false);
  const [selectedMuseum, setSelectedMuseum] = useState(null);

  const handleClickOpen = (museum) => {
    setSelectedMuseum(museum);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMuseum(null);
  };

  return (
    <div className="museum-list-container">
      <h2>Explore Museums and Historical Places</h2>
      <Grid container spacing={3}>
        {museumsData.map((museum) => (
          <Grid item xs={12} sm={6} md={4} key={museum.id}>
            <Card className="museum-card">
              <CardMedia
                component="img"
                alt={museum.name}
                height="200"
                image={museum.image}
                sx={{ borderRadius: "16px 16px 0 0" }} // Rounded corners for the image
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold", color: "#333" }}>
                  {museum.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {museum.description}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>Location:</strong> {museum.location.address}, {museum.location.city}, {museum.location.county}, {museum.location.country}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>Opening Hours:</strong> {museum.openingHours}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>Ticket Prices:</strong>
                  <ul>
                    <li>Foreigner: {museum.ticketPrices.foreigner}</li>
                    <li>Native: {museum.ticketPrices.native}</li>
                    <li>Student: {museum.ticketPrices.student}</li>
                  </ul>
                </Typography>
                <Button variant="contained" color="primary" onClick={() => handleClickOpen(museum)} sx={{ marginTop: 2 }}>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for showing additional details */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{selectedMuseum?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            {selectedMuseum?.additionalDetails}
          </Typography>

          {/* Render map only if selectedMuseum is defined */}
          {selectedMuseum && selectedMuseum.coordinates && (
            <MapContainer center={selectedMuseum.coordinates} zoom={13} style={{ height: "300px", width: "100%", marginTop: '20px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={selectedMuseum.coordinates} icon={redMarkerIcon}>
                <Popup>{selectedMuseum.name}</Popup>
              </Marker>
            </MapContainer>
          )}
          
          {/* GPS Link */}
          {selectedMuseum && selectedMuseum.coordinates && (
            <Typography variant="body2" color="text.primary" sx={{ marginTop: '10px' }}>
              <strong>GPS Link:</strong>{" "}
              <a
                href={`https://www.openstreetmap.org/?mlat=${selectedMuseum.coordinates.lat}&mlon=${selectedMuseum.coordinates.lng}#map=12/${selectedMuseum.coordinates.lat}/${selectedMuseum.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in OpenStreetMap
              </a>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MuseumList;