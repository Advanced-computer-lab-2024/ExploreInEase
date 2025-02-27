import './App.css'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { Suspense,useEffect } from 'react';
  
// Lazy load components
const ArchiveProduct = React.lazy(() => import("./Shared/Components/Product/ArchiveProduct"));
const TermsAcceptance = React.lazy(() => import('./TermsAcceptance'));
const ChangePassword=React.lazy(()=>import("./TouristGovernor/changePassword"))
const Signup = React.lazy(() => import('./SignUp/Signup'));
// const RoleSelection = React.lazy(() => import('./SignUp/RoleSelection'));
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
const CreateItinerary = React.lazy(() => import('./TourGuide/CreateItinerary'));
const GuestNavbar = React.lazy(() => import("./Guest/GuestNavbar"));
const AdvertiserNavbar = React.lazy(() => import("./Advertier/AdvertiserNavbar"));
const TouristNavbar = React.lazy(() => import('./Tourist/TouristNavbar'));
const SellerNavbar = React.lazy(() => import('./Seller/SellerNavbar'));
const TourGuideNavbar = React.lazy(() => import("./TourGuide/TourGuideNavbar"));
const GovernorNavbar = React.lazy(() => import("./TouristGovernor/GovernorNavbar"));
const Product = React.lazy(() => import("./Shared/Components/Product/Product"));
const SignIn = React.lazy(() => import("./Login/login"));
const TouristGovernorHP=React.lazy(()=>import("./TouristGovernor/GovernorNavbar"));
const Booked=React.lazy(()=>import("./Tourist/booked"));
const ProductPurchased= React.lazy(() => import("./Shared/Components/Product/PurchaseProduct"));
const Transportion= React.lazy(() => import("./Advertier/transportation"));
const BookTransportation= React.lazy(() => import("./Tourist/bookTransportation"));
const BookHotel= React.lazy(() => import("./Tourist/hotels"));
const BookFlight= React.lazy(() => import("./Tourist/flights"));
const Complaints = React.lazy(() => import('./Tourist/Complaints'));
const AdminSideMenu = React.lazy(() => import('./Admin/AdminSideMenu'));
const ResetPassword=React.lazy(()=>import('./Login/resetPassword'));
const GovernT=React.lazy(()=>import('./TouristGovernor/GovernorHomePage'));
const AdvertiserHP=React.lazy(()=>import('./Advertier/advertiserHomePage'));
const SellerHomePage =React.lazy(()=>import('./Seller/SellerHomePage'));
const TourGuideHomePage=React.lazy(()=>import('./TourGuide/GuideHomePage'));
const TouristHomePage=React.lazy(()=>import('./Tourist/touristHomePage'));
const Cart2=React.lazy(()=>import('./Tourist/cart2'));
const TourGuideReport = React.lazy(() => import('./Shared/Components/Reports/TouristsReport'));
const SalesReport = React.lazy(() => import('./Shared/Components/Reports/SalesReport'));
const OrderHistory = React.lazy(() => import('./Tourist/OrderHistory'));
const MyBookmarks = React.lazy(() => import('./Shared/MyBookmarks'));
const Events= React.lazy(() => import('./Guest/Events'));
const WishList= React.lazy(() => import('./Tourist/components/wishlist'));
const StepByStepGuide=React.lazy(() => import('../src/stepbystepGuide'));
const App = () => {
  useEffect(() => {
    document.title = 'ExploreInEase';
}, []);

  return (
    <Router>
      {/* Wrapping Routes with Suspense to handle loading */}
      <Suspense fallback={<div>Loading</div>}>
        <Routes>
          <Route path="/" element={<Events/>} />
          <Route path="/register" element={<Signup/>} />
          <Route path="/explore" element={<Filter/>} />
          <Route path="/viewProduct" element={<Product/>} />
          <Route path="/viewTouristProfile" element={<TouristProfile/>} />
          <Route path="/HistoricalPlaces" element={<HistoricalPlaces/>} />
          <Route path="/viewAllGovernorCreatedMuseum" element={<MuseumList/>} />
          <Route path="/viewHistoricalTags" element={<Tags/>} />
          <Route path="/viewSellerProfile" element={<SellerProfile/>} />
          <Route path="/viewAdvertiserProfile" element={<AdvertiserProfile/>} />
          <Route path="/viewAllCreatedActivities" element={<ActivityList/>} />
          <Route path="/viewTourGuideProfile" element={<TourGuideProfile/>} />
          <Route path="/viewCreatedItineraryList" element={<ItineraryList/>} />
          <Route path="/viewMyItinerary" element={<ItineraryForm/>} />
          <Route path="/CreateItinerary" element={<CreateItinerary/>} />
          <Route path="/viewActivityCategory" element={<ActivityCategory/>} />
          <Route path="/viewPreferencatags" element={<Preferencetags />} />
          <Route path="/viewAddedUsers" element={<AddUser/>} />
          <Route path="/viewAllUserProfiles" element={<AdminUserProfiles />} />
          <Route path="/TouristHomePage" element={<Filter />} />
          <Route path="/SellerHomePage" element={<SalesReport />} />
          <Route path="/TourGuideHomePage" element={<SalesReport />} />
          <Route path="/AdminHomePage" element={<AdminSideMenu/>} />
          <Route path="/AdvertiserNavbar" element={<AdvertiserNavbar/>} />
          <Route path="/GovernorHomePage" element={<HistoricalPlaces/>} />
          <Route path="/AdvertiserHomePage" element={<SalesReport/>}/>
          <Route path="/Activities" element={<Activity />} />
          <Route path="/Login" element={<SignIn />} />
          <Route path="/TouristGovernorHP" element={<TouristGovernorHP />} />
          <Route path="/AddUser" element={<AddUser />} />
          <Route path="/ViewListofBooked" element={<Booked />} />
          <Route path="/ViewPurchasedProduct" element={<ProductPurchased/>} />
          <Route path="/transportion" element={<Transportion/>} />
          <Route path="/BookTransportation" element={<BookTransportation/>} />
          <Route path="/BookHotel" element={<BookHotel/>} />
          <Route path="/BookFlight" element={<BookFlight/>} />
          <Route path="/Complaints" element={<Complaints />} />
          <Route path="/TermsAcceptance" element={<TermsAcceptance />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/unArchiveProduct" element={<ArchiveProduct />} />
          <Route path="/resetPassword" element={<ResetPassword/>}/>
          <Route path="/cart" element={<Cart2/>}/>
          <Route path="/TouristsReport" element={<TourGuideReport />} />
          <Route path="/SalesReport" element={<SalesReport />} />
          <Route path="/OrderHistory" element={<OrderHistory />} />
          <Route path="/myBookmarks" element={<MyBookmarks/>}/>
          <Route path="/Events" element={<Events/>}/>
          <Route path="/touristNavbar" element={<TouristNavbar/>}/>
          <Route path="/WishList" element={<WishList/>}/>
          <Route path="/stepbystepGuide" element={<StepByStepGuide/>}/>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
