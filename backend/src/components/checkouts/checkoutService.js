const checkoutRepository = require('./checkoutRepository');

// Service to search for a product by name
exports.searchProductByName = async (name) => {
    return await checkoutRepository.searchByName(name);
};
