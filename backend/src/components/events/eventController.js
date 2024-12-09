require('dotenv').config();
const eventService = require('../events/eventService');
const { validationResult } = require('express-validator');
const eventRepository = require('../events/eventRepository');
const checkoutRepository = require('../checkouts/checkoutRepository');
const checkoutService = require('../checkouts/checkoutService');
const nodemailer = require('nodemailer');





const getAllEvents= async(req, res) => {
  try {
    const data = await eventService.getAllEvents();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
}

const updateEventFlagController = async (req, res) => {
  const { userType, eventType, eventID } = req.body;

  try {
        if (userType !== 'admin') {
          throw new Error('Only admins can update the flag.');
      }

      const updatedEvent = await eventService.updateEventFlag(eventType, eventID);
      if (!updatedEvent) {
          return res.status(404).json({ message: 'Event not found.' });
      }
      const publisher = await eventRepository.getPublisher(updatedEvent.created_by);


      const body =` ${eventType} with ID ${eventID} has been flagged Inappropriate.`;
        const notificationData = {
            title: 'Inappropriate Event Flagged',
            body,
            user: {
                user_id: publisher._id,     // Match the schema key
                user_type: publisher.type   // Match the schema key
            }
        };
        const notification = await checkoutRepository.addNotification(notificationData);
        console.log("NOTIFICATION: ",notification);


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL2_USER,
                pass: process.env.EMAIL2_PASS
            }
        });
    
        console.log("Transporter created");
        
        const mailOptions = {
            from: process.env.EMAIL2_USER,
            to: publisher.email,
            subject: 'Inappropriate Event Flagged',
            text:` Hello ${publisher.username},\n\n${body}\n\nBest regards,\n${process.env.EMAIL2_USER}`
        };
    
        await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: 'Event flag updated successfully.', updatedEvent });
  } catch (error) {
      console.error('Error updating event flag:', error.message);
      return res.status(400).json({ message: error.message });
  }
};

const bookEventWithCard = async (req, res) => {
  const {
    userType,
    touristId,
    eventType,
    eventID,
    ticketType,
    currency,
    activityPrice,
    cardNumber,
    expMonth,
    expYear,
    cvc,
    promoCode
  } = req.body;

  try {
    if (userType !== "tourist") {
      throw new Error("User type must be tourist");
    }
    if (
      !touristId ||
      !userType ||
      !eventType ||
      !eventID ||
      !cardNumber ||
      !expMonth ||
      !expYear ||
      !cvc
    ) {
      return res.status(400).json({
        success: false,
        message: "All attributes are required in the request body",
      });
    }

    const result = await eventService.addEventToTouristWithCard(
      userType,touristId,eventType,eventID,ticketType,currency,activityPrice,cardNumber,expMonth,expYear,cvc,promoCode
    );


    const allTourists = await eventRepository.findTourists();
    
    allTourists.forEach(async tourist => {
      const isInterested = Array.isArray(tourist.interestedIn) && 
        tourist.interestedIn.some(interested => 
          interested.id.toString() === eventID && 
          interested.type === eventType
        );
    
      if (isInterested) {
          const event = await eventRepository.findEventById(eventID, eventType);
          console.log("Event: ",event);
          const eventName = event.name;
          console.log("Event Name: ",eventName);
          if (event) {
              if(!event.isBooked) {
                const body = `${eventType} with Name ${eventName} started its first booking`;
                const notificationData = {
                    title: "Event Booking",
                    body,
                    user: {
                        user_id: tourist._id,
                        user_type: "tourist"
                    }
                };
                const notification = await checkoutRepository.addNotification(notificationData);
                console.log("NOTIFICATION: ",notification);
                
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL2_USER,
                        pass: process.env.EMAIL2_PASS
                    }
                });
            
                console.log("Transporter created");
                console.log("Tourist email: ",tourist.email);
                
                const mailOptions = {
                    from: process.env.EMAIL2_USER,
                    to: tourist.email,
                    subject: 'Event Booking',
                    text: `${eventType} with Name ${eventName} started its first booking.\n\nBest regards,\n${process.env.EMAIL2_USER}`
                };
            
                await transporter.sendMail(mailOptions); 
              }
            }
        }
      });

    return res.status(200).json({
      success: true,
      message: "Event booked successfully, Payment successful and Email sent",
      data: result.tourist,
      paymentStatus: result.paymentStatus,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Get all user events by _id and userType
const getUserEvents = async (req, res) => {
  const { _id, userType } = req.body;

  // Validate input
  if (!_id || !userType) {
      return res.status(400).json({ message: "User ID and userType are required." });
  }

  if (typeof _id !== 'string' || typeof userType !== 'string') {
      return res.status(400).json({ error: 'Invalid userId or userType format' });
  }

  try {
      const events = await eventService.getUserEvents(_id, userType);
      return res.status(200).json(events);
  } catch (error) {
      console.error('Error fetching user events:', error.message);
      return res.status(500).json({ message: error.message });
  }
};
  
//CRUD ACTIVITY CATEGORY    
// Create an activity category
const createCategory = async (req, res) => {
  try {
    const category = await eventService.createCategory(req.body);
    return res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Get all activity categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await eventService.getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Update an activity category by ID
const updateCategoryById = async (req, res) => {
  const { _id } = req.params; 
  const categoryName = req.body; // Use req.body directly
  console.log(categoryName); // Ensure correct data is being logged
  try {
    const updatedCategory = await eventService.updateCategoryById(_id, categoryName);
    console.log(updatedCategory);
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error.message);
    return res.status(500).json({ message: error.message });
  }
};


const deleteCategoryById = async (req, res) => {
  const { _id } = req.params; // Get the ID from the URL
  

  try {
      const result = await eventService.deleteCategoryById(_id); 
      if (!result) {
          return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

//CRUD PREFTAGS


// Create a new preference tag
const createTag = async (req, res) => {
  const { tags } = req.body;

  try {
    const newTag = await eventService.createTag({ tags });
    return res.status(201).json(newTag);
  } catch (error) {
    console.error('Error creating tag:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Get all preference tags
const getAllTags = async (req, res) => {
  try {
    const tags = await eventService.getAllTags();
    const tagsArray = tags.map(tag => tag.tags);
    return res.status(200).json({message: 'Fetched all tags', tags: tags});
  } catch (error) {
    console.error('Error fetching tags:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Update a preference tag by its _id
const updateTagById = async (req, res) => {
  const { _id } = req.params; // Get the id from the URL
  const updatedData = req.body; // Get the updated data from the request body

  try {
    const updatedTag = await eventService.updateTagById(_id, updatedData);
    if (!updatedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    return res.status(200).json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Delete a preference tag by its _id
const deleteTagById = async (req, res) => {
  const { _id } = req.params; // Get the id from the URL

  try {
    const deletedTag = await eventService.deleteTagById(_id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    return res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const GetupcommingActivitesFilter = async (req, res) => {
  try {
    const {
      budget,
      date,
      categoryId,
      rating,
    } = req.query;

    const filters = {
      budget: budget ? parseFloat(budget) : undefined, //ye7welo to float
      date,
      categoryId,
      rating: rating ? parseint(rating) : undefined,
    };

    console.log("Filters:", filters);
    const activities = await eventService.getFilteredUpcomingActivities(
      filters
    );

    return res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const {currency} = req.params;
    console.log(req.params);
    const upcomingEvents = await eventService.getAllUpcomingEvents(currency);
    return res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

const filterHistoricalPlacesByTags = async (req, res) => {
  try {
    const { tags } = req.query; // Extract tags from query parameters

    // Convert tags into an array
    const tagsArray = Array.isArray(tags) ? tags : [tags];

    const filteredHistoricalPlaces =
      await eventService.getFilteredHistoricalPlaces(tagsArray);
    return res.status(200).json(filteredHistoricalPlaces);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};



const getFilteredItineraries = async (req, res) => {
  try {
    const { budget, date, preferences, language } = req.query;

    // Pass the query parameters to the service
    const itineraries = await eventService.getFilteredItineraries({
      budget,
      date,
      preferences,
      language,
    });

    return res.status(200).json({
      success: true,
      total: itineraries.length,
      itineraries,
    });
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching itineraries",
      details: error.message,
    });
  }
};

// Create a new preference tag
const createHistoricalTag = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("TAG Error 1");
      return res.status(400).json({ errors: errors.array() });
  }

  try {
      const checkUserType =await eventRepository.getTypeForTag(req.params._id);
      if(checkUserType !== 'tourismGovernor'){
        console.log("TAG Error 2");

          return res.status(400).json({ message: 'Only tourism governors can create historical tags' });
      }

      const checkTagType = req.body.type.toLowerCase();

      if (
      checkTagType === 'monuments' || 
      checkTagType === 'museums' || 
      checkTagType === 'religious' || 
      checkTagType === 'sites' || 
      checkTagType === 'palaces' || 
      checkTagType === 'castles' || 
      checkTagType === 'palaces/castles'
      ) {

          try{
              const tag = await eventService.createHistoricalTag(req.body);
              response={
                  message: "Historical tag created successfully",
                  tag: tag
              }
              res.status(201).json(response);
          }
          catch (error) {
              res.status(400).json({ message: error.message });
              console.log("TAG Error 3:",error.message);
          }

      }else{
        console.log("TAG Error 4");
          return res.status(400).json({ message: 'Only historical tags can be created' });
      }


      
  } catch (error) {

      res.status(400).json({ message: error.message });
      console.log("TAG Error 5",error.message);

  }
};

const getActivityById = async (req, res) => {
  const { _id, userId } = req.params;
  if(!_id || !userId) {
    res.status(400).json({ message: 'Missing inputs' });
  }
  const type = await eventRepository.getType(userId);
  console.log(type);
  if (type !== 'advertiser' && type !== 'tourGuide') {
    return res.status(400).json({ message: 'Invalid type' });
  }
  try {
    const activity = await eventService.getActivityById(_id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    return res.status(200).json(activity);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};

const getAllActivities = async (req, res) => {
  const {userId} = req.params;
  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }
  try {
    const type = await eventRepository.getType(userId);
    if (type !== 'advertiser') {
      return res.status(400).json({ message: 'Invalid user type' });
    }
    const activities = await eventService.getAllActivitiesAdvertiser(userId); // Same here
    return res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activitiesss:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const addActivity = async (req, res) => {
  const { name, date, time, latitude, longitude, price, category, tags, specialDiscounts, isOpen, created_by } = req.body;
  const file = req.file;

  console.log(latitude);
  console.log(longitude);

  const location = {
    latitude,
    longitude,
  }

  console.log("File:", file);
  console.log("Body:", req.body);

  
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Validate required fields
  if (!name || !date || !time || !location || !price || !category || !tags || typeof isOpen === 'undefined' || !created_by) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const type = await eventRepository.getType(created_by);
  if (type !== 'advertiser') {
    return res.status(400).json({ message: 'Invalid type' });
  }

  try {
    const activity = await eventService.addActivity({
      name,
      date,
      time,
      location,
      price: JSON.parse(price),
      category,
      tags: JSON.parse(tags),
      specialDiscounts,
      isOpen,
      created_by,
    });

    const activityImage = await checkoutService.uploadEventImage(activity._id, file, 'Activity');
    if (activityImage.message !== 'Image uploaded successfully') {
      return res.status(400).json({ message: 'Error uploading image' });
    }

    const finalActivity = await eventService.getActivityById(activity._id);

    return res.status(200).json({ message: 'Activity created successfully', finalActivity, imageUrl: activityImage.imageUrl });
  } catch (error) {
    console.error('Error creating activity:', error.message);
    return res.status(500).json({ message: error.message });
  }
};


const getAllActivitiesInDatabase = async (req, res) => {
  try {
    const activities = await eventService.getAllActivitiesInDatabase();
    return res.status(200).json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error.message);
    return res.status(500).json({ message: 'Server error.' });
  }
}
const updateActivity = async (req, res) => {
  const { _id, userId } = req.params;
  const updateData = req.body; 
  console.log("_id:",_id);
  console.log("userId:",userId);
  console.log("Update data:",updateData);
  if(!_id || !userId) {
    return res.status(400).json({ message: 'Missing inputs' });
  }
  const type = await eventRepository.getType(userId);
  if (type !== 'advertiser') {
    return res.status(400).json({ message: 'Invalid type' });
  }

  const allowedUpdates = ['date', 'time', 'location', 'price', 'category', 'tags', 'specialDiscounts', 'isOpen', 'name'];
  const invalidUpdates = Object.keys(updateData).filter(key => !allowedUpdates.includes(key));

  if (invalidUpdates.length) {
    console.log("hena  ");
    console.log("Invalid fields here:",invalidUpdates);
    return res.status(400).json({ message: `Invalid fields: ${invalidUpdates.join(', ')}` });
  }

  try {
    const getActivity = await eventService.getActivityById(_id);
    if (!getActivity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    if (getActivity.created_by.toString() !== userId) {
      return res.status(400).json({ message: 'You are not authorized to update this activity.' });
    }
    const updatedActivity = await eventService.updateActivity(_id, updateData);
    console.log("Updated activity:",updatedActivity);
  
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }
    return res.status(200).json({message: 'Activity updated successfully', activity: updatedActivity});
  } catch (error) {
    console.error('Error updating activity:', error.message);
    return res.status(500).json({ message: error.message });
  }
 
};

const deleteActivity = async (req, res) => {
  const { _id, userId } = req.params; // Extract the activity ID from the request parameters

  if(!_id || !userId) {
    return res.status(400).json({ message: 'Missing inputs' });
  }

  const type = await eventRepository.getType(userId);
  if (type !== 'advertiser') {
    return res.status(400).json({ message: 'Invalid type' });
  }
  try {
    const getActivity = await eventService.getActivityById(_id);
    if (!getActivity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }
    if(getActivity.created_by.toString()
       !== userId) {
      return res.status(400).json({ message: 'Cannot Delete the Activity as it is not yours.' });
    }
    const deletedActivity = await eventService.deleteActivity(_id);
    
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    return res.status(200).json({ message: 'Activity deleted successfully.', deletedActivity: deletedActivity });
  } catch (error) {
    console.error('Error deleting activity:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getAllItineraries = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const type = await eventRepository.getType(userId);
    if (type !== 'tourGuide') {
      return res.status(400).json({ message: 'Invalid type' });
    }

    const itineraries = await eventService.getAllItineraries(userId);
    return res.status(200).json({message: "Itineraries fetched successfully" ,Itineraries: itineraries});  } catch (error) {
    console.error('Error fetching itineraries:', error.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};


const getItineraryById = async (req, res) => {
  const { _id, userId } = req.params;
  
  if(!_id){
    return res.status(400).json({ message: 'Missing id' });
  }

  const type = await eventRepository.getType(userId);

  if(type !== 'tourGuide'){
    return res.status(400).json({ message: 'Invalid type' });
  }

  try {
    const itinerary = await eventService.getItineraryById(_id);
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }

    if(itinerary.created_by !== userId){
      return res.status(400).json({ message: 'Cannot access the itinerary as it is not yours.' });
    }

    return res.status(200).json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const createItinerary = async (req, res) => {
  try {
    const {name, activities, locations, timeline, directions, language, price, dateTimeAvailable, accessibility, pickupLocation, dropoffLocation, isActivated, created_by, flag, isSpecial} = req.body;
    console.log("      ");
    console.log(req.body);
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    if(!name || !activities || !locations || !timeline || !directions || !language || !price || !dateTimeAvailable || !pickupLocation || !dropoffLocation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if(!flag){
      const flag = false;
    }
    else{
      const flag = true;
    }
    if(!isActivated){
      const isActivated = false;
    }
    else{
      const isActivated = true;
    }
    if(!created_by){
      return res.status(400).json({ message: 'Missing created_by' });
    }
    if(!accessibility){
      const accessibility = false;
    }
    else{
      const accessibility = true;
    }
    if(!isSpecial){
      const isSpecial = false;
    }
    else{
      const isSpecial = true;
    }
    const type = await eventRepository.getType(created_by);

    if(type !== 'tourGuide'){
      return res.status(400).json({ message: 'Invalid type' });
    }
    
    const allActivities = await eventRepository.getAllActivities();

    if(!allActivities) {
      return res.status(404).json({ message: 'Activities not found.' });
    }
    console.log(activities);
    const allActivitiesIds = allActivities.map(activity => activity._id.toString());
    const areAllActivitiesValid = activities.every(activityId => allActivitiesIds.includes(activityId));

    if (!areAllActivitiesValid) {
      return res.status(400).json({ message: 'One or more provided activities are invalid.' });
    }
    
    const itineraryData = { name, activities, locations, timeline, directions, language, price, dateTimeAvailable, accessibility, pickupLocation, dropoffLocation, isActivated, created_by, flag, isSpecial };
    
    // Call the service to create the itinerary
    const newItinerary = await eventService.createItinerary(itineraryData);

    const itineraryImage = await checkoutService.uploadEventImage(newItinerary._id, file, "Itinerary");
    if(itineraryImage.message != 'Image uploaded successfully') {
      return res.status(400).json({ message: 'Error uploading image' });
    } 
    return res.status(200).json({message: "Itinerary created successfully", Itinerary: newItinerary});
  } catch (error) {
    console.error('Error creating itinerary:', error.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const updateItinerary = async (req, res) => {
  const { _id, userId } = req.params;
  const itineraryData = req.body;

  if (!_id) {
      return res.status(400).json({ message: 'Missing id' });
  }

  const type = await eventRepository.getType(userId);

  if (type !== 'tourGuide') {
      return res.status(400).json({ message: 'Invalid type' });
  }

  try {
    const getItinerary = await eventService.getItineraryById(_id);
    if (!getItinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }
    if(getItinerary.created_by.toString() !== userId) {
      return res.status(400).json({ message: 'Cannot Delete the Itinerary as it is not yours.' });
    }
      const updatedItinerary = await eventService.updateItinerary(_id, itineraryData);
      
      if (!updatedItinerary) {
          return res.status(404).json({ message: 'Itinerary not found' });
      }
      
      return res.status(200).json(updatedItinerary);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating itinerary', error: error.message });
  }
};

// Delete Itinerary by ID
const deleteItinerary = async (req, res) => {
  const { _id, userId } = req.params;

  if (!_id) {
      return res.status(400).json({ message: 'Missing id' });
  }

  const type = await eventRepository.getType(userId);

  if (type !== 'tourGuide') {
      return res.status(400).json({ message: 'Invalid type' });
  }

  try {
    const getItinerary = await eventService.getItineraryById(_id);
    if (!getItinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }
    if(getItinerary.created_by.toString() !== userId) {
      return res.status(400).json({ message: 'Cannot Delete the Itinerary as it is not yours.' });
    }
      const deletedItinerary = await eventService.deleteItinerary(_id);
      if (!deletedItinerary) {
          return res.status(404).json({ message: 'Itinerary not found' });
      }
      res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting itinerary', error: error.message });
  }
};

// Create a new Historical Place
const createHistoricalPlace = async (req, res) => {
  const {
    name,
    description,
    latitude,
    longitude,
    address,
    openingHours,
    ticketPrice_student,
    ticketPrice_native,
    ticketPrice_foreign,
    created_by,
    tags
  } = req.body;

  console.log(req.body);

  const location = {
    latitude,
    longitude,
    address
  };

  const ticketPrice = {
    student: ticketPrice_student,
    native: ticketPrice_native,
    foreign: ticketPrice_foreign
  };

const cleanOpeningHours = JSON.parse(openingHours);

  console.log(location);
  console.log(ticketPrice);

  const file = req.file;

  if (!file) {
    console.log("fff");
    return res.status(400).send('No file uploaded.');
  }
  console.log("3ada");
  // Validate required fields
  if (!name || !description || !location || !cleanOpeningHours || !ticketPrice  || !created_by || !tags) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  console.log("3ada2");

  try {
    const tagString = JSON.parse(tags)[0];
    console.log("TagString:",tagString);
    const tag = await eventRepository.findTagByTypeAndPeriod(tagString);
      if (!tag) {
        console.log("Tag Error 1");
        return res.status(400).json({ message: 'Invalid tag type' });
      }
      console.log("Tag:",tag);
    const historicalPlaceData = {
      name,
      description,
      location,
      openingHours: cleanOpeningHours,
      ticketPrice,
      created_by,
      tagString
    };

    // Call the service to create the historical place
    const historicalPlace = await eventService.createHistoricalPlace(historicalPlaceData);
    console.log("Historical Place:",historicalPlace.response);

    const historicalPlaceImage = await checkoutService.uploadEventImage(historicalPlace.response.savedPlace._id, file, "HistoricalPlace");
    if(historicalPlaceImage.message != 'Image uploaded successfully') {
      return res.status(400).json({ message: 'Error uploading image' });
    } 

    return res.status(historicalPlace.status).json({historicalPlace: historicalPlace.response, imageUrl: historicalPlaceImage.imageUrl});
  } catch (error) {
    console.error('Error creating historical place:', error.message);
    return res.status(500).json({ message: 'Error creating historical place', error: error.message });
  }
};


// Get all Historical Places
const getAllHistoricalPlaces = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
  }
  const type = await eventRepository.getType(userId);
  if (type !== 'tourismGovernor') {
      return res.status(400).json({ message: 'Invalid type' });
  }
  try {
      const historicalPlaces = await eventService.getAllHistoricalPlaces();
      res.status(200).json(historicalPlaces);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching historical places', error: error.message });
  }
};

// Get Historical Place by ID
const getHistoricalPlaceById = async (req, res) => {
  try {
      const { _id, userId } = req.params;
      if (!_id || !userId) {
          return res.status(400).json({ message: 'Missing inputs' });
      }
      const type = await eventRepository.getType(userId);
      if (type !== 'tourismGovernor') {
          return res.status(400).json({ message: 'Invalid type' });
      }
      const historicalPlace = await eventService.getHistoricalPlaceById(_id, userId);
      res.status(historicalPlace.status).json(historicalPlace.response);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching historical place', error: error.message });
  }
};

// Update a Historical Place by ID
const updateHistoricalPlace = async (req, res) => {
  try {
      const { _id, userId } = req.params;
      const { updateValues } = req.body;

      console.log(updateValues);

      if (!_id || !userId) {
          return res.status(400).json({ message: 'Missing inputs' });
      }

      const type = await eventRepository.getType(userId);
      console.log(type);
      if (type !== 'tourismGovernor') {
          return res.status(400).json({ message: 'Invalid type' });
      }
      const getHistoricalPlace = await eventService.getHistoricalPlaceById(_id, userId);
      if (!getHistoricalPlace) {
        return res.status(404).json({ message: 'Historical Place not found.' });
      }
      console.log(getHistoricalPlace);
      if(getHistoricalPlace.response.historicalPlace.created_by.toString() !== userId) {
        return res.status(400).json({ message: 'Cannot Update the Historical Place as it is not yours.' });
      }
      const updatedPlace = await eventService.updateHistoricalPlace(_id, userId, updateValues);
      if (!updatedPlace) {
          return res.status(404).json({ message: 'Historical place not found' });
      }
      res.status(updatedPlace.status).json(updatedPlace.response);
  } catch (error) {
      res.status(500).json({ message: 'Error updating historical place', error: error.message });
  }
};

// Delete a Historical Place by ID
const deleteHistoricalPlace = async (req, res) => {
  try {
      const { _id, userId } = req.params;
      if(!_id || !userId) {
          return res.status(400).json({ message: 'Missing inputs' });
      }

      const type = await eventRepository.getType(userId);
      if (type !== 'tourismGovernor') {
          return res.status(400).json({ message: 'Invalid type' });
      }
      const getHistoricalPlace = await eventService.getHistoricalPlaceById(_id, userId);
      if (!getHistoricalPlace) {
        return res.status(404).json({ message: 'Historical Place not found.' });
      }
      if(getHistoricalPlace.response.historicalPlace.created_by.toString() !== userId) {
        return res.status(400).json({ message: 'Cannot Delete the Historical Place as it is not yours.' });
      }
      const deletedPlace = await eventService.deleteHistoricalPlace(_id, userId);
      if (!deletedPlace) {
          return res.status(404).json({ message: 'Historical place not found' });
      }
      res.status(deletedPlace.status).json(deletedPlace.response);
  } catch (error) {
      res.status(500).json({ message: 'Error deleting historical place', error: error.message });
  }
};
const getAllHistoricalTags = async (req, res) => {
  const { userId } = req.params;
  if(!userId) {
    console.log("test 1");
    
    res.status(400).json({ message: 'Missing inputs' });
  }
  const type = await eventRepository.getType(userId);
  console.log("type:",type);
  if (type !== 'tourGuide' && type !== 'tourist' && type != 'guest' && type != 'tourismGovernor') {
   console.log("henaaa",type);
   
    return res.status(400).json({ message: 'Invalid type' });
  }
  try {
    const tags = await eventService.getAllHistoricalTags();
    return res.status(200).json({message: "Tags fetched successfully", tags: tags});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
}

const getHistoricalTagDetails = async (req, res) => {
  const { tagId } = req.params;
  if(!tagId) {    
    res.status(400).json({ message: 'Missing inputs' });
  }
  try {
    const tag = await eventService.getHistoricalTagDetails(tagId);
    return res.status(200).json({message: "Tags fetched successfully", tags: tag});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
}

const sendEventEmail = async (req, res) => {
  const { touristId, receiverEmail } = req.params;
  const eventDetails = req.body;

  try {
      const result = await eventService.sendEventEmail(touristId, receiverEmail, eventDetails);
      console.log(true);
      
      res.status(200).json(result);
  } catch (error) {
    console.log("error",error);
      res.status(500).json({ error: error.message });
  }
};

//Mohamed Apis



const bookedEvents = async (req, res) => {
  try {
      const { touristId } = req.params;
      if (!touristId) {
          return res.status(400).json({ error: "touristId is required in the request body" });
      }
      const result = await eventService.bookedEvents(touristId);
      console.log(result);
      return res.status(200).json(result);
  } catch (error) {
    // console.log(error.message );
      return res.status(500).json({ error: error.message });
      
  }
};






const cancelBookingEvent = async (req, res) => {
  const { userType, touristId, eventType, eventID } = req.body;

  try {
    if (userType !== 'tourist') {
      throw new Error('User type must be tourist');
     }

      const updatedTourist = await eventService.cancelEventToTourist(userType, touristId, eventType, eventID);
      return res.status(200).json({
          success: true,
          message: 'Event updated successfully',
          data: updatedTourist,
      });
  } catch (error) {
      return res.status(400).json({
          success: false,
          message: error.message,
      });
  }
};


const getCityCode = async (req, res) => {
  try {
      const response = await eventService.fetchCityCode(req.params.city);
      res.status(200).json(response);  
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const flightOffers = async (req, res) => {
  const { originCode, destinationCode, dateOfDeparture,currency,personCount } = req.body;

  if (!originCode || !destinationCode || !dateOfDeparture  || !currency || !personCount) {
      return res.status(400).json({ message: "Origin, destination, and departure date are required." });
  }

  try {
      
      const flights = await eventService.flightOffers( originCode, destinationCode, dateOfDeparture,currency,personCount);
      return res.status(200).json(flights);
  } catch (error) {
      console.error('Error searching flights:', error.message);
      return res.status(500).json({ message: error.message });
  }
};


const bookFlight = async (req, res) => {
  const { bookedBy, price, departureTime, arrivalTime, personCount,currency,originCode,destinationCode } = req.body;

  
  if (!bookedBy || !price || !departureTime || !arrivalTime || !personCount || !currency || !originCode || !destinationCode) {
    console.log("bookedBy",bookedBy);
    console.log("price",price);
    console.log("departureTime",departureTime);
    console.log("arrivalTime",arrivalTime);
    console.log("personCount",personCount);
    console.log("currency",currency);
    console.log("originCode",originCode);
    console.log("destinationCode",destinationCode);
    console.log("currency",currency);
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
      const newBooking = await eventService.flightBooking({ bookedBy, price, departureTime, arrivalTime, personCount,currency ,originCode,destinationCode });
      return res.status(201).json(newBooking);
  } catch (error) {
      console.error('Error booking flight:', error.message);
      return res.status(500).json({ message: error.message });
  }
};









const getHotelsByCityCode = async (req, res) => {
  try {
      const { startDate, endDate, currency, personCount } = req.params; 
    

      const response = await eventService.fetchHotelsByCityCode(
          req.params.cityCode,
          req.params.startDate,
          req.params.endDate,
          req.params.currency,  
          req.params.personCount 
      );
      res.status(200).json(response); 
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const bookHotel = async (req, res) => {
  const { bookedBy, price, iataCode, hotelName, hotelId,startDate,endDate,personCount,currency } = req.body;
 
  
  if (!bookedBy || !price || !iataCode || !hotelName || !hotelId || !startDate || !endDate || !personCount || !currency) {
       



    return res.status(400).json({ message: "All fields are required." });
  }

  try {
      const newBooking = await eventService.bookingHotel({ bookedBy, price, iataCode, hotelName, hotelId,startDate ,endDate,personCount,currency });
      return res.status(201).json(newBooking);
  } catch (error) {
      console.error('Error booking hotel:', error.message);
      return res.status(500).json({ message: error.message });
  }
};






const createTransportation = async (req, res) => {
  try {
    const { advertiserId, pickupLocation, dropoffLocation, dateAvailable,timeAvailable, price, transportationType } = req.body; 

    if (!advertiserId || !pickupLocation || !dropoffLocation || !dateAvailable || !timeAvailable || !price || !transportationType ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newTransportation = await eventService.createTransportation(advertiserId, pickupLocation, dropoffLocation, dateAvailable,timeAvailable, price, transportationType);
    return res.status(201).json({
      success: true,
      message: 'Transportation created successfully.',
      data: newTransportation,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



const getTransportations = async (req, res) => {
  try {
    const{currency} = req.params;
    const transportation = await eventService.getTransportations(currency);
    return res.status(200).json(transportation);
  } catch (error) {
    console.error('Error fetching transportation:', error.message);
    return res.status(500).json({ message: error.message });
  }
}



const bookTransportation = async (req, res) => {
  const { touristId, transportationId } = req.body;

  try {
      const result = await eventService.bookTransportation(touristId, transportationId);
      return res.status(200).json(result);
  } catch (error) {
      console.error('Error in booking transportation:', error.message);
      return res.status(400).json({ message: error.message });
  }
};


//Saif,Tasnim


const updateItineraryActivation = async (req, res) => {
  
  const { itineraryId, isActivated, userId, userType } = req.params;


  if (!itineraryId || isActivated === undefined || !userId || !userType) {
      return res.status(400).json({ message: "Itinerary ID, activation status, user ID, and userType are required." });
  }
  if (userType !== 'tourGuide') {
    throw new Error('Only tour guides can update itineraries.');
  }
  if ( (isActivated !== 0 && isActivated !== 1)) {
      return res.status(400).json({ error: 'isActivated must be 0 (deactivate) or 1 (activate)' });
  }

  try {
      const updatedItinerary = await eventService.updateItineraryActivation(itineraryId, isActivated, userId, userType);
      if (!updatedItinerary) {
          return res.status(404).json({ message: 'Itinerary not found or not created by this user.' });
      }
      return res.status(200).json(updatedItinerary);
  } catch (error) {
      console.error('Error updating itinerary activation:', error.message);
      return res.status(500).json({ message: error.message });
  }
};



//Buildo + saif apis 



const notifyUpcomingEvents = async (req, res) => {
  try {
    const { touristId } = req.params;
    if (!touristId) {
      return res.status(400).json({ error: "touristId is required" });
    }
    const result = await eventService.notifyUpcomingEvents(touristId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



const bookEvent = async (req, res) => {
  const { userType, touristId, eventType, eventID, ticketType, currency, activityPrice,promoCode } = req.body;
  try {
    if (userType !== 'tourist') {
      throw new Error('User type must be tourist');
    }
    if (!touristId || !userType || !eventType || !eventID) {
      return res.status(400).json({ error: "All attributes are required in the request body" });
    }

    const updatedTourist = await eventService.addEventToTourist(userType, touristId, eventType, eventID, ticketType, currency, activityPrice,promoCode);

    const allTourists = await eventRepository.findTourists();
    

    
    allTourists.forEach(async tourist => {
      console.log(tourist);
      const isInterested = tourist.interestedIn.some(interested => 
          interested.id.toString() === eventID && 
          interested.type === eventType
      );
    
      if (isInterested) {
          const event = await eventRepository.findEventById(eventID, eventType);
          console.log("Event: ",event);
          const eventName = event.name;
          console.log("Event Name: ",eventName);
          if (event) {
              if(!event.isBooked) {
                const body = `${eventType} with Name ${eventName} started its first booking`;
                const notificationData = {
                    title: "Event Booking",
                    body,
                    user: {
                        user_id: tourist._id,
                        user_type: "tourist"
                    }
                };
                const notification = await checkoutRepository.addNotification(notificationData);
                console.log("NOTIFICATION: ",notification);
                
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL2_USER,
                        pass: process.env.EMAIL2_PASS
                    }
                });
            
                console.log("Transporter created");
                console.log("Tourist email: ",tourist.email);
                
                const mailOptions = {
                    from: process.env.EMAIL2_USER,
                    to: tourist.email,
                    subject: 'Event Booking',
                    text:` ${eventType} with Name ${eventName} started its first booking.\n\nBest regards,\n${process.env.EMAIL2_USER}`
                };
            
                await transporter.sendMail(mailOptions); 
              }
            }
        }
      });
    
    return res.status(200).json({
      success: true,
      message: 'Event booked successfully',
      data: updatedTourist,
    });
  } catch (error) {
    if (error.message.includes('already been booked')) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  updateItineraryActivation,
  getHistoricalTagDetails,
  getUserEvents,
  createCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  createTag,
  getAllTags,
  updateTagById,
  deleteTagById,
  GetupcommingActivitesFilter,
  getUpcomingEvents,
  filterHistoricalPlacesByTags,
  getFilteredItineraries,
  createHistoricalTag,
  getActivityById,
  addActivity,
  updateActivity,
  deleteActivity,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  createHistoricalPlace,
  getAllHistoricalPlaces,
  getHistoricalPlaceById,
  updateHistoricalPlace,
  deleteHistoricalPlace,
  getAllItineraries,
  getAllActivities,
  getAllHistoricalTags,
  getAllActivitiesInDatabase,
  bookedEvents,
  bookEvent,
  cancelBookingEvent,
  getCityCode,
  flightOffers,
  bookFlight,
  getHotelsByCityCode,
  bookHotel,
  createTransportation,
  getTransportations,
  bookTransportation,
  sendEventEmail,
  updateEventFlagController,
  getAllEvents,
  bookEventWithCard,
  notifyUpcomingEvents
  };
  