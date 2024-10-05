const Product = require('../../models/product'); 
const Users = require('../../models/user');
const Tourist = require('../../models/tourist');

const addProduct = async (productData) => {
    try {
        const newProduct = new Product(productData);
        return await newProduct.save(); 
    } catch (error) {
        throw new Error(`Error adding product: ${error.message}`);
    }
};

const getAllAvailableProducts = async () => {
    try {
        const availableProducts = await Product.find({
            $expr: { $lt: ["$takenQuantity", "$originalQuantity"] }
        })
        .select('picture price description ratings reviews sellerId')
        .populate('sellerId', 'username sellerType');

        const transformedProducts = availableProducts.map(product => ({
            picture: product.picture,
            price: product.price,
            description: product.description,
            sellerType: product.sellerId.sellerType,
            ratings: product.ratings,
            reviews: product.reviews,
        }));

        return transformedProducts;
    } catch (error) {
        throw new Error(`Error retrieving available products: ${error.message}`);
    }
};

const getProductsByPriceRange = async (minPrice, maxPrice) => {
    try {
        const products = await Product.find({
            isActive: true,
            price: {
                $gte: minPrice,
                $lte: maxPrice
            }
        })
        .select('productId picture price description sellerId ratings reviews originalQuantity name')
        .populate('sellerId', 'name type');

        return products;
    } catch (error) {
        throw new Error(`Error querying products by price range: ${error.message}`);
    }
};

const getProductById = async (productId) => {
    try {
        const product = await Product.findOne({ productId }).populate('sellerId', 'username sellerType');
        return product;
    } catch (error) {
        throw new Error(`Error fetching product by ID: ${error.message}`);
    }
};



const updateProduct = async (productId, updatedProductData) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { productId: productId },
            { $set: updatedProductData },
            { new: true, runValidators: true }
        );
        
        return updatedProduct;
    } catch (error) {
        throw new Error(`Error updating product: ${error.message}`);
    }
};

const getAvailableProductsSortedByRatings = async () => {
    try {
        const products = await Product.find({})
            .populate('sellerId')
            .sort({ ratings: 1 });

        return products;
    } catch (error) {
        throw new Error(`Error retrieving products: ${error.message}`);
    }
};

const searchByName = async (name) => {
    return await Product.find({ name });
};

const getType = async (id) => {
    const user = await Users.findOne({ _id: id });
    const tourist = await Tourist.findOne({ _id: id });
    const product = await Product.findOne({ _id: id});
    if (user) {
        return user.type;
    } else if (tourist) {
        return tourist.type;
    } else if (product){
        return product.type;
    } else {
        throw new Error('User not found');
    }
};

module.exports = {
    addProduct,
    getAllAvailableProducts,
    getProductsByPriceRange,
    getProductById, // Export the new function
    updateProduct,
    getAvailableProductsSortedByRatings,
    searchByName,
    getType
};
