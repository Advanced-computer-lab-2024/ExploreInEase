// checkoutController.js
const checkoutService = require('../checkouts/checkoutService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tourist = require('../../models/tourist');
const nodemailer = require('nodemailer');
const userRepository = require('../users/userRepository');
const checkoutRepository = require('./checkoutRepository');
const Notification = require('../../models/notification');
require('dotenv').config();


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



const createOrderWalletOrCod = async (req, res) => {
    const { touristId, productsIdsQuantity, price, addressToBeDelivered, paymentType, promoCode, currency } = req.body;

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
            promoCode,
            currency
        });

        for (const product of productsIdsQuantity) {
            const { id: productId, quantity } = product; // Access productId and quantity directly
            const productDetails = await checkoutRepository.getProductById(productId); // Fetch product details
            
            if (!productDetails) {
                console.warn(`Product with ID ${productId} not found.`);
                continue; 
            }

            if (product.takenQuantity === product.originalQuantity) {
                console.log(product.sellerId);
                const publisherId = productDetails.sellerId.toString();
                const publisher = await userRepository.findSellerById(publisherId);

                console.log("PUBLISHER: ", publisher);

                const body = `Product ${product.name} is out of stock`;
                const notificationData = {
                    body,
                    user: {
                        user_id: publisher._id,
                        user_type: publisher.type
                    }
                };
                const notification = await checkoutRepository.addNotification(notificationData);
                console.log("NOTIFICATION: ", notification);

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL2_USER,
                        pass: process.env.EMAIL2_PASS
                    }
                });

                console.log("Transporter created");

                const mailOptions = {
                    from: process.env.EMAIL2_USER,
                    to: publisher.email,
                    subject: 'Product out of stock',
                    text:` Hello ${publisher.username},\n\nYour product ${product.name} is out of stock.\n\nBest regards,\n${process.env.EMAIL2_USER}`
                };

                await transporter.sendMail(mailOptions);
            }
        }

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
        promoCode,
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
        !cvc ||
        !addressToBeDelivered ||
        !currency
    ) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields.',
        });
    }

    let updatedCurrency;
    let price2 = price;
    switch (currency) {
        case 'euro':
            updatedCurrency = "EUR";
            price2 = (price * 55).toFixed(2);
            break;
        case 'dollar':
            updatedCurrency = "USD";
            price2 = (price * 50).toFixed(2);
            break;
        case 'EGP':
            updatedCurrency = "EGP";
            price2 = price.toFixed(2);
            break;
        default:
            throw new Error('Invalid currency');
    }

    try {
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            return res.status(404).json({
                success: false,
                message: 'Tourist not found.',
            });
        }

        if (promoCode) {
            const validPromo = tourist.promoCodes.includes(promoCode);
            if (validPromo) {
                tourist.promoCodes = tourist.promoCodes.filter((pc) => pc !== promoCode);
                await tourist.save();
            } else {
                throw new Error("Invalid promo code");
            }
        }

        if (promoCode) {
            price2 *= 0.7; // Apply 30% discount
        }

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc: cvc,
            },
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(price2 * 100),
            currency: updatedCurrency,
            payment_method: paymentMethod.id,
            confirm: true,
            description:` Payment for order by Tourist with username: ${tourist.username}`,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        });

        const order = await checkoutService.createOrderWithCard({
            touristId,
            productsIdsQuantity,
            price: price2,
            addressToBeDelivered,
            paymentType: 'card',
        });

        for (const product of productsIdsQuantity) {
            const { id: productId, quantity } = product; // Access productId and quantity directly
            const productDetails = await checkoutRepository.getProductById(productId); // Fetch product details
            
            if (!productDetails) {
                console.warn(`Product with ID ${productId} not found.`);
                continue; 
            }

            if (product.takenQuantity === product.originalQuantity) {
                const publisherId = productDetails.sellerId.toString();
                const publisher = await userRepository.findSellerById(publisherId);

                console.log("PUBLISHER: ", publisher);

                const body = `Product ${product.name} is out of stock`;
                const notificationData = {
                    body,
                    user: {
                        user_id: publisher._id,
                        user_type: publisher.type
                    }
                };
                const notification = await checkoutRepository.addNotification(notificationData);
                console.log("NOTIFICATION: ", notification);

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL2_USER,
                        pass: process.env.EMAIL2_PASS
                    }
                });

                console.log("Transporter created");

                const mailOptions = {
                    from: process.env.EMAIL2_USER,
                    to: publisher.email,
                    subject: 'Product out of stock',
                    text: `Hello ${publisher.username},\n\nYour product ${product.name} is out of stock.\n\nBest regards,\n${process.env.EMAIL2_USER}`
                };

                await transporter.sendMail(mailOptions);
            }
        }

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
const viewMyOrders = async (req, res) => {
    const { touristId,currency } = req.params;

    if (!touristId) {
        return res.status(400).json({
            success: false,
            message: 'Tourist ID is required.',
        });
    }

    try {
        const orders = await checkoutService.getOrdersByStatusAndTouristId(touristId,currency);
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
    viewMyOrders,
    cancelOrder
};
