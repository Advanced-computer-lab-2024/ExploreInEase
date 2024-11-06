const checkoutRepository = require('../checkouts/checkoutRepository');
const Product = require('../../models/product'); 
const path = require('path');


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

const getProductById = async (productId) => {
    try {
        // Call the repository to fetch a product by its ID
        return await checkoutRepository.getProductById(productId);
    } catch (error) {
        throw new Error(`Error fetching product by ID: ${error.message}`);
    }
};

const updateProduct = async (productId, updatedProductData) => {
    try {
        console.log(updatedProductData);
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId },  // Keep this to search by productId
            { $set: updatedProductData },
            { new: true, runValidators: true }
        );
        return updatedProduct;
    } catch (error) {
        throw new Error(`Error updating product: ${error.message}`);
    }
};


const getAvailableProductsSortedByRatings = async () => {
    return await checkoutRepository.getAvailableProductsSortedByRatings();
};

const searchProductByName = async (name) => {
    return await checkoutRepository.searchByName(name);
};

const uploadImage = async (productId, file) => {
    console.log('Service');
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        throw new Error('Only image files are allowed (jpg, jpeg, png).');
    }

    const fileName = `${productId}-${Date.now()}${fileExtension}`;
    const fileBuffer = file.buffer;

    await checkoutRepository.uploadImage(productId, fileName, fileBuffer); 
    const imageUrl = `http://localhost:3030/images/${fileName}`; // Adjust to match how you access images

    await checkoutRepository.updateProductImage(productId, fileName);

    return { message: 'Image uploaded successfully', imageUrl: imageUrl };
};

const archiveProduct = async (product) => {
     await checkoutRepository.archiveProduct(product);
};

const calculateSalesAndAvailability = async (userType, productId, currency) => {

    const product = await checkoutRepository.getProductById2(productId);
    

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

module.exports = {
    calculateSalesAndAvailability,
    archiveProduct,
    uploadImage,
    addProduct,
    getAvailableProducts,
    getProductsByPriceRange,
    getProductById, // Export the new function
    updateProduct,
    getAvailableProductsSortedByRatings,
    searchProductByName
};
