import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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

import ActivityCategory from './activityCategories';
import AddUser from './AddUser';
import Preferencetags from './preferenceTags';
import AdminUserProfiles from './adminUserProfiles';
import ViwProduct from '../Shared/Components/Product/Product';
const drawerWidth = 240;



function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] =useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);

  const handleCollapseToggle = () => {
    setCollapseOpen(!collapseOpen);
  };


  const [UsercollapseOpen, setUserCollapseOpen] = useState(false);

  const handleUserCollapseToggle = () => {
    setUserCollapseOpen(!UsercollapseOpen);
  };

  const [ openTab , setOpenTab ] = useState('ComplaintsTable');

  const [tab, setTab] = useState(<ComplaintsTable />);


  useEffect(() => {

    console.log(localStorage.getItem('openTab'));

    

    const tab = () => {
      localStorage.getItem('openTab') && setOpenTab(localStorage.getItem('openTab'));

      console.log('openTab', openTab);

      switch(openTab){
        case 'ComplaintsTable':
          setTab(<ComplaintsTable />);
          return <ComplaintsTable />
        case 'DeletionRequests':
          setTab(<DeletionRequests />);
          return <DeletionRequests />
        case 'EventsAndItineraries':
          setTab(<EventsAndItineraries />);
          return <EventsAndItineraries />
        case 'RegistringUsers':
          setTab(<RegistringUsers />);
          return <RegistringUsers />

          case 'ViwProduct':
            setTab(<ViwProduct />);
            return <ViwProduct />

            case 'AdminUserProfiles':
              setTab(<AdminUserProfiles />);
              return <AdminUserProfiles />

              case 'Preferencetags':
                setTab(<Preferencetags/>);
                return <Preferencetags/>

                case 'AddUser':
                  setTab(<AddUser />);
                  return <AddUser />

                  case 'ActivityCategory':
                    setTab(<ActivityCategory />);
                    return <ActivityCategory />

        default:
          setTab(<ComplaintsTable />);
          return <ComplaintsTable />
      }
    }

    tab();

   

  }, [openTab]);

  const handleTabChange = (tab) => {
    setOpenTab(tab);
    localStorage.setItem('openTab', tab);

    console.log('openTab', openTab);
  }


  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        
        <ListItemButton onClick={handleUserCollapseToggle}>
          <ListItemText primary="Users" />
          {UsercollapseOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={UsercollapseOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {['ComplaintsTable', 'DeletionRequests', 'EventsAndItineraries', 'RegistringUsers','ViwProduct','AdminUserProfiles','Preferencetags','AddUser','ActivityCategory'].map((text) => (
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
          <List component="div" disablePadding>
            {['ComplaintsTable', 'DeletionRequests', 'EventsAndItineraries', 'RegistringUsers','ViwProduct','AdminUserProfiles','Preferencetags','AddUser','ActivityCategory'].map((text) => (
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
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` },marginTop: "50px" }}
      >


          {tab}
        {/* <ComplaintsTable /> */}
        {/* <DeletionRequests /> */}
        {/* <EventsAndItineraries /> */}
        {/* <RegistringUsers /> */}
        
      </Box>
    </Box>
  );
}



export default ResponsiveDrawer;
