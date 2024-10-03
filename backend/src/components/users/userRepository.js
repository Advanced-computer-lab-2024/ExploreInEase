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


// Fetch all available products with details
const getAllAvailableProducts = async () => {
    try {
        return await Product.find({ isActive: true })
            .select('productId picture price description sellerId ratings reviews originalQuantity takenQuantity name') // Only fetch necessary fields
            .populate('sellerId', 'name type'); // Assuming 'sellerId' is a reference to a User or Seller collection
    } catch (error) {
        throw new Error(`Error fetching products: ${error.message}`);
    }
};

const getProductByPriceRange = async (minPrice, maxPrice) => {
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

module.exports = { deleteUser, deleteTourist,addGovernerOrAdmin, getAllAvailableProducts, getProductByPriceRange};
