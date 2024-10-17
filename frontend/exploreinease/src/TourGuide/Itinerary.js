import React, { useState, useEffect } from 'react';
import {
  Button,Dialog, DialogActions,DialogContent,DialogTitle,TextField,Typography,Grid, Card,CardContent, CardActions,Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import axios from 'axios';  // Import Axios
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import NetworkService from '../NetworkService';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

function Itinerary() {
  const location = useLocation();
  const {userId}=location.state||{};
  const [itineraries, setItineraries] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState(null);

  const [itineraryForm, setItineraryForm] = useState({
    name: '',
    activities: [], // Changed to an array to hold selected activities for each day
    startDate: null,
    endDate: null,
    language: '',
    price: '',
    availableDates: [{ start: null, end: null }],
    accessibility: '',
    pickupLocation: '',
    dropoffLocation: '',
  });
  const [availableActivities, setAvailableActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {  
      const response = await axios.get(`http://localhost:3030/allActivities`); // Replace with your actual API endpoint
      // console.log(response);
      setAvailableActivities(response.data.activities);
      console.log(availableActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };
  const handleClickOpen = () => {
    setItineraryForm({
      name: '',
      activities: [], // Resetting activities to empty array for new itineraries
      startDate: null,
      endDate: null,
      language: '',
      price: '',
      availableDates: [{ start: null, end: null }],
      accessibility: '',
      pickupLocation: '',
      dropoffLocation: '',
    });
    setCurrentItinerary(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItineraryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailableDateChange = (index, field, newValue) => {
    const newAvailableDates = itineraryForm.availableDates.map((dateRange, i) => {
      if (i === index) {
        return { ...dateRange, [field]: newValue };
      }
      return dateRange;
    });
    setItineraryForm((prev) => ({ ...prev, availableDates: newAvailableDates }));
  };

  const handleAddAvailableDate = () => {
    setItineraryForm((prev) => ({
      ...prev,
      availableDates: [...prev.availableDates, { start: null, end: null }],
    }));
  };

  const handleActivityChange = (index, event) => {
    const newActivities = [...itineraryForm.activities];
    newActivities[index] = event.target.value;  // Update activity for the specific day
    setItineraryForm((prev) => ({ ...prev, activities: newActivities }));
  };

  const handleSaveItinerary = async () => {
    const updatedItinerary = {
      ...itineraryForm,
      startDate: itineraryForm.startDate ? dayjs(itineraryForm.startDate).toISOString() : null,
      endDate: itineraryForm.endDate ? dayjs(itineraryForm.endDate).toISOString() : null,
      availableDates: itineraryForm.availableDates.map((dateRange) => ({
        start: dateRange.start ? dayjs(dateRange.start).toISOString() : null,
        end: dateRange.end ? dayjs(dateRange.end).toISOString() : null,
      })),
    };
    console.log(updatedItinerary);

    try {
      if (currentItinerary !== null) {
        // Update existing itinerary
      try{
        const apiPath=`http://localhost:3030/itinerary/${updatedItinerary._id}/${userId}`;
        const body= {
          //     activities,
          //     locations:updatedActivity.location,
          //     timeline,
          //    directions,
          //     language,
          //     price:updatedActivity.price,
          //     dateTimeAvailable,
          //    accessibility,
          //    pickupLocation,
          //    dropoffLocation,
          //    isActivated, 
          //   created_by, 
          //   flag,        
          //  isSpecial
          };
          console.log("body:",body);
          const response = await axios.put(apiPath,body);
        setItineraries((prevItineraries) =>
          prevItineraries.map((itinerary, index) =>
            index === currentItinerary ? updatedItinerary : itinerary
          )
        );
      }catch {
        console.log("Error:");

      }
      } else {
        // Create a new itinerary
        const body= {
          //     activities,
          //     locations:updatedActivity.location,
          //     timeline,
          //    directions,
          //     language,
          //     price:updatedActivity.price,
          //     dateTimeAvailable,
          //    accessibility,
          //    pickupLocation,
          //    dropoffLocation,
          //    isActivated, 
          //   created_by, 
          //   flag,        
          //  isSpecial
          };
        const response = await NetworkService.post({
          apiPath: '/itinerary', 
          body: body,
        });
        // /itinerary/:_id/:userId
        console.log(response);
        
        if (response && response.itinerary) {
          setItineraries((prevItineraries) => [...prevItineraries, response.itinerary]);
        }
      }
      handleClose();
    } catch (error) {
      console.error('Error saving itinerary:', error);
    }
  };

  const handleEditItinerary = (index) => {
    setCurrentItinerary(index);
    setItineraryForm(itineraries[index]);
    setOpen(true);
  };

  const handleDeleteItinerary = (index) => {
    const activityid=itineraries[index]._id;
    const options ={
      apiPath:`/activity/${activityid}/${userId}`,
   };
   const response = NetworkService.delete(options);
   console.log(response);
    setItineraries((prevItineraries) => prevItineraries.filter((_, i) => i !== index));
  };

  const calculateDays = (startDate, endDate) => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      return end.diff(start, 'day') + 1; // Include start date
    }
    return 0;
  };

  const numberOfDays = calculateDays(itineraryForm.startDate, itineraryForm.endDate);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Button variant="contained" onClick={handleClickOpen}>
          Add Itinerary
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{currentItinerary !== null ? 'Edit Itinerary' : 'Add Itinerary'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Itinerary Name"
              value={itineraryForm.name}
              onChange={handleInputChange}
            />
            <DatePicker
              label="Start Date"
              value={itineraryForm.startDate}
              onChange={(newValue) => setItineraryForm((prev) => ({ ...prev, startDate: newValue }))}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
            <DatePicker
              label="End Date"
              value={itineraryForm.endDate}
              onChange={(newValue) => setItineraryForm((prev) => ({ ...prev, endDate: newValue }))}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />

            {/* Activity selection for each day of the tour */}
            {Array.from({ length: numberOfDays }, (_, index) => (
  <FormControl fullWidth margin="normal" key={index}>
    <InputLabel id={`activity-label-${index}`}>Activity for Day {index + 1}</InputLabel>
    <Select
      labelId={`activity-label-${index}`}
      value={itineraryForm.activities[index] || ''}  // Display selected activity
      onChange={(event) => handleActivityChange(index, event)}  // Update on selection change
    >
      {availableActivities.map((activity) => (
        <MenuItem key={activity.id} value={activity.id}>
          {activity.name}  {/* Display activity name */}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
))}

            {itineraryForm.availableDates.map((dateRange, index) => (
              <div key={index} style={{ display: 'flex', marginBottom: '16px' }}>
                <DatePicker
                  label={`Available Start Date ${index + 1}`}
                  value={dateRange.start}
                  onChange={(newValue) => handleAvailableDateChange(index, 'start', newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" style={{ marginRight: '8px' }} />
                  )}
                />
                <DatePicker
                  label={`Available End Date ${index + 1}`}
                  value={dateRange.end}
                  onChange={(newValue) => handleAvailableDateChange(index, 'end', newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" />
                  )}
                />
              </div>
            ))}
            <Button onClick={handleAddAvailableDate} variant="outlined" style={{ marginBottom: '16px' }}>
              Add More Available Dates
            </Button>
            <TextField
              fullWidth
              margin="normal"
              name="language"
              label="Language"
              value={itineraryForm.language}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="price"
              label="Price"
              value={itineraryForm.price}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="accessibility"
              label="Accessibility"
              value={itineraryForm.accessibility}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="pickupLocation"
              label="Pickup Location"
              value={itineraryForm.pickupLocation}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="dropoffLocation"
              label="Drop-off Location"
              value={itineraryForm.dropoffLocation}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveItinerary} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={2}>
          {itineraries.map((itinerary, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{itinerary.name}</Typography>
                  <Typography variant="body2">Activities: {itinerary.activities.join(', ')}</Typography>
                  <Typography variant="body2">Start Date: {dayjs(itinerary.startDate).format('DD/MM/YYYY')}</Typography>
                  <Typography variant="body2">End Date: {dayjs(itinerary.endDate).format('DD/MM/YYYY')}</Typography>
                  {itinerary.availableDates.map((dateRange, idx) => (
                    <Typography key={idx} variant="body2">
                      Available Dates: {dayjs(dateRange.start).format('DD/MM/YYYY')} - {dayjs(dateRange.end).format('DD/MM/YYYY')}
                    </Typography>
                  ))}
                  <Typography variant="body2">Language: {itinerary.language}</Typography>
                  <Typography variant="body2">Price: {itinerary.price}</Typography>
                  <Typography variant="body2">Accessibility: {itinerary.accessibility}</Typography>
                  <Typography variant="body2">Pickup Location: {itinerary.pickupLocation}</Typography>
                  <Typography variant="body2">Drop-off Location: {itinerary.dropoffLocation}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleEditItinerary(index)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteItinerary(index)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </LocalizationProvider>
  );
}

export default Itinerary;
