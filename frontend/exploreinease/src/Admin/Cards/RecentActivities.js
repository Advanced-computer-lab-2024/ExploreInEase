import { List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecentActivities = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const UserId = localStorage.getItem("UserId");

    const getNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/allNotifications/${UserId}/admin`);
        const data = response.data; 
        // data is expected to be an array of notifications

        // Example:
        // [
        //   {
        //     "_id": "67433c6b9d6ea96e5967e973",
        //     "body": "Product Saif Topppp is out of stock",
        //     "createdAt": "2024-11-24T14:47:07.192Z",
        //     "updatedAt": "2024-11-24T14:47:07.192Z",
        //     "user": { "user_id": "674a0420d40aac380d7d375e", "user_type": "admin" }
        //   }
        // ]

        setNotifications(data); 
      }
      catch (error) {
        console.error(error);
      }
    };

    getNotifications();
  }, []);

  return (
    <List>
      {notifications.map((notification, index) => {
        // Convert ISO time to a readable format
        const date = new Date(notification.createdAt);
        const formattedDate = date.toLocaleString(); 
        // You can adjust locale or date options if you need a different format
        
        return (
          <React.Fragment key={notification._id}>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary={notification.body}
                secondary={formattedDate} // Display the formatted date as secondary text
              />
            </ListItem>
            {index < notifications.length - 1 && <Divider />}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default RecentActivities;
