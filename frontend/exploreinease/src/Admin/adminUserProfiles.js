import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import AdminsCard from '../Shared/Components/AdminCard/adminsCard';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // Ensure Axios is imported
const AdminUserProfiles = () => {
  const location = useLocation();
  const { Product, AdminId } = location.state || [];
  console.log(Product);
  const [userList, setUserList] = useState(Product);
  console.log("list",userList);
  
  React.useEffect(() => {
   
  }, []);
    // Function to handle the deletion of a user
  const handleDelete = async (id) => {
    console.log(id);
    const accountType=userList.find(item=>item._id===id)?.type;
    console.log(accountType);
    
    try{
      const apiPath=`http://localhost:3030/deleteUserByIdAndType`;
       
        const  body= {
          _id: id,
          userType: accountType,
          selfId: AdminId,      
          }
      console.log(body);
      
      const response = await axios.delete(apiPath,body);

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