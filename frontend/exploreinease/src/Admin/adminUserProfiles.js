import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import AdminsCard from '../Shared/Components/AdminCard/adminsCard';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // Ensure Axios is imported
import NetworkService from '../NetworkService';
const AdminUserProfiles = () => {
  const location = useLocation();
  const { Product, AdminId } = location.state || [];
  console.log(Product);
  const [userList, setUserList] = useState(Product);
  console.log("list",userList);
  
  React.useEffect(() => {
    getAllUsers();
  }, []);
    // Function to handle the deletion of a user
  const getAllUsers =async()=> {
    try{
      const  options = { apiPath: `/fetchAllUsersAndTourists/${AdminId}`, urlParam: AdminId };        
       const  response = await NetworkService.get(options);
        console.log(response);
        const allUsers = response;
        setUserList(allUsers);
      } 
      catch (err) {
        if (err.response) {
            console.error(err.message);
        } else {
            console.error('An unexpected error occurred.', err);
        }
      }
  }

  const handleDelete = async (id) => {
    console.log(id);
    const accountType=userList.find(item=>item._id===id)?.type || 'tourist';
    console.log(accountType);
    console.log(AdminId);
    
    try{
      const apiPath=`/deleteUserByIdAndType`;
       
        const  body= {
          _id: id,
          userType: accountType,
          selfId: AdminId,      
          }
      console.log(body);


      const options = {
        apiPath: apiPath,
        body: {
          _id: id,
          userType: accountType,
          selfId: AdminId,
        },
        headers: {
          // Add any custom headers if needed
          'Content-Type': 'application/json'
        }
      };
      
      const response = await NetworkService.delete(options);
      const updatedUsers = userList.filter((user) => user._id !== id);
      setUserList(updatedUsers);
          console.log(response);
          
    }
    catch{

    }

      
    }
    // Filter out the user with the matching name
    // const updatedUsers = userList.filter((user) => user.name !== name);
    // // Update the state with the filtered list
    // setUserList(updatedUsers);
 

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {userList.map((user) => (
        <Grid item xs={12} sm={3} md={2} key={user.email}> 
          <AdminsCard
            name={user.username}
            email={user.email}
            role={user.type||'tourist'}
            initialStatus={user.initialStatus}
            mobileNumber={user.mobileNum}
            nationality={user.nation}
            dateOfBirth={user.dob}
            onDelete={() => handleDelete(user._id)} 
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminUserProfiles;