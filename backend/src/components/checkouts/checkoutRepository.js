const Product = require('../../models/product'); // Assuming you have a Product model

// Repository to search for products by name
exports.searchByName = async (name) => {
    return await Product.find({ name });
};
