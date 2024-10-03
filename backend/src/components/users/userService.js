const userRepository = require('../users/userRepository');

const deleteUserByUsername = async (username) => {
    // Try to delete from both tables (users and tourists)
    const deletedUser = await userRepository.deleteUser(username);
    const deletedTourist = await userRepository.deleteTourist(username);

    // Return true if a user/tourist was deleted from either table
    return deletedUser || deletedTourist;
};


const addGovernerOrAdmin = async (username, password, type,email) => {
    const newUser = {
        username: username,
        password: password,
        type: type, // The type can be 'admin' or 'tourismGovernor'
        email: email
    };

    return await userRepository.addGovernerOrAdmin(newUser);
};

const addProduct = async (productData) => {
    return await userRepository.addProduct(productData);
};

const getAvailableProducts = async () => {
    return await userRepository.getAllAvailableProducts();
}

const getProductsByPriceRange = async (minPrice, maxPrice) => {
    return await userRepository.getProductsByPriceRange(minPrice, maxPrice);
};

const updateProduct = async (productId, updatedProductData) => {
    return await userRepository.updateProduct(productId, updatedProductData);
};

const getAvailableProductsSortedByRatings = async () => {
    return await userRepository.getAvailableProductsSortedByRatings();
};

module.exports = { deleteUserByUsername,addGovernerOrAdmin, addProduct, getAvailableProducts, getProductsByPriceRange, updateProduct, getAvailableProductsSortedByRatings};
