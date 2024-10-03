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
        // Fetch products where the taken quantity is less than the original quantity (in stock)
        const availableProducts = await Product.find({
            $expr: { $lt: ["$takenQuantity", "$originalQuantity"] }  // Only include products where takenQuantity < originalQuantity
        })
        .select('picture price description ratings reviews sellerId')  // Select only the required fields
        .populate('sellerId', 'username');  // Populate only the seller's username

        // Transform the result to include seller's username directly
        const transformedProducts = availableProducts.map(product => ({
            picture: product.picture,
            price: product.price,
            description: product.description,
            ratings: product.ratings,
            reviews: product.reviews,
            sellerName: product.sellerId.username  // Get the seller's username directly
        }));

        return transformedProducts;
    } catch (error) {
        throw new Error(`Error retrieving available products: ${error.message}`);
    }
};

// const getMaxProductPrice = async () => {
//     try {
//         // Find the product with the highest price
//         const maxPriceProduct = await Product.findOne({ isActive: true })
//             .sort({ price: -1 })  // Sort by price in descending order
//             .select('price');      // Select only the price field
        
//         return maxPriceProduct ? maxPriceProduct.price : 0;  // Return the price or 0 if no product
//     } catch (error) {
//         throw new Error(`Error fetching max product price: ${error.message}`);
//     }
// };


const getProductsByPriceRange = async (minPrice, maxPrice) => {
    try {
        // Query products within the price range and that are active
        const products = await Product.find({
            isActive: true,  // Assuming products have an isActive field to check availability
            price: {
                $gte: minPrice,  // Greater than or equal to minPrice
                $lte: maxPrice   // Less than or equal to maxPrice
            }
        })
        .select('productId picture price description sellerId ratings reviews originalQuantity takenQuantity name')
        .populate('sellerId', 'name type');  // Populate seller information

        return products;
    } catch (error) {
        throw new Error(`Error querying products by price range: ${error.message}`);
    }
};

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

const getAvailableProductsSortedByRatings = async () => {
    try {
        // Fetch all products and sort by ratings in ascending order (lowest to highest)
        const products = await Product.find({})
            .populate('sellerId')
            .sort({ ratings: 1 });  // Sort by ratings in ascending order

        return products;
    } catch (error) {
        throw new Error(`Error retrieving products: ${error.message}`);
    }
};


module.exports = { deleteUser, deleteTourist,addGovernerOrAdmin, addProduct, getAllAvailableProducts, getProductsByPriceRange,updateProduct, getAvailableProductsSortedByRatings};
