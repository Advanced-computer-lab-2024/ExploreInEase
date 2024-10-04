const express = require('express');
const router = express.Router();
const checkoutController = require('../checkouts/checkoutController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         picture:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         sellerId:
 *           type: string
 *         originalQuantity:
 *           type: number
 *         takenQuantity:
 *           type: number
 *           default: 0
 *         name:
 *           type: string
 *         isActive:
 *           type: boolean
 *           default: true
 */

/**
 * @swagger
 * /addProduct:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/addProduct', checkoutController.addProduct);

/**
 * @swagger
 * /getAvailableProducts:
 *   get:
 *     summary: Get all available products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of available products
 *       500:
 *         description: Internal server error
 */
router.get('/getAvailableProducts', checkoutController.getAvailableProducts);

/**
 * @swagger
 * /filterProducts:
 *   get:
 *     summary: Get products by price range
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price of the products
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price of the products
 *     responses:
 *       200:
 *         description: Products within the price range
 *       500:
 *         description: Internal server error
 */
router.get('/filterProducts', checkoutController.getProductsByPriceRange);

/**
 * @swagger
 * /editProducts/{productId}:
 *   put:
 *     summary: Update product details
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put('/editProducts/:productId', checkoutController.updateProduct);

/**
 * @swagger
 * /sortProducts:
 *   get:
 *     summary: Get products sorted by ratings
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Sorted list of products
 *       500:
 *         description: Internal server error
 */
router.get('/sortProducts', checkoutController.getAvailableProductsSortedByRatings);

module.exports = router;
