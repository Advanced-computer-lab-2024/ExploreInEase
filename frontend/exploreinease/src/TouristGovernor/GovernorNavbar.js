// src/Shared/Components/GuestHP.js
import React ,{useState,useEffect}from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; 
import HomePageLogo from '../HomePageLogo.png';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import "../TouristGovernor/GovernorHomePage.css"; 
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; 
import UploadIcon from '@mui/icons-material/Upload';
import Delete from '@mui/icons-material/Delete';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import axios from 'axios';

const GovernorNavbar = () => {
  const Userr = JSON.parse(localStorage.getItem('User'));
  const imageUrl=localStorage.getItem('imageUrl');
  const savedAvatarUrl = localStorage.getItem(`${Userr._id}`) || '';
  const userId = Userr?.User?._id || Userr?._id;
   const navigate = useNavigate();
   const location = useLocation();
   const { state } = location;
   const tourist = state?.tourist || Userr;  
   const initialUsername = tourist?.username;
   const [selectedTab, setSelectedTab] = useState("Historical Places");  
   const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
   const [avatarImage, setAvatarImage] = useState(savedAvatarUrl || `http://localhost:3030/images/${imageUrl || ''}`);
   const [anchorProfileEl, setAnchorProfileEl] = useState(null);
   const governorId=tourist?._id;
   const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';


       // useEffect(()=>{
        //   checkPromoCode();
        // },[]);
        // const checkPromoCode=async()=>{
        //   const options = {
        //     apiPath: '/updatePromoCode',
        //   };
        //   await NetworkService.put(options);
        // }
   useEffect(() => {
    const savedTab = localStorage.getItem('selectedTab');
    if (savedTab) {
      setSelectedTab(savedTab); // Restore the selected tab
    }
  }, []);
   useEffect(() => {
    // Update the avatar URL when the component mounts if a new image URL exists
    if (savedAvatarUrl || imageUrl) {
        setAvatarImage(savedAvatarUrl || `http://localhost:3030/images/${imageUrl}`);
    } else {
        setAvatarImage(defaultAvatarUrl);
    }
}, [imageUrl, savedAvatarUrl, defaultAvatarUrl]);

   const handleOpenMenu = (event) => {
    setAnchorProfileEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorProfileEl(null);
  };
  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
          // setError(null);
            const response = await axios.post(`http://localhost:3030/uploadImage/${Userr._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Image uploaded successfully:', response);
            const uploadedImageUrl = response.data.imageUrl;
            
            // Update avatarImage and save the URL in localStorage
            setAvatarImage(uploadedImageUrl);
            localStorage.setItem(`${Userr._id}`, uploadedImageUrl);
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
   async function handleRegisterClick(title) {
      if (title==="Tags") {
        setSelectedTab(title);
        localStorage.setItem('selectedTab', title);
         navigate(`/viewHistoricalTags`,{state:{governorId:userId}});          
      }
      else if (title === 'Change Password') {
        navigate('/change-password', { state: { userId: userId } });;
    } else if (title === 'Log Out') {
      console.log('yes here');
      localStorage.removeItem('User');
      localStorage.removeItem('Userr');
      localStorage.removeItem('imageUrl');
      localStorage.removeItem('UserId');
      localStorage.removeItem('UserType');
      navigate('/');    }
    else if(title=='Delete Account'){
      try {
        const userType='TourismGovernor';
        const options = {
          apiPath: `/requestDeletion/${Userr._id}/${Userr.type}`,
          useParams: userId,
          userType, 
        };
        const response = await NetworkService.put(options);
        console.log(response);
    
        console.log(response.message || "Delete Successfully!");
        console.log(true);
    
        if (response.success) {
          console.log("Account deletion requested successfully.");
        } else {
          console.log(response.message || "Account deletion request failed.");
        }
      } catch (err) {
        // Access the error message from the response data
        const errorMessage = err.response?.data?.message || "An error occurred";
        console.log(errorMessage);
        console.log(true);
        console.log(errorMessage);
      }
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
           setSelectedTab(title);
           localStorage.setItem('selectedTab', title);
           navigate(`/HistoricalPlaces`,{state:{governorId,response}});   
         } 
       catch {
         console.log('An unexpected error occurred.'); // Generic error message
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
      <span className="website-name">ExploreInEase/GovernorHomePage</span>
    </div>
      </div>
    <div className="navbar-right">
                    <Tooltip title='Options'>
                    <Avatar sx={{ bgcolor: 'darkblue', color: 'white',cursor:'pointer' ,marginRight:'20px'}} src={avatarImage || undefined} onClick={handleOpenMenu} >
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
                           {/* <Divider/> */}
                            <MenuItem onClick={()=>handleRegisterClick('Change Password')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <PasswordOutlinedIcon />
                              </ListItemIcon>
                              Change Password
                       </MenuItem>                            <Divider/>
                            {/* <MenuItem onClick={()=>handleRegisterClick('Delete Account')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <Delete />
                              </ListItemIcon>
                              Delete Account  
                            </MenuItem>                            <Divider/> */}
                            <MenuItem component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <UploadIcon />
                              </ListItemIcon>
                                Upload Profile Picture
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleAvatarUpload}
                                />
                            </MenuItem>
                            <Divider/>
                            <MenuItem onClick={()=>handleRegisterClick('Log Out')} component="label" sx={{cursor:'pointer', alignItems: 'center', padding: 0 , marginLeft: '8px'}} >
                              <ListItemIcon sx={{cursor:'pointer', minWidth: 0, marginRight: '8px' }}>
                                  <LogoutOutlinedIcon />
                              </ListItemIcon>
                              Log Out
                            </MenuItem>                        </Menu>
     </div>
            </nav>
            <nav className="navbarSecondary">
              {["Historical Places","Tags"].map((tab) => (
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


export default GovernorNavbar;