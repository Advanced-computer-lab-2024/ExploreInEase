// import './App.css';
// import AdminCard from './Shared/Components/AdminCard/adminsCard.js';
// import GenericDialog from './Shared/Components/GenericDialog/genericDialog.js';
// //import React from 'react';
// import React, { useState } from 'react'; // Fix for useState error
// import GenericCard from './Shared/Components/UserCard/Usergenericcard.js';
// import AddUser from "./Shared/Components/admin/AddUser.js";
// import ActivityList from "./Shared/Components/Activities/ActivityList.js";
// import "./Shared/Components/Activities/ActivityList.css"; // Importing the CSS
// import TouristSignUp from './Shared/Components/RegisterForms/TouristSignup.js';
// import GuideAdvertiserSignUp from './Shared/Components/RegisterForms/GuideAdvertiserSignUp.js';
// import './App.css'; // Optional CSS for styling

// // function App() {S
// //   return (
   
// //       <AdminCard  title="Lizard"
// //       description="Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica."
// //       imageUrl="/static/images/cards/contemplative-reptile.jpg"/>
 
// //   );
// // }
// //const App = () => {
//   // const handleButtonClick = () => {
//   //   alert('Button clicked!');
//   // };

//   // return (
//   //   <div>
//   //     <GenericCard
//   //       title="Sample Title"
//   //       title2="taso"
//   //       subtitle="Sample Subtitle"
//   //       image="https://via.placeholder.com/150"
//   //       description="This is a sample description for the card."
//   //       buttonLabel="Click Me"
//   //       onButtonClick={handleButtonClick}
//   //     />
//   //   </div>
//   // );
//   // return (
//   //   <div className="App">
//   //     <AddUser />
//   //   </div>
//   // );
//   // return (
//   //   <div className="App">
//   //     <ActivityList />
//   //   </div>
//   // );
  
//   function App() {
//     const [role, setRole] = useState(''); // No initial role selected
  
//     const handleRoleChange = (selectedRole) => {
//       setRole(selectedRole);
//     };
  


//    return (
//     <div className="App">
//       <div className="form-container"> 
//         <h1>Sign Up</h1>
        
//         {/* Buttons for role selection */}
//         <div className="button-group">
//           <button className={`role-button ${role === 'tourist' ? 'active' : ''}`} onClick={() => handleRoleChange('tourist')}>
//             Register as Tourist
//           </button>
//           <button className={`role-button ${role === 'guideAdvertiser' ? 'active' : ''}`} onClick={() => handleRoleChange('guideAdvertiser')}>
//             Register as Guide / Advertiser / Seller
//           </button>
//         </div>
        
//         {/* Conditionally render the form based on the selected role */}
//         {role && (
//           <div className="form-content">
//             {role === 'tourist' ? <TouristSignUp /> : <GuideAdvertiserSignUp />}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
import './App.css'; // Import your CSS for styling
import React, { useState } from 'react';
import TouristSignUp from './Shared/Components/RegisterForms/TouristSignup.js';
import GuideAdvertiserSignUp from './Shared/Components/RegisterForms/GuideAdvertiserSignUp.js';

function App() {
  const [role, setRole] = useState(''); // No initial role selected

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>Sign Up</h1>
        
        {/* Buttons for role selection */}
        <div className="button-group">
          <button className={`role-button ${role === 'tourist' ? 'active' : ''}`} onClick={() => handleRoleChange('tourist')}>
            Register as Tourist
          </button>
          <button className={`role-button ${role === 'guideAdvertiser' ? 'active' : ''}`} onClick={() => handleRoleChange('guideAdvertiser')}>
            Register as Guide / Advertiser / Seller
          </button>
        </div>
        
        {/* Conditionally render the form based on the selected role */}
        {role && (
          <div className="form-content">
            {role === 'tourist' ? <TouristSignUp /> : <GuideAdvertiserSignUp />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
