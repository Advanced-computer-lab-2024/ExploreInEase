import './App.css';
import AdminCard from './Shared/Components/AdminCard/adminsCard.js';
import TourGuideProfile from './Shared/Components/TourGuideProfile/TourGuideProfile.js';
import AdvertiserProfile from './Shared/Components/advertiserProfile/advertiserProfile.js';
import SellerProfile from './Shared/Components/SellerProfile/sellerProfile.js';
import TouristProfile from './Shared/Components/TouristProfile/touristProfile.js';
import AdminUserProfiles from './Admin/adminUserProfiles.js'


  const App = () => {
    const users = [
        {
            name: 'Shahd Fawzy',
            email: 'john@example.com',
            role: 'Tour Guide',
            status: 'Active',
            mobileNumber: '123-456-7890',
            nationality: 'American',
            dateOfBirth: '1990-01-01',
            typeOfLifeLiving: 'Full-time',
        },
        {
            name: 'Sarrah El-Gazzar',
            email: 'jane@example.com',
            role: 'Seller',
            status: 'Pending',
            mobileNumber: '987-654-3210',
            nationality: 'Canadian',
            dateOfBirth: '1985-05-05',
            typeOfLifeLiving: 'Part-time',
        },
        {
          name: 'Tasneem',
          email: 'jane@example.com',
          role: 'Admin',
          status: 'Pending',
          mobileNumber: '987-654-3210',
          nationality: 'Canadian',
          dateOfBirth: '1985-05-05',
          typeOfLifeLiving: 'Part-time',
      },
      {
        name: 'Ali Hani',
        email: 'jane@example.com',
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
   <div>
      {/* <AdminCard  title="Lizard"
      description="Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica."
      imageUrl="/static/images/cards/contemplative-reptile.jpg"/> */}
      {/* <TourGuideProfile username='Shahd Mohamed' email='shahd@gmail.com' password="Ss123456!" mobileNumber="01027556612" yearExp="5" prevWork="previous work is a lot" /> */}
      <SellerProfile/>
 </div>
  );
}

export default App;
