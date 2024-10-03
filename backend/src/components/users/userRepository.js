const Users = require('../../models/user');
const Product = require('../../models/product'); 

// Delete user from Users table
const deleteUser = async (username) => {
    try {
        const result = await Users.findOneAndDelete({ username });
        return result ? true : false;
    } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        return false;
    }
};

// Delete user from Tourist table
const deleteTourist = async (username) => {
    try {
        const result = await Tourist.findOneAndDelete({ username });
        return result ? true : false;
    } catch (error) {
        console.error(`Error deleting tourist: ${error.message}`);
        return false;
    }
};

// Add a new user wether admin or tourism governer
const addGovernerOrAdmin = async (userData) => {
    try {
        // Check if username already exists
        const existingUser = await Users.findOne({ username: userData.username });
        if (existingUser) {
            throw new Error('Username already exists');
        }
        
        const newUser = new Users(userData);
        return await newUser.save();
    } catch (error) {
        throw new Error(`Error adding user: ${error.message}`);
    }
};


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
        return await Product.find({ isActive: true })
            .select('productId picture price description sellerId ratings reviews originalQuantity takenQuantity name') 
            .populate('sellerId', 'name type'); 
    } catch (error) {
        throw new Error(`Error fetching products: ${error.message}`);
    }
};

const getProductsByPriceRange = async (minPrice, maxPrice) => {
    try{
        const query = {
            isActive: true,
            price:{
                $gte: minPrice || 0,
                $lte: maxPrice || Infinity
            }
        };
        return await Product.find(query)
            .select('productId picture price description sellerId ratings reviews originalQuantity takenQuantity name')
            .populate('sellerId', 'name type');
    } catch (error){
        throw new Error ('Error fetching products by price range: ${error.message}');
    }
}

const updateProduct = async (productId, updatedProductData) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { productId: productId },  // Find the product by productId
            { $set: updatedProductData },  // Set the updated data
            { new: true, runValidators: true }  // Return the updated document
        );
        
        return updatedProduct;
    } catch (error) {
        throw new Error(`Error updating product: ${error.message}`);
    }
};

module.exports = { deleteUser, deleteTourist,addGovernerOrAdmin, addProduct, getAllAvailableProducts, getProductsByPriceRange,updateProduct};
