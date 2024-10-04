// src/App.js
import React from 'react';
import ActivityList from './Shared/Components/Activities/ActivityList'; // Import ActivityList
//import ItineraryList from './Shared/Components/ItineraryList.js';
// import 'ItineraryList.css';
import ItineraryList from './Shared/Components/ItineraryList';
import './Shared/Components/ItineraryList.css'; // Ensure this path is correct
import MuseumList from './Shared/Components/MuseumList'; // Ensure this path is correct
import GuestHP from './Shared/Components/GuestHP';

const App = () => {
  return (
    <div>
    
      <GuestHP />
    </div>
  );
};

export default App;