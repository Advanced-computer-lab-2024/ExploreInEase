const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const eventController = require('../events/eventController');

router.put('/inappropriate', eventController.updateEventFlagController);

router.get('/getAllEvents', eventController.getAllEvents);
/**
 * @swagger
 * /GetMyEvents/{_id}/{userType}:
 *   get:
 *     summary: Get events based on user type
 *     description: Retrieve events related to a specific user based on their role (tourismGovernor, tourGuide, advertiser).
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *         example: "64a8b0f1234567890abc1234"
 *       - in: path
 *         name: userType
 *         required: true
 *         description: The type of the user (tourismGovernor, tourGuide, advertiser)
 *         schema:
 *           type: string
 *           enum: [tourismGovernor, tourGuide, advertiser]
 *         example: "tourGuide"
 *     responses:
 *       200:
 *         description: Successfully retrieved user events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   description: List of events related to the user
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the event
 *                       name:
 *                         type: string
 *                         description: The name of the event
 *                       description:
 *                         type: string
 *                         description: A brief description of the event
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: The date of the event
 *                       location:
 *                         type: string
 *                         description: The location of the event
 *       400:
 *         description: Bad request due to missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User ID and userType are required."
 *                 error:
 *                   type: string
 *                   example: "Invalid userId or userType format"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred"
 *                 details:
 *                   type: string
 *                   example: "Error details message"
 */
router.get('/GetMyEvents/:_id/:userType', eventController.getUserEvents);

/**
 * @swagger
 * /createCategory/{_id}:
 *   post:
 *     summary: Create a new category (admin only)
 *     description: This endpoint allows the creation of a new category. Only users with the userType 'admin' can create categories. The userType is validated using the provided user ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user making the request (userType must be 'admin' to create categories)
 *         example: "64d5a4e674b17cba3f4e2f96"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the new category
 *                 example: "Historical"
 *     responses:
 *       201:
 *         description: Successfully created category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category created successfully"
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the newly created category
 *                     name:
 *                       type: string
 *                       description: The name of the newly created category
 *       400:
 *         description: Invalid inputs or userType is not 'admin'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid inputs" or "Invalid type"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating the category"
 */
router.post('/createCategory/:_id', eventController.createCategory);

/**
 * @swagger
 * /getAllCategories/{userType}:
 *   get:
 *     summary: Retrieve all categories based on user type
 *     description: This endpoint retrieves all categories. The userType is validated before fetching the categories. Only valid user types can access this endpoint.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: userType
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of user making the request (e.g., advertiser, admin, tourGuide, tourist, guest)
 *         example: "advertiser"
 *     responses:
 *       200:
 *         description: Successfully retrieved all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the category
 *                   name:
 *                     type: string
 *                     description: The name of the category
 *       400:
 *         description: Invalid userType provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid type"
 *       500:
 *         description: Internal server error while fetching categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching categories"
 */
router.get('/getAllCategories/:userType', eventController.getAllCategories);

/**
 * @swagger
 * /updateCategoryById/{_id}:
 *   put:
 *     summary: Update a category by its ID
 *     description: This endpoint updates a category based on its ID. Only admin users can update a category.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update
 *         example: "123456"
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
 *                 example: "Updated Category Name"
 *               description:
 *                 type: string
 *                 description: Optional description for the category
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Successfully updated the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the updated category
 *                 name:
 *                   type: string
 *                   description: The updated name of the category
 *                 description:
 *                   type: string
 *                   description: Optional updated description
 *       400:
 *         description: Missing required fields or invalid user type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields" or "Invalid type"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category not found"
 *       500:
 *         description: Internal server error while updating the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the category"
 */
router.put('/updateCategoryById/:_id', eventController.updateCategoryById);

/**
 * @swagger
 * /deleteCategoryById/{_id}:
 *   delete:
 *     summary: Delete a category by its ID
 *     description: This endpoint deletes a category by its ID. Only admin users can delete a category.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *         example: "123456"
 *     responses:
 *       200:
 *         description: Successfully deleted the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *       400:
 *         description: Missing required fields or invalid user type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields" or "Invalid type"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category not found"
 *       500:
 *         description: Internal server error while deleting the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: string
 *                   description: Details about the server error
 */
router.delete('/deleteCategoryById/:_id', eventController.deleteCategoryById);

/**
 * @swagger
 * /createPreferenceTag/{_id}:
 *   post:
 *     summary: Create new tags
 *     description: This endpoint allows users with the role of admin to create new tags.
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user creating the tags
 *         example: "123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of tags to create
 *                 example: ["historical", "nature", "adventure"]
 *     responses:
 *       201:
 *         description: Successfully created the tag(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["historical", "nature", "adventure"]
 *       400:
 *         description: Missing required fields or invalid user type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Internal server error while creating the tag(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating tag"
 */
router.post('/createPreferenceTag/:_id', eventController.createTag);


/**
 * @swagger
 * /getAllPreferenceTags/{_id}:
 *   get:
 *     summary: Retrieve all preference tags
 *     description: This endpoint allows users with the role of admin to fetch all preference tags.
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user fetching the tags
 *         example: "123456"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of preference tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["historical", "nature", "adventure"]
 *       400:
 *         description: Missing required fields or invalid user type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Internal server error while fetching the tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching tags"
 */
router.get('/getAllPreferenceTags/:_id', eventController.getAllTags);



/**
 * @swagger
 * /updatePreferenceTagById/{_id}:
 *   put:
 *     summary: Update a preference tag by ID
 *     description: This endpoint allows updating a specific preference tag using its ID. The request is only allowed if the user is an admin.
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the preference tag to be updated
 *         example: "607d1e3eab1e3f001fddf72a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               tags: ["cultural", "historical"]
 *     responses:
 *       200:
 *         description: Successfully updated the preference tag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag updated successfully"
 *                 updatedTag:
 *                   type: object
 *                   additionalProperties: true
 *       400:
 *         description: Missing required fields or invalid user type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid type"
 *       404:
 *         description: Tag not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag not found"
 *       500:
 *         description: Internal server error while updating the tag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating tag"
 */
router.put('/updatePreferenceTagById/:_id', eventController.updateTagById);

/**
 * @swagger
 * /deletePreferenceTagById/{_id}:
 *   delete:
 *     summary: Delete a preference tag by ID
 *     description: This endpoint allows deleting a specific preference tag using its ID. The request is only allowed if the user is an admin.
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the preference tag to be deleted
 *         example: "607d1e3eab1e3f001fddf72a"
 *     responses:
 *       200:
 *         description: Successfully deleted the preference tag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag deleted successfully"
 *       400:
 *         description: Missing required fields or invalid user type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid type"
 *       404:
 *         description: Tag not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag not found"
 *       500:
 *         description: Internal server error while deleting the tag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting tag"
 */
router.delete('/deletePreferenceTagById/:_id', eventController.deleteTagById);

/**
 * @swagger
 * /upcomingEvents:
 *   get:
 *     summary: Retrieve upcoming events
 *     description: This endpoint returns a list of upcoming events, including activities, itineraries, and historical places.
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: A list of upcoming events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "607d1e3eab1e3f001fddf72a"
 *                       name:
 *                         type: string
 *                         example: "City Tour"
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-10-15"
 *                       time:
 *                         type: string
 *                         example: "10:00 AM"
 *                       location:
 *                         type: object
 *                         properties:
 *                           latitude:
 *                             type: number
 *                             example: 37.7749
 *                           longitude:
 *                             type: number
 *                             example: -122.4194
 *                       budget:
 *                         type: number
 *                         example: 50.00
 *                       category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Cultural"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "sightseeing"
 *                       specialDiscounts:
 *                         type: array
 *                         items:
 *                           type: string
 *                       created_by:
 *                         type: string
 *                         example: "admin"
 *                       flag:
 *                         type: boolean
 *                         example: true
 *                       isOpen:
 *                         type: boolean
 *                         example: true
 *                       rating:
 *                         type: number
 *                         format: float
 *                         example: 4.5
 *                       comments:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-08-10T12:00:00Z"
 *                       description:
 *                         type: string
 *                         example: "Explore the city's history and culture."
 *                 itineraries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "607d1e3eab1e3f001fddf72b"
 *                       activities:
 *                         type: array
 *                         items:
 *                           type: string
 *                       locations:
 *                         type: array
 *                         items:
 *                           type: string
 *                       timeline:
 *                         type: string
 *                         example: "09:00 AM - 05:00 PM"
 *                       directions:
 *                         type: string
 *                         example: "Start at the main square."
 *                       language:
 *                         type: string
 *                         example: "English"
 *                       price:
 *                         type: number
 *                         example: 150.00
 *                       dateAvailable:
 *                         type: string
 *                         format: date
 *                         example: "2024-10-15"
 *                       accessibility:
 *                         type: string
 *                         example: "Wheelchair accessible"
 *                       pickupLocation:
 *                         type: string
 *                         example: "Hotel Lobby"
 *                       dropoffLocation:
 *                         type: string
 *                         example: "Main Square"
 *                       isActivated:
 *                         type: boolean
 *                         example: true
 *                       created_by:
 *                         type: string
 *                         example: "admin"
 *                       flag:
 *                         type: boolean
 *                         example: false
 *                       rating:
 *                         type: number
 *                         format: float
 *                         example: 4.0
 *                       comments:
 *                         type: array
 *                         items:
 *                           type: string
 *                 historicalPlaces:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "607d1e3eab1e3f001fddf72c"
 *                       description:
 *                         type: string
 *                         example: "A beautiful historical site."
 *                       pictures:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "http://example.com/image.jpg"
 *                       location:
 *                         type: object
 *                         properties:
 *                           latitude:
 *                             type: number
 *                             example: 37.7749
 *                           longitude:
 *                             type: number
 *                             example: -122.4194
 *                       openingHours:
 *                         type: string
 *                         example: "9 AM - 6 PM"
 *                       ticketPrice:
 *                         type: object
 *                         properties:
 *                           student:
 *                             type: number
 *                             example: 10.00
 *                           native:
 *                             type: number
 *                             example: 20.00
 *                           foreign:
 *                             type: number
 *                             example: 30.00
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-08-10T12:00:00Z"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "history"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 *                 details:
 *                   type: string
 *                   example: "Error message details"
 */
router.get("/upcomingEvents", eventController.getUpcomingEvents);

/**
 * @swagger
 * /filterUpcommingActivites:
 *   get:
 *     summary: Filter upcoming activities
 *     description: Retrieve a filtered list of upcoming activities based on budget, date, categoryId, and rating.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: query
 *         name: budget
 *         schema:
 *           type: number
 *         description: The maximum budget for the activities
 *         example: 100.50
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: The date of the activity (filter)
 *         example: 2024-10-10T00:00:00Z
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: The ID of the category to filter activities by
 *         example: "categoryId123"
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *         description: Minimum rating of the activities (1-5)
 *         example: 4
 *     responses:
 *       200:
 *         description: Successfully retrieved the filtered list of activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the activity
 *                   name:
 *                     type: string
 *                     description: The name of the activity
 *                   budget:
 *                     type: number
 *                     description: The budget for the activity
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: The date of the activity
 *                   categoryId:
 *                     type: string
 *                     description: The category ID of the activity
 *                   rating:
 *                     type: integer
 *                     description: The rating of the activity (1-5)
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 *                 details:
 *                   type: string
 *                   example: "Error details message"
 */
router.get("/filterUpcommingActivites", eventController.GetupcommingActivitesFilter);
/**
 * @swagger
 * /filteritineraries:
 *   get:
 *     summary: Get filtered itineraries
 *     description: Fetch itineraries based on budget, date, preferences, and language.
 *     parameters:
 *       - in: query
 *         name: budget
 *         required: false
 *         description: Budget filter for itineraries
 *         schema:
 *           type: number
 *       - in: query
 *         name: date
 *         required: false
 *         description: Date filter for itineraries in YYYY-MM-DD format
 *         schema:
 *           type: string
 *       - in: query
 *         name: preferences
 *         required: false
 *         description: User preferences for filtering itineraries
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: language
 *         required: false
 *         description: Preferred language for itineraries
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered itineraries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 itineraries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       activities:
 *                         type: array
 *                         items:
 *                           type: string
 *                       locations:
 *                         type: array
 *                         items:
 *                           type: string
 *                       price:
 *                         type: number
 *                       dateTimeAvailable:
 *                         type: string
 *                       language:
 *                         type: string
 *                       accessibility:
 *                         type: string
 *                       pickupLocation:
 *                         type: string
 *                       dropoffLocation:
 *                         type: string
 *                       rating:
 *                         type: number
 *                       comments:
 *                         type: array
 *                         items:
 *                           type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: An error occurred while fetching itineraries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching itineraries"
 *                 details:
 *                   type: string
 *                   example: "Error details message"
 */
router.get("/filteritineraries", eventController.getFilteredItineraries);

/**
 * @swagger
 * /historicalPlacesByTags/{_id}:
 *   get:
 *     summary: Filter historical places by tags
 *     description: Fetch historical places based on specified tags for a given user ID.
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: User ID to filter the historical places
 *         schema:
 *           type: string
 *       - in: query
 *         name: tags
 *         required: true
 *         description: Array of tags to filter historical places
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered historical places
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   description:
 *                     type: string
 *                   pictures:
 *                     type: array
 *                     items:
 *                       type: string
 *                   location:
 *                     type: string
 *                   openingHours:
 *                     type: string
 *                   ticketPrice:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                   createdBy:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *       400:
 *         description: Missing required fields or invalid user type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: An error occurred while fetching historical places
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */
router.get("/historicalPlacesByTags/:_id", eventController.filterHistoricalPlacesByTags);

/**
 * @swagger
 * /createHistoricalTag/{_id}:
 *   post:
 *     summary: Create a historical tag
 *     description: Creates a new historical tag if the user is authorized (tourismGovernor).
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: User ID for authorization
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the historical tag
 *               description:
 *                 type: string
 *                 description: Description of the historical tag
 *     responses:
 *       201:
 *         description: Successfully created a historical tag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Missing required fields or invalid user type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: An error occurred while creating the tag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */
router.post('/createHistoricalTag/:_id', eventController.createHistoricalTag);

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
router.get('/getAllActivities', eventController.getAllActivitiesInDatabase);
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

/**
 * @swagger
 * /getAllHistoricalTags/{userId}:
 *   get:
 *     summary: Get all historical tags for a user
 *     description: This endpoint fetches all historical tags for a user by userId.
 *     tags: 
 *       - Historical Tags
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: Successfully fetched tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tags fetched successfully
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123"
 *                       tagName:
 *                         type: string
 *                         example: "Ancient Monument"
 *       400:
 *         description: Missing or invalid inputs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing inputs or Invalid type
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 *                 details:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.get('/getAllHistoricalTags/:userId', eventController.getAllHistoricalTags);
router.get('/allActivities', eventController.getAllActivitiesInDatabase);
router.get('/getHistoricalTagDetails/:tagId', eventController.getHistoricalTagDetails);
router.post('/sendEventEmail/:touristId/:receiverEmail', eventController.sendEventEmail);






//mohamed apis 

router.get('/bookedEvents/:touristId', eventController.bookedEvents)
router.put('/bookEvent', eventController.bookEvent);
router.put('/cancelBookingEvent', eventController.cancelBookingEvent);
// Route to get city code by city name
router.get('/city/:city', eventController.getCityCode);

// Route to get hotel IDs by city code
router.get('/hotels/:cityCode/:startDate/:endDate/:currency/:personCount', eventController.getHotelsByCityCode);

//define the route to book hotels 
router.post('/bookHotel', eventController.bookHotel);

// Route to get Flight Offers
router.post('/flightOffers', eventController.flightOffers);
// Define the route to book a flight
router.post('/bookFlight', eventController.bookFlight);

// Create Transportation Route
router.post('/createTransportation', eventController.createTransportation);

// Get Transportation Route
router.get('/getTransportations/:currency', eventController.getTransportations);
// Route to book transportation
router.post('/bookTransportation', eventController.bookTransportation);

module.exports = router;
