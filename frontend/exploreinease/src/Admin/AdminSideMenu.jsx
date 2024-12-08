import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeIcon from "@mui/icons-material/Home";

import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect,useState } from 'react';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
//component imports
import ComplaintsTable from './AdminComplaintsTable';
import RegistringUsers from './AdminRegistringUsers';
import DeletionRequests from './DeletionRequests';
import EventsAndItineraries from './EventsAndItenararies';

import AdminHomePage from './AdminHomePage';
import AdminSalesReport from './AdminSalesReport';

import ActivityCategory from './activityCategories';//done
import AddUser from './AddUser';//done
import Preferencetags from './preferenceTags';//done
import AdminUserProfiles from './adminUserProfiles';  //done
import ArchiveProduct from '../Shared/Components/Product/ArchiveProduct';
import ViewProduct from '../Shared/Components/Product/Product';
import ChangePassword from '../TouristGovernor/changePassword';
import Login from '../Login/login';

// import AdminHomePage from './AdminHomePage';



const drawerWidth = 240;



const ResponsiveDrawer = (props) => {
  const adminId = localStorage.getItem("UserId");

  const { window } = props;
  const navigate = useNavigate(); // Use useNavigate hook
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);


  localStorage.setItem("UserId", '674a0420d40aac380d7d375e');

  const handleCollapseToggle = () => {
    setCollapseOpen(!collapseOpen);
  };

  const [UsercollapseOpen, setUserCollapseOpen] = useState(false);

  const handleUserCollapseToggle = () => {
    setUserCollapseOpen(!UsercollapseOpen);
  };

  const [openTab, setOpenTab] = useState("AdminHomePage");

  const [tab, setTab] = useState(<AdminHomePage />);

  useEffect(() => {
    const tab = () => {
      localStorage.getItem("openTab") &&
        setOpenTab(localStorage.getItem("openTab"));
  
      switch (openTab) {
        case "AdminHomePage":
          setTab(<AdminHomePage />);
          return <AdminHomePage />;
        case "ComplaintsTable":
          setTab(<ComplaintsTable />);
          return <ComplaintsTable />;
        case "AdminSalesReport": // Add this case
          setTab(<AdminSalesReport />);
          return <AdminSalesReport />;
        case "DeletionRequests":
          setTab(<DeletionRequests />);
          return <DeletionRequests />;
        case "EventsAndItineraries":
          setTab(<EventsAndItineraries />);
          return <EventsAndItineraries />;
        case "RegistringUsers":
          setTab(<RegistringUsers />);
          return <RegistringUsers />;
        case "ViewProduct":
          setTab(<ViewProduct />);
          return <ViewProduct />;
        case "AdminUserProfiles":
          setTab(<AdminUserProfiles />);
          return <AdminUserProfiles />;
        case "Preferencetags":
          setTab(<Preferencetags />);
          return <Preferencetags />;
        case "AddUser":
          setTab(<AddUser />);
          return <AddUser />;
        case "ActivityCategory":
          setTab(<ActivityCategory />);
          return <ActivityCategory />;
        case "ArchiveProduct":
          setTab(<ArchiveProduct />);
          return <ArchiveProduct />;
        case "ChangePassword":
          setTab(<ChangePassword />);
          return <ChangePassword />;
        default:
          setTab(<AdminHomePage />);
          return <AdminHomePage />;
      }
    };
  
    tab();
  }, [openTab]);
  
  const handleTabChange = (tab) => {
    setOpenTab(tab);
    localStorage.setItem("openTab", tab);
  };
  
  // Update drawer to include AdminSalesReport
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton onClick={() => handleTabChange("AdminHomePage")}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => handleTabChange("AllNotifications")}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="All Notifications" />
        </ListItemButton>
        <Divider />
        
        <ListItemButton onClick={() => handleTabChange("AdminSalesReport")}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Sales Report" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={handleUserCollapseToggle}>
          <ListItemText primary="Users" />
          {UsercollapseOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={UsercollapseOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ backgroundColor: "#156fb7", color: "fff" }}>
            {[
              "ComplaintsTable",
              "DeletionRequests",
              "EventsAndItineraries",
              "RegistringUsers",
              "AddUser",
              "ChangePassword",
            ].map((text) => (
              <ListItemButton
                key={text}
                sx={{ pl: 4 }}
                onClick={() => handleTabChange(text)}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
        <ListItemButton onClick={handleCollapseToggle}>
          <ListItemText primary="Events" />
          {collapseOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ backgroundColor: "#156fb7", color: "fff" }}>
            {[
              "ComplaintsTable",
              "DeletionRequests",
              "EventsAndItineraries",
              "ViewProduct",
              "Preferencetags",
              "ActivityCategory",
              "ArchiveProduct",
            ].map((text) => (
              <ListItemButton
                key={text}
                sx={{ pl: 4 }}
                onClick={() => handleTabChange(text)}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#1261a0",
              color: "white",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#1261a0",
              color: "white",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: "50px",
        }}
      >
        {tab}
      </Box>
    </Box>
  );
};

export default ResponsiveDrawer;

