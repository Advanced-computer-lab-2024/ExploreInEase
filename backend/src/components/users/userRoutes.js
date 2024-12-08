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
router.get('/notAcceptedUsers', userController.getNotAcceptedUsers);

router.get('/deletionrequests', userController.getUsersForDeletion);

router.put('/user/updatingStatus/:userId/:status', userController.updatingStatusUser)

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
// router.get('/upcomingEvents/:username', userController.getTouristUpcommingEvents);

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

router.post('/rateTourGuide/:touristId', userController.rateTourGuide);

router.post('/commentTourGuide/:touristId', userController.commentOnTourGuide);

router.post('/rateItinerary/:touristId', userController.rateItinerary);

router.post('/commentItinerary/:touristId', userController.commentOnItinerary);

router.post('/rateActivity/:touristId', userController.rateActivity);

router.post('/commentActivity/:touristId', userController.commentOnActivity);

router.post('/rateHistoricalPlace/:touristId', userController.rateHistoricalPlace);

router.post('/commentHistoricalPlace/:touristId', userController.commentOnHistoricalPlace);



// Saif ,Tasnim
router.put('/changePassword/:userId', userController.changePassword);

router.post('/uploadImage/:userId', upload.single('image'), userController.uploadImage);

router.get('/notAcceptedUsers', userController.getNotAcceptedUsers);

router.get('/redeemPoints/:userId/:points', userController.redeemPoints);

router.put('/pointsAfterPayment/:userId/:amount', userController.pointsAfterPayment);

router.get('/level/:userId', userController.getLevel);

router.put('/acceptTerms/:_id/:type', userController.acceptTerms);

router.post('/register/:type', userController.registerUser);

router.post('/login', userController.login);

router.post('/forgetPassword', userController.forgetPassword);
router.get('/verifyOTP/:userId/:otp', userController.verifyOtP);
router.put('/changePasswordAfterOTP/:userId', userController.changePasswordAfterOTP);

router.post('/creatingPromoCode', userController.creatingPromoCode);
router.put('/updatePromoCode', userController.updatePromoCode);

router.put('/addInterestedIn/:_id/:eventId/:eventType', userController.addInterestedIn);
router.get('/getAllNotifications/:userId', userController.getAllNotifications);

router.put('/requestDeletion/:userId/:type', userController.requestDeletion);
router.get('/userReport/:userId', userController.userReport);


router.post("/bookmark/:touristId/:id/:type", userController.addBookmark);
router.get("/fetchbookmark/:touristId", userController.getBookmarks);

router.post('/addAddresses/:userId/:address', userController.addAddresses);
router.get('/getAddresses/:userId', userController.getAddresses);

module.exports = {
    router,
    setDBConnection,
   
};