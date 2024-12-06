import React, { useState } from 'react';
import HomePage from './SellerNavbar';
import { FaUserCircle, FaBox, FaFolderOpen } from 'react-icons/fa';
import NetworkService from '../NetworkService';
import "../TouristGovernor/GovernorHomePage.css"; 
import { useNavigate } from 'react-router-dom';

const SellerHomePage = () => {
    const Userr = JSON.parse(localStorage.getItem('User'));
    const navigate= useNavigate();
    const [ setSuccess] = useState('');
    const [setError] = useState('');
    async function handleClick(title) {
        if (title==="My Profile"){
         try {
           const options = {
             apiPath: `/getSeller/${Userr.User?._id}`,
           };
           
           const response = await NetworkService.get(options);
           setSuccess(response.message); // Set success message
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
         if (title==="View List of Available Products"){
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
      
      {/* <div className="photo-background-advertiser" />

      <div className="card-container">
      
        <div className="card">
          <div className="card-icon">
            <FaBox /> 
          </div>
          <button className="card-button" onClick={()=>handleClick("View List of Available Products")}>View List of Available Products</button>
        </div>

   
        <div className="card">
          <div className="card-icon">
            <FaFolderOpen /> 
          </div>
          <button className="card-button" onClick={()=>handleClick("View Archived Product")}>View Archived Product</button>
        </div>

      
        <div className="card">
          <div className="card-icon">
            <FaUserCircle /> 
          </div>
          <button className="card-button" onClick={()=>handleClick("My Profile")}>My Profile</button>
        </div>
      </div> */}
    </div>
  );
};

export default SellerHomePage;
