import * as React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';

export default function VerticalLinearStepper() {
  const [activeTourIndex, setActiveTourIndex] = React.useState(0);
  const [activeDayIndex, setActiveDayIndex] = React.useState(0);
  const [tours, setTours] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [tourData, setTourData] = React.useState({
    name: '',
    startDate: '',
    endDate: '',
    numberOfDays: 0,
    activities: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "numberOfDays") {
      // Ensure the activities array matches the number of days
      const newActivities = Array.from({ length: value }, (_, index) => ({
        activity: tourData.activities[index]?.activity || '',
        location: tourData.activities[index]?.location || '',
        price: tourData.activities[index]?.price || '',
        tag: tourData.activities[index]?.tag || '',
        category: tourData.activities[index]?.category || '',
      }));

      setTourData((prevData) => ({
        ...prevData,
        [name]: value,
        activities: newActivities,
      }));
    } else {
      setTourData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleActivityChange = (index, field, value) => {
    const updatedActivities = [...tourData.activities];
    updatedActivities[index][field] = value;
    setTourData((prevData) => ({
      ...prevData,
      activities: updatedActivities,
    }));
  };

  const handleClickOpen = () => {
    setTourData({
      name: '',
      startDate: '',
      endDate: '',
      numberOfDays: 0,
      activities: [],
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateDates = () => {
    const start = dayjs(tourData.startDate);
    const end = dayjs(tourData.endDate);
    return start.isValid() && end.isValid() && start.isBefore(end);
  };

  const handleAddTour = () => {
    if (!validateDates()) {
      alert("Please enter valid start and end dates.");
      return;
    }
    setTours((prevTours) => [
      ...prevTours,
      {
        name: tourData.name,
        startDate: tourData.startDate,
        endDate: tourData.endDate,
        activities: tourData.activities,
      },
    ]);
    handleClose();
  };

  const handleEditTour = (index) => {
    const tourToEdit = tours[index];
    setTourData(tourToEdit);
    setOpen(true);
  };

  const handleDeleteTour = (index) => {
    setTours((prevTours) => prevTours.filter((_, idx) => idx !== index));
  };

  const handleNextTour = () => {
    setActiveTourIndex((prevIndex) => Math.min(prevIndex + 1, tours.length - 1));
    setActiveDayIndex(0); // Reset to first day of the next tour
  };

  const handleBackTour = () => {
    setActiveTourIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setActiveDayIndex(0); // Reset to first day of the previous tour
  };

  const handleNextDay = () => {
    const activitiesCount = tours[activeTourIndex]?.activities.length || 0;
    setActiveDayIndex((prevIndex) => Math.min(prevIndex + 1, activitiesCount - 1));
  };

  const handleBackDay = () => {
    setActiveDayIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleReset = () => {
    setActiveTourIndex(0);
    setActiveDayIndex(0);
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Tour
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{tourData.name ? 'Edit Tour' : 'Add Tour'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name of Tour"
            type="text"
            fullWidth
            value={tourData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={tourData.startDate}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={tourData.endDate}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="numberOfDays"
            label="Number of Days"
            type="number"
            fullWidth
            value={tourData.numberOfDays}
            onChange={handleChange}
          />
          {Array.from({ length: tourData.numberOfDays }).map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6">Day {index + 1}</Typography>
              <TextField
                margin="dense"
                label="Activity"
                type="text"
                fullWidth
                value={tourData.activities[index]?.activity || ''}
                onChange={(e) => handleActivityChange(index, 'activity', e.target.value)}
              />
              <TextField
                margin="dense"
                label="Location"
                type="text"
                fullWidth
                value={tourData.activities[index]?.location || ''}
                onChange={(e) => handleActivityChange(index, 'location', e.target.value)}
              />
              <TextField
                margin="dense"
                label="Price"
                type="text"
                fullWidth
                value={tourData.activities[index]?.price || ''}
                onChange={(e) => handleActivityChange(index, 'price', e.target.value)}
              />
              <TextField
                margin="dense"
                label="Tags"
                type="text"
                fullWidth
                value={tourData.activities[index]?.tag || ''}
                onChange={(e) => handleActivityChange(index, 'tag', e.target.value)}
              />
              <TextField
                margin="dense"
                label="Category"
                type="text"
                fullWidth
                value={tourData.activities[index]?.category || ''}
                onChange={(e) => handleActivityChange(index, 'category', e.target.value)}
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddTour}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Outer Stepper for Tour Names */}
      <Stepper activeStep={activeTourIndex} orientation="vertical">
        {tours.map((tour, index) => (
          <Step key={index}>
            <StepLabel>{tour.name}</StepLabel>
            <StepContent>
              <Typography>{`Tour from ${dayjs(tour.startDate).format('YYYY-MM-DD')} to ${dayjs(tour.endDate).format('YYYY-MM-DD')}`}</Typography>
              
              {/* Inner Stepper for Tour Activities */}
              <Stepper activeStep={activeDayIndex} orientation="vertical">
                {tour.activities.map((activity, idx) => (
                  <Step key={idx}>
                    <StepLabel>{`Day ${idx + 1}`}</StepLabel>
                    <StepContent>
                      <Paper sx={{ padding: 2, marginBottom: 1 }}>
                        <Typography variant="h6">Activity: {activity.activity}</Typography>
                        <Typography color="textSecondary">Location: {activity.location}</Typography>
                        <Typography color="textSecondary">Price: {activity.price}</Typography>
                        <Typography color="textSecondary">Tags: {activity.tag}</Typography>
                        <Typography color="textSecondary">Category: {activity.category}</Typography>
                        <IconButton onClick={() => handleEditTour(index)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteTour(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              <Box>
                <Button onClick={handleBackTour} disabled={activeTourIndex === 0}>Back Tour</Button>
                <Button onClick={handleNextTour} disabled={activeTourIndex === tours.length - 1}>Next Tour</Button>
                <Button onClick={handleBackDay} disabled={activeDayIndex === 0}>Back Day</Button>
                <Button onClick={handleNextDay} disabled={activeDayIndex === (tour.activities.length - 1)}>Next Day</Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {tours.length === 0 && (
        <Typography variant="h6" sx={{ mt: 2 }}>No Tours Available</Typography>
      )}
    </Box>
  );
}
    