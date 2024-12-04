import React, { useState } from 'react';
import TouristNavbar from '../Tourist/TouristNavbar';
import {  FaBed,FaBox,FaRunning,FaHistory,FaPlane } from 'react-icons/fa';
import NetworkService from '../NetworkService';
import "../TouristGovernor/GovernorHomePage.css"; 
import { useNavigate } from 'react-router-dom';

const TouristHomePage = () => {
    const currency='EGY';
    const Userr = JSON.parse(localStorage.getItem('User'));
    const navigate= useNavigate();
    const [ setSuccess] = useState('');
    const [setError] = useState('');
    const  handleRegisterClick=async(title)=> {
        if(title ==="Book a Transportation") {
         try {
           const options = { 
             apiPath: `/getTransportations/EGP`
            };
           const response = await NetworkService.get(options);
           console.log(response);
           
            const transportationData=response;
           navigate(`/BookTransportation`,{state:{userId:Userr.User?._id,transportationData:transportationData}});          
           } catch (error) {
           console.log('Error:', error);
         }
       }
         if (title === "View Products") {
             try {
                 const options = {
                   apiPath: `/getAvailableProducts/${Userr.User?._id}`,
                 };
                 
                 const response = await NetworkService.get(options);
                 setSuccess(response.message); // Set success message
                 console.log(response);
                 const Product=response.Products;
                 const Type='tourist';
                 navigate(`/viewProduct`,{ state: { Product, Type ,User:Userr} });          
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
               apiPath: `/getTourist/${Userr.User?._id}`,
               
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
           const touristId=Userr.User?._id;
           const options = { 
             apiPath: `/bookedEvents/${touristId}`
            };
           const response = await NetworkService.get(options);
           navigate(`/ViewListofBooked`,{state:{events:response,userId:Userr.User?._id}});          
   
         } catch (error) {
           console.log('Error:', error);
         }
       }
       else if(title ==="View/Rate Purchased Product") {
         console.log("hereeeee");
         console.log("heree");
 
         try {
           const options = {
             apiPath: `/getOrders/${Userr.User?._id}`,
           };
           const response = await NetworkService.get(options);
           setSuccess(response.message); // Set success message
           console.log("get Purchased Product",response);
           const Product=response.orders;
           console.log("get Purchased Product",Product);
 
           const Type='tourist';
           navigate(`/ViewPurchasedProduct`,{ state: { Product:Product, Type:Type ,userId:Userr.User?._id} });          
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
        navigate(`/BookHotel`,{state:{userId:Userr.User?._id}});          
       }
       else if(title ==="Book Flights") {
         navigate(`/BookFlight`,{state:{userId:Userr.User?._id}});          
       }
       else if (title ==="Complaints"){
         try { 
           const options = {
             apiPath: `/myComplaints/${Userr.User?._id}`,
             urlParam:Userr.User?._id
           };
           const response = await NetworkService.get(options);
           setSuccess(response.message); // Set success message
           console.log(response);
           const events=response.data;
           console.log(events)
           navigate(`/Complaints`,{state:{events,userId:Userr.User?._id}});          
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
             apiPath: `/myOrders/${Userr.User?._id}/${currency}`,
           };
           
           const response = await NetworkService.get(options);
           console.log(response);
 
           setSuccess(response.message); // Set success message
           const Type='tourist';
           const Orders = response.data;
           navigate(`/OrderHistory`,{ state: { Orders, Type ,User:Userr} });          
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
             
             navigate(`/explore`,{state:{events:events,userId:Userr.User?._id,typee:"tourist"}});          
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
  return (
    <div className="HomePage">
      <div>
        <TouristNavbar />
      </div>
      <div className="photo-background-tourist" />

      <div className="card-container">
        {/* Card 1 - Activity */}
        <div className="card">
          <div className="card-icon">
            <FaPlane /> {/* You can change the icon to suit your needs */}
          </div>
          <button className="card-button" onClick={()=>handleRegisterClick("Book Flights")}>Book Flights</button>
        </div>

        {/* Card 2 - Transportation */}
        <div className="card">
          <div className="card-icon">
            <FaRunning /> {/* Icon for Transportation */}
          </div>
          <button className="card-button" onClick={()=>handleRegisterClick("Explore Activities")}>Explore Activities</button>
        </div>

        {/* Card 3 - My Profile */}
        <div className="card">
          <div className="card-icon">
            <FaHistory /> 
          </div>
          <button className="card-button" onClick={()=>handleRegisterClick("Order History")}>Order History</button>
        </div>
        <div className="card">
          <div className="card-icon">
            <FaBed /> 
          </div>
          <button className="card-button" onClick={()=>handleRegisterClick("Order History")}>Book Hotels</button>
        </div>
        <div className="card">
          <div className="card-icon">
            <FaBox /> 
          </div>
          <button className="card-button" onClick={()=>handleRegisterClick("View Products")}>View Products</button>
        </div>
      </div>
    </div>
  );
};

export default TouristHomePage;
