import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import AdminsCard from '../Shared/Components/AdminCard/adminsCard';
import { useLocation } from 'react-router-dom';
import NetworkService from '../NetworkService';

const AdminUserProfiles = () => {
  const adminIdd = localStorage.getItem('UserId');
  const location = useLocation();
  const [allproductss, setAllProducts] = useState([]);
  const Product = location.state?.Product || allproductss;
  const adminId = location.state?.AdminId || adminIdd;
  const [checkPersonDelete, setCheckPersonDelete] = useState(true);
  const [userList, setUserList] = useState(Product);

  // Effect to fetch all users on mount or when deletion check changes
  useEffect(() => {
    getAllUsers();
  }, [checkPersonDelete]);

  // Effect to update userList whenever allproductss is updated
  useEffect(() => {
    setUserList(Product);
  }, [allproductss]);

  const getAllUsers = async () => {
    try {
      const options = { apiPath: `/fetchAllUsersAndTourists/${adminId}`, urlParam: adminId };
      const response = await NetworkService.get(options);
      console.log("RESPONSE", response);
      setAllProducts(response); // Updates allproductss, triggering userList update
    } catch (err) {
      console.error(err.response ? err.message : 'An unexpected error occurred.', err);
    }
  };

  const handleDelete = async (id) => {
    setCheckPersonDelete(false);
    const accountType = userList.find(item => item._id === id)?.type || 'tourist';

    try {
      const options = {
        apiPath: `/deleteUserByIdAndType`,
        body: {
          _id: id,
          userType: accountType,
          selfId: adminId,
        },
        headers: {
          'Content-Type': 'application/json'
        }
      };
      await NetworkService.delete(options);
      const updatedUsers = userList.filter((user) => user._id !== id);
      setUserList(updatedUsers);
      setCheckPersonDelete(true);
    } catch (err) {
      console.error('Error during deletion:', err);
    }
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {userList?.length > 0 ? (
        userList.map((user) => (
          <Grid item xs={12} sm={3} md={2} key={user.email}>
            <AdminsCard
              name={user.username}
              email={user.email}
              role={user.type || 'tourist'}
              initialStatus={user.initialStatus}
              mobileNumber={user.mobileNum}
              nationality={user.nation}
              dateOfBirth={user.dob}
              onDelete={() => handleDelete(user._id)}
            />
          </Grid>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </Grid>
  );
};

export default AdminUserProfiles;
