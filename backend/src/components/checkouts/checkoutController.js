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



// Controller function to handle order creation with wallet or COD payment
const createOrderWalletOrCod = async (req, res) => {
    const { touristId, productsIdsQuantity, price, addressToBeDelivered, paymentType } = req.body;

    if (
        !touristId ||
        !Array.isArray(productsIdsQuantity) ||
        productsIdsQuantity.length === 0 ||
        price === undefined ||
        !paymentType
    ) {
        return res.status(400).json({
            success: false,
            message: 'Tourist ID, products, price, and payment type are required.',
        });
    }

    const validPaymentTypes = ['wallet', 'COD'];
    if (!validPaymentTypes.includes(paymentType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid payment type. Must be "wallet" or "COD".',
        });
    }

    try {
        const order = await checkoutService.createOrderWalletOrCod({
            touristId,
            productsIdsQuantity,
            price,
            addressToBeDelivered,
            paymentType,
        });
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



const createOrderWithCard = async (req, res) => {
    const { touristId, productsIdsQuantity, price, addressToBeDelivered, paymentType, paymentMethodId } = req.body;

    // Validate input
    if (
        !touristId ||
        !Array.isArray(productsIdsQuantity) ||
        productsIdsQuantity.length === 0 ||
        price === undefined ||
        !paymentType ||
        !paymentMethodId
    ) {
        return res.status(400).json({
            success: false,
            message: 'Tourist ID, products, price, payment type, and payment method ID are required.',
        });
    }

    if (paymentType !== 'card') {
        return res.status(400).json({
            success: false,
            message: 'Invalid payment type. Must be "card".',
        });
    }

    try {
        // Call the service layer
        const { order, paymentIntentId } = await checkoutService.createOrderWithCard({
            touristId,
            productsIdsQuantity,
            price,
            addressToBeDelivered,
            paymentType,
            paymentMethodId,
        });

        return res.status(201).json({
            success: true,
            message: 'Payment successful and order created.',
            data: { order, paymentIntentId },
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
            message: 'Order canceled successfully.',
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
    createOrderWalletOrCod,
    createOrderWithCard,
    viewDeliveredOrders,
    viewPendingOrders,
    cancelOrder
};
