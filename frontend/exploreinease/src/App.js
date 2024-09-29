import './App.css';
import AdminCard from './Shared/Components/AdminCard/adminsCard.js';
import GenericDialog from './Shared/Components/GenericDialog/genericDialog.js';
import React from 'react';
import GenericCard from './Shared/Components/UserCard/Usergenericcard.js';
// function App() {
//   return (
   
//       <AdminCard  title="Lizard"
//       description="Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica."
//       imageUrl="/static/images/cards/contemplative-reptile.jpg"/>
 
//   );
// }
const App = () => {
  const handleButtonClick = () => {
    alert('Button clicked!');
  };

  return (
    <div>
      <GenericCard
        title="Sample Title"
        title2="taso"
        subtitle="Sample Subtitle"
        image="https://via.placeholder.com/150"
        description="This is a sample description for the card."
        buttonLabel="Click Me"
        onButtonClick={handleButtonClick}
      />
    </div>
  );
};

export default App;
