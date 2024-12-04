// src/Shared/Components/GuestHP.js
import React ,{useState}from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; 
import HomePageLogo from '../HomePageLogo.png';
import List from '@mui/material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { Alert } from '@mui/material'; 
import LockIcon from '@mui/icons-material/Lock';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; 

const GovernorNavbar = () => {
  const Userr = JSON.parse(localStorage.getItem('User'));
   const navigate = useNavigate();
   const location = useLocation();
   const { state } = location;
   const tourist = state?.tourist || Userr;    
   const [showSuccessMessage ] = useState(false);
   const [showErrorMessage ] = useState(false);
   const [errorMessage] = useState('');
   const [successMessage] = useState('');
   const [drawerOpen, setDrawerOpen] = useState(false);
   const initialUsername = tourist?.username;
   const governorId=tourist?._id;
   const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
   console.log(governorId);
   const avatarImage="";
   async function handleRegisterClick(title) {
      if (title==="Create Historical Locations Tags") {
         navigate(`/viewHistoricalTags`,{state:{governorId}});          
      }
      else if (title === 'changePassword') {
       navigate('/change-password', { state: { userId: governorId } });;
    } else if (title === 'logout') {
       navigate('/');
    }
     else {
       try{
           const options = 
           {
             apiPath: `/historical-places/${governorId}/allHistoricalPlaces`,
           };
           const response1 = await NetworkService.get(options);
           // setSuccess(response.message); // Set success message
           const response = response1.filter(item=>item.created_by.toString()===governorId);
           navigate(`/HistoricalPlaces`,{state:{governorId,response}});   
         } 
       catch {
         console.log('An unexpected error occurred.'); // Generic error message
       }       
     }
     };

     
     const toggleDrawer = (open) => () => {
       setDrawerOpen(open);
   };
 return (
   <div>
     <nav className="navbar">
       <div className="logo-container">
         <img
           src={HomePageLogo} // Use the imported logo
           alt="ExploreInEase Logo"
           className="logo"
         />
         <span className="website-name">ExploreInEase</span>
       </div>
    


               <IconButton 
              onClick={toggleDrawer(true)} 
              className="menu-button" 
              style={{ 
                position: 'absolute', 
                right: '40px', 
                color: 'white',      // Icon color
                backgroundColor: '#3f51b5' // Background color
              }}
                >
 <MenuIcon />
</IconButton>
</nav>
<Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} style={{width: drawerOpen ? '700px' : '300px'}}>
         <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
             <Avatar sx={{ bgcolor: 'darkblue', color: 'white' }} src={avatarImage || undefined}>
                 {avatarImage ? '' : firstInitial}
             </Avatar>
             <Typography variant="h6" style={{ marginLeft: '10px' }}>{tourist.username}</Typography>
         </div>
         <Divider />
         <List>
 <Typography variant="h6" style={{ padding: '8px 16px' }}><strong>Account</strong></Typography>
 <ListItem button onClick={() => handleRegisterClick('changePassword')}>
   <ListItemIcon style={{ minWidth: '0px', marginRight: '8px' }}>
     <LockIcon fontSize="small" />
   </ListItemIcon>
   <ListItemText primary="Change Password" />
 </ListItem>
 <ListItem button onClick={() => handleRegisterClick('logout')}>
   <ListItemIcon style={{ minWidth: '0px', marginRight: '8px' }}>
     <LogoutIcon fontSize="small" />
   </ListItemIcon>
   <ListItemText primary="Logout" />
 </ListItem>
</List>

         <Divider />
         <List>
             <Typography variant="h6" style={{ padding: '8px 16px' }}><strong>Pages</strong></Typography>
             {[
                 "Create Historical Locations Tags",
                 "CRUD Historical Places",
             ].map((text) => (
                 <ListItem key={text} disablePadding>
                     <ListItemButton onClick={() => handleRegisterClick(text)}>
                         <ListItemText primary={text} />
                     </ListItemButton>
                 </ListItem>
             ))}
         </List>
             </Drawer>
             <div>
             {showSuccessMessage && (
               <Alert severity="success" 
               sx={{
                 position: 'fixed',
                 top: 80, // You can adjust this value to provide space between success and error alerts
                 right: 20,
                 width: 'auto',
                 fontSize: '1.2rem', // Adjust the size
                 padding: '16px',
                 zIndex: 9999, // Ensure it's visible above other content
               }}>
                 {successMessage}
               </Alert>
             )}
             {showErrorMessage && (
               <Alert severity="error" 
               sx={{
                 position: 'fixed',
                 top: 60, // You can adjust this value to provide space between success and error alerts
                 right: 20,
                 width: 'auto',
                 fontSize: '1.2rem', // Adjust the size
                 padding: '16px',
                 zIndex: 9999, // Ensure it's visible above other content
               }}>
                 {errorMessage}
               </Alert>
             )}
        </div>
   </div>
 );
};


export default GovernorNavbar;