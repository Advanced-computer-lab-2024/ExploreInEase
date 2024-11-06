import React,{ useState } from 'react';
import HomePageLogo from '../HomePageLogo.png';
import '../Guest/GuestHP.css';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
   const location=useLocation();
    const navigate = useNavigate();
    const [success,setSuccess]=useState();
    const [error,setError]=useState();
    const { User } = location.state || {};
    const initialUsername = User?.username;
    const userId=User._id;
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    const userType = User.type;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleAvatarClick = (event) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
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
      const handleDeleteAccount = async () => {
        try {
          console.log(userId,userType);

          const options = {
              apiPath: `/requestDeletion/${userId}/${userType}`,
              useParams:userId,userType,
            };
          const response = await NetworkService.put(options);
          console.log(response);

          if (response.success) {
              setSuccess("Account deletion requested successfully.");
          } else {
              setError(response.message || "Account deletion request failed.");
          }
      } catch (err) {
          setError(err.response?.data?.message || "An error occurred while requesting account deletion.");
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
                        sx={{
                            bgcolor: 'darkblue',
                            color: 'white',
                            width: 56,
                            height: 56,
                            fontSize: 24,
                            cursor: 'pointer',
                            marginLeft: 2,
                        }}
                        onClick={handleAvatarClick}
                    >
                        {firstInitial}
                    </Avatar>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleDeleteAccount}>Delete My Account</MenuItem>
                    </Menu>
                </div>
            </nav>
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
  );
};

export default HomePage;