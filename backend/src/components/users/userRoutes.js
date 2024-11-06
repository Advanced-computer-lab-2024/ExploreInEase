const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const userController = require('../users/userController');
const multer = require('multer');
const { bucket } = require('../../../main'); // Import bucket directly from main.js
const storage = multer.memoryStorage();
const upload = multer({ storage });

let db;

const setDBConnection = (database) => {
    db = database;
};
/**
 * @swagger
 * /deleteUserByIdAndType:
 *   delete:
 *     summary: Delete a user by _id and userType
 *     description: Deletes a user based on the provided userType and prevents self-deletion.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               userType:
 *                 type: string
 *               selfId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid input or trying to delete oneself
 *       403:
 *         description: Unauthorized action
 *       500:
 *         description: Server error
 */
router.delete('/deleteUserByIdAndType', userController.deleteUserByIdAndType);

/**
 * @swagger
 * /addGovernorOrAdmin:
 *   post:
 *     summary: Add a new tourismGovernor or Admin
 *     description: Adds a new user with role 'tourismGovernor' or 'admin'.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *               type:
 *                 type: string
 *                 enum: [admin, tourismGovernor]
 *                 description: The role of the new user (either 'admin' or 'tourismGovernor').
 *     responses:
 *       201:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     type:
 *                       type: string
 *       400:
 *         description: Missing required fields or username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: An error occurred while adding the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/addGovernorOrAdmin', userController.addGovernorOrAdmin);

/**
 * @swagger
 * /fetchAllUsersAndTourists/{_id}:
 *   get:
 *     summary: Fetch all users and tourists
 *     description: Retrieves all registered users and tourists. Only accessible by admins.
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the admin requesting the information.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of users and tourists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       type:
 *                         type: string
 *                 tourists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       type:
 *                         type: string
 *       400:
 *         description: Missing _id parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/fetchAllUsersAndTourists/:_id', userController.fetchAllUsersAndTourists);

/**
 * @swagger
 * /upcomingEvents/{username}:
 *   get:
 *     summary: Get upcoming events for a tourist
 *     description: Retrieves a list of upcoming activities, itineraries, and historical places for the specified tourist username.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The username of the tourist whose upcoming events are to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of upcoming events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 upcomingActivities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       description:
 *                         type: string
 *                 upcomingItineraries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       description:
 *                         type: string
 *                 upcomingHistoricalPlaces:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       description:
 *                         type: string
 *       400:
 *         description: Bad request due to invalid username
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Tourist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
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
router.get('/upcomingEvents/:username', userController.getTouristUpcommingEvents);

/**
 * @swagger
 * /createTourGuide/{_id}:
 *   post:
 *     summary: Create a new tour guide
 *     description: Adds a new tour guide to the system.
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the tour guide to create.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the tour guide.
 *               password:
 *                 type: string
 *                 description: The password for the tour guide.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the tour guide.
 *               mobileNum:
 *                 type: string
 *                 description: The mobile number of the tour guide.
 *     responses:
 *       201:
 *         description: Tour guide created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tour guide created successfully"
 *                 tourGuide:
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
/**
 * @swagger
 * /getTourGuide/{_id}:
 *   get:
 *     summary: Get tour guide details
 *     description: Retrieve details of a specific tour guide by ID.
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the tour guide to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved tour guide details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tourGuide:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: Tour guide not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tour guide not found"
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
/**
 * @swagger
 * /updateTourGuide/{_id}:
 *   put:
 *     summary: Update a tour guide
 *     description: Update the details of a specific tour guide by ID.
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the tour guide to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email address of the tour guide.
 *               mobileNum:
 *                 type: string
 *                 description: The updated mobile number of the tour guide.
 *               otherDetails:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Tour guide updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tour guide updated successfully"
 *                 tourGuide:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: Tour guide not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tour guide not found"
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

router.post('/createTourGuide/:_id', userController.createTourGuide);
router.get('/getTourGuide/:_id', userController.getTourGuide);
router.put('/updateTourGuide/:_id', userController.updateTourGuide);

/**
 * @swagger
 * /createAdvertiser/{_id}:
 *   post:
 *     summary: Create a new advertiser
 *     description: Adds a new advertiser to the system.
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the advertiser to create.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the advertiser.
 *               password:
 *                 type: string
 *                 description: The password for the advertiser.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the advertiser.
 *               mobileNum:
 *                 type: string
 *                 description: The mobile number of the advertiser.
 *     responses:
 *       201:
 *         description: Advertiser created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Advertiser created successfully"
 *                 advertiser:
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
/**
 * @swagger
 * /getAdvertiser/{_id}:
 *   get:
 *     summary: Get advertiser details
 *     description: Retrieve details of a specific advertiser by ID.
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the advertiser to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved advertiser details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 advertiser:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: Advertiser not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Advertiser not found"
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
/**
 * @swagger
 * /updateAdvertiser/{_id}:
 *   put:
 *     summary: Update an advertiser
 *     description: Update the details of a specific advertiser by ID.
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the advertiser to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email address of the advertiser.
 *               mobileNum:
 *                 type: string
 *                 description: The updated mobile number of the advertiser.
 *               otherDetails:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Advertiser updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Advertiser updated successfully"
 *                 advertiser:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: Advertiser not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Advertiser not found"
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

router.post('/createAdvertiser/:_id', userController.createAdvertiser);
router.get('/getAdvertiser/:_id', userController.getAdvertiser);
router.put('/updateAdvertiser/:_id', userController.updateAdvertiser);

/**
 * @swagger
 * /createSeller/{_id}:
 *   post:
 *     summary: Create a new seller
 *     description: Adds a new seller to the system.
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the seller to create.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the seller.
 *               password:
 *                 type: string
 *                 description: The password for the seller.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the seller.
 *               mobileNum:
 *                 type: string
 *                 description: The mobile number of the seller.
 *     responses:
 *       201:
 *         description: Seller created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Seller created successfully"
 *                 seller:
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
/**
 * @swagger
 * /getSeller/{_id}:
 *   get:
 *     summary: Get seller details
 *     description: Retrieve details of a specific seller by ID.
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the seller to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved seller details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seller:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: Seller not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Seller not found"
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
/**
 * @swagger
 * /updateSeller/{_id}:
 *   put:
 *     summary: Update a seller
 *     description: Update the details of a specific seller by ID.
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the seller to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email address of the seller.
 *               mobileNum:
 *                 type: string
 *                 description: The updated mobile number of the seller.
 *               otherDetails:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Seller updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Seller updated successfully"
 *                 seller:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: Seller not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Seller not found"
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

router.post('/createSeller/:_id', userController.createSeller);
router.get('/getSeller/:_id', userController.getSeller);
router.put('/updateSeller/:_id', userController.updateSeller);

/**
 * @swagger
 * /getTourist/{_id}:
 *   get:
 *     summary: Get tourist details
 *     description: Retrieve details of a specific tourist by ID.
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the tourist to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved tourist details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tourist:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: Tourist not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tourist not found"
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
/**
 * @swagger
 * /updateTourist/{_id}:
 *   put:
 *     summary: Update a tourist
 *     description: Update the details of a specific tourist by ID.
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the tourist to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email address of the tourist.
 *               mobileNum:
 *                 type: string
 *                 description: The updated mobile number of the tourist.
 *               otherDetails:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Tourist updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tourist updated successfully"
 *                 tourist:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: Tourist not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tourist not found"
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

router.get('/getTourist/:_id', userController.getTourist);
router.put('/updateTourist/:_id', userController.updateTourist);

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
router.post('/register/:type', userController.registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Log in with a username and password to get user details.
 *     tags:
 *       - [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 example: "password123"
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged in Successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "613b1f1fcf1a4b2f3856b3a1"
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *       400:
 *         description: Bad Request - Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing parameters"
 *       404:
 *         description: Not Found - Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid username or password"
 *       500:
 *         description: Internal Server Error - An error occurred during login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while logging in the user"
 */
router.post('/login', userController.login);


router.put('/acceptTerms/:_id/:type', userController.acceptTerms);

module.exports = {
    setDBConnection,
    router,
};
