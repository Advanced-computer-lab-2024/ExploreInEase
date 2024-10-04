const checkoutRepository = require('../checkouts/checkoutRepository');

const addProduct = async (productData) => {
    return await checkoutRepository.addProduct(productData);
};

const getAvailableProducts = async () => {
    return await checkoutRepository.getAllAvailableProducts();
}

const getProductsByPriceRange = async (minPrice, maxPrice) => {
    try {
        // Call the repository to fetch products by price range
        return await checkoutRepository.getProductsByPriceRange(minPrice, maxPrice);
    } catch (error) {
        throw new Error(`Error fetching products by price range: ${error.message}`);
    }
};

const updateProduct = async (productId, updatedProductData) => {
    return await checkoutRepository.updateProduct(productId, updatedProductData);
};

const getAvailableProductsSortedByRatings = async () => {
    return await checkoutRepository.getAvailableProductsSortedByRatings();
};

module.exports = {addProduct, getAvailableProducts, getProductsByPriceRange, updateProduct, getAvailableProductsSortedByRatings};
