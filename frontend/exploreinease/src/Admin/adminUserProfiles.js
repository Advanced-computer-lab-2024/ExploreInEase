import React, { useState } from 'react';
import { Grid } from '@mui/material';
import AdminsCard from '../Shared/Components/AdminCard/adminsCard';

const AdminUserProfiles = ({ users = [], onDelete }) => {
  const [userList, setUserList] = useState(users);

  // Function to handle the deletion of a user
  const handleDelete = (name) => {
    // Filter out the user with the matching name
    const updatedUsers = userList.filter((user) => user.name !== name);
    // Update the state with the filtered list
    setUserList(updatedUsers);
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {userList.map((user) => (
        <Grid item xs={12} sm={6} md={4} key={user.email}> {/* Adjust size based on your design */}
          <AdminsCard
            name={user.name}
            email={user.email}
            role={user.role}
            initialStatus={user.initialStatus}
            mobileNumber={user.mobileNumber}
            nationality={user.nationality}
            dateOfBirth={user.dateOfBirth}
            typeOfLifeLiving={user.typeOfLifeLiving}
            onDelete={() => handleDelete(user.name)} // Pass the user's name for deletion
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminUserProfiles;
