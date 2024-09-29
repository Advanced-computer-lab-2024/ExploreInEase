import './App.css';
import AdminCard from './Shared/Components/AdminCard/adminsCard.js';
import GenericDialog from './Shared/Components/GenericDialog/genericDialog.js';
function App() {
  return (
   
      <AdminCard  title="Lizard"
      description="Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica."
      imageUrl="/static/images/cards/contemplative-reptile.jpg"/>
 
  );
}

export default App;
