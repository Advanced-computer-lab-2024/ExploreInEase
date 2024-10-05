import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import RoleSelection from './SignUp/RoleSelection.js'; // Import RoleSelection component
// import AdminCard from './Shared/Components/AdminCard/adminsCard.js';
import TourGuideProfile from './Shared/Components/TourGuideProfile/TourGuideProfile.js';
import AdvertiserProfile from './Shared/Components/advertiserProfile/advertiserProfile.js';
import SellerProfile from './Shared/Components/SellerProfile/sellerProfile.js';
import TouristProfile from './Shared/Components/TouristProfile/touristProfile.js';
import AdminUserProfiles from './Admin/adminUserProfiles.js';
import Tags from './TouristGovernor/tags.js';
import Preferencetags from './Admin/preferenceTags.js';
import ActivityCategory from './Admin/activityCategories.js';
import HistoricalPlaces from './TouristGovernor/historicPlaces.js';
import Activity from './Advertier/activities.js';
import Filter from './Shared/Components/Filter/Filter.js';
import AddUser from './Admin/AddUser.js';
import ItineraryForm from './TourGuide/Itinerary.js';
import MuseumList from './TouristGovernor/MuseumList.js';
import ActivityList from './Advertier/ActivityList.js';
import ItineraryList from './TourGuide/ItineraryList.js';
import GuestNavbar from "./Guest/GuestNavbar.js";
import AdminNavbar from './Admin/AdminNavbar.js';
import AdvertiserNavbar from "./Advertier/AdvertiserNavbar.js";
import TouristNavbar from './Tourist/TouristNavbar.js';
import SellerNavbar from './Seller/SellerNavbar.js';
import TourGuideNavbar from "./TourGuide/TourGuideNavbar.js";
import Product from "./Shared/Components/Product/Product.js";


const App = () => {

  const users = [
    {
      name: 'Shahd Fawzy',
      email: 'john1@example.com',
      role: 'Tour Guide',
      status: 'Active',
      mobileNumber: '123-456-7890',
      nationality: 'American',
      dateOfBirth: '1990-01-01',
      typeOfLifeLiving: 'Full-time',
    },
    {
      name: 'Sarrah El-Gazzar',
      email: 'jane2@example.com',
      role: 'Seller',
      status: 'Pending',
      mobileNumber: '987-654-3210',
      nationality: 'Canadian',
      dateOfBirth: '1985-05-05',
      typeOfLifeLiving: 'Part-time',
    },
    {
      name: 'Tasneem',
      email: 'jane3@example.com',
      role: 'Admin',
      status: 'Pending',
      mobileNumber: '987-654-3210',
      nationality: 'Canadian',
      dateOfBirth: '1985-05-05',
      typeOfLifeLiving: 'Part-time',
    },
    {
      name: 'Ali Hani',
      email: 'jane4@example.com',
      role: 'Tourist',
      status: 'Pending',
      mobileNumber: '987-654-3210',
      nationality: 'Canadian',
      dateOfBirth: '1985-05-05',
      typeOfLifeLiving: 'Part-time',
    },
    // Add more users as needed
  ];

  return (
    <Router>
      {/* Conditionally render the Navbar */}
      <Routes>
        {/* Set RoleSelection as the default route */}
        <Route path="/" element={<GuestNavbar />} />
        <Route path="/register" element={<RoleSelection/>} />
        <Route path="/explore" element={<Filter />} />
        <Route path="/viewProduct" element={<Product />} />
        <Route path="/viewTouristProfile" element={<TouristProfile />} />
        <Route path="/viewHistoricalPlaces" element={<HistoricalPlaces/>} />
        <Route path="/viewAllGovernorCreatedMuseum" element={<MuseumList/>} />
        <Route path="/viewHistoricalTags" element={<Tags/>} />
        <Route path="/viewSellerProfile" element={<SellerProfile/>} />
        <Route path="/viewAdvertiserProfile" element={<AdvertiserProfile/>} />
        <Route path="/viewAllCreatedActivities" element={<ActivityList/>} />
        <Route path="/viewTourGuideProfile" element={<TourGuideProfile/>} />
        <Route path="/viewCreatedItineraryList" element={<ItineraryList/>} />
        <Route path="/viewMyItinerary" element={<ItineraryForm/>} />
         <Route path="/viewActivityCategory'" element={<ActivityCategory/>} />
        <Route path="/viewPreferencatags" element={<Preferencetags/>} />
        <Route path="/viewAddedUsers" element={<AddUser/>} />
        <Route path="/viewAllUserProfiles" element={<AdminUserProfiles/>} />
        <Route path="/TouristHomePage" element={<TouristNavbar/>} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
//  <div>
//   <viewMyItinerary />
//  </div>
  );
};

export default App;
