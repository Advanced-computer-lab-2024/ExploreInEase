// /register/:type
/**
 * @swagger
 * /register/{type}:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user based on the user type (tourist, tourGuide, advertiser, seller).
 *     tags: [Users]
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         description: The type of user to register (tourist, tourGuide, advertiser, seller).
 *         schema:
 *           type: string
 *           enum: [tourist, tourGuide, advertiser, seller]
 *       - name: body
 *         in: body
 *         required: true
 *         description: User registration details.
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: The user's email address.
 *             username:
 *               type: string
 *               description: The username for the user.
 *             password:
 *               type: string
 *               description: The password for the user.
 *             mobileNum:
 *               type: string
 *               description: The mobile number of the tourist (only for type `tourist`).
 *             nation:
 *               type: string
 *               description: The nationality of the tourist (only for type `tourist`).
 *             dob:
 *               type: string
 *               format: date
 *               description: The date of birth of the tourist (only for type `tourist`).
 *             profession:
 *               type: string
 *               description: The profession of the tourist (only for type `tourist`).
 *     responses:
 *       200:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 User:
 *                   type: object
 *                   additionalProperties: true
 *       400:
 *         description: Bad request due to missing input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing Input"
 *       409:
 *         description: Conflict due to existing username or email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Username already exists"
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

