import React, { useState, useEffect } from 'react';
import HomePage from './SellerNavbar';
import { FaCar, FaUserCircle, FaTasks, FaChartLine, FaBox, FaTags, FaArchive, FaFolderOpen } from 'react-icons/fa';
import NetworkService from '../NetworkService';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import "../TouristGovernor/GovernorHomePage.css"; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdvertiserHomePage = () => {
    const Userr = JSON.parse(localStorage.getItem('User'));
    const navigate= useNavigate();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    async function handleClick(title) {
        if (title=="My Profile"){
         try {
           const options = {
             apiPath: `/getSeller/${Userr.User?._id}`,
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
         if (title=="View List of Available Products"){
         try {
           const options = {
             apiPath: `/getAvailableProducts/${Userr.User?._id}`,
           };
           const response = await NetworkService.get(options);
           setSuccess(response.message); // Set success message
           console.log(response);
           const Product=response.Products;
           const Type='Seller';
           navigate(`/viewProduct`,{ state: { Product, Type ,User:Userr.User?._id} });          
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
             apiPath: `/getArchivedProducts/${Userr.User?._id}`,
           };
           const response = await NetworkService.get(options);
           setSuccess(response.message); // Set success message
           console.log(response);
           const Product=response.Products;
           const Type='Seller';
           navigate(`/unArchiveProduct`,{ state: { Product, Type ,User:Userr} });          
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
       };
  return (
    <div className="HomePage">
      <div>
        <HomePage />
      </div>
      <div className="photo-background-advertiser" />

      <div className="card-container">
        {/* Card 1 - Activity */}
        <div className="card">
          <div className="card-icon">
            <FaBox /> {/* You can change the icon to suit your needs */}
          </div>
          <button className="card-button" onClick={()=>handleClick("View List of Available Products")}>View List of Available Products</button>
        </div>

        {/* Card 2 - Transportation */}
        <div className="card">
          <div className="card-icon">
            <FaFolderOpen /> {/* Icon for Transportation */}
          </div>
          <button className="card-button" onClick={()=>handleClick("View Archived Product")}>View Archived Product</button>
        </div>

        {/* Card 3 - My Profile */}
        <div className="card">
          <div className="card-icon">
            <FaUserCircle /> 
          </div>
          <button className="card-button" onClick={()=>handleClick("My Profile")}>My Profile</button>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserHomePage;
