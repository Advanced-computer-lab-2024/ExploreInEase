const userService = require('../users/userService');

// Delete user by username
const deleteUserByUsername = async (req, res) => {
    const { username } = req.body;

    // Validation
    if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing username' });
    }

    try {
        // Call the service to delete the user
        const result = await userService.deleteUserByUsername(username);

        if (result) {
            return res.status(200).json({ message: `User ${username} deleted successfully` });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
};

// Add a new tourismGovernor or a new Admin
const addGovernerOrAdmin = async (req, res) => {
    const { username, password, type,email } = req.body;

    // Check if username and password are provided
    if (!username || !password || !type) {
        return res.status(400).json({ message: "Username and password and usertype are required." });
    }


    try {
        // Send data to the service layer to create a new tourismGovernor
        const result = await userService.addGovernerOrAdmin(username, password, type,email);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addProduct = async (req, res) => {
    const { productId, picture, price, description, sellerId, originalQuantity, name } = req.body;

    // Basic validation
    if (!productId || !price || !originalQuantity || !name || !description || !sellerId || !picture) {
        return res.status(400).json({ message: "ProductId, price, picture, original quantity, description, sellerId and name are required." });
    }

    const productData = {
        productId,
        picture,
        price,
        description,
        sellerId,
        originalQuantity,
        takenQuantity: 0, // Initially, no quantity has been taken
        name,
        isActive: true // New products are active by default
    };

    try {
        const newProduct = await userService.addProduct(productData);
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAvailableProducts = async (req, res) => {
    try {
        const products = await userService.getAvailableProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getProductsByPriceRange = async (req, res) => {
    const { minPrice, maxPrice } = req.query;

    
    const min = parseFloat(minPrice) || 0;  // Default to 0 if not provided
    const max = parseFloat(maxPrice) || Infinity;  // Default to Infinity if not provided

    try {
        const products = await userService.getProductsByPriceRange(min, max);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
const   updateProduct = async (req, res) => {
    const { productId } = req.params;
    const updatedProductData = req.body;

    // Basic validation
    if (!productId || !updatedProductData) {
        return res.status(400).json({ message: "Product ID and updated data are required." });
    }

    try {
        const updatedProduct = await userService.updateProduct(productId, updatedProductData);
        
        if (updatedProduct) {
            return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
        } else {
            return res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAvailableProductsSortedByRatings = async (req, res) => {
    try {
        const products = await userService.getAvailableProductsSortedByRatings();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { deleteUserByUsername ,addGovernerOrAdmin , addProduct, getAvailableProducts, getProductsByPriceRange, updateProduct, getAvailableProductsSortedByRatings};
