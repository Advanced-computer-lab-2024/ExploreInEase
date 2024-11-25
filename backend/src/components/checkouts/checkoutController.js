// checkoutController.js
const checkoutService = require('../checkouts/checkoutService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tourist = require('../../models/tourist');

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
    const { 
        touristId, 
        productsIdsQuantity, 
        price, 
        addressToBeDelivered, 
        cardNumber, 
        expMonth, 
        expYear, 
        cvc,
        currency 
    } = req.body;

    if (
        !touristId || 
        !Array.isArray(productsIdsQuantity) || 
        productsIdsQuantity.length === 0 || 
        !price || 
        !cardNumber || 
        !expMonth || 
        !expYear || 
        !cvc    ||
        !addressToBeDelivered ||
        !currency

    ) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields.',
        });
    }
    


    let updatedCurrency;
    switch (currency) {
        case 'euro':
          updatedCurrency = "EUR";
          break;
        case 'dollar':
            updatedCurrency = "USD";
          break;
        case 'EGP':
            updatedCurrency = "EGP";
          break;
        default:
          throw new Error('Invalid currency');
      }



    try {
        // Find tourist information
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            return res.status(404).json({
                success: false,
                message: 'Tourist not found.',
            });
        }

        // Create a Payment Method
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc: cvc,
            },
        });

        // Create a Payment Intent with a custom description
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(price * 100), // Convert dollars to cents
            currency: updatedCurrency,
            payment_method: paymentMethod.id,
            confirm: true, // Automatically confirms the payment
            description: `Payment for order by Tourist with username: ${tourist.username}`, // Custom description
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never', // Disallow redirect-based payment methods
            },
        });

        // Payment successful, create the order
        const order = await checkoutService.createOrderWithCard({
            touristId,
            productsIdsQuantity,
            price,
            addressToBeDelivered,
            paymentType: 'card',
        });

        return res.status(201).json({
            success: true,
            data: order,
            paymentStatus: paymentIntent.status,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Stripe Payment Failed: ${error.message}`,
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
