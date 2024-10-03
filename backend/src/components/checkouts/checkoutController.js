const checkoutService = require('./checkoutService');

// Search for a product by name
exports.searchProductByName = async (req, res) => {
    const { name } = req.params;

    try {
        const products = await checkoutService.searchProductByName(name);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
