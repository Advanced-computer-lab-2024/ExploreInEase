// src/App.js
import React from 'react';
import ActivityList from './Shared/Components/Activities/ActivityList'; // Import ActivityList
//import ItineraryList from './Shared/Components/ItineraryList.js';
// import 'ItineraryList.css';
import ItineraryList from './Shared/Components/ItineraryList';
import './Shared/Components/ItineraryList.css'; // Ensure this path is correct
import MuseumList from './Shared/Components/MuseumList'; // Ensure this path is correct
import GuestHP from './Shared/Components/GuestHP';
import TourGuideHP from './Shared/Components/TourGuideHP';
import GenericCard from './Shared/Components/UserCard/Usergenericcard'
import RoleSelection from './Shared/Components/RoleSelection/RoleSelection';

const App = () => {
  return (
    <div>
    
      <MuseumList />
    </div>
  );
};

export default App;