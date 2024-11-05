const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const checkoutController = require('../checkouts/checkoutController');

/**
 * @swagger
 * /addProduct/{userId}:
 *   post:
 *     summary: Add a new product
 *     description: Adds a new product by a user with the specified userId.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user adding the product.
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
 *                 description: Name of the product
 *               picture:
 *                 type: string
 *                 description: The URL of the product picture.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the product.
 *               description:
 *                 type: string
 *                 description: A description of the product.
 *               sellerType:
 *                 type: string
 *                 description: The type of the seller.
 *               originalQuantity:
 *                 type: integer
 *                 description: The original quantity of the product available.
 *               ratings:
 *                 type: number
 *                 description: The initial ratings of the product.
 *               reviews:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of reviews for the product.
 *     responses:
 *       201:
 *         description: Product added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product added successfully"
 *                 product:
 *                   type: object
 *                   description: The created product object.
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the product
 *                     picture:
 *                       type: string
 *                       description: The URL of the product picture.
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: The price of the product.
 *                     description:
 *                       type: string
 *                       description: A description of the product.
 *                     sellerType:
 *                       type: string
 *                       description: The type of the seller.
 *                     originalQuantity:
 *                       type: integer
 *                       description: The original quantity of the product available.
 *                     ratings:
 *                       type: number
 *                       description: The initial ratings of the product.
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of reviews for the product.
 *       400:
 *         description: Missing required fields or invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Price, picture, original quantity, description, sellerType, name, ratings and reviews are required."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error adding product"
 */

/**
 * @swagger
 * /getAvailableProducts/{userId}:
 *   get:
 *     summary: Get available products
 *     description: Retrieves all available products for a user with the specified userId.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user retrieving available products.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of available products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the product
 *                   picture:
 *                     type: string
 *                     description: The URL of the product picture.
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the product.
 *                   description:
 *                     type: string
 *                     description: A description of the product.
 *                   sellerType:
 *                     type: string
 *                     description: The type of the seller.
 *                   ratings:
 *                     type: number
 *                     description: The product's ratings.
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of reviews for the product.
 *       400:
 *         description: Invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid type"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving available products"
 */

/**
 * @swagger
 * /filterProducts/{userId}:
 *   get:
 *     summary: Filter products by price range
 *     description: Retrieves products within a specified price range for a user with the specified userId.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user filtering products.
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         required: false
 *         description: The minimum price of products to retrieve.
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         description: The maximum price of products to retrieve.
 *         schema:
 *           type: number
 *           format: float
 *     responses:
 *       200:
 *         description: List of products filtered by price range.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the product
 *                   picture:
 *                     type: string
 *                     description: The URL of the product picture.
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the product.
 *                   description:
 *                     type: string
 *                     description: A description of the product.
 *                   sellerType:
 *                     type: string
 *                     description: The type of the seller.
 *                   ratings:
 *                     type: number
 *                     description: The product's ratings.
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of reviews for the product.
 *       400:
 *         description: Invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid type"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error querying products by price range"
 */

/**
 * @swagger
 * /editProducts/{userId}/{productId}:
 *   put:
 *     summary: Update a product
 *     description: Updates an existing product for the user with the specified userId.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user updating the product.
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to be updated.
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
 *                 description: Name of the product
 *               picture:
 *                 type: string
 *                 description: The URL of the product picture.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The updated price of the product.
 *               description:
 *                 type: string
 *                 description: The updated description of the product.
 *               originalQuantity:
 *                 type: integer
 *                 description: The updated original quantity of the product.
 *               ratings:
 *                 type: number
 *                 description: The updated ratings of the product.
 *               reviews:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The updated list of reviews for the product.
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 product:
 *                   type: object
 *                   description: The updated product object.
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the product
 *                     picture:
 *                       type: string
 *                       description: The URL of the product picture.
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: The price of the product.
 *                     description:
 *                       type: string
 *                       description: A description of the product.
 *                     originalQuantity:
 *                       type: integer
 *                       description: The original quantity of the product available.
 *                     ratings:
 *                       type: number
 *                       description: The updated ratings of the product.
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Updated list of reviews for the product.
 *       400:
 *         description: Missing required fields or invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Price, picture, original quantity, description, name, ratings and reviews are required."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating product"
 */

/**
 * @swagger
 * /sortProducts/{userId}:
 *   get:
 *     summary: Sort products by price or rating
 *     description: Retrieves products sorted by price or rating for a user with the specified userId.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user sorting products.
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         required: false
 *         description: The criterion to sort by (price or rating).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products sorted by the specified criterion.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the product
 *                   picture:
 *                     type: string
 *                     description: The URL of the product picture.
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the product.
 *                   description:
 *                     type: string
 *                     description: A description of the product.
 *                   sellerType:
 *                     type: string
 *                     description: The type of the seller.
 *                   ratings:
 *                     type: number
 *                     description: The product's ratings.
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of reviews for the product.
 *       400:
 *         description: Invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid type"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error sorting products"
 */

/**
 * @swagger
 * /searchProductByName/{userId}:
 *   get:
 *     summary: Search products by name
 *     description: Retrieves products by name for a user with the specified userId.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user searching for products.
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         required: true
 *         description: The name of the product to search for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the product
 *                   picture:
 *                     type: string
 *                     description: The URL of the product picture.
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the product.
 *                   description:
 *                     type: string
 *                     description: A description of the product.
 *                   sellerType:
 *                     type: string
 *                     description: The type of the seller.
 *                   ratings:
 *                     type: number
 *                     description: The product's ratings.
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of reviews for the product.
 *       400:
 *         description: Invalid user type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid type"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error searching products"
 */

router.post('/addProduct/:userId', checkoutController.addProduct);
router.get('/getAvailableProducts/:userId', checkoutController.getAvailableProducts);
router.get('/filterProducts/:userId', checkoutController.getProductsByPriceRange);
router.put('/editProducts/:userId/:productId', checkoutController.updateProduct);
router.get('/sortProducts/:userId', checkoutController.getAvailableProductsSortedByRatings);
router.get('/searchProductByName/:userId', checkoutController.searchProductByName);

router.post('/product/uploadImage/:productId/:userId', upload.single('image'), checkoutController.uploadImage);



module.exports = router;
