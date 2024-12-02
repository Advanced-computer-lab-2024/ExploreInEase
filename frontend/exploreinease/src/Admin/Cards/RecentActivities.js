import { List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import React from 'react';

const RecentActivities = () => {
  const activities = [
    "User John Doe filed a complaint",
    "Admin Jane approved an event",
    "New user registration: alice@example.com",
    "Product ABC archived",
  ];

  return (
    <List>
      {activities.map((activity, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary={activity} />
          </ListItem>
          {index < activities.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default RecentActivities;
