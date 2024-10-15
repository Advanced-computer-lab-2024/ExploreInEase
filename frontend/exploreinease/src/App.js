import './App.css'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
  
// Lazy load components
const RoleSelection = React.lazy(() => import('./SignUp/RoleSelection'));
const TourGuideProfile = React.lazy(() => import('./Shared/Components/TourGuideProfile/TourGuideProfile'));
const AdvertiserProfile = React.lazy(() => import('./Shared/Components/advertiserProfile/advertiserProfile'));
const SellerProfile = React.lazy(() => import('./Shared/Components/SellerProfile/sellerProfile'));
const TouristProfile = React.lazy(() => import('./Shared/Components/TouristProfile/touristProfile'));
const AdminUserProfiles = React.lazy(() => import('./Admin/adminUserProfiles'));
const Tags = React.lazy(() => import('./TouristGovernor/tags'));
const Preferencetags = React.lazy(() => import('./Admin/preferenceTags'));
const ActivityCategory = React.lazy(() => import('./Admin/activityCategories'));
const HistoricalPlaces = React.lazy(() => import('./TouristGovernor/historicPlaces'));
const Activity = React.lazy(() => import('./Advertier/activities'));
const Filter = React.lazy(() => import('./Shared/Components/Filter/Filter'));
const AddUser = React.lazy(() => import('./Admin/AddUser'));
const ItineraryForm = React.lazy(() => import('./TourGuide/Itinerary'));
const MuseumList = React.lazy(() => import('./TouristGovernor/MuseumList'));
const ActivityList = React.lazy(() => import('./Advertier/ActivityList'));
const ItineraryList = React.lazy(() => import('./TourGuide/ItineraryList'));
const GuestNavbar = React.lazy(() => import("./Guest/GuestNavbar"));
const AdminNavbar = React.lazy(() => import('./Admin/AdminNavbar'));
const AdvertiserNavbar = React.lazy(() => import("./Advertier/AdvertiserNavbar"));
const TouristNavbar = React.lazy(() => import('./Tourist/TouristNavbar'));
const SellerNavbar = React.lazy(() => import('./Seller/SellerNavbar'));
const TourGuideNavbar = React.lazy(() => import("./TourGuide/TourGuideNavbar"));
const Product = React.lazy(() => import("./Shared/Components/Product/Product"));
const GovernorNavbar = React.lazy(() => import("./TouristGovernor/GovernorNavbar"));
const SignIn = React.lazy(() => import("./Login/login"));
const AdminHomePage=React.lazy(()=>import("./Admin/AdminNavbar"))
const TouristGovernorHP=React.lazy(()=>import("./TouristGovernor/GovernorNavbar"))

const App = () => {

  return (
    <Router>
      {/* Wrapping Routes with Suspense to handle loading */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<GuestNavbar />} />
          <Route path="/register" element={<RoleSelection />} />
          <Route path="/explore" element={<Filter />} />
          <Route path="/viewProduct" element={<Product />} />
          <Route path="/viewTouristProfile" element={<TouristProfile />} />
          <Route path="/" element={<HistoricalPlaces />} />
          <Route path="/viewAllGovernorCreatedMuseum" element={<MuseumList />} />
          <Route path="/viewHistoricalTags" element={<Tags />} />
          <Route path="/viewSellerProfile" element={<SellerProfile />} />
          <Route path="/viewAdvertiserProfile" element={<AdvertiserProfile />} />
          <Route path="/viewAllCreatedActivities" element={<ActivityList />} />
          <Route path="/viewTourGuideProfile" element={<TourGuideProfile />} />
          <Route path="/viewCreatedItineraryList" element={<ItineraryList />} />
          <Route path="/viewMyItinerary" element={<ItineraryForm />} />
          <Route path="/viewActivityCategory" element={<ActivityCategory />} />
          <Route path="/viewPreferencatags" element={<Preferencetags />} />
          <Route path="/viewAddedUsers" element={<AddUser />} />
          <Route path="/viewAllUserProfiles" element={<AdminUserProfiles />} />
          <Route path="/TouristHomePage" element={<TouristNavbar />} />
          <Route path="/SellerHomePage" element={<SellerNavbar />} />
          <Route path="/TourGuideHomePage" element={<TourGuideNavbar />} />
          <Route path="/AdminHomePage" element={<AdminNavbar />} />
          <Route path="/AdvertiserHomePage" element={<AdvertiserNavbar />} />
          <Route path="/GovernorHomePage" element={<GovernorNavbar />} />
          <Route path="/Activities" element={<Activity />} />
          <Route path="/Login" element={<SignIn />} />
          <Route path="/AdminHomePage" element={<AdminHomePage />} />
          <Route path="/TouristGovernorHP" element={<TouristGovernorHP />} />
          <Route path="/AddUser" element={<AddUser />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
