// checkoutService.js
//All New Codeeee
const checkoutRepository = require('../checkouts/checkoutRepository');
const { Tourist } = require('../../models/tourist');

// Function to calculate sales and available quantity based on userType, productId, and currency
const calculateSalesAndAvailability = async (userType, productId, currency) => {

    const product = await checkoutRepository.getProductById(productId);
    

    if (!product) {
        throw new Error('Product not found'); 
    }

    const { price, originalQuantity, takenQuantity } = product;
    const availableQuantity = originalQuantity - takenQuantity; 

    
    let sales = price * takenQuantity;

    switch (currency) {
        case 'euro':
            sales = (sales / 55).toFixed(2); 
            break;
        case 'dollar':
            sales = (sales / 50).toFixed(2); 
            break;
        case 'EGP':
            sales = sales.toFixed(2); 
            break;
        default:
            throw new Error('Invalid currency'); 
    }
    
    
    sales = parseFloat(sales);

    return {
        sales,
        availableQuantity,
    };
};



//New ElNew code 


// Service to create an order
const createOrder = async ({ touristId, productsIdsQuantity, price, addressToBeDelivered }) => {

    // Create the order
    const order = await checkoutRepository.createOrder({
        touristId,
        productIds:productsIdsQuantity.map(product => product.id),
        productsIdsQuantity,
        price,
        addressToBeDelivered,
    });

    return order;
};


// Service for retrieving orders by status and touristId
const getOrdersByStatusAndTouristId = async (status, touristId) => {
    const validStatuses = ['delivered', 'pending'];
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid order status');
    }

    const orders = await checkoutRepository.findOrdersByStatusAndTouristId(status, touristId);
    return orders;
};





// Service to cancel an order
const cancelOrder = async (orderId, touristId) => {
    // Fetch the order details
    const order = await checkoutRepository.getOrderById(orderId);

    if (!order) {
        throw new Error('Order not found');
    }

    if (order.touristId.toString() !== touristId) {
        throw new Error('Order does not belong to the provided tourist.');
    }

    // Fetch the tourist
    const tourist = await checkoutRepository.getTouristById(touristId);

    if (!tourist) {
        throw new Error('Tourist not found');
    }

    // Refund the tourist wallet
    tourist.wallet += order.price;
    await tourist.save();

    // Delete the order
    await checkoutRepository.deleteOrderById(orderId);
};



module.exports = {
    calculateSalesAndAvailability,
    createOrder,
    getOrdersByStatusAndTouristId,
    cancelOrder
};
