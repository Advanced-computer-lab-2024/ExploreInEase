const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const eventController = require('../events/eventController');

/**
 * @swagger
 * /GetMyEvents:
 *   get:
 *     summary: Retrieve user events by user ID and userType
 *     tags: [Events]
 *     parameters:
 *       - in: body
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's ID
 *       - in: body
 *         name: userType
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's type
 *     responses:
 *       200:
 *         description: A list of events for the user
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get('/GetMyEvents', eventController.getUserEvents);

/**
 * @swagger
 * /createCategory:
 *   post:
 *     summary: Create a new activity category
 *     tags: [Activity Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

// Create activity category
router.post('/createCategory', eventController.createCategory);


/**
 * @swagger
 * /getAllCategories:
 *   get:
 *     summary: Retrieve all activity categories
 *     tags: [Activity Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *       500:
 *         description: Server error
 */

// Read all activity categories
router.get('/getAllCategories', eventController.getAllCategories); 



/**
 * @swagger
 * /updateCategoryById/{id}:
 *   put:
 *     summary: Update an activity category by ID
 *     tags: [Activity Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the category
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */


// Update by name activity category
router.put('/updateCategoryById/:id', eventController.updateCategoryById);


/**
 * @swagger
 * /deleteCategoryById/{id}:
 *   delete:
 *     summary: Delete an activity category by ID
 *     tags: [Activity Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

// Delete by name activity category
router.delete('/deleteCategoryById/:id', eventController.deleteCategoryById); 

/**
 * @swagger
 * /createTag:
 *   post:
 *     summary: Create a new preference tag
 *     tags: [Preference Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the tag
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
// Create a new preference tag
router.post('/createTag', eventController.createTag);


/**
 * @swagger
 * /getAllTags:
 *   get:
 *     summary: Retrieve all preference tags
 *     tags: [Preference Tags]
 *     responses:
 *       200:
 *         description: A list of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *       500:
 *         description: Server error
 */
// Get all preference tags
router.get('/getAllTags', eventController.getAllTags);


/**
 * @swagger
 * /updateTagById/{id}:
 *   put:
 *     summary: Update a preference tag by ID
 *     tags: [Preference Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tag to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the tag
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */

// Update a preference tag by name
router.put('/updateTagById/:id', eventController.updateTagById);


/**
 * @swagger
 * /deleteTagById/{id}:
 *   delete:
 *     summary: Delete a preference tag by ID
 *     tags: [Preference Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tag to delete
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */

// Delete a preference tag by name
router.delete('/deleteTagById/:id', eventController.deleteTagById);



/**
 * @swagger
 * /upcomingEvents:
 *   get:
 *     summary: Retrieve all upcoming events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of upcoming events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   date:
 *                     type: string
 *                   location:
 *                     type: object
 *       500:
 *         description: Server error
 */
router.get("/upcomingEvents", eventController.getUpcomingEvents);

/**
 * @swagger
 * /filterUpcommingActivites:
 *   get:
 *     summary: Retrieve filtered upcoming activities
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: filters
 *         schema:
 *           type: object
 *         required: false
 *         description: Filters for activities
 *     responses:
 *       200:
 *         description: A list of filtered upcoming activities
 *       400:
 *         description: Invalid filters
 *       500:
 *         description: Server error
 */
router.get("/filterUpcommingActivites", eventController.GetupcommingActivitesFilter);

/**
 * @swagger
 * /filteritineraries:
 *   get:
 *     summary: Retrieve filtered itineraries
 *     tags: [Itineraries]
 *     parameters:
 *       - in: query
 *         name: filters
 *         schema:
 *           type: object
 *         required: false
 *         description: Filters for itineraries
 *     responses:
 *       200:
 *         description: A list of filtered itineraries
 *       400:
 *         description: Invalid filters
 *       500:
 *         description: Server error
 */
router.get("/filteritineraries", eventController.getFilteredItineraries);

/**
 * @swagger
 * /historicalPlacesByTags:
 *   get:
 *     summary: Retrieve historical places by tags
 *     tags: [Historical Places]
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: true
 *         description: Tags to filter historical places
 *     responses:
 *       200:
 *         description: A list of historical places matching the tags
 *       400:
 *         description: Invalid tags
 *       500:
 *         description: Server error
 */
router.get("/historicalPlacesByTags", eventController.filterHistoricalPlacesByTags);


/**
 * @swagger
 * /createHistoricalTag:
 *   post:
 *     summary: Create a new historical tag
 *     description: Creates a new historical tag associated with cultural heritage.
 *     tags: [Historical Tag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of the historical tag (e.g., monuments, museums, etc.).
 *               period:
 *                 type: string
 *                 description: The historical period associated with the tag.
 *     responses:
 *       201:
 *         description: Historical tag created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Historical tag created successfully"
 *                 tag:
 *                   type: object
 *                   description: The created historical tag object.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the created historical tag.
 *                     type:
 *                       type: string
 *                       description: The type of the historical tag.
 *                     period:
 *                       type: string
 *                       description: The historical period associated with the tag.
 *       400:
 *         description: Bad Request, validation errors or invalid tag type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Only tourism governors can create historical tags"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating historical tag"
 */

router.post('/createHistoricalTag', eventController.createHistoricalTag);

// /activity/:_id/:userId
/**
 * @swagger
 * /activity/{_id}/{userId}:
 *   get:
 *     summary: Retrieve activity by ID
 *     description: Get activity details based on the provided activity ID and user ID. Only 'advertiser' type users can access this endpoint.
 *     tags: [Activities]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the activity to retrieve.
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user requesting the activity.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved activity details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the activity.
 *                 name:
 *                   type: string
 *                   description: The name of the activity.
 *                 description:
 *                   type: string
 *                   description: A description of the activity.
 *       400:
 *         description: Invalid input or user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing inputs"
 *       404:
 *         description: Activity not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Activity not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error message here"
 */
// /activity/user/:userId/allActivities
/**
 * @swagger
 * /activity/user/{userId}/allActivities:
 *   get:
 *     summary: Retrieve all activities for an advertiser
 *     description: Get all activities created by a specific user, where the user is of type 'advertiser'.
 *     tags: [Activities]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user requesting the activities.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved activities.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the activity.
 *                   name:
 *                     type: string
 *                     description: The name of the activity.
 *                   description:
 *                     type: string
 *                     description: A description of the activity.
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The date when the activity was created.
 *                   created_by:
 *                     type: string
 *                     description: The ID of the user who created the activity.
 *       400:
 *         description: Invalid user type or missing userId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid user type"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching activities"
 */
// /activity
/**
 * @swagger
 * /activity:
 *   post:
 *     summary: Create a new activity
 *     description: Adds a new activity created by an advertiser.
 *     tags: [Activities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the activity.
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the activity.
 *               time:
 *                 type: string
 *                 description: The time of the activity.
 *               location:
 *                 type: string
 *                 description: The location of the activity.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the activity.
 *               category:
 *                 type: string
 *                 description: The ID of the category for the activity.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the activity.
 *               specialDiscounts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Special discounts for the activity.
 *               isOpen:
 *                 type: boolean
 *                 description: Indicates if the activity is open.
 *               created_by:
 *                 type: string
 *                 description: The ID of the user who created the activity.
 *     responses:
 *       200:
 *         description: Activity created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Activity created successfully"
 *                 activity:
 *                   type: object
 *                   description: The created activity object.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the created activity.
 *                     name:
 *                       type: string
 *                       description: The name of the activity.
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: The date of the activity.
 *                     time:
 *                       type: string
 *                       description: The time of the activity.
 *                     location:
 *                       type: string
 *                       description: The location of the activity.
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: The price of the activity.
 *                     category:
 *                       type: string
 *                       description: The ID of the category for the activity.
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Tags associated with the activity.
 *                     specialDiscounts:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Special discounts for the activity.
 *                     isOpen:
 *                       type: boolean
 *                       description: Indicates if the activity is open.
 *                     created_by:
 *                       type: string
 *                       description: The ID of the user who created the activity.
 *       400:
 *         description: Missing required fields or invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating activity"
 */
// /activity/:_id/:userId
/**
 * @swagger
 * /activity/{_id}/{userId}:
 *   put:
 *     summary: Update an existing activity
 *     description: Updates the details of an existing activity.
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the activity to update.
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user making the update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The updated date of the activity.
 *               time:
 *                 type: string
 *                 description: The updated time of the activity.
 *               location:
 *                 type: string
 *                 description: The updated location of the activity.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The updated price of the activity.
 *               category:
 *                 type: string
 *                 description: The updated ID of the category for the activity.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated tags associated with the activity.
 *               specialDiscounts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated special discounts for the activity.
 *               isOpen:
 *                 type: boolean
 *                 description: Indicates if the activity is open.
 *     responses:
 *       200:
 *         description: Activity updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Activity updated successfully"
 *                 activity:
 *                   type: object
 *                   description: The updated activity object.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the updated activity.
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: The updated date of the activity.
 *                     time:
 *                       type: string
 *                       description: The updated time of the activity.
 *                     location:
 *                       type: string
 *                       description: The updated location of the activity.
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: The updated price of the activity.
 *                     category:
 *                       type: string
 *                       description: The updated ID of the category for the activity.
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Updated tags associated with the activity.
 *                     specialDiscounts:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Updated special discounts for the activity.
 *                     isOpen:
 *                       type: boolean
 *                       description: Indicates if the activity is open.
 *       400:
 *         description: Missing inputs, invalid type, or invalid fields in the update request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing inputs"
 *       404:
 *         description: Activity not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Activity not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating activity"
 */
// /activity/:_id/:userId
/**
 * @swagger
 * /activity/{_id}/{userId}:
 *   delete:
 *     summary: Delete an existing activity
 *     description: Deletes an activity by its ID.
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the activity to delete.
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user making the delete request.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Activity deleted successfully."
 *       400:
 *         description: Missing inputs or invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing inputs"
 *       404:
 *         description: Activity not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Activity not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting activity"
 */

// /itinerary/:_id/:userId
/**
 * @swagger
 * /itinerary/{_id}/{userId}:
 *   get:
 *     summary: Retrieve an itinerary by ID
 *     description: Fetches an itinerary based on its ID and the user type.
 *     tags: [Itineraries]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the itinerary to retrieve.
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user making the request.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved itinerary.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f5f1b2c001f7e8e6f"
 *                 name:
 *                   type: string
 *                   example: "Summer Vacation"
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       activityId:
 *                         type: string
 *                         example: "60c72b2f5f1b2c001f7e8e6g"
 *                       description:
 *                         type: string
 *                         example: "Beach day with friends"
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                       content:
 *                         type: string
 *                         example: "Had a great time!"
 *       400:
 *         description: Missing ID or invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing id"
 *       404:
 *         description: Itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Itinerary not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
// /itinerary/user/:userId/allItineraries
/**
 * @swagger
 * /itinerary/user/{userId}/allItineraries:
 *   get:
 *     summary: Retrieve all itineraries for a user
 *     description: Fetches all itineraries created by a specific user based on their user ID.
 *     tags: [Itineraries]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user whose itineraries are being requested.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved itineraries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f5f1b2c001f7e8e6f"
 *                   name:
 *                     type: string
 *                     example: "Weekend Getaway"
 *                   activities:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         activityId:
 *                           type: string
 *                           example: "60c72b2f5f1b2c001f7e8e6g"
 *                         description:
 *                           type: string
 *                           example: "Visit the local museum"
 *                   created_by:
 *                     type: string
 *                     example: "60c72b2f5f1b2c001f7e8e6h"
 *       400:
 *         description: Invalid user ID or user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing userId"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
// /itinerary
/**
 * @swagger
 * /itinerary:
 *   post:
 *     summary: Create a new itinerary
 *     description: Creates a new itinerary with the specified details.
 *     tags: [Itineraries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ["60c72b2f5f1b2c001f7e8e6f", "60c72b2f5f1b2c001f7e8e70"]
 *               locations:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ["Location A", "Location B"]
 *               timeline:
 *                 type: string
 *                 example: "Day 1: Arrival; Day 2: Sightseeing"
 *               directions:
 *                 type: string
 *                 example: "Take bus number 5 to reach the destination."
 *               language:
 *                 type: string
 *                 example: "English"
 *               price:
 *                 type: number
 *                 example: 100.00
 *               dateTimeAvailable:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-01T10:00:00Z"
 *               accessibility:
 *                 type: string
 *                 example: "Wheelchair accessible"
 *               pickupLocation:
 *                 type: string
 *                 example: "Hotel Lobby"
 *               dropoffLocation:
 *                 type: string
 *                 example: "Airport"
 *               isActivated:
 *                 type: boolean
 *                 example: true
 *               created_by:
 *                 type: string
 *                 example: "60c72b2f5f1b2c001f7e8e6h"
 *               flag:
 *                 type: string
 *                 example: "normal"
 *               isSpecial:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Successfully created itinerary.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Itinerary created successfully"
 *                 Itinerary:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001f7e8e6f"
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: ["60c72b2f5f1b2c001f7e8e6f", "60c72b2f5f1b2c001f7e8e70"]
 *                     # Include other itinerary fields as needed
 *       400:
 *         description: Missing required fields or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
// /itinerary/:_id/:userId
/**
 * @swagger
 * /itinerary/{_id}/{userId}:
 *   put:
 *     summary: Update an existing itinerary
 *     description: Updates the specified itinerary with new data. Only tour guides can update itineraries.
 *     tags: [Itineraries]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the itinerary to update.
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f7e8e6f"
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user making the request.
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f7e8e6h"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ["60c72b2f5f1b2c001f7e8e6f", "60c72b2f5f1b2c001f7e8e70"]
 *               locations:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ["Location A", "Location B"]
 *               timeline:
 *                 type: string
 *                 example: "Day 1: Arrival; Day 2: Sightseeing"
 *               directions:
 *                 type: string
 *                 example: "Take bus number 5 to reach the destination."
 *               language:
 *                 type: string
 *                 example: "English"
 *               price:
 *                 type: number
 *                 example: 100.00
 *               dateTimeAvailable:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-01T10:00:00Z"
 *               accessibility:
 *                 type: string
 *                 example: "Wheelchair accessible"
 *               pickupLocation:
 *                 type: string
 *                 example: "Hotel Lobby"
 *               dropoffLocation:
 *                 type: string
 *                 example: "Airport"
 *               isActivated:
 *                 type: boolean
 *                 example: true
 *               flag:
 *                 type: string
 *                 example: "normal"
 *               isSpecial:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Successfully updated itinerary.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Itinerary updated successfully."
 *                 itinerary:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001f7e8e6f"
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: ["60c72b2f5f1b2c001f7e8e6f", "60c72b2f5f1b2c001f7e8e70"]
 *                     # Include other itinerary fields as needed
 *       400:
 *         description: Invalid request due to missing id or user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid type or missing id."
 *       404:
 *         description: Itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Itinerary not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating itinerary."
 */
// /itinerary/:_id/:userId
/**
 * @swagger
 * /itinerary/{_id}/{userId}:
 *   delete:
 *     summary: Delete an existing itinerary
 *     description: Deletes the specified itinerary. Only tour guides can delete itineraries.
 *     tags: [Itineraries]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the itinerary to delete.
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f7e8e6f"
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user making the request.
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f7e8e6h"
 *     responses:
 *       200:
 *         description: Successfully deleted itinerary.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Itinerary deleted successfully."
 *       400:
 *         description: Invalid request due to missing id or user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid type or missing id."
 *       404:
 *         description: Itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Itinerary not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting itinerary."
 */

// /historical-places
/**
 * @swagger
 * /historical-places:
 *   post:
 *     summary: Create a new historical place
 *     description: Creates a new historical place with the specified details. Only tourism governors are authorized to create historical places.
 *     tags: [Historical Places]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "A beautiful historical site with rich cultural heritage."
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               location:
 *                 type: string
 *                 example: "123 Historical Ave, History Town"
 *               openingHours:
 *                 type: string
 *                 example: "09:00 AM - 05:00 PM"
 *               ticketPrice:
 *                 type: number
 *                 example: 15.00
 *               type:
 *                 type: string
 *                 example: "cultural"
 *               period:
 *                 type: string
 *                 example: "Medieval"
 *               created_by:
 *                 type: string
 *                 example: "60c72b2f5f1b2c001f7e8e6h"
 *     responses:
 *       200:
 *         description: Successfully created historical place.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Historical Place created successfully."
 *                 savedPlace:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001f7e8e70"
 *                     description:
 *                       type: string
 *                       example: "A beautiful historical site with rich cultural heritage."
 *                     # Include other historical place fields as needed
 *       400:
 *         description: Missing required fields or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields."
 *       403:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to create a Historical Place."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating historical place."
 */
// /historical-places/:userId/allHistoricalPlaces
/**
 * @swagger
 * /historical-places/{userId}/allHistoricalPlaces:
 *   get:
 *     summary: Retrieve all historical places
 *     description: Retrieves a list of all historical places. Only tourism governors are authorized to access this endpoint.
 *     tags: [Historical Places]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user making the request.
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f7e8e6h"
 *     responses:
 *       200:
 *         description: A list of historical places.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f5f1b2c001f7e8e70"
 *                   description:
 *                     type: string
 *                     example: "A beautiful historical site with rich cultural heritage."
 *                   pictures:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "https://example.com/image1.jpg"
 *                   location:
 *                     type: string
 *                     example: "123 Historical Ave, History Town"
 *                   openingHours:
 *                     type: string
 *                     example: "09:00 AM - 05:00 PM"
 *                   ticketPrice:
 *                     type: number
 *                     example: 15.00
 *                   created_by:
 *                     type: string
 *                     example: "60c72b2f5f1b2c001f7e8e6h"
 *       400:
 *         description: Missing userId or invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing userId"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching historical places."
 */
// /historical-places/:_id/:userId
/**
 * @swagger
 * /historical-places/{_id}/{userId}:
 *   get:
 *     summary: Retrieve a historical place by ID
 *     description: Fetch a specific historical place using its ID. Only tourism governors are authorized to access this endpoint.
 *     tags: [Historical Places]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the historical place to retrieve.
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f7e8e70"
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user making the request.
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f7e8e6h"
 *     responses:
 *       200:
 *         description: Historical place found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Historical Place found"
 *                 historicalPlace:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001f7e8e70"
 *                     description:
 *                       type: string
 *                       example: "A beautiful historical site with rich cultural heritage."
 *                     pictures:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "https://example.com/image1.jpg"
 *                     location:
 *                       type: string
 *                       example: "123 Historical Ave, History Town"
 *                     openingHours:
 *                       type: string
 *                       example: "09:00 AM - 05:00 PM"
 *                     ticketPrice:
 *                       type: number
 *                       example: 15.00
 *                     created_by:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001f7e8e6h"
 *       400:
 *         description: Missing inputs or invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing inputs"
 *       404:
 *         description: Historical place not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Historical Place not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching historical place."
 */
// /historical-places/:_id/:userId
/**
 * @swagger
 * /historical-places/{_id}/{userId}:
 *   put:
 *     summary: Update a historical place by ID
 *     description: Update an existing historical place using its ID. Only tourism governors are authorized to make updates.
 *     tags: [Historical Places]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the historical place to update.
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f7e8e70"
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user making the request.
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f7e8e6h"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updateValues:
 *                 type: object
 *                 properties:
 *                   description:
 *                     type: string
 *                     example: "An updated description for the historical site."
 *                   pictures:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "https://example.com/image2.jpg"
 *                   location:
 *                     type: string
 *                     example: "456 Updated Historical Ave, History Town"
 *                   openingHours:
 *                     type: string
 *                     example: "10:00 AM - 06:00 PM"
 *                   ticketPrice:
 *                     type: number
 *                     example: 20.00
 *     responses:
 *       200:
 *         description: Historical place updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Historical Place updated"
 *                 updatedHistoricalPlace:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001f7e8e70"
 *                     description:
 *                       type: string
 *                       example: "An updated description for the historical site."
 *                     pictures:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "https://example.com/image2.jpg"
 *                     location:
 *                       type: string
 *                       example: "456 Updated Historical Ave, History Town"
 *                     openingHours:
 *                       type: string
 *                       example: "10:00 AM - 06:00 PM"
 *                     ticketPrice:
 *                       type: number
 *                       example: 20.00
 *                     created_by:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001f7e8e6h"
 *       400:
 *         description: Missing inputs or invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing inputs"
 *       404:
 *         description: Historical place not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Historical Place not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating historical place."
 */
// /histrorical-places/:_id/:userId
/**
 * @swagger
 * /historical-places/{_id}/{userId}:
 *   delete:
 *     summary: Delete a historical place by ID
 *     description: Deletes an existing historical place using its ID. Only tourism governors are authorized to perform this action.
 *     tags: [Historical Places]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the historical place to delete.
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f7e8e70"
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user making the request.
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f7e8e6h"
 *     responses:
 *       200:
 *         description: Historical place deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Historical Place deleted"
 *       400:
 *         description: Missing inputs or invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing inputs"
 *       404:
 *         description: Historical place not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Historical Place not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting historical place."
 */

router.get('/activity/:_id/:userId', eventController.getActivityById);
router.get('/activity/user/:userId/allActivities', eventController.getAllActivities);
router.post('/activity', eventController.addActivity);
router.put('/activity/:_id/:userId', eventController.updateActivity);
router.delete('/activity/:_id/:userId', eventController.deleteActivity);

router.get('/itinerary/:_id/:userId', eventController.getItineraryById);
router.get('/itinerary/user/:userId/allItineraries', eventController.getAllItineraries);
router.post('/itinerary', eventController.createItinerary);
router.put('/itinerary/:_id/:userId', eventController.updateItinerary);
router.delete('/itinerary/:_id/:userId', eventController.deleteItinerary);

router.post('/historical-places', eventController.createHistoricalPlace);
router.get('/historical-places/:userId/allHistoricalPlaces', eventController.getAllHistoricalPlaces);
router.get('/historical-places/:_id/:userId', eventController.getHistoricalPlaceById);
router.put('/historical-places/:_id/:userId', eventController.updateHistoricalPlace);
router.delete('/historical-places/:_id/:userId', eventController.deleteHistoricalPlace);


module.exports = router;
