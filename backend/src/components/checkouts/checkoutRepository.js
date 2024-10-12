// checkoutRepository.js
const Products = require('../../models/product'); // Adjust the path as necessary

const getProductById = async (productId) => {
    
    return await Products.findOne({ _id :productId }).exec();
};

module.exports = {
    getProductById,
};
