import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import '../Guest/GuestHP.css'; 
import HomePageLogo from '../HomePageLogo.png';
import IconButton from '@mui/material/IconButton';
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { AddShoppingCart } from "@mui/icons-material";
import "../TouristGovernor/GovernorHomePage.css"; 
import Tooltip from '@mui/material/Tooltip';
import ListItemIcon from '@mui/material/ListItemIcon';
import UploadIcon from '@mui/icons-material/Upload';
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from 'axios';
import Delete from '@mui/icons-material/Delete';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const TouristNavbar = () => {
   const Userr = JSON.parse(localStorage.getItem('User'));
   const imageUrll = localStorage.getItem('imageUrl');
   const [selectedTab, setSelectedTab] = useState('Events');  
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const imageUrl = state?.imageUrl || imageUrll;
    const  tourist  = Userr;
    const [currency] = useState(Userr.currency); // default currency
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const openNotfication = Boolean(anchorEl1);
    const open = Boolean(anchorEl);
    const initialUsername = tourist?.username;
     const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
     const userId=Userr.User?._id ||tourist._id||{};
     const userType = tourist.tourist?.type || Userr?.type||tourist.type||'tourist';
     const [anchorProfileEl, setAnchorProfileEl] = useState(null);
     const [showSuccessMessage, setShowSuccessMessage] = useState(false);
     const [showErrorMessage, setShowErrorMessage] = useState(false);
     const [ setErrorMessage] = useState('');
     const savedAvatarUrl = localStorage.getItem(`${userId}`) || '';
     const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
     const [avatarImage, setAvatarImage] = useState(savedAvatarUrl || `http://localhost:3030/images/${imageUrl || ''}`);
     const [menuItems,setMenuItem]=useState( []);


//      useEffect(()=>{
//   checkPromoCode();
// },[]);
// const checkPromoCode=async()=>{
//   const options = {
//     apiPath: '/updatePromoCode',
//   };
//   await NetworkService.put(options);
// }
useEffect(() => {
         // Update the avatar URL when the component mounts if a new image URL exists
         if (savedAvatarUrl || imageUrl) {
             setAvatarImage(savedAvatarUrl || `http://localhost:3030/images/${imageUrl}`);
         } else {
             setAvatarImage(defaultAvatarUrl);
         }
}, [imageUrl, savedAvatarUrl, defaultAvatarUrl]);
     
 useEffect(() => {
      if (showSuccessMessage) {
        const timer = setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
}, [showSuccessMessage]);
    
useEffect(() => {
      if (showErrorMessage) {
        const timer = setTimeout(() => {
          setShowErrorMessage(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
 }, [showErrorMessage]);

useEffect(() => {
  const savedTab = localStorage.getItem('selectedTab');
  if (savedTab) {
    setSelectedTab(savedTab); // Restore the selected tab
  }
}, []);


 const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        console.log(null);
          const response = await axios.post(`http://localhost:3030/uploadImage/${userId}`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
          console.log('Image uploaded successfully:', response);
          const uploadedImageUrl = response.data.imageUrl; 
          // Update avatarImage and save the URL in localStorage
          setAvatarImage(uploadedImageUrl);
          localStorage.setItem(`${userId}`, uploadedImageUrl);
          console.log('Image uploaded successfully!');
      } catch (err) {
          console.error('Error uploading image:', err);
          console.log(err.response ? err.response.data.error : 'Failed to upload image. Please try again.');
      }
  }else {
    console.log('No file selected.');
    return; 
  }
};
const handleClick = (event) => {
  setAnchorEl1(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl1(null);
};
const handleCloseMenu = () => {
  setAnchorProfileEl(null);
};
const handleClickNotification = async(event) => {
  setAnchorEl1(event.currentTarget);
  const options = { 
    apiPath: `/getAllNotifications/${Userr._id}`,
    urlParam: Userr._id
   };
  const response =await NetworkService.get(options);
  setMenuItem(response);
  console.log(response);
  console.log(menuItems);

};
const handleOpenMenu = (event) => {
  setAnchorProfileEl(event.currentTarget);
};
   const handleMenuClose = () => {
      setAnchorEl(null);
};
const  handleRegisterClick=async(title)=> {

           if(title ==="Transportation") {
        try {
          const options = { 
            apiPath: `/getTransportations/EGP`
           };
          const response = await NetworkService.get(options);
          console.log(response);
          
           const transportationData=response;
           setSelectedTab(title);
           localStorage.setItem('selectedTab', title);
          navigate(`/BookTransportation`,{state:{userId:userId,transportationData:transportationData}});          
          } catch (error) {
          console.log('Error:', error);
        }
            }
            else if(title==='Book Hotels'){
              setSelectedTab(title);
              localStorage.setItem('selectedTab', title);
              navigate(`/BookHotel`,{state:{userId}});          
            }
            else if (title==='Book Flights'){
              setSelectedTab(title);
              localStorage.setItem('selectedTab', title);
              navigate(`/BookFlight`,{state:{userId}});          
            }
           else if (title==="Products") {

            try {
                const options = {
                  apiPath: `/getAvailableProducts/${userId}`,
                };
                
                const response = await NetworkService.get(options);
                console.log(response.message); // Set success message
                console.log(response);
                const Product=response.Products;
                const Type='tourist';
                setSelectedTab(title);
                localStorage.setItem('selectedTab', title);
                navigate(`/viewProduct`,{ state: { Product, Type ,User:tourist} });          
              } catch (err) {
                if (err.response) {
                    console.log(err.message);

                  console.log(err.response.data.message); // Set error message from server response if exists
                } else {
                  console.log('An unexpected error occurred.'); // Generic error message
                }
              }
             }
            else if (title==='profile'){
              try {
                  navigate(`/viewTouristProfile`,{state:{Tourist:Userr}});
                } catch (err) {
                  if (err.response) {
                      console.log(err.message);
                      console.log(err.response.data.message); // Set error message from server response if exists
                  } else {
                    console.log('An unexpected error occurred.'); // Generic error message
                  }
                }
            }
            else if(title ==="Booked items") {
              try {
                const touristId=Userr._id;
                const options = { 
                  apiPath: `/bookedEvents/${touristId}`
                };
                const response = await NetworkService.get(options);
                setSelectedTab(title);
                localStorage.setItem('selectedTab', title);
                navigate(`/ViewListofBooked`,{state:{events:response,userId:Userr._id}});          
        
              } catch (error) {
                console.log('Error:', error);
              }
            }
            else if(title ==="Purchased Product") {
              try {
                const options = {
                  apiPath: `/getOrders/${Userr._id}`,
                };
                const response = await NetworkService.get(options);
                console.log(response.message); // Set success message
                console.log("get Purchased Product",response);
                const Product=response.orders;
                console.log("get Purchased Product",Product);

                const Type='tourist';
                setSelectedTab(title);
                localStorage.setItem('selectedTab', title);
                navigate(`/ViewPurchasedProduct`,{ state: { Product:Product, Type:Type ,userId:Userr._id} });          
              } catch (err) {
                if (err.response) {
                    console.log(err.message);
                    console.log(err.response.data.message); // Set error message from server response if exists
                } else {
                  console.log('An unexpected error occurred.'); // Generic error message
                }
              }
            }
            else if(title ==="Book Hotels") {
              setSelectedTab(title);
              localStorage.setItem('selectedTab', title);
            navigate(`/BookHotel`,{state:{userId:Userr._id}});          
            }
            else if(title ==="Book Flights") {
              setSelectedTab(title);
              localStorage.setItem('selectedTab', title);
              navigate(`/BookFlight`,{state:{userId:Userr._id}});          
            }
            else if (title ==="Complaints"){
              try { 
                const options = {
                  apiPath: `/myComplaints/${Userr._id}`,
                  urlParam:userId
                };
                const response = await NetworkService.get(options);
                console.log(response.message); // Set success message
                console.log(response);
                const events=response.data;
                console.log(events);
                setSelectedTab(title);
                localStorage.setItem('selectedTab', title);
                navigate(`/Complaints`,{state:{events,userId:Userr._id}});          
              } catch (err) {
                if (err.response) {
                    console.log(err.message);
                    console.log(err.response.data.message); // Set error message from server response if exists
                } else {
                  console.log('An unexpected error occurred.'); // Generic error message
                }
              }
            }
            else if(title ==="Order History"){
              try {
                const options = {
                  apiPath: `/myOrders/${Userr._id}/${currency}`,
                };
                
                const response = await NetworkService.get(options);
                console.log(response);
                console.log(response.message); // Set success message
                const Type='tourist';
                const Orders = response.data;
                setSelectedTab(title);
                localStorage.setItem('selectedTab', title);
                navigate(`/OrderHistory`,{ state: { Orders, Type ,User:tourist} });          
              } catch (err) {
                if (err.response) {
                    console.log(err.message);
                    console.log(err.response.data.message); // Set error message from server response if exists
                } else {
                  console.log('An unexpected error occurred.'); // Generic error message
                }
              } 
            }
            else if(title==='Change Password'){
              console.log('hereee');
              
              navigate('/change-password', { state: { userId: Userr._id ,userType:userType} });;
            }
            else if(title==='Delete Account'){
              try {
                const options = {
                  apiPath: `/requestDeletion/${Userr._id}/${userType}`,
                  useParams: Userr._id,
                  userType,
                };
                const response = await NetworkService.put(options);
                console.log(response);
            
                console.log(response.message || "Delete Successfully!");            
                if (response.success) {
                  console.log("Account deletion requested successfully.");
                } else {
                  console.log(response.message || "Account deletion request failed.");
                }
              } catch (err) {
                // Access the error message from the response data
                const errorMessage = err.response?.data?.message || "An error occurred";
                setErrorMessage(errorMessage);
                setShowErrorMessage(true);
                console.log(errorMessage);
              }
            }
            else if(title==='BookMarks'){
              try { 
                const options = {
                  apiPath: `/fetchbookmark/${Userr._id}`,
                };
                const response = await NetworkService.get(options);
                console.log(response); // Set success message
                const events=response.data;
                setSelectedTab(title);
                localStorage.setItem('selectedTab', title);
                navigate('/MyBookmarks',{state:{events:events,userId}});  
              }
               catch (err) {
                if (err.response) {
                    console.log(err.message);
                  console.log(err.response.data.message); // Set error message from server response if exists
                } else {
                  console.log('An unexpected error occurred.'); // Generic error message
                }
              }  
            }
            else if(title==='Log Out'){
              console.log('yes here');
              localStorage.removeItem('User');
              localStorage.removeItem('imageUrl');
              localStorage.removeItem('UserId');
              localStorage.removeItem('UserType');
              navigate('/');
            }
            else if(title==='Events') {              
              try {
                  const options = {
                    apiPath: `/upcomingEvents/${currency}`,
                    urlParam: {currency: currency},
                  };
                  console.log(options);
                  const response = await NetworkService.get(options);
                  console.log(response.message); // Set success message
                  console.log("response",response);
                  const events=response;
                  console.log(Userr._id);
                  setSelectedTab(title);
                  localStorage.setItem('selectedTab', title);
                  navigate(`/explore`,{state:{events:events,userId:Userr._id,userType:"tourist"}});          
                } catch (err) {
                  if (err.response) {
                      console.log(err.message);
                      console.log(err.response.data.message); // Set error message from server response if exists
                  } else {
                    console.log('An unexpected error occurred.'); // Generic error message
                  }
                }
            }

};

return (
  <>
      <nav className="navbarMain">
    <div className="navbar-left">
    <div className="logo-container">
      <img
        src={HomePageLogo} // Replace with your logo's import
        alt="ExploreInEase Logo"
        className="logo"
      />
      <span className="website-name">ExploreInEase/Tourist</span>
    </div>
      </div>
    <div className="navbar-right">
       {/* Cart Button */}
        <IconButton
          style={{
            color: 'blue',
            backgroundColor: '#e0f7fa',
          }}
          onClick={() => {
            navigate('/cart');
          }}
        >
          <Tooltip title="Cart">
          <AddShoppingCart />
          </Tooltip>

        </IconButton>   

  {/* Notification Button */}
{/* Notification Icon Button */}
<IconButton
        aria-controls={openNotfication ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openNotfication ? "true" : undefined}
        onClick={handleClickNotification} // Attach the function here
        style={{
          color: "blue",
          backgroundColor: "#e0f7fa",
        }}
      >
        <Badge badgeContent={menuItems?.length || 0} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Notification Menu */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl1}
        open={openNotfication}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            maxHeight: "300px",
            overflow: "auto",
          },
        }}
      >
        {menuItems && menuItems.length > 0 ? (
          menuItems.map((item, index) => (
            <MenuItem key={index}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <strong>{item.title}</strong>
                <span style={{ fontSize: "0.875rem", color: "gray" }}>
                  {item.body}
                </span>
              </div>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No notifications available</MenuItem>
        )}
      </Menu>
  <Tooltip title="Options">
  <Avatar
    sx={{
      bgcolor: 'darkblue',
      color: 'white',
      cursor: 'pointer',
    }}
    src={avatarImage || undefined}
    onClick={handleOpenMenu}
  >
    {avatarImage ? '' : initialUsername.charAt(0).toUpperCase()}
  </Avatar>
</Tooltip>
  <Menu
    anchorEl={anchorProfileEl}
    open={Boolean(anchorProfileEl)}
    onClose={handleCloseMenu}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
  >
                      <MenuItem onClick={()=>handleRegisterClick('profile')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <PersonOutlineIcon />
                              </ListItemIcon>
                              profile
                       </MenuItem> 
                          <Divider/>
                          <MenuItem onClick={()=>handleRegisterClick('Change Password')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                                                    <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                                        <PasswordOutlinedIcon />
                                                    </ListItemIcon>
                                                    Change Password
                                            </MenuItem>    <Divider/>
                          <MenuItem onClick={()=>handleRegisterClick('Delete Account')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                                                    <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                                        <Delete />
                                                    </ListItemIcon>
                                                    Delete Account  
                                                  </MenuItem>    <Divider/>
                          <MenuItem component="label" sx={{cursor:'pointer', alignItems: 'center',padding: 0 , marginLeft: '8px'}} >
                                                    <ListItemIcon sx={{cursor:'pointer', marginRight: '5px' }}>
                                                        <UploadIcon />
                                                    </ListItemIcon>
                                                      Upload Profile Picture
                                                      <input
                                                          type="file"
                                                          accept="image/*"
                                                          style={{ display: 'none' }}
                                                          onChange={handleAvatarUpload}
                          /> </MenuItem>
                        <Divider/>
                          <MenuItem onClick={()=>handleRegisterClick('Log Out')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                                                    <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                                        <LogoutOutlinedIcon />
                                                    </ListItemIcon>
                                                    Log Out
                          </MenuItem> 
     </Menu>           
     </div>
    </nav>
    <nav className="navbarSecondary">
    {['Events',,"Products","Transportation","Complaints","Book Hotels","Book Flights","Purchased Product",,"Booked items","BookMarks"].map((tab) => (
          <div
            key={tab}
            className={`navbar-tab ${selectedTab === tab ? 'selected' : ''}`}
            onClick={() => handleRegisterClick(tab)}
          >
            {tab}
          </div>
        ))}
    </nav>
  </>
);
};
export default TouristNavbar;