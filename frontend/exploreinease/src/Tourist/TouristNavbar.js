import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import '../Guest/GuestHP.css'; 
import HomePageLogo from '../HomePageLogo.png';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { Alert } from '@mui/material'; 
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { AddShoppingCart } from "@mui/icons-material";

const TouristNavbar = () => {
   const Userr = JSON.parse(localStorage.getItem('User'));
   const imageUrll = JSON.parse(localStorage.getItem('imageUrl'));
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const imageUrl = state?.imageUrl || imageUrll;
    const  tourist  = state?.tourist ||Userr.User|| {};
    const [setSuccess]=useState();
    const [setError]=useState();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currency] = useState("EGP"); // default currency
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const openNotfication = Boolean(anchorEl1);
    const open = Boolean(anchorEl);
    const initialUsername = tourist?.username;
     const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
     const userId=Userr.User?._id ||tourist._id||{};
     const userType = tourist.tourist?.type || Userr?.type||tourist.type||'tourist';
     const [showSuccessMessage, setShowSuccessMessage] = useState(false);
     const [showErrorMessage, setShowErrorMessage] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const [successMessage, setSuccessMessage] = useState('');

     const savedAvatarUrl = localStorage.getItem(`${userId}`) || '';
     const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
     const [avatarImage, setAvatarImage] = useState(savedAvatarUrl || `http://localhost:3030/images/${imageUrl || ''}`);
     const [menuItems]=useState( [
      { title: 'New Message', body: 'You have received a new message from Alex.' },
      { title: 'Task Update', body: 'Your task "Design Mockup" is due tomorrow.' },
      { title: 'System Alert', body: 'Server maintenance scheduled for tonight.' },
      { title: 'Meeting Reminder', body: 'Team meeting scheduled at 3 PM.' },
      { title: 'Project Deadline', body: 'Project submission is due next week.' },
      { title: 'Event Invitation', body: 'You are invited to the annual gala dinner.' },
      { title: 'Feedback Request', body: 'Please provide feedback on the new design.' }]);
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
const handleClick = (event) => {
  setAnchorEl1(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl1(null);
};

   const handleMenuClose = () => {
      setAnchorEl(null);
   };

   const handleMenuClick = (action) => {
      handleMenuClose();
      if (action === 'changePassword') {
         navigate('/change-password', { state: { userId: userId } });;
      } else if (action === 'logout') {
         navigate('/');
      }
   };

    const  handleRegisterClick=async(title)=> {
       if(title ==="Book a Transportation") {
        try {
          const options = { 
            apiPath: `/getTransportations/EGP`
           };
          const response = await NetworkService.get(options);
          console.log(response);
          
           const transportationData=response;
          navigate(`/BookTransportation`,{state:{userId:userId,transportationData:transportationData}});          
          } catch (error) {
          console.log('Error:', error);
        }
      }
       else if (title === "View Products") {
            try {
                const options = {
                  apiPath: `/getAvailableProducts/${userId}`,
                };
                
                const response = await NetworkService.get(options);
                setSuccess(response.message); // Set success message
                console.log(response);
                const Product=response.Products;
                const Type='tourist';
                navigate(`/viewProduct`,{ state: { Product, Type ,User:tourist} });          
              } catch (err) {
                if (err.response) {
                    console.log(err.message);
                  setError(err.response.data.message); // Set error message from server response if exists
                } else {
                  setError('An unexpected error occurred.'); // Generic error message
                }
              }
        }
      else if (title==="My Profile"){
        try {
            const options = {
              apiPath: `/getTourist/${userId}`,
              
            };
            
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            console.log(response);
            navigate(`/viewTouristProfile`,{state:{Tourist:response}});
          } catch (err) {
            if (err.response) {
                console.log(err.message);
              setError(err.response.data.message); // Set error message from server response if exists
            } else {
              setError('An unexpected error occurred.'); // Generic error message
            }
          }
      }      else if(title ==="View Booked items") {
        try {
          const touristId=userId;
          const options = { 
            apiPath: `/bookedEvents/${touristId}`
           };
          const response = await NetworkService.get(options);
          navigate(`/ViewListofBooked`,{state:{events:response,userId:userId}});          
  
        } catch (error) {
          console.log('Error:', error);
        }
      }
      else if(title ==="View/Rate Purchased Product") {
        console.log("hereeeee");
        console.log("heree");

        try {
          const options = {
            apiPath: `/getOrders/${userId}`,
          };
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log("get Purchased Product",response);
          const Product=response.orders;
          console.log("get Purchased Product",Product);

          const Type='tourist';
          navigate(`/ViewPurchasedProduct`,{ state: { Product:Product, Type:Type ,userId:userId} });          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      }
      else if(title ==="Book Hotels") {
       navigate(`/BookHotel`,{state:{userId}});          
      }
      else if(title ==="Book Flights") {
        navigate(`/BookFlight`,{state:{userId}});          
      }
      else if (title ==="Complaints"){
        try { 
          const options = {
            apiPath: `/myComplaints/${userId}`,
            urlParam:userId
          };
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log(response);
          const events=response.data;
          console.log(events)
          navigate(`/Complaints`,{state:{events,userId:userId}});          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      }
      else if(title ==="Order History"){
        try {
          const options = {
            apiPath: `/myOrders/${userId}/${currency}`,
          };
          
          const response = await NetworkService.get(options);
          console.log(response);

          setSuccess(response.message); // Set success message
          const Type='tourist';
          const Orders = response.data;
          navigate(`/OrderHistory`,{ state: { Orders, Type ,User:tourist} });          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        } 
      }
      else{
        try {
            const options = {
              apiPath: `/upcomingEvents/${currency}`,
              urlParam: {currency: currency},
            };
            console.log(options);
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            console.log("response",response);
            const events=response;
            console.log(userId);
            
            navigate(`/explore`,{state:{events:events,userId:userId,typee:"tourist"}});          
          } catch (err) {
            if (err.response) {
                console.log(err.message);
              setError(err.response.data.message); // Set error message from server response if exists
            } else {
              setError('An unexpected error occurred.'); // Generic error message
            }
          }
      }
      }

      const handleDeleteAccount = async () => {
        try {
          console.log(userId, userType);
      
          const options = {
            apiPath: `/requestDeletion/${userId}/${userType}`,
            useParams: userId,
            userType,
          };
          const response = await NetworkService.put(options);
          console.log(response);
      
          setSuccessMessage(response.message || "Delete Successfully!");
          setShowSuccessMessage(true);
      
          if (response.success) {
            setSuccess("Account deletion requested successfully.");
          } else {
            setError(response.message || "Account deletion request failed.");
          }
        } catch (err) {
          // Access the error message from the response data
          const errorMessage = err.response?.data?.message || "An error occurred";
          setErrorMessage(errorMessage);
          setShowErrorMessage(true);
          setError(errorMessage);
        }
      };
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
};
return (
  <div>
      <nav className="navbar">
          <div className="logo-container">
              <img src={HomePageLogo} alt="ExploreInEase Logo" className="logo" />
              <span className="website-name">ExploreInEase</span>
          </div>
          <div style={{ display: 'flex',flexDirection: 'row',marginLeft:'1450px',alignContent:'center',alignItems:'center' }}>
          <IconButton 
           className="menu-button"
           style={{ 
            position:'absolute',
            color: 'blue',      // Change icon color to blue
            backgroundColor: '#e0f7fa', // Light blue background for contrast
            alignItems:'center'
        }}
          onClick={()=>{navigate('/cart')}} >
                    <AddShoppingCart />
            </IconButton>
      
          <IconButton 
                        onClick={handleClick} 
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        className="menu-button" 
                        style={{ 
                            position:'absolute',
                            color: 'blue',      // Change icon color to blue
                            backgroundColor: '#e0f7fa', // Light blue background for contrast
                            right: '115px',
                            alignItems:'center'
                        }}>
                        <Badge badgeContent={4} color="success">
                        <NotificationsNoneOutlinedIcon sx={{ fontSize: 30 }} />
                        </Badge>
             </IconButton>
             
    <Menu
    id="basic-menu"
    anchorEl={anchorEl1}
    open={openNotfication}
    onClose={handleClose}
    MenuListProps={{
        'aria-labelledby': 'basic-button',
    }}
    PaperProps={{
        style: {
            maxHeight: '300px', // Set the maximum height for the menu
            overflow: 'auto',   // Enable scrolling
        },
    }}
>
    {menuItems && menuItems.length > 0 ? (
        menuItems.map((item, index) => (
            <MenuItem key={index}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong>{item.title}</strong>
                    <span style={{ fontSize: '0.875rem', color: 'gray' }}>{item.body}</span>
                </div>
            </MenuItem>
        ))
    ) : (
        <MenuItem disabled>No notifications available</MenuItem>
    )}
</Menu>
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
                    </div>

       
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
  <ListItem button onClick={() => handleMenuClick('changePassword')}>
    <ListItemIcon style={{ minWidth: '0px', marginRight: '8px' }}>
      <LockIcon fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Change Password" />
  </ListItem>
  <ListItem button onClick={handleDeleteAccount}>
    <ListItemIcon style={{ minWidth: '0px', marginRight: '8px' }}>
      <Delete fontSize="small" />
    </ListItemIcon>
    
    <ListItemText primary="Delete Account" />
  </ListItem>
  <ListItem button onClick={() => handleMenuClick('logout')}>
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
                  "Explore Activities",
                  "View Products",
                  "Book a Transportation",
                  "View Booked items",
                  "View/Rate Purchased Product",
                  "Book Hotels",
                  "Book Flights",
                  "Complaints",
                  "Order History",
                  "My Profile"
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
export default TouristNavbar;