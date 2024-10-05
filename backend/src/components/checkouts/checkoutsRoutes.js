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
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /addProduct/{userId}:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product added successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ProductId, price, picture, original quantity, description, sellerId and name are required."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
router.post('/addProduct/:userId', checkoutController.addProduct);

/**
 * @swagger
 * /getAvailableProducts/{userId}:
 *   get:
 *     summary: Get all available products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of available products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   picture:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   ratings:
 *                     type: integer
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                   sellerType:
 *                     type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.get('/getAvailableProducts/:userId', checkoutController.getAvailableProducts);

/**
 * @swagger
 * /filterProducts/{userId}:
 *   get:
 *     summary: Get products by price range
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
router.get('/filterProducts/:userId', checkoutController.getProductsByPriceRange);

/**
 * @swagger
 * /editProducts/{userId}/{productId}:
 *   put:
 *     summary: Update product details
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
router.put('/editProducts/:userId/:productId', checkoutController.updateProduct);


/**
 * @swagger
 * /sortProducts/{userId]}:
 *   get:
 *     summary: Get products sorted by ratings
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Sorted list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
router.get('/sortProducts/:userId', checkoutController.getAvailableProductsSortedByRatings);

/**
 * @swagger
 * /searchProductByName/{userId}:
 *   get:
 *     summary: Search for a product by name
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No products found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
router.get('/searchProductByName/:userId', checkoutController.searchProductByName);

module.exports = router;
