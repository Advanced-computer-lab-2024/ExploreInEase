import { List, ListItem, ListItemText, ListItemIcon, Divider, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecentActivities = ({ maxNotifications = 10, maxHeight = 300 }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const UserId = localStorage.getItem("UserId");

    const getNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/allNotifications/${UserId}/admin`);
        const data = response.data; 
        setNotifications(data);
      } catch (error) {
        console.error(error);
      }
    };

    getNotifications();
  }, []);

  // Limit the notifications displayed
  const displayedNotifications = notifications.slice(0, maxNotifications);

  return (
    <Box sx={{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }}>
      <List>
        {displayedNotifications.map((notification, index) => {
          const date = new Date(notification.createdAt);
          const formattedDate = date.toLocaleString();
          return (
            <React.Fragment key={notification._id}>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary={notification.body}
                  secondary={formattedDate}
                />
              </ListItem>
              {index < displayedNotifications.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default RecentActivities;
