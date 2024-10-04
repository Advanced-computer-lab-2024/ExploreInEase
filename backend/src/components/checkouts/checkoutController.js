const checkoutService = require('../checkouts/checkoutService');

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
        const newProduct = await checkoutService.addProduct(productData);
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAvailableProducts = async (req, res) => {
    try {
        const products = await checkoutService.getAvailableProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getProductsByPriceRange = async (req, res) => {
    try {
        // Extract minPrice and maxPrice from the query parameters
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

        // Call the service to fetch products within the price range
        const products = await checkoutService.getProductsByPriceRange(minPrice, maxPrice);

        // Send the filtered products as a response
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        const updatedProduct = await checkoutService.updateProduct(productId, updatedProductData);
        
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
        const products = await checkoutService.getAvailableProductsSortedByRatings();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchProductByName = async (req, res) => {
    const { productName } = req.body;

    try {
        const products = await checkoutService.searchProductByName(productName);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    addProduct,
    getAvailableProducts,
    getProductsByPriceRange,
    updateProduct,
    getAvailableProductsSortedByRatings,
    searchProductByName
};
