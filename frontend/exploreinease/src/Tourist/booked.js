import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
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

  DialogTitle
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import React, { useState, useEffect } from "react";
import { differenceInHours } from 'date-fns'; // Use date-fns or a similar library
import { Alert } from '@mui/material'; 
import NetworkService from "../NetworkService";
const Booked = () => {
  const location = useLocation();
  const { events ,userId} = location.state || {};
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  console.log(events);
  
  const itemList = events?.flat() || []; // Flatten the array and ensure it's initialized
  console.log("event",events);
  console.log("user",userId);
  console.log("itemList",itemList);

  const [filters] = useState({
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
  const [historicalTags] = useState({});
  const [openCancelation, setOpenCancelation] = React.useState(false);
  const [openComment, setOpenComment] = React.useState(false);
  const [openRate, setOpenRate] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [rateType, setRateType] = useState(''); 
  const [rating, setRating] = useState(''); 
  const [commentType, setCommentType] = useState(''); 
  const [comment, setComment] = useState('');    
   
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

  // const getAddressFromCoordinates = async (coordinates) => {
  //   if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
  //     return 'Location not available';
  //   }
  //   const [longitude, latitude] = coordinates;

  //   // Check cache first
  //   const cacheKey = `${latitude},${longitude}`;
  //   if (addressCache[cacheKey]) {
  //     return addressCache[cacheKey];
  //   }
  //   try {
  //     const response = await fetch(
  //       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
  //       {
  //         headers: {
  //           'Accept-Language': 'en-US,en;q=0.9',
  //         },
  //       }
  //     );
      
  //     if (!response.ok) {
  //       throw new Error('Geocoding failed');
  //     }

  //     const data = await response.json();
      
  //     // Create a readable address from the response
  //     const address = data.display_name.split(',').slice(0, 3).join(',');
      
  //     // Cache the result
  //     setAddressCache(prev => ({
  //       ...prev,
  //       [cacheKey]: address
  //     }));

  //     return address;
  //   } catch (error) {
  //     console.error('Error fetching address:', error);
  //     // Fallback to coordinate display if geocoding fails
  //     return `${Math.abs(latitude)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude)}°${longitude >= 0 ? 'E' : 'W'}`;
  //   }
  // };
  
  // const LocationDisplay = ({ coordinates }) => {
  //   const [address, setAddress] = useState('Loading...');

  //     useEffect(() => {
  //       const fetchAddress = async () => {
  //         const result = await getAddressFromCoordinates(coordinates);
  //         console.log(result);
          
  //         setAddress(result);
  //       };
  //       fetchAddress();
  //     }, [coordinates]);
  //   return (
  //     <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  //       {address}
  //       <Button
  //         size="small"
  //         onClick= 
  //         {() => {
  //           const [longitude,latitude] = coordinates;
  //           window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  //         }}
  //         style={{ minWidth: 'auto', padding: '4px' }}
  //       >
  //         🗺️
  //       </Button>
  //     </span>
  //   );
  // };

  useEffect(() => {
    const initialData = itemList.filter(item =>
      (role === 'Activities' && item.type === 'Activity') ||
      (role === 'Itineraries' && item.type === 'Itinerary') ||
      (role === 'HistoricalPlaces' && item.type === 'HistoricalPlace')
    );
    setFilteredData(initialData);
  }, []);

  // Handle Rating Change

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

  // Helper function to check if a field should be displayed for the current role
  const handleClose = () => {
    setOpenCancelation(false);
    setOpenComment(false);
    setOpenRate(false);
     setSelectedItem(null); 
    setRateType(null);
    setRating(null);
    setComment(null);
    setCommentType(null);

  };
  const handleClickOpenCancelation = (item) => {
    setOpenCancelation(true);
    setSelectedItem(item);
  };
  const handleClickOpenRate = (item) => {
      setOpenRate(true);
      setSelectedItem(item);

    };
    const handleClickOpenComment = (item) => {
      setOpenComment(true);
      setSelectedItem(item);
    };
  const handleChange = (event) => {
    setRateType(event.target.value);
  };
  const handleCommentChange = (event) => {
      setCommentType(event.target.value);
    };
    const handleCommentValuesChange = (event) => {
      setComment(event.target.value);
    };
  const handleRatingValuesChange=(event)=>{
      setRating(event.target.value);
  }
  const canCancelBooking = (startDate) => {
      const now = new Date();
      const hoursDifference = differenceInHours(new Date(startDate), now);
      return hoursDifference >= 48;
    };
  const  handleSaveRating=async (type,rating,selectedItem)=>{
    console.log("selectedItem",selectedItem);
    // console.log(selectedItem.created_by._id);

    if(type==="tourGuide") {
      try {
        console.log("Rating",rating);
        const options = { apiPath: `/rateTourGuide/${userId}`,
        body:{
          tourGuideId:selectedItem.created_by._id,
          itineraryId:selectedItem.id,
          rating:rating
        }
        };
        
        const response = await NetworkService.post(options);
          console.log(response);
          setSuccessMessage(response.message||"Add Rate Successfully!");
          setShowSuccessMessage(true);
      } catch (error) {
        console.log('Error fetching historical places:', error);
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);
      }
    }else if (selectedItem.type==="Itinerary"){
      try {
        const options = { apiPath: `/rateItinerary/${userId}`,
        body:{
          tourGuideId:selectedItem.created_by._id,
          itineraryId:selectedItem.id,
          rating:rating
        }
        };
        const response = await NetworkService.post(options);
          console.log(response);
          setSuccessMessage(response.message||"Add Rate Successfully!");
          setShowSuccessMessage(true);
      } catch (error) {
        console.log('Error fetching historical places:', error);
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);
      }
    }
    else if (selectedItem.type==="Activity"){
      try {
        const options = { apiPath: `/rateActivity/${userId}`,
      body:{
        activityId:selectedItem.id,
        rating:rating
      }
     };
        const response = await NetworkService.post(options);
          console.log(response);
          setSuccessMessage(response.message||"Add Rate Successfully!");
          setShowSuccessMessage(true);
      } catch (error) {
        console.log('Error fetching historical places:', error);
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);
      }
    }
    else {
      try {
        const options = { 
          apiPath: `/rateHistoricalPlace/${userId}`,
          body:{
            historicalPlaceId:selectedItem.id,
            rating:rating
          }
         };
         
        const response = await NetworkService.post(options);
          console.log(response);
          setSuccessMessage(response.message||"Add Rate Successfully!");
          setShowSuccessMessage(true);
      } catch (error) {
        console.log('Error fetching historical places:', error);
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);
      }
    }
    handleClose();
  }
  const handleCancelBooking=async(selectedItem)=>{

        if (selectedItem.type==="Activity"){
          try {
            const options = { apiPath: `/cancelBookingEvent`,
            body:{
              userType:'tourist',
              touristId:userId,
              eventType:'activity',
              eventID:selectedItem.id,
            }
            };
            const response = await NetworkService.put(options);
              console.log(response);
              setFilteredData(prevData => prevData.filter(item => item.id !== filteredData.id));

          } catch (error) {
            console.log('Error fetching historical places:', error);
          }
        }
        else if (selectedItem.type==="Itinerary"){
          try {
            const options = { apiPath: `/cancelBookingEvent`,
            body:{
              userType:'tourist',
              touristId:userId,
              eventType:'itinerary',
              eventID:selectedItem.id,
            }
            };
            const response = await NetworkService.put(options);
              console.log(response);
              setFilteredData(prevData => prevData.filter(item => item.id !== filteredData.id));

          } catch (error) {
            console.log('Error fetching historical places:', error);
          }
        }
        else {
          try {
            const options = { apiPath: `/cancelBookingEvent`,
            body:{
              userType:'tourist',
              touristId:userId,
              eventType:'historicalPlace',
              eventID:selectedItem.id,
            }
            };
            const response = await NetworkService.put(options);
              console.log(response);
              setFilteredData(prevData => prevData.filter(item => item._id !== filteredData._id));

          } catch (error) {
            console.log('Error fetching historical places:', error);
          }
        }
        handleClose();
  }
  const handleSaveComments=async(type,comment,selectedItem)=>{
    if (type ==='tourGuide'){
      try {
        const options = { 
          apiPath: `/commentTourGuide/${userId}`,
          body:{
            tourGuideId:selectedItem.created_by._id,
            itineraryId:selectedItem.id,
            commentText:comment,
          }
         };
         
        const response = await NetworkService.post(options);
          console.log("response comment ",response);
          setSuccessMessage(response.message||"Add Comment Successfully!");
          setShowSuccessMessage(true);
      } catch (error) {
        console.log('Error fetching historical places:', error);
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);
      }
    }
    else if (selectedItem.type==="Activity"){
      try {
        const options = { 
          apiPath: `/commentActivity/${userId}`,
          body:{
            activityId:selectedItem.id,
            commentText:comment,
          }
         };
         
        const response = await NetworkService.post(options);
          console.log(response);
          setSuccessMessage(response.message||"Add Comment Successfully!");
          setShowSuccessMessage(true);
      } catch (error) {
        console.log('Error fetching historical places:', error);
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);
      }
    }
    else if (selectedItem.type==="Itinerary"){
      try {
        const options = { 
          apiPath: `/commentItinerary/${userId}`,
          body:{
            tourGuideId:selectedItem.created_by._id,
            itineraryId:selectedItem.id,
            commentText:comment,
          }
         };
         
        const response = await NetworkService.post(options);
          console.log(response);
          setSuccessMessage(response.message||"Add Comment Successfully!");
          setShowSuccessMessage(true);
      } catch (error) {
        console.log('Error fetching historical places:', error);
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);
      }
    }
    else {
      try {
        const options = { 
          apiPath: `/commentHistoricalPlace/${userId}`,
          body:{
            historicalPlaceId:selectedItem.id,
            commentText:comment,
          }
         };
         
        const response = await NetworkService.post(options);
          console.log(response);
          setSuccessMessage(response.message||"Add Comment Successfully!");
          setShowSuccessMessage(true);
      } catch (error) {
        console.log('Error fetching historical places:', error);
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);
      }
    }
    handleClose();

  }
  console.log("Filtered Data",filteredData);

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2, display: 'flex', justifyContent: 'center' }}>
        <Tabs value={role} onChange={handleRoleChange}>
          <Tab label="Activities" value="Activities" />
          <Tab label="Itineraries" value="Itineraries" />
          <Tab label="Historical Places" value="HistoricalPlaces" />
        </Tabs>
      </Box>

      <div style={{ display: 'flex', flex: 1 }}>
        <Grid container spacing={2} style={{ padding: '20px', flex: 1 }}>
          {filteredData.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card    
               style={{
                 width: item.type === 'Activity' ? '300px' : item.type === 'Itinerary' ? '400px' : '380px',
                 height: item.type === 'Activity' ? '300px' : item.type === 'Itinerary' ? '450px' : '390px',
                }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {item.name}
                  </Typography>
                  {item.type === 'Activity' && (
                    <>
                      <Typography color="text.secondary">Budget: {item.budget}</Typography>
                      <Typography color="text.secondary">Date: {format(parseISO(item.date), 'MMMM d, yyyy')}</Typography>
                      <Typography color="text.secondary">Category: {item.category}</Typography>
                      {/* <Typography color="text.secondary">
                          Locations: {Array.isArray(item.location[0]) ? 
                          item.location.map((loc, index) => (
                            <span key={index}>
                              <LocationDisplay coordinates={loc} />
                              {index < item.location.length - 1 ? ', ' : ''}
                            </span>
                          )) : 
                          <LocationDisplay coordinates={item.location} />}
                      </Typography> */}
                      <Typography color="text.secondary">Tags: {item.tags}</Typography>
                      {item.specialDiscount && (
                        <Typography color="text.secondary">Special Discount: {item.specialDiscount}%</Typography>
                      )}
                    </>
                  )}
                  {item.type === 'Itinerary' && (
                    <>
                      <Typography ><strong>Activities: </strong>{item.activities.join(', ')}</Typography>
                      <Typography ><strong> Locations:</strong> {item.locations.join(', ')}</Typography>
                      <Typography ><strong> Price:</strong> {item.price}</Typography>
                      <Typography ><strong> Rating: </strong> {item.rating.length ===0 ?0:item.rating}</Typography>
                      <Typography ><strong> Language:</strong> {item.language}</Typography>
                      <Typography ><strong>Dropoff location:</strong>  {item.dropoffLocation}</Typography>
                      <Typography ><strong>Pickup location:</strong>  {item.pickupLocation}</Typography>
                      <Typography ><strong>Directions:</strong>  {item.directions}</Typography>
                    </>
                  )}
                  {item.type === 'HistoricalPlace' && (
                    <>
                      <Typography ><strong>Description: </strong>{item.description}</Typography>
                      {/* <Typography color="text.secondary">
                          Locations: {Array.isArray(item.location[0]) ? 
                          item.location.map((loc, index) => (
                            <span key={index}>
                              <LocationDisplay coordinates={loc} />
                              {index < item.location.length - 1 ? ', ' : ''}
                            </span>
                          )) : 
                          <LocationDisplay coordinates={item.location} />}
                      </Typography> */}
                      <Typography><strong>Opening Hours:</strong> {item.openingHours}</Typography>
                      <Typography><strong>Students ticket price:</strong> {item.ticketPrice[0]}</Typography>
                      <Typography><strong>Native ticket price:</strong> {item.ticketPrice[1]}</Typography>
                      <Typography><strong>Foreign ticket price:</strong> {item.ticketPrice[2]}</Typography>

                      <strong>Tags:</strong> {historicalTags[item.tags] ? historicalTags[item.tags].join(', ') : item.tags}
                      </>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  {!canCancelBooking(item.startDate) ? (
                          <Button
                          style={{ height: "50px", width: "80px", marginRight: '7px' }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleClickOpenCancelation(item)}
                          >
                          Cancel Booking
                          </Button>
                      ) : (
                          <Button
                          style={{ height: "50px", width: "80px", marginRight: '7px' }}
                          variant="contained"
                          color="primary"
                          disabled
                          >
                          Cancel Booking
                          </Button>
                      )}
                      
                  
                             
                    <Button style={{width:"80px",marginRight: '7px'}} variant="contained"
                     color="primary" onClick={() => handleClickOpenComment(item)}>
                      Comment 
                   </Button>    
                        <Button style={{width:"20px"}}
                          variant="contained" 
                          color="primary" 
                          onClick={() => handleClickOpenRate(item)}>
                             Rate 
                        </Button> 
                      

                      </div>
                  </CardContent>
                  </Card>    
                </Grid>
                  ))}
                </Grid>



                <Dialog
                  open={openCancelation}
                  onClose={handleClose}
               >
                <DialogTitle id="alert-dialog-title">
                {'Cancel Booking a Ticket for '} {selectedItem?.name}
                </DialogTitle>
                <DialogContent>
                    <div>
                    <strong>Are you sure you want to cancel booking ?</strong>
                    </div>
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>handleCancelBooking(selectedItem)} autoFocus>
                    Confirm
                  </Button>
                  <Button onClick={handleClose}>Close</Button>
                </DialogActions>
              </Dialog>



              <Dialog
                open={openRate}
                onClose={handleClose}
             >
              <DialogTitle id="alert-dialog-title">
              {'Rating'}
              </DialogTitle>
              <DialogContent>
              {selectedItem && (
      <>
        {selectedItem.type === 'Activity' && (
          <>
         {(
          <div style={{ marginTop: '16px' }}>
            <Typography variant="body1">Enter rating for {'Activity'} (out of 5):</Typography>
            <TextField
            label="Rate"
            type="number"
              inputProps={{ min: 1, max: 5 }}
              variant="standard"
              value={rating}
              onChange={handleRatingValuesChange}
              style={{ width: '100px', marginTop: '8px' }}
              required
            />
          </div>
        )}
          </>
        )}
        {selectedItem.type === 'Itinerary' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center',  }}>
                  <span style={{ marginRight: '8px',marginTop:'10px' }}>Choose your Type:</span>
                  <FormControl variant="standard" style={{ minWidth: '165px',}}>
                 <InputLabel id="demo-simple-select-label"><strong>what to Rate?</strong> </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={rateType}
                        label="Rate"
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value={'tourGuide'}>Tour Guide</MenuItem>
                        <MenuItem value={'Itinerary'}>Itinerary</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  {(rateType === 'tourGuide' || rateType === 'Itinerary') && (
          <div style={{ marginTop: '16px' }}>
            <Typography variant="body1">Enter rating for {rateType === 'tourGuide' ? 'Tour Guide' : 'Itinerary'} (out of 5):</Typography>
            <TextField
            label="Rate"
            type="number"
              inputProps={{ min: 1, max: 5 }}
              variant="standard"
              value={rating}
              onChange={handleRatingValuesChange}
              style={{ width: '100px', marginTop: '8px' }}
              required
            />
          </div>
        )}
          </>
        )}
        {selectedItem.type === 'HistoricalPlace' && (
          <>
                  { (
          <div style={{ marginTop: '16px' }}>
            <Typography variant="body1">Enter rating for {'Event'} (out of 5):</Typography>
            <TextField
            label="Rate"
            type="number"
              inputProps={{ min: 1, max: 5 }}
              variant="standard"
              value={rating}
              onChange={handleRatingValuesChange}
              style={{ width: '100px', marginTop: '8px' }}
              required
            />
          </div>
        )}  
          </>
        )}
      </>
    )}
              </DialogContent>
              <DialogActions>
              <Button onClick={()=>handleSaveRating(rateType,rating,selectedItem)} autoFocus>
                  Save
                </Button>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>


            <Dialog
                open={openComment}
                onClose={handleClose}
             >
              <DialogTitle id="alert-dialog-title">
              {'Comments'}
              </DialogTitle>
              <DialogContent>
              {selectedItem && (
      <>
        {selectedItem.type === 'Activity' && (
          <>
                   <div style={{ display: 'flex', alignItems: 'center',  }}>
                  <span style={{ marginRight: '8px',marginTop:'10px' }}>Choose your Type:</span>
                  <FormControl variant="standard" style={{ minWidth: '165px',}}>
                 <InputLabel id="demo-simple-select-label"><strong>Comment on</strong> </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={commentType}
                        label="Comment on"
                        onChange={handleCommentChange}
                        required
                      >
                        <MenuItem value={'tourGuide'}>Tour Guide</MenuItem>
                        <MenuItem value={'activity'}>Activity</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  {(commentType === 'tourGuide' || commentType === 'activity') && (
          <div style={{ marginTop: '16px' }}>
            <Typography variant="body1">Enter a Comment for {commentType === 'tourGuide' ? 'Tour Guide' : 'Activity'} </Typography>
            <TextField
            label="Comment"
              variant="standard"
              value={comment}
              onChange={handleCommentValuesChange}
              style={{ minWidth: '160px', marginTop: '8px' }}
              required
            />
          </div>
        )}
          </>
        )}
        {selectedItem.type === 'Itinerary' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center',  }}>
                  <span style={{ marginRight: '8px',marginTop:'10px' }}>Choose your Type:</span>
                  <FormControl variant="standard" style={{ minWidth: '165px',}}>
                 <InputLabel id="demo-simple-select-label"><strong>Comment on</strong> </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={commentType}
                        label="Comment on "
                        onChange={handleCommentChange}
                        required
                      >
                        <MenuItem value={'tourGuide'}>Tour Guide</MenuItem>
                        <MenuItem value={'Itinerary'}>Itinerary</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  {(commentType === 'tourGuide' || commentType === 'Itinerary') && (
          <div style={{ marginTop: '16px' }}>
            <Typography variant="body1">Enter a Comment for {commentType === 'tourGuide' ? 'Tour Guide' : 'Itinerary'}</Typography>
            <TextField
            label="comment"
              variant="standard"
              value={comment}
              onChange={handleCommentValuesChange}
              style={{ minWidth: '100px', marginTop: '8px' }}
              required
            />
          </div>
        )}
          </>
        )}
        {selectedItem.type === 'HistoricalPlace' && (
          <>
                           <div style={{ display: 'flex', alignItems: 'center',  }}>
                  <span style={{ marginRight: '8px',marginTop:'10px' }}>Choose your Type:</span>
                  <FormControl variant="standard" style={{ minWidth: '165px',}}>
                 <InputLabel id="demo-simple-select-label"><strong>Comment on</strong> </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={commentType}
                        label="Comment"
                        onChange={handleCommentChange}
                        required
                      >
                        <MenuItem value={'tourGuide'}>Tour Guide</MenuItem>
                        <MenuItem value={'event'}>Event</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  {(commentType === 'tourGuide' || commentType === 'event') && (
          <div style={{ marginTop: '16px' }}>
            <Typography variant="body1">Enter a Comment for {commentType === 'tourGuide' ? 'Tour Guide' : 'Event'} </Typography>
            <TextField
            label="Comment"
              variant="standard"
              value={comment}
              onChange={handleCommentValuesChange}
              style={{ minWidth: '100px', marginTop: '8px' }}
              required
            />
          </div>
        )}  
          </>
        )}
      </>
    )}
              </DialogContent>
              <DialogActions>
              <Button onClick={()=>handleSaveComments(rateType,comment,selectedItem)} autoFocus>
                  Save
                </Button>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>

              </div>
              <div>
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
    {showErrorMessage && (
      <Alert severity="error" 
      sx={{
        position: 'fixed',
        top: 60, // You can adjust this value to provide space between success and error alerts
        right: 20,
        width: 'auto',
        fontSize: '1.2rem', // Adjust the size
        padding: '16px',
        zIndex: 9999, // Ensure it's visible above other content
      }}>
        {errorMessage}
      </Alert>
    )}
              </div>
            </div>
          );
        };
export default Booked;


