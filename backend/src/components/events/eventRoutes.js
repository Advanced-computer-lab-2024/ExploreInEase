const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()


const eventController = require('./eventController');

// Routes for creating and getting preference tags

/**
 * @swagger
 * /createHistoricalTag:
 *   post:
 *     summary: Create a new historical tag
 *     tags: [Historical Tag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoricalTag'
 *     responses:
 *       201:
 *         description: Historical tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoricalTag'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post('/createHistoricalTag/:_id', eventController.createHistoricalTag);





module.exports = router;
