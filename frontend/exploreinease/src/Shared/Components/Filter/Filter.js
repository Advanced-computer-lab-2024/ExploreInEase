import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Rating,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardMedia,
  IconButton
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';  
import { useLocation } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import React, { useState, useEffect } from "react";
import debounce from 'lodash.debounce';
import NetworkService from "../../../NetworkService";
import TouristNavbar from "../../../Tourist/TouristNavbar";
import TravelItemsShareDialog from './TravelItemsShareDialog';
import nodata from "../../../Shared/nodata.avif";
import NodataFound from "../../../No data Found.avif";
const roleFields = {
  HistoricalPlaces: ['Tag'],
  Activities: ['budget', 'date', 'category', 'rating'],
  Itineraries: ['budget', 'date', 'preferences', 'language'],
};
const Filter = ({ eventsG = [], typeeG = '' }) => {
  const Userr = JSON.parse(localStorage.getItem('User'));
  let typeTourist = localStorage.getItem('userType') || '';
  localStorage.removeItem('userType');
  const location = useLocation();
  const { userType: userTypee } = location.state || '';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const { events, userId = null, typee } = location.state || {};
  const [itemList, setItemList] = useState(events?.flat() || eventsG?.flat() || []); // Flatten the array and ensure it's initialized
  const [filters, setFilters] = useState({
    budget: '',
    price: '',
    date: '',
    rating: 0,
    category: '',
    language: '',
    preferences: '',
    Tag: '',
    search: '',
    sortBy: '',
  });
  const [filteredData, setFilteredData] = useState([]);
  const [role, setRole] = useState('Activities'); // Default to Main to show all
  const [addressCache] = useState({});
  // const [historicalTags, setHistoricalTags] = useState({});
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ shareDialogOpen,setShareDialogOpen] = useState(false);
  const [type, setType] = useState(''); 
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState(Userr.currency);
  const [success,setSuccess]=useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [ errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [payment, setPayment] = useState('');
  const [cardNumber, setcardNumber] = useState('');
  const [expYear, setexpYear] = useState('');
  const [expMonth, setexpMonth] = useState('');
  const [cvc, setcvc] = useState('');
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);
  
  useEffect(() => {
    if (showErrorMessage) {
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorMessage]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false); // Hide the alert after 3 seconds
      }, 7000);
  
      return () => clearTimeout(timer); // Clean up the timer on component unmount
    }
  }, [success]);

  useEffect(() => {
    const initialData = itemList.filter(item =>
      (role === 'Activities' && item.type === 'Activity') ||
      (role === 'Itineraries' && item.type === 'Itinerary') ||
      (role === 'HistoricalPlaces' && item.type === 'HistoricalPlace')
    );
    console.log("itemList",itemList);
    console.log("initalData",initialData);
    let event;
    if(role === 'Activities'){
      event = 'activity';
    }
    else{
      if(role === 'Itineraries'){
        event = 'itinerary';
      }
      else{
        event = 'historical';
      }
    }
        
    const adjustedFilteredData = initialData.map((item) => ({
      ...item,
      picture: localStorage.getItem(`${event}-image-${item.id}`) || nodata,
    }));
    console.log(adjustedFilteredData);

    setFilteredData(adjustedFilteredData);

  },[itemList]);

  useEffect(() => {
    fetchEvents();
  },[currency]);

  const  fetchEvents=async()=> {
    try {
      let currency=Userr.currency;
      const options = {
        apiPath: `/upcomingEvents/${Userr.currency}`,
        urlParam: { currency },
      };

      const response = await NetworkService.get(options); // Fetch data from NetworkService
      setItemList(response.flat());
      console.log(response);
        // setFilteredData(response.flat());
    } catch (err) {
      console.error("Error fetching events:", err);
      console.log("An unexpected error occurred.");
    }
  }
  const handleShareClick = (item) => {
    setSelectedItem(item);
    setShareDialogOpen(true);
  };
  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  const handlePayment = (event) => {

    const value = event.target.value; // Get the selected value
    console.log(value);
    setPayment(value); // Update the state
  };

  const handlePromoCode = (event) => {
    setPromoCode(event.target.value);
  };
  const handlecardNumber = (event) => {
    setcardNumber(event.target.value);
  }; const handleexpYear = (event) => {
    setexpYear(event.target.value);
  }; const handleexpMonth = (event) => {
    setexpMonth(event.target.value);
  }; const handlecvc = (event) => {
    setcvc(event.target.value);
  }

  const fetchAddressFromAPI = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
          },
        }
      );
  
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
  
      const data = await response.json();
      return data.display_name.split(',').slice(0, 3).join(',');
    } catch (error) {
      console.error('Error fetching address:', error);
      return `${Math.abs(latitude)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude)}°${longitude >= 0 ? 'E' : 'W'}`;
    }
  };
  const debouncedFetchAddress = debounce(async (latitude, longitude, setAddress) => {
    const cacheKey = `${latitude},${longitude}`;
  
    if (addressCache[cacheKey]) {
      setAddress(addressCache[cacheKey]);
    } else {
      const address = await fetchAddressFromAPI(latitude, longitude);
      addressCache[cacheKey] = address; 
      setAddress(address);
    }
  }, 300);
  const LocationDisplay = ({ coordinates }) => {
    const [address, setAddress] = useState('Press here to view location...');
  
    useEffect(() => {
      if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
        const [longitude, latitude] = coordinates;
        debouncedFetchAddress(latitude, longitude, setAddress);
      }
    }, [coordinates]);
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {address}
        <Button
          size="small"
          onClick= 
          {() => {
            const [longitude,latitude] = coordinates;
            window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
          }}
          style={{ minWidth: 'auto', padding: '4px' }}
        >
          🗺️
        </Button>
      </span>
    );
  };
  // Handle Input Change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Rating Change
  const handleRatingChange = (event, newRating) => {
    setFilters({
      ...filters,
      rating: newRating,
    });
  };

  const handleRoleChange = (event, newValue) => {
    setRole(newValue);
    applyFilters(newValue); // Apply filters immediately when changing tabs
  };

  // Apply Filters
  const applyFilters = (roleToFilter = role) => {
    let data = itemList;

    // Filter by role-specific type
    if (roleToFilter === 'Activities') {
      data = data.filter((item) => item.type === 'Activity');
    } else if (roleToFilter === 'Itineraries') {
      data = data.filter((item) => item.type === 'Itinerary');
    } else if (roleToFilter === 'HistoricalPlaces') {
      data = data.filter((item) => item.type === 'HistoricalPlace');
    }

    // Apply other filters
    if (filters.budget) {
      data = data.filter((item) => item.budget <= parseFloat(filters.budget));
    }

    if (filters.price) {
      data = data.filter((item) => item.price.toString() === filters.price);
    }

    if (filters.date) {
      data = data.filter((item) => item.date === filters.date);
    }

    if (filters.rating) {
      data = data.filter((item) => item.rating >= filters.rating && item.rating <= 5);
    }

    if (filters.category) {
      data = data.filter((item) => item.category === filters.category);
    }

    if (filters.language) {
      data = data.filter((item) => item.language === filters.language);
    }

    if (filters.preferences) {
      data = data.filter((item) => item.preferences === filters.preferences);
    }

    if (filters.Tag) {
      data = data.filter((item) => item.Tag === filters.Tag);
    }

    // Search by name
    if (filters.search) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Sort logic
    if (filters.sortBy === 'price') {
      data.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      data.sort((a, b) => b.rating - a.rating);
    }

    setFilteredData(data);
  };

  const handleBookmarkClick = async (item) => {
    const touristId = Userr._id;
    const id = item.id;  // 'Activity', 'Itinerary', 'HistoricalPlace'
    const type = item.type;
    console.log(item);
    console.log(id);
    console.log(type);

  
    try {
      const options = {
        apiPath: `/bookmark/${touristId}/${id}/${type}` ,// POST request to the correct endpoint
      };
      
      const response = await NetworkService.post(options);  // Use POST instead of PUT
      console.log(response);
    } catch (error) {
      console.error('Error bookmarking event:', error);
      alert('Failed to bookmark event. Please try again.');
    }
  };
  // Reset Filters
  const resetFilters = () => {
    setFilters({
      budget: '',
      price: '',
      date: '',
      rating: 0,
      category: '',
      language: '',
      preferences: '',
      Tag: '',
      search: '',
      sortBy: '',
    });

    // Filter items based on the current role
    const resetData = itemList.filter(item => {
      if (role === 'Activities') return item.type === 'Activity';
      if (role === 'Itineraries') return item.type === 'Itinerary';
      if (role === 'HistoricalPlaces') return item.type === 'HistoricalPlace';
      return false;
    });

    setFilteredData(resetData);
  };

  // Helper function to check if a field should be displayed for the current role
  const shouldDisplayField = (field) => {
    return roleFields[role]?.includes(field);
  };

  // const getHistoricalTags = async (tagId) => {
  //   try {
  //     const apiPath = `http://localhost:3030/getHistoricalTagDetails/${tagId}`;
  //     const response = await axios.get(apiPath);
  //     const tagsArray = response.data.tags.map((tag) => `${tag.period} ${tag.type}`);
  //     setHistoricalTags((prevTags) => ({ ...prevTags, [tagId]: tagsArray }));
  //     console.log("Historical Tags",historicalTags);
      
  //   } catch (err) {
  //     console.log(err.response ? err.message : 'An unexpected error occurred.');
  //   }
  // };
  // const getAllTags=async ()=>{
  //   try {
  //     const apiPath = `http://localhost:3030/getAllPreferenceTags/${id}`;  // Ensure this matches your API route
  //     const response = await axios.get(apiPath);
  //     // console.log(response);
      
  //     if (Array.isArray(response.data.tags)) {
  //       const tags = response.data.tags.map(tag => ({
  //         id: tag._id,
  //         name: tag.tags
  //       }));
  //       setTagsList(tags);    
  //       console.log("tags",tagsList);
          
  //     } else {
  //       console.error('Unexpected data format from API');
  //     }
      
  //   } catch (err) {
  //     // Check if there is a response from the server and handle error
  //     if (err.response) {
  //       console.error('API Error:', err.message);
  //       // setError(err.response.data.message);  // Display error message from the server
  //     } else {
  //       console.error('Unexpected Error:', err);
  //       // setError('An unexpected error occurred.');  // Display generic error message
  //     }
  //   }
  // }
  // const renderTags = (tagId) => {
  //   console.log("Historical Tags",historicalTags);
    
  //   if (!historicalTags[tagId]) {
  //     // Fetch tags only if they haven't been fetched yet
  //     getHistoricalTags(tagId);
  //     return 'Loading...';
  //   }
  //   // Display the cached tags
  //   return historicalTags[tagId].join(', ');
  // };
  const handleClose = () => {
    setOpen(false);
    setType(null);
    setCurrency(null);
    setBudget(null);
     setSelectedItem(null); 
    
  };
  const handleClickOpen = (item) => {
     setSelectedItem(item);   
    setOpen(true);
  };
  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleChangeCurrency = (event) => {
    setCurrency(event.target.value);
  };
  const handleBudgetChange = (event) => {
    setBudget(event.target.value);
  };
  const handleSaveBook=async(selectedItem,budget,type,currency)=>{
    console.log(selectedItem);
    console.log("type:",type);
    console.log(payment);
    if (selectedItem.type === 'Activity') {
      if (payment == 'Wallet') {
        try {
          const options = {
            apiPath: `/bookEvent`,
            body: {
              userType: 'tourist',
              touristId: Userr._id,
              eventType: 'activity',
              eventID: selectedItem.id,
              ticketType: '',
              currency: currency,
              activityPrice: budget
            }
          };
          const response = await NetworkService.put(options);
          console.log(response);
          setFilteredData(prevData => prevData.filter(item => item.id !== selectedItem.id));
          setSuccess(true);
          setSuccessMessage(response.data.message || "Save Successfully!");
          setShowSuccessMessage(true);

        } catch (error) {
          setErrorMessage(error.response?.data?.message || 'An error occurred');
          setShowErrorMessage(true);
          console.log('Error fetching historical places:', error);
        }
      } else {
        try {
          const options = {
            apiPath: "/bookEventWithCard",
            body: {
              userType: 'tourist',
              touristId: Userr._id,
              eventType: 'activity',
              eventID: selectedItem.id,
              ticketType: '',
              currency: currency,
              activityPrice: budget,
              paymentType: 'card',
              cardNumber: cardNumber,
              expMonth: expMonth,
              expYear: expYear,
              cvc: cvc
            }
          };
          const response = await NetworkService.post(options);
          console.log(response);
          setFilteredData(prevData => prevData.filter(item => item.id !== selectedItem.id));
          setSuccess(true);
          setSuccessMessage(response.data.message || "Save Successfully!");
          setShowSuccessMessage(true);

        } catch (error) {
          setErrorMessage(error.response?.data?.message || 'An error occurred');
          setShowErrorMessage(true);
          console.log('Error fetching historical places:', error);
        }
      }
    }

    else if (selectedItem.type === 'Itinerary') {
      console.log(selectedItem);
      if (payment == 'Wallet') {
        try {
          const options = {
            apiPath: `/bookEvent`,
            body: {
              userType: 'tourist',
              touristId: Userr._id,
              eventType: 'itinerary',
              eventID: selectedItem.id,
              ticketType: '',
              currency: currency,
              activityPrice: ''
            }
          };
          const response = await NetworkService.put(options);
          console.log(response);
          setFilteredData(prevData => prevData.filter(item => item.id !== selectedItem.id));
          setSuccess(true);
          setSuccessMessage(response.data.message || "Save Successfully!");
          setShowSuccessMessage(true);

        } catch (error) {
          setErrorMessage(error.response?.data?.message || 'An error occurred');
          setShowErrorMessage(true);
          console.log('Error fetching historical places:', error);
        }
      } else {
        try {
          const options = {
            apiPath: `/bookEventWithCard`,
            body: {
              userType: 'tourist',
              touristId: Userr._id,
              eventType: 'itinerary',
              eventID: selectedItem.id,
              ticketType: '',
              currency: currency,
              activityPrice: '',
              paymentType: 'card',
              cardNumber: cardNumber,
              expMonth: expMonth,
              expYear: expYear,
              cvc: cvc
            }
          };
          const response = await NetworkService.post(options);
          console.log(response);
          setFilteredData(prevData => prevData.filter(item => item.id !== selectedItem.id));
          setSuccess(true);
          setSuccessMessage(response.data.message || "Save Successfully!");
          setShowSuccessMessage(true);

        } catch (error) {
          setErrorMessage(error.response?.data?.message || 'An error occurred');
          setShowErrorMessage(true);
          console.log('Error fetching historical places:', error);
        }
      }
    }
    else {
      if (type === 'student') {
        if (payment == 'Wallet') {
          try {
            const options = {
              apiPath: `/bookEvent`,
              body: {
                userType: 'tourist',
                touristId: Userr._id,
                eventType: 'historicalPlace',
                eventID: selectedItem.id,
                ticketType: type,
                currency: '',
                activityPrice: selectedItem.ticketPrice[0]
              }
            };
            const response = await NetworkService.put(options);
            console.log(response);
            setFilteredData(prevData => prevData.filter(item => item.id !== selectedItem.id));
            setSuccess(true);
            setSuccessMessage(response.data.message || "Save Successfully!");
            setShowSuccessMessage(true);

          } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred');
            setShowErrorMessage(true);
            console.log('Error fetching historical places:', error);
          }
        } else {
          try {
            const options = {
              apiPath: `/bookEventWithCard`,
              body: {
                userType: 'tourist',
                touristId: Userr._id,
                eventType: 'historicalPlace',
                eventID: selectedItem.id,
                ticketType: type,
                currency: '',
                activityPrice: selectedItem.ticketPrice[0],
                paymentType: 'card',
                cardNumber: cardNumber,
                expMonth: expMonth,
                expYear: expYear,
                cvc: cvc

              }
            };
            const response = await NetworkService.post(options);
            console.log(response);
            setFilteredData(prevData => prevData.filter(item => item.id !== selectedItem.id));
            setSuccess(true);
            setSuccessMessage(response.data.message || "Save Successfully!");
            setShowSuccessMessage(true);

          } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred');
            setShowErrorMessage(true);
            console.log('Error fetching historical places:', error);
          }
        }
      }
      else if (type === 'native') {
        if (payment == 'Wallet') {
          try {
            const options = {
              apiPath: `/bookEvent`,
              body: {
                userType: 'tourist',
                touristId: Userr._id,
                eventType: 'historicalPlace',
                eventID: selectedItem.id,
                ticketType: type,
                currency: '',
                activityPrice: selectedItem.ticketPrice[0]
              }
            };
            const response = await NetworkService.put(options);
            console.log(response);
            setFilteredData(prevData => prevData.filter(item => item.id !== selectedItem.id));
            setSuccess(true);
            setSuccessMessage(response.data.message || "Save Successfully!");
            setShowSuccessMessage(true);

          } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred');
            setShowErrorMessage(true);
            console.log('Error fetching historical places:', error);
          }
        } else {
          try {
            const options = {
              apiPath: `/bookEventWithCard`,
              body: {
                userType: 'tourist',
                touristId: Userr._id,
                eventType: 'historicalPlace',
                eventID: selectedItem.id,
                ticketType: type,
                currency: '',
                activityPrice: selectedItem.ticketPrice[0],
                paymentType: 'card',
                cardNumber: cardNumber,
                expMonth: expMonth,
                expYear: expYear,
                cvc: cvc
              }
            };
            const response = await NetworkService.post(options);
            console.log(response);
            setFilteredData(prevData => prevData.filter(item => item.id !== selectedItem.id));
            setSuccess(true);
            setSuccessMessage(response.data.message || "Save Successfully!");
            setShowSuccessMessage(true);

          } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred');
            setShowErrorMessage(true);
            console.log('Error fetching historical places:', error);
          }
        }
      }
      else {
        if (payment == 'Wallet') {
          try {
            const options = {
              apiPath: `/bookEvent`,
              body: {
                userType: 'tourist',
                touristId: Userr._id,
                eventType: 'historicalPlace',
                eventID: selectedItem.id,
                ticketType: type,
                currency: '',
                activityPrice: selectedItem.ticketPrice[0]
              }
            };
            const response = await NetworkService.put(options);
            console.log(response);
            setFilteredData(prevData => prevData.filter(item => item.id !== selectedItem.id));
            setSuccess(true);
            setSuccessMessage(response.data.message || "Save Successfully!");
            setShowSuccessMessage(true);

          } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred');
            setShowErrorMessage(true);
            console.log('Error fetching historical places:', error);
          }
        } else {
          try {
            const options = {
              apiPath: `/bookEventWithCard`,
              body: {
                userType: 'tourist',
                touristId: Userr._id,
                eventType: 'historicalPlace',
                eventID: selectedItem.id,
                ticketType: type,
                currency: '',
                activityPrice: selectedItem.ticketPrice[0],
                paymentType: 'card',
                cardNumber: cardNumber,
                expMonth: expMonth,
                expYear: expYear,
                cvc: cvc
              }
            };
            const response = await NetworkService.post(options);
            console.log(response);
            setFilteredData(prevData => prevData.filter(item => item.id !== selectedItem.id));
            setSuccess(true);
            setSuccessMessage(response.data.message || "Save Successfully!");
            setShowSuccessMessage(true);

          } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred');
            setShowErrorMessage(true);
            console.log('Error fetching historical places:', error);
          }
        }
      }

    }
    handleClose();
  }

const handleOpenDialog = (data) => {
  setDialogData(data);
  setDialogOpen(true);
};

const handleCloseDialog = () => {
  setDialogOpen(false);
  setDialogData(null);
};

  return (
<div>
      {
        userTypee==='tourist' &&(
          <TouristNavbar/>
        )
      }

    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
     <div style={{ position: 'absolute', top: '20px', right: '20px', width: '300px' }}>
      {/* Alert component to show success message */}
      {success && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Booked successfully
        </Alert>
      )}
      {/* Your other component code here */}
    </div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2, display: 'flex', justifyContent: 'center' }}>
        <Tabs value={role} onChange={handleRoleChange}>
          <Tab label="Activities" value="Activities" />
          <Tab label="Itineraries" value="Itineraries" />
          <Tab label="Historical Places" value="HistoricalPlaces" />
        </Tabs>
      </Box>

      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: '300px', padding: '20px', backgroundColor: '#f5f5f5' }}>
          <h3>Filters</h3>
          <TextField
            label="Search by Name"
            variant="outlined"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          {role ==='Itineraries' && (
            <FormControl fullWidth style={{ marginBottom: '20px' }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={filters.sortBy} onChange={handleFilterChange} name="sortBy">
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
          )}
          {role === 'Activities' && (
            <FormControl fullWidth style={{ marginBottom: '20px' }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={filters.sortBy} onChange={handleFilterChange} name="sortBy">
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {shouldDisplayField('budget') && (
              <TextField
                label="Budget"
                variant="outlined"
                name="budget"
                value={filters.budget}
                onChange={handleFilterChange}
                fullWidth
              />
            )}

            {shouldDisplayField('Tag') && (
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tag</InputLabel>
                <Select
                  label="Tag"
                  name="Tag"
                  value={filters.Tag}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Monuments">Monuments</MenuItem>
                  <MenuItem value="Museums">Museums</MenuItem>
                  <MenuItem value="Palaces">Palaces</MenuItem>
                </Select>
              </FormControl>
            )}

            {shouldDisplayField('preferences') && (
              <TextField
                label="Preferences"
                variant="outlined"
                name="preferences"
                value={filters.preferences}
                onChange={handleFilterChange}
                fullWidth
              />
            )}

            {shouldDisplayField('category') && (
              <TextField
                label="Category"
                variant="outlined"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                fullWidth
              />
            )}

            {shouldDisplayField('language') && (
              <TextField
                label="Language"
                variant="outlined"
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
                fullWidth
              />
            )}

            {shouldDisplayField('date') && (
              <TextField
                label="Date"
                variant="outlined"
                name="date"
                type="date"
                value={filters.date}
                onChange={handleFilterChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}

            {shouldDisplayField('rating') && (
              <div>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={filters.rating}
                  onChange={handleRatingChange}
                  precision={0.5}
                />
              </div>
            )}

            <Button variant="contained" color="primary" onClick={() => applyFilters()}>
              Apply Filters
            </Button>
            <Button variant="outlined" color="secondary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>

{filteredData.length>0 ?(
  <Grid container spacing={2} style={{ padding: '20px', flex: 1 }}>
  {filteredData.map((item) => (
    <Grid item xs={12} sm={6} md={4} key={item.id}>
      <Card    
        style={{
          width: 'auto',
          height: 'auto',
          margin: '16px',
          padding: '16px',
          border: '1px solid #ddd',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
      }}
      onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        }}
        >
       <CardMedia
          component="img"
          height="150"
          image={item.picture || nodata} // Default placeholder if no image URL is provided
          alt={item.name}
          style={{ borderRadius: '8px 8px 0 0' }}
          />
        <CardContent>
        <div style={{ display: 'flex', alignItems: 'center'}}>  
         <Typography variant="h5" component="div">
           {item.name}
         </Typography>
         <IconButton onClick={() => handleOpenDialog(item)} style={{ marginTop: '8px' }}>
            <InfoIcon color="primary" />
          </IconButton>
          </div>
          {item.type === 'Activity' && (
            <>
              <Typography><strong>Locations:</strong>
                   { 
                      <LocationDisplay coordinates={item.location} />
                 }
              </Typography> 
               {item.specialDiscount && (
                <Typography ><strong>Special Discount:</strong> {item.specialDiscount}%</Typography>
              )}
            </>
          )}
          {item.type === 'Itinerary' && (
            <>
              <Typography ><strong>Activities:</strong> {item.activities.join(', ')}</Typography>
              <Typography ><strong>Locations:</strong> {item.locations.join(', ')}</Typography>   
     
            </>
          )}
          {item.type === 'HistoricalPlace' && (
            <>
              <Typography><strong>Description:</strong> {item.description}</Typography>
              <Typography><strong>Locations:</strong>
                  { 
                      <LocationDisplay coordinates={item.location} />
                 }
              </Typography>
            </>
          )}
              {userTypee==="tourist" && (<>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
               <Button variant="contained" color="primary" onClick={() => handleClickOpen(item)}>
                 Book a ticket 
                </Button> 
              <Button
              variant="contained"
              color="primary"
              onClick={() => handleShareClick(item)}
              style={{ marginLeft: '10px' }}
             >
              Share
            </Button>
                
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleBookmarkClick(item)}
              style={{ marginLeft: '10px' }}
            >
              Bookmark
            </Button>
           </div>
        
      
                       <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
<DialogTitle>More Details  </DialogTitle>
<DialogContent>
  {dialogData && (
    <div>
      {item.type === 'Activity' && (
        <>
          <Typography><strong>Budget:</strong> {dialogData.budget}</Typography>
          <Typography><strong>Date:</strong> {dialogData.date}</Typography>
          <Typography><strong>Category:</strong> {dialogData.category}</Typography>
          {dialogData.specialDiscount && (
            <Typography><strong>Special Discount:</strong> {dialogData.specialDiscount}%</Typography>
          )}
        </>
      )}
      {item.type === 'Itinerary' && (
        <>
          <Typography><strong>Price:</strong> {dialogData.price}</Typography>
          <Typography><strong>Rating:</strong> {dialogData.rating.length === 0 ? 0 : dialogData.rating}</Typography>
          <Typography><strong>Language:</strong> {dialogData.language}</Typography>
          <Typography><strong>Dropoff location:</strong> {dialogData.dropoffLocation}</Typography>
          <Typography><strong>Pickup location:</strong> {dialogData.pickupLocation}</Typography>
          <Typography><strong>Directions:</strong> {dialogData.directions}</Typography>
        </>
      )}
      {item.type === 'HistoricalPlace' && (
        <>
          <Typography><strong>Students ticket price:</strong> {dialogData.ticketPrice[0]}</Typography>
          <Typography><strong>Native ticket price:</strong> {dialogData.ticketPrice[1]}</Typography>
          <Typography><strong>Foreign ticket price:</strong> {dialogData.ticketPrice[2]}</Typography>
        </>
      )}
    </div>
  )}
</DialogContent>
</Dialog> 
        </>)}
          </CardContent>

          </Card> 
     
        </Grid>
          ))}

        </Grid>
):(
  <div
  style={{
    width: "400px", // Set a fixed width for the GIF
    height: "400px", // Set a fixed height to match the width
    position: "relative",
    marginLeft:'600px',
    marginTop:'100px',
    alignContent:'center',
    alignItems:'center'
  }}
>
  <img
    src={NodataFound}
    width="100%"
    height="100%"

  ></img>
</div>
 )}
      

                {shareDialogOpen && (
                    <TravelItemsShareDialog item={selectedItem} onClose={handleShareDialogClose} />
                  )} 
                
                <Dialog
                  open={open}
                  onClose={handleClose}
                 
               >
                <DialogTitle id="alert-dialog-title">
                {'Book a Ticket for '} {selectedItem?.name}
                </DialogTitle>
                <DialogContent>
                {selectedItem && (
        <>
          {selectedItem.type === 'Activity' && (
            <>
<Typography>Budget for Activity: {selectedItem.budget}</Typography>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px', marginTop: '10px' }}>Choose your payment type:</span>
                        <FormControl variant="standard" style={{ minWidth: '165px' }}>
                          <InputLabel id="demo-simple-select-label">payment</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={payment}
                            label="payment"
                            onChange={handlePayment}
                            required
                          >
                            <MenuItem value={'Wallet'}>Wallet</MenuItem>
                            <MenuItem value={'Card'}>Card</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px', marginTop: '10px' }}>Choose your currency:</span>
                        <FormControl variant="standard" style={{ minWidth: '165px' }}>
                          <InputLabel id="demo-simple-select-label">currency</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={currency}
                            label="currency"
                            onChange={handleChangeCurrency}
                            required
                          >
                            <MenuItem value={'EGP'}>EGP</MenuItem>
                            <MenuItem value={'euro'}>euro</MenuItem>
                            <MenuItem value={'dollar'}>USD</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ marginRight: '8px', marginTop: '10px' }}>Write your Budget for the Activity:</span>
                        <TextField
                          id="standard-basic"
                          label="budget"
                          type="number"
                          variant="standard"
                          style={{ width: '150px' }}
                          required
                          value={budget}
                          onChange={handleBudgetChange}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ marginRight: '8px', marginTop: '10px' }}>PromoCode:</span>
                        <TextField
                          id="standard-basic"
                          label="PromoCode"
                          type="string"
                          variant="standard"
                          style={{ width: '150px' }}
                          required
                          value={promoCode}
                          onChange={handlePromoCode}
                        />
                      </div>

                      {payment === 'Card' && (
                        <div style={{ marginTop: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ marginRight: '8px' }}>Card Number:</span>
                            <TextField
                              id="card-number"
                              label="Card Number"
                              variant="standard"
                              style={{ width: '200px' }}
                              required
                              value={cardNumber}
                              onChange={handlecardNumber}
                              inputProps={{ maxLength: 16 }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ marginRight: '8px' }}>CVV:</span>
                            <TextField
                              id="cvv"
                              label="CVV"
                              variant="standard"
                              type="password"
                              style={{ width: '100px' }}
                              required
                              value={cvc}
                              onChange={handlecvc}
                              inputProps={{ maxLength: 3 }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ marginRight: '8px' }}>Expiration Date:</span>
                            <TextField
                              id="expiry-month"
                              label="MM"
                              variant="standard"
                              style={{ width: '60px', marginRight: '8px' }}
                              required
                              value={expMonth}
                              onChange={handleexpMonth}
                              inputProps={{ maxLength: 2 }}
                            />
                            <span style={{ marginRight: '8px' }}>/</span>
                            <TextField
                              id="expiry-year"
                              label="YY"
                              variant="standard"
                              style={{ width: '60px' }}
                              required
                              value={expYear}
                              onChange={handleexpYear}
                              inputProps={{ maxLength: 4 }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {selectedItem.type === 'Itinerary' && (
                    <>
                      <Typography>Activities: {selectedItem.activities.join(', ')}</Typography>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px', marginTop: '10px' }}>Choose your payment type:</span>
                        <FormControl variant="standard" style={{ minWidth: '165px' }}>
                          <InputLabel id="demo-simple-select-label">payment</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={payment}
                            label="payment"
                            onChange={handlePayment}
                            required
                          >
                            <MenuItem value={'Wallet'}>Wallet</MenuItem>
                            <MenuItem value={'Card'}>Card</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px', marginTop: '10px' }}>Choose your currency:</span>
                        <FormControl variant="standard" style={{ minWidth: '165px' }}>
                          <InputLabel id="demo-simple-select-label">currency</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={currency}
                            label="currency"
                            onChange={handleChangeCurrency}
                            required
                          >
                            <MenuItem value={'EGP'}>EGP</MenuItem>
                            <MenuItem value={'euro'}>euro</MenuItem>
                            <MenuItem value={'dollar'}>USD</MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ marginRight: '8px', marginTop: '10px' }}>PromoCode:</span>
                        <TextField
                          id="standard-basic"
                          label="PromoCode"
                          type="string"
                          variant="standard"
                          style={{ width: '150px' }}
                          required
                          value={promoCode}
                          onChange={handlePromoCode}
                        />
                      </div>

                      {payment === 'Card' && (
                        <div style={{ marginTop: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ marginRight: '8px' }}>Card Number:</span>
                            <TextField
                              id="card-number"
                              label="Card Number"
                              variant="standard"
                              style={{ width: '200px' }}
                              required
                              value={cardNumber}
                              onChange={handlecardNumber}
                              inputProps={{ maxLength: 16 }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ marginRight: '8px' }}>CVV:</span>
                            <TextField
                              id="cvv"
                              label="CVV"
                              variant="standard"
                              type="password"
                              style={{ width: '100px' }}
                              required
                              value={cvc}
                              onChange={handlecvc}
                              inputProps={{ maxLength: 3 }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ marginRight: '8px' }}>Expiration Date:</span>
                            <TextField
                              id="expiry-month"
                              label="MM"
                              variant="standard"
                              style={{ width: '60px', marginRight: '8px' }}
                              required
                              value={expMonth}
                              onChange={handleexpMonth}
                              inputProps={{ maxLength: 2 }}
                            />
                            <span style={{ marginRight: '8px' }}>/</span>
                            <TextField
                              id="expiry-year"
                              label="YY"
                              variant="standard"
                              style={{ width: '60px' }}
                              required
                              value={expYear}
                              onChange={handleexpYear}
                              inputProps={{ maxLength: 4 }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {selectedItem.type === 'HistoricalPlace' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px', marginTop: '10px' }}>Choose your Type:</span>
                        <FormControl variant="standard" style={{ minWidth: '165px' }}>
                          <InputLabel id="demo-simple-select-label">Type</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            label="Type"
                            onChange={handleChange}
                            required
                          >
                            <MenuItem value={'native'}>Native</MenuItem>
                            <MenuItem value={'student'}>Student</MenuItem>
                            <MenuItem value={'foreigner'}>Foreigner</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px', marginTop: '10px' }}>Choose your payment type:</span>
                        <FormControl variant="standard" style={{ minWidth: '165px' }}>
                          <InputLabel id="demo-simple-select-label">payment</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={payment}
                            label="payment"
                            onChange={handlePayment}
                            required
                          >
                            <MenuItem value={'Wallet'}>Wallet</MenuItem>
                            <MenuItem value={'Card'}>Card</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px', marginTop: '10px' }}>Choose your currency:</span>
                        <FormControl variant="standard" style={{ minWidth: '165px' }}>
                          <InputLabel id="demo-simple-select-label">currency</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={currency}
                            label="currency"
                            onChange={handleChangeCurrency}
                            required
                          >
                            <MenuItem value={'EGP'}>EGP</MenuItem>
                            <MenuItem value={'euro'}>euro</MenuItem>
                            <MenuItem value={'dollar'}>USD</MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ marginRight: '8px', marginTop: '10px' }}>PromoCode:</span>
                        <TextField
                          id="standard-basic"
                          label="PromoCode"
                          type="string"
                          variant="standard"
                          style={{ width: '150px' }}
                          required
                          value={promoCode}
                          onChange={handlePromoCode}
                        />
                      </div>

                        {payment === 'Card' && (
                        <div style={{ marginTop: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ marginRight: '8px' }}>Card Number:</span>
                            <TextField
                              id="card-number"
                              label="Card Number"
                              variant="standard"
                              style={{ width: '200px' }}
                              required
                              value={cardNumber}
                              onChange={handlecardNumber}
                              inputProps={{ maxLength: 16 }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ marginRight: '8px' }}>CVV:</span>
                            <TextField
                              id="cvv"
                              label="CVV"
                              variant="standard"
                              type="password"
                              style={{ width: '100px' }}
                              required
                              value={cvc}
                              onChange={handlecvc}
                              inputProps={{ maxLength: 3 }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ marginRight: '8px' }}>Expiration Date:</span>
                            <TextField
                              id="expiry-month"
                              label="MM"
                              variant="standard"
                              style={{ width: '60px', marginRight: '8px' }}
                              required
                              value={expMonth}
                              onChange={handleexpMonth}
                              inputProps={{ maxLength: 2 }}
                            />
                            <span style={{ marginRight: '8px' }}>/</span>
                            <TextField
                              id="expiry-year"
                              label="YY"
                              variant="standard"
                              style={{ width: '60px' }}
                              required
                              value={expYear}
                              onChange={handleexpYear}
                              inputProps={{ maxLength: 4 }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              <div>
                <strong>Important Note:</strong>
                <p>Please note that you must bring a Student ID/Passport/National ID to the location</p>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleSaveBook(selectedItem, budget, type, currency)} autoFocus>
                Book
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
        {showSuccessMessage && (
          <Alert severity="success"
            sx={{
              position: 'fixed',
              top: 80, // You can adjust this value to provide space between success and error alerts
              right: 20,
              width: 'auto',
              fontSize: '1.2rem', // Adjust the size
              padding: '16px',
              zIndex: 9999, // Ensure it's visible above other content
            }}>
            {successMessage}
          </Alert>
        )}
      </div>
    </div>
  );
};
export default Filter;