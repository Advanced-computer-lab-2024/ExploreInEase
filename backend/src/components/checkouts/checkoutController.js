// checkoutController.js
const checkoutService = require('../checkouts/checkoutService');

// Function to handle the API request
const availableQuantityAndSales = async (req, res) => {
    const { userType, productId, currency } = req.body;

    if (!userType || !["admin", "seller"].includes(userType)) {
        return res.status(400).json({
            success: false,
            message: 'User type must be "admin" or "seller".',
        });
    }

    if (!productId || typeof productId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Product ID is required and must be a valid string.',
        });
    }

    const validCurrencies = ["euro", "dollar", "EGP"];
    if (!currency || !validCurrencies.includes(currency)) {
        return res.status(400).json({
            success: false,
            message: `Currency must be one of the following: ${validCurrencies.join(', ')}.`,
        });
    }

    try {
        const result = await checkoutService.calculateSalesAndAvailability(userType, productId, currency);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


//New ElNew code 


// Controller function to handle order creation
const createOrder = async (req, res) => {
    const { touristId, productsIdsQuantity, price, addressToBeDelivered } = req.body;

    if (!touristId || !Array.isArray(productsIdsQuantity) || productsIdsQuantity.length === 0 || price === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Tourist ID, products, and price are required.',
        });
    }

    try {
        const order = await checkoutService.createOrder({ touristId, productsIdsQuantity, price, addressToBeDelivered });
        return res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// Controller for viewing delivered orders associated with a tourist
const viewDeliveredOrders = async (req, res) => {
    const { touristId } = req.params;

    if (!touristId) {
        return res.status(400).json({
            success: false,
            message: 'Tourist ID is required.',
        });
    }

    try {
        const orders = await checkoutService.getOrdersByStatusAndTouristId('delivered', touristId);
        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Controller for viewing pending orders associated with a tourist
const viewPendingOrders = async (req, res) => {
    const { touristId } = req.params;

    if (!touristId) {
        return res.status(400).json({
            success: false,
            message: 'Tourist ID is required.',
        });
    }

    try {
        const orders = await checkoutService.getOrdersByStatusAndTouristId('pending', touristId);
        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};





// Controller to cancel an order
const cancelOrder = async (req, res) => {
    const { orderId, touristId } = req.body;

    if (!orderId || !touristId) {
        return res.status(400).json({
            success: false,
            message: 'Order ID and Tourist ID are required.',
        });
    }

    try {
        await checkoutService.cancelOrder(orderId, touristId);
        return res.status(200).json({
            success: true,
            message: 'Order canceled successfully, and wallet refunded.',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




module.exports = {
    availableQuantityAndSales,
    createOrder,
    viewDeliveredOrders,
    viewPendingOrders,
    cancelOrder
};
