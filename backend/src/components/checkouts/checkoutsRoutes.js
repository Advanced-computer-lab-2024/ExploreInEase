const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()


const checkoutController = require('./checkoutController');

// Route to search for products by name

/**
 * @swagger
 * /searchProductByName:
 *   get:
 *     summary: Search for a product by name
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: productName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the product to search for
 *     responses:
 *       200:
 *         description: List of products matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/searchProductByName', checkoutController.searchProductByName);

module.exports = router;
