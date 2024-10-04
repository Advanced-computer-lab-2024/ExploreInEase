// /upcomingEvents
/**
 * @swagger
 * /filterUpcomingActivities:
 *   get:
 *     summary: Filter and retrieve upcoming activities
 *     tags: 
 *       - Events
 *     description: Retrieve a list of upcoming activities based on various filters such as budget, date, category, and rating.
 *     parameters:
 *       - in: query
 *         name: budget
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum budget for activities (filter by price)
 *         example: 100.00
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter activities that occur on or after this date
 *         example: "2024-10-15"
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by activity category ID
 *         example: "63429f6b5b4a7b009b3e5c5a"
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *         description: Minimum rating to filter activities (1 to 5)
 *         example: 4
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of activities per page
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "63429f6b5b4a7b009b3e5c5a"
 *                   name:
 *                     type: string
 *                     example: "Outdoor Concert"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-20"
 *                   time:
 *                     type: string
 *                     example: "18:30"
 *                   location:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         example: 29.9792
 *                       longitude:
 *                         type: number
 *                         example: 31.1342
 *                   budget:
 *                     type: number
 *                     format: float
 *                     example: 50.0
 *                   category:
 *                     type: string
 *                     example: "Music"
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["concert", "outdoor"]
 *                   specialDiscounts:
 *                     type: string
 *                     example: "10% off for early bookings"
 *                   created_by:
 *                     type: string
 *                     example: "user123"
 *                   flag:
 *                     type: boolean
 *                     example: false
 *                   isOpen:
 *                     type: boolean
 *                     example: true
 *                   rating:
 *                     type: number
 *                     format: float
 *                     example: 4.5
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                           example: "user456"
 *                         comment:
 *                           type: string
 *                           example: "Great event!"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-15T13:45:00Z"
 *                   description:
 *                     type: string
 *                     example: "An amazing outdoor concert featuring live performances."
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameter"
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

// /filterUpcommingActivites   
/**
 * @swagger
 * /filterUpcomingActivities:
 *   get:
 *     summary: Filter and retrieve upcoming activities
 *     tags: 
 *       - Events
 *     description: Retrieve a list of upcoming activities based on filters such as budget, date, category, and rating.
 *     parameters:
 *       - in: query
 *         name: budget
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum budget for activities (filter by price)
 *         example: 100.00
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter activities that occur on or after this date
 *         example: "2024-10-15"
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by activity category ID
 *         example: "63429f6b5b4a7b009b3e5c5a"
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *         description: Minimum rating to filter activities (1 to 5)
 *         example: 4
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "63429f6b5b4a7b009b3e5c5a"
 *                   name:
 *                     type: string
 *                     example: "Outdoor Concert"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-20"
 *                   time:
 *                     type: string
 *                     example: "18:30"
 *                   location:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         example: 29.9792
 *                       longitude:
 *                         type: number
 *                         example: 31.1342
 *                   budget:
 *                     type: number
 *                     format: float
 *                     example: 50.0
 *                   category:
 *                     type: string
 *                     example: "Music"
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["concert", "outdoor"]
 *                   specialDiscounts:
 *                     type: string
 *                     example: "10% off for early bookings"
 *                   created_by:
 *                     type: string
 *                     example: "user123"
 *                   flag:
 *                     type: boolean
 *                     example: false
 *                   isOpen:
 *                     type: boolean
 *                     example: true
 *                   rating:
 *                     type: number
 *                     format: float
 *                     example: 4.5
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                           example: "user456"
 *                         comment:
 *                           type: string
 *                           example: "Great event!"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-15T13:45:00Z"
 *                   description:
 *                     type: string
 *                     example: "An amazing outdoor concert featuring live performances."
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameter"
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


//filteritineraries
/**
 * @swagger
 * /filteritineraries:
 *   get:
 *     summary: Filter and retrieve itineraries based on budget, date, preferences, and language
 *     tags:
 *       - Itineraries
 *     description: Retrieve a list of itineraries based on filters such as budget, date, preferences (tags), and language.
 *     parameters:
 *       - in: query
 *         name: budget
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum budget for itineraries (filter by price)
 *         example: 200.00
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter itineraries starting from this date onward
 *         example: "2024-10-20"
 *       - in: query
 *         name: preferences
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Preferences for itineraries, filtered by tags
 *         example: ["adventure", "family-friendly"]
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by preferred language of the itinerary
 *         example: "English"
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
 *                   example: 5
 *                 itineraries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "63429f6b5b4a7b009b3e5c5a"
 *                       activities:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Hiking", "City Tour"]
 *                       locations:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["New York", "Grand Canyon"]
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 150.00
 *                       dateTimeAvailable:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-10-22T09:00:00Z"
 *                       language:
 *                         type: string
 *                         example: "English"
 *                       accessibility:
 *                         type: string
 *                         example: "Wheelchair accessible"
 *                       pickupLocation:
 *                         type: string
 *                         example: "Hotel Lobby"
 *                       dropoffLocation:
 *                         type: string
 *                         example: "Airport"
 *                       rating:
 *                         type: number
 *                         format: float
 *                         example: 4.7
 *                       comments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             user:
 *                               type: string
 *                               example: "user123"
 *                             comment:
 *                               type: string
 *                               example: "Great itinerary!"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["adventure", "outdoor"]
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameter"
 *       500:
 *         description: Internal server error
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
 *                   example: "Error message details"
 */


//historicalPlacesByTags
/**
 * @swagger
 * /historicalPlacesByTags:
 *   get:
 *     summary: Retrieve historical places filtered by tags
 *     tags:
 *       - Historical Places
 *     description: Retrieve historical places filtered by specific tags such as type and period.
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Tags to filter historical places by (type and period).
 *         example: ["medieval", "castle"]
 *     responses:
 *       200:
 *         description: Successfully retrieved historical places based on tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the historical place
 *                     example: "63429f6b5b4a7b009b3e5c5a"
 *                   description:
 *                     type: string
 *                     description: Description of the historical place
 *                     example: "A medieval castle built in the 12th century."
 *                   pictures:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *                     description: An array of image URLs of the historical place
 *                     example: ["http://example.com/images/castle.jpg"]
 *                   location:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         format: float
 *                         example: 40.712776
 *                       longitude:
 *                         type: number
 *                         format: float
 *                         example: -74.005974
 *                   openingHours:
 *                     type: string
 *                     description: Opening hours of the historical place
 *                     example: "09:00 AM - 05:00 PM"
 *                   ticketPrice:
 *                     type: number
 *                     format: float
 *                     description: The ticket price for entry
 *                     example: 15.00
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date the historical place record was created
 *                     example: "2024-10-03T12:00:00Z"
 *                   createdBy:
 *                     type: string
 *                     description: User who created the record
 *                     example: "user123"
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Tags associated with the historical place, representing type and period
 *                     example: ["medieval", "castle"]
 *       400:
 *         description: Bad request, invalid query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameter"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while retrieving historical places"
 *                 details:
 *                   type: string
 *                   example: "Error message details"
 */


///upcomingEvents/:username'
/**
 * @swagger
 * /historicalPlacesByTags:
 *   get:
 *     summary: Retrieve historical places filtered by tags
 *     tags:
 *       - Historical Places
 *     description: Retrieve historical places filtered by specific tags such as type and period.
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Tags to filter historical places by (type and period).
 *         example: ["medieval", "castle"]
 *     responses:
 *       200:
 *         description: Successfully retrieved historical places based on tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the historical place
 *                     example: "63429f6b5b4a7b009b3e5c5a"
 *                   description:
 *                     type: string
 *                     description: Description of the historical place
 *                     example: "A medieval castle built in the 12th century."
 *                   pictures:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *                     description: An array of image URLs of the historical place
 *                     example: ["http://example.com/images/castle.jpg"]
 *                   location:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         format: float
 *                         example: 40.712776
 *                       longitude:
 *                         type: number
 *                         format: float
 *                         example: -74.005974
 *                   openingHours:
 *                     type: string
 *                     description: Opening hours of the historical place
 *                     example: "09:00 AM - 05:00 PM"
 *                   ticketPrice:
 *                     type: number
 *                     format: float
 *                     description: The ticket price for entry
 *                     example: 15.00
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date the historical place record was created
 *                     example: "2024-10-03T12:00:00Z"
 *                   createdBy:
 *                     type: string
 *                     description: User who created the record
 *                     example: "user123"
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Tags associated with the historical place, representing type and period
 *                     example: ["medieval", "castle"]
 *       400:
 *         description: Bad request, invalid query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameter"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while retrieving historical places"
 *                 details:
 *                   type: string
 *                   example: "Error message details"
 */

