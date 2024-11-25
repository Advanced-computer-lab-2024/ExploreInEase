// checkoutRepository.js
const Products = require('../../models/product'); // Adjust the path as necessary
const Order = require('../../models/order'); // Adjust the path as necessary
const Tourist = require('../../models/tourist'); // Adjust the path as necessary

const getProductById = async (productId) => {
    
    return await Products.findOne({ _id :productId }).exec();
};



//New ElNew code 

const createOrder = async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
};


const findOrdersByStatusAndTouristId = async (status, touristId) => {
    return await Order.find({ status, touristId }).exec();
};



// Fetch order by ID
const getOrderById = async (orderId) => {
    return await Order.findById(orderId).exec();
};

// Fetch tourist by ID
const getTouristById = async (touristId) => {
    return await Tourist.findById(touristId).exec();
};

// Delete order by ID
const deleteOrderById = async (orderId) => {
    return await Order.findByIdAndDelete(orderId).exec();
};


module.exports = {
    getProductById,
    createOrder,
    findOrdersByStatusAndTouristId,
    getOrderById,
    getTouristById,
    deleteOrderById
};
