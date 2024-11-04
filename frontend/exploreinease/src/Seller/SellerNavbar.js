import React,{ useState } from 'react';
import HomePageLogo from '../HomePageLogo.png';
import '../Guest/GuestHP.css';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
   const location=useLocation();
    const navigate = useNavigate();
    const [success,setSuccess]=useState();
    const [error,setError]=useState();
    const { User } = location.state || {};
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const initialUsername = User?.username;
    const userId=User._id;
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
   
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
   };

   const handleMenuClick = (action) => {
      handleMenuClose();
      if (action === 'changePassword') {
         navigate('/change-password', { state: { userId: userId } });;
      } else if (action === 'logout') {
         navigate('/login');
      }
   };
   
    async function handleClick(title) {
       if (title=="My Profile"){
        try {
          const options = {
            apiPath: `/getSeller/${userId}`,
          };
          
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          const tourist=response.seller;
          console.log(response.seller);
          navigate(`/viewSellerProfile`,{state:{tourist:response.seller}});     

        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      }
      else {
        try {
          const options = {
            apiPath: `/getAvailableProducts/${userId}`,
          };
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log(response);
          const Product=response.Products;
          const Type='Seller';
          navigate(`/viewProduct`,{ state: { Product, Type ,User:User} });          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      }
      };
  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo-container">
          <img
            src={HomePageLogo} // Use the imported logo
            alt="ExploreInEase Logo"
            className="logo"
          />
          <span className="website-name">ExploreInEase</span>
        </div>
        <div className="nav-links">
          <button onClick={() => handleClick("View List of Available Products")}
              className="small-button">View List of Available Products</button>
          <button onClick={() => handleClick("Add Product")}
              className="small-button">Add Product</button>
          <button onClick={() => handleClick("Edit Product")}  
           className="small-button"
            >Edit Product</button>
          <button 
          onClick={() => handleClick("My Profile")}
          className="small-button">My Profile</button>
       
        <div style={{marginRight:5,marginTop:30,marginLeft:30}}>
          <span className="currency-symbol"></span>
          <select>
            <option value="usd">USD ($)</option>
            <option value="eur">EUR (€)</option>
            <option value="egp">EGP (ج.م)</option>
          </select>
        </div>
        </div>
        <div className="avatar-container">
               <Avatar
                  sx={{ bgcolor: 'darkblue', color: 'white', width: 48, height: 48, fontSize: 20, cursor: 'pointer' }}
                  onClick={handleMenuOpen}
               >
                  {firstInitial}
               </Avatar> 
               <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                     elevation: 3,
                     sx: {
                        mt: 1.5,
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                     },
                  }}
               >
                  <Typography variant="h6" sx={{ padding: '8px 16px', fontWeight: 600 }}>
                     Account
                  </Typography>
                  <Divider />
                  <MenuItem onClick={() => handleMenuClick('changePassword')}>
                     <ListItemIcon>
                        <LockIcon fontSize="small" />
                     </ListItemIcon>
                     Change Password
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick('logout')}>
                     <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                     </ListItemIcon>
                     Logout
                  </MenuItem>
               </Menu>
            </div>
      </nav>
      {/* Other homepage content goes here */}
    </div>
  );
};

export default HomePage;