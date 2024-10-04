const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const userController = require('../users/userController');


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
 *     summary: Add a new governor or admin
 *     description: Creates a new tourism governor or admin.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               type:
 *                 type: string
 *               
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Server error
 */
router.post('/addGovernorOrAdmin', userController.addGovernorOrAdmin);

/**
 * @swagger
 * /fetchAllUsersAndTourists:
 *   get:
 *     summary: Fetch all users and tourists
 *     description: Retrieve data from the Users and Tourists tables.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved data
 *       500:
 *         description: Server error
 */
router.get('/fetchAllUsersAndTourists', userController.fetchAllUsersAndTourists);


/**
 * @swagger
 * /upcomingEvents/{username}:
 *   get:
 *     summary: Get a tourist's upcoming events
 *     description: Retrieve upcoming activities, itineraries, and historical places for a given tourist by username.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the tourist
 *     responses:
 *       200:
 *         description: Successfully retrieved upcoming events
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
 *                         format: date
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
 *                         format: date
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
 *                         format: date
 *                       description:
 *                         type: string
 *       400:
 *         description: Username is required or invalid
 *       500:
 *         description: Server error
 */
router.get('/upcomingEvents/:username', userController.getTouristUpcommingEvents);

/**
 * @swagger
 * /createTourGuide/{_id}:
 *   post:
 *     summary: Create a new tour guide profile
 *     tags: [Tour Guide]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to convert to tour guide
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourGuide'
 *     responses:
 *       201:
 *         description: Tour guide created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourGuide'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /getTourGuide/{_id}:
 *   get:
 *     summary: Retrieve a tour guide profile
 *     tags: [Tour Guide]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tour guide to retrieve
 *     responses:
 *       200:
 *         description: Tour guide profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourGuide'
 *       404:
 *         description: Tour guide not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /updateTourGuide/{_id}:
 *   put:
 *     summary: Update a tour guide profile
 *     tags: [Tour Guide]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tour guide to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourGuide'
 *     responses:
 *       200:
 *         description: Tour guide updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourGuide'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tour guide not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */








router.post('/createTourGuide/:_id', userController.createTourGuide);
router.get('/getTourGuide/:_id', userController.getTourGuide);
router.put('/updateTourGuide/:_id', userController.updateTourGuide);








/**
 * @swagger
 * /createAdvertiser/{_id}:
 *   post:
 *     summary: Create a new advertiser profile
 *     tags: [Advertiser]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to convert to advertiser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Advertiser'
 *     responses:
 *       201:
 *         description: Advertiser profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advertiser'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /getAdvertiser/{_id}:
 *   get:
 *     summary: Retrieve an advertiser profile
 *     tags: [Advertiser]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the advertiser to retrieve
 *     responses:
 *       200:
 *         description: Advertiser profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advertiser'
 *       404:
 *         description: Advertiser not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /updateAdvertiser/{_id}:
 *   put:
 *     summary: Update an advertiser profile
 *     tags: [Advertiser]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the advertiser to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Advertiser'
 *     responses:
 *       200:
 *         description: Advertiser profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advertiser'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Advertiser not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */




router.post('/createAdvertiser/:_id', userController.createAdvertiser);
router.get('/getAdvertiser/:_id', userController.getAdvertiser);
router.put('/updateAdvertiser/:_id', userController.updateAdvertiser);





/**
 * @swagger
 * /createSeller/{_id}:
 *   post:
 *     summary: Create a new seller profile
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to convert to seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seller'
 *     responses:
 *       201:
 *         description: Seller profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seller'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /getSeller/{_id}:
 *   get:
 *     summary: Retrieve a seller profile
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the seller to retrieve
 *     responses:
 *       200:
 *         description: Seller profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seller'
 *       404:
 *         description: Seller not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /updateSeller/{_id}:
 *   put:
 *     summary: Update a seller profile
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the seller to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seller'
 *     responses:
 *       200:
 *         description: Seller profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seller'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Seller not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */



router.post('/createSeller/:_id', userController.createSeller);
router.get('/getSeller/:_id', userController.getSeller);
router.put('/updateSeller/:_id', userController.updateSeller);

/**
 * @swagger
 * /getTourist/{_id}:
 *   get:
 *     summary: Retrieve a tourist profile
 *     tags: [Tourist]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tourist to retrieve
 *     responses:
 *       200:
 *         description: Tourist profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tourist'
 *       404:
 *         description: Tourist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /updateTourist/{_id}:
 *   put:
 *     summary: Update a tourist profile (excluding username and wallet)
 *     tags: [Tourist]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tourist to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tourist'
 *     responses:
 *       200:
 *         description: Tourist profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tourist'
 *       400:
 *         description: Bad Request, cannot update username or wallet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tourist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


router.get('/getTourist/:_id', userController.getTourist);
router.put('/updateTourist/:_id', userController.updateTourist);


router.post('/register/:type', userController.registerUser);


module.exports = router;
