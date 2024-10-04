const checkoutService = require('./checkoutService');

// Search for a product by name
exports.searchProductByName = async (req, res) => {
    const { productName } = req.body;

    try {
        const products = await checkoutService.searchProductByName(productName);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
