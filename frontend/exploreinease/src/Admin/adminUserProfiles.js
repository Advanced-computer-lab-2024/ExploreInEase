import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import AdminsCard from '../Shared/Components/AdminCard/adminsCard';
import { useLocation } from 'react-router-dom';

const AdminUserProfiles = ({ users = [], onDelete }) => {
  const location = useLocation();
  const { Product=[], AdminId } = location.state || [];
  users = Product;
  const [userList, setUserList] = useState(Array.isArray(Product) ? Product : []);
    console.log("Everything in Database: ", Product)
  // Function to handle the deletion of a user
  const handleDelete = (name) => {
    const options = {
      apiPath: `/deleteUserByIdAndType`,
      body: {
        _id: name,
        userType: 'admin',
        selfId: AdminId,
      },
      
    }
    // Filter out the user with the matching name
    const updatedUsers = userList.filter((user) => user.name !== name);
    // Update the state with the filtered list
    setUserList(updatedUsers);
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {userList.map((user) => (
        <Grid item xs={12} sm={6} md={4} key={user.email}> 
          <AdminsCard
            name={user.name}
            email={user.email}
            role={user.role}
            initialStatus={user.initialStatus}
            mobileNumber={user.mobileNumber}
            nationality={user.nationality}
            dateOfBirth={user.dateOfBirth}
            typeOfLifeLiving={user.typeOfLifeLiving}
            onDelete={() => handleDelete(user.name)} 
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminUserProfiles;