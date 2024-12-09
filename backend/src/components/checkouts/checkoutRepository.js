const Product = require('../../models/product'); 
const Users = require('../../models/user');
const Tourist = require('../../models/tourist');
const Notification = require('../../models/notification');
const PromoCode = require('../../models/promoCode');
const Activity = require('../../models/activity');
const Itinerary = require('../../models/itinerary');
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const path = require('path');
const fs = require('fs');
const HistoricalPlace = require('../../models/historicalPlace');
dotenv = require('dotenv');

const addProduct = async (productData) => {
    try {
        const newProduct = new Product(productData);
        return await newProduct.save(); 
    } catch (error) {
        throw new Error(`Error adding product: ${error.message}`);
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
        console.log("id: ", productId)
        const product = await Product.findOne({ _id: productId })
        return product;
    } catch (error) {
        throw new Error(`Error fetching product by ID: ${error.message}`);
    }
};

const addWishlist = async (touristId, productId) => {
    try {
        const tourist = await Tourist.findOne({ _id: touristId });
        tourist.wishlists.push(productId);
        await tourist.save();
        return tourist;
    } catch (error) {
        throw new Error(`Error adding to wishlist: ${error.message}`);
    }
}

const getWishlist = async (touristId) => {
    try {
        const tourist = await Tourist.findOne({ _id: touristId });
        const wishlistProducts = tourist.wishlists;
        const products = await Product.find({ _id: { $in: wishlistProducts } });
        return products;
    } catch (error) {
        throw new Error(`Error adding to wishlist: ${error.message}`);
    }
}

const removeWishlist = async (touristId, productId) => {
    try {
        const tourist = await Tourist.findOne({ _id: touristId });
        tourist.wishlists.pull(productId);
        await tourist.save();
        return tourist;
    } catch (error) {
        throw new Error(`Error adding to wishlist: ${error.message}`);
    }
}

const addCart = async (touristId, productId, quantity) => {
    try {
        const cartTourists = await Cart.find({ touristId: touristId });
        if(cartTourists.length != 0){
            cartTourists[0].products.push({ productId: productId, quantity: quantity });
            await cartTourists[0].save();
            return cartTourists[0];
        }
        const cartItem = {
            touristId: touristId,
            products: {
                productId:productId,
                quantity:quantity
            }
        };
        const cart = new Cart(cartItem);
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(`Error adding to cart: ${error.message}`);
    }
}

const getCart = async (touristId) => {
    try {
        const cart = await Cart.find({ touristId });

        if (!cart || cart.length === 0) {
            return { products: [] };
        }

        const allProducts = [];

        for (const cartItem of cart) {
            const products = await Promise.all(
                cartItem.products.map(async (product) => {
                    const getProduct = await getProductById2(product.productId);

                    // Flatten product if it contains an indexed key
                    const flattenedProduct = getProduct && getProduct['0'] ? getProduct['0'] : getProduct;

                    if (!flattenedProduct) {
                        return null; // Skip invalid product
                    }

                    return {
                        ...flattenedProduct._doc,
                        quantity: product.quantity,
                    };
                })
            );

            allProducts.push(...products.filter(Boolean)); // Add only valid products
        }

        // Loop through allProducts and remove indexed keys
        const cleanedProducts = allProducts.map((product) => {
            if (product && product['0']) {
                return { ...product['0'], quantity: product.quantity }; // Remove the indexed key
            }
            return product; // Return as-is if no indexed key
        });

        return { products: cleanedProducts };
    } catch (error) {
        console.error(`Error fetching cart: ${error.message}`);
        throw new Error(`Error fetching cart: ${error.message}`);
    }
};


const removeCart = async (touristId, cartItemId) => {
    try {
        const cart = await Cart.findOne({ touristId: touristId });
        cart.products.splice(cartItemId, 1); // Removes the item at the given index
        if(cart.products.length == 0){
            await Cart.deleteOne({ touristId: touristId });
        }
        await cart.save();
        return cart;
    }
    catch (error) {
        throw new Error(`Error removing from cart: ${error.message}`);
    }
}

const editQuantityInCart = async (touristId, cartItemId, quantity) => {
    try {
        const cart = await Cart.findOne({ touristId: touristId });
        cart.products[cartItemId].quantity = quantity;
        await cart.save();
        return cart;
    }
    catch (error) {
        throw new Error(`Error adding to cart: ${error.message}`);
    }
}

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
        return "tourist";
    } else if (product){
        return product.type;
    } else {
        throw new Error('User not found');
    }
};
const findUserById = async (_id) => {
    try {
        const existsUser = await Users.findOne({ _id });
        if (existsUser) return existsUser;

        const existsTourist = await Tourist.findOne({ _id });
        return existsTourist ? {tourist: existsTourist, type: "tourist"} : false;
    } catch (error) {
        console.error(`Error checking if user exists: ${error.message}`);
        return false;
    }
};

const isPurchased = async (TouristId, ProductId) => {
    try {
        const order = await Order.findOne({ 
            touristId: TouristId, 
            productIds: { $in: [ProductId]} // Checks if ProductId exists in the productIds array
        });

        if (!order) {
            throw new Error("No such product exists or the tourist did not order this product");
        }
        else{
            if(order.status == "delivered"){
                return true;
            }
        }

    } catch (error) {
        console.error("Error checking product purchase:", error);
        throw error;
    }
}

const updateProductRating = async (productId, updatedFields) => {
    try {
        // Use Mongoose's `findByIdAndUpdate` to update the tour guide's comments
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updatedFields },
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedProduct) {
            console.log("error in update Rating");
            
            throw new Error("Product not found or could not be updated.");
        }

        return updatedProduct;
    } catch (error) {
        console.error("Error updating product ratings:", error);
        throw error;
    }
}
const createOrder = async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
};
const updateProductReviews = async (productId, updatedFields) => {
    try {
        // Use Mongoose's `findByIdAndUpdate` to update the tour guide's comments
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updatedFields,
            { new: true, runValidators: true } // `new: true` returns the updated document
        );
        
        if (!updatedProduct) {
            throw new Error("Product not found or could not be updated.");
        }

        return updatedProduct;
    } catch (error) {
        console.error("Error updating product comments:", error);
        throw error;
    }
};

const getOrderById = async (orderId) => {
    try {
        // Use Mongoose to find the order by its ID
        const order = await Order.findById(orderId)
            .populate('touristId', 'name email') // Populate touristId with specific fields if needed
            .populate('productIds', 'name price') // Populate productIds with specific fields if needed
            .exec(); // Execute the query

        return order; // Return the found order, or null if not found
    } catch (error) {
        throw new Error(`Error retrieving order: ${error.message}`); // Throw an error if something goes wrong
    }
};


const addOrder = async (orderData) => {
    try {
        const newOrder = new Order(orderData);
        return await newOrder.save();
    } catch (error) {
        throw new Error(`Error adding order: ${error.message}`);
    }
};

const getAllOrders = async () => {
    try {
        // Find all orders and populate `touristId` and `productIds`
        const orders = await Order.find()
            .select('touristId productIds quantities status dateDelivered createdAt') // Select the desired fields
            .populate({
                path: 'touristId',
                select: 'name email', // Adjust to select desired fields from the Tourist model
            })
            .populate({
                path: 'productIds',
                select: 'name price', // Adjust to select desired fields from the Product model
            });

        // Map over the orders to add custom fields if needed
        const ordersWithDetails = orders.map(order => {
            const orderObj = order.toObject(); // Convert the document to a plain object

            return {
                ...orderObj,
                // You can add custom processing here if needed, e.g., removing fields
                touristId: order.touristId,
                productIds: order.productIds,
            };
        });

        return ordersWithDetails;
    } catch (error) {
        throw new Error(`Error retrieving orders: ${error.message}`);
    }
};

const getOrdersByTouristId = async (touristId) => {
    try {
        // Find orders with the matching touristId
        const orders = await Order.find({ touristId })
            .select('productIds quantities status dateDelivered createdAt') // Select specific fields you need
            .populate({
                path: 'productIds',
                select: 'name price description', // Populate fields from Product schema
            });

        // Map through orders if any additional processing is required
        const ordersWithProductDetails = orders.map(order => {
            return order.toObject(); // Convert each order document to a plain object
        });

        return ordersWithProductDetails;
    } catch (error) {
        throw new Error(`Error fetching orders for tourist: ${error.message}`);
    }
};

//Saif, Tasnim

const getProductById2 = async (productId) => {
    try {
        const product = await Product.findById(productId);
        return product;
    } catch (error) {
        throw new Error(`Error fetching product by ID: ${error.message}`);
    }
};

const getAllAvailableProducts = async () => {
    try {
        // Step 1: Find all available products where takenQuantity is less than originalQuantity
        const availableProducts = await Product.find({
            $expr: { $lt: ["$takenQuantity", "$originalQuantity"] }
        })
        .select('picture price description ratings reviews name originalQuantity takenQuantity sellerId isActive')
        .populate({
            path: 'reviews.userId', // Populate userId in each review
            select: 'username mobileNum email nation dob profession', // Specify fields to include from the Tourist model
        })

        // Step 2: Map over the available products and add the sellerType directly
        const productsWithSellerType = availableProducts.map(product => {
            const productObj = product.toObject(); // Convert the product document to a plain object
            const sellerType = product.sellerId?.type || ''; // Retrieve the seller type, fallback to an empty string if not found

            return {
                ...productObj,
            };
        });

        // Return the processed products array with the added sellerType
        return productsWithSellerType;
    } catch (error) {
        throw new Error(`Error retrieving product: ${error.message}`);
    }
};

const updateProductImage = async (productId, fileName) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('product not found');
        }
        product.picture = fileName;
        await product.save();
    } catch (error) {
        throw new Error(`Error updating profile picture: ${error.message}`);
    }
};

const updateEventImage = async (eventId, fileName, type) => {
    try {
        let event;
        if(type == "Activity"){
            event = await Activity.findById(eventId);
        }else if(type == "Itinerary"){
            event = await Itinerary.findById(eventId);
        }else if(type == "HistoricalPlace"){
            event = await HistoricalPlace.findById(eventId);
        }
        else{
            throw new Error('Invalid Type');
        }
        if (!event) {
            throw new Error('eventId not found');
        }
        
        event.picture = fileName;
        await event.save();
    } catch (error) {
        throw new Error(`Error updating profile picture: ${error.message}`);
    }
};



const uploadImage = async (productId, fileName, fileBuffer) => {
    try {
        const imagesDir = path.join(__dirname, '../images');
        
        // Check if the 'images' directory exists, and create it if it doesn't
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        const filePath = path.join(imagesDir, fileName);
        
        // Write the file to the filesystem
        await fs.promises.writeFile(filePath, fileBuffer);

        return { message: 'Image uploaded successfully', fileName: fileName };
    } catch (error) {
        throw new Error(`Error uploading image: ${error.message}`);
    }
};

const archiveProduct = async (product) => {
    if (product.isActive == true) {
        product.isActive = false;
    } else {
        product.isActive = true;
    }
    await product.save();
};

const addNotification = async (notificationData) => {
    const notification = new Notification(notificationData);
    const newNotification = await notification.save();
    return newNotification;
};




const getAllNotifications = async (id, type) => {

    try {
        const allnotifications = await Notification.find();
        console.log(allnotifications);
        const notifications = await Notification.find({ 'user.user_id': id, 'user.user_type': type });
        return notifications;
    } catch (error) {
        throw new Error(`Error retrieving notifications: ${error.message}`);
    }
};

const getPromoCode = async (promoCode) => {
    try {
        const promoCode = await PromoCode.findOne({ promoCodes: promoCode });
        return promoCode.promoCodes;
    } catch (error) {
        throw new Error(`Error retrieving notifications: ${error.message}`);
    }
};












module.exports = {
    editQuantityInCart,
    removeCart,
    getCart,
    addCart,
    removeWishlist,
    getWishlist,
    addWishlist,
    getAllNotifications,
    addNotification,
    getAvailableProductsSortedByRatings,
    addProduct,
    getAllAvailableProducts,
    getProductsByPriceRange,
    getProductById,
    updateProduct,
    searchByName,
    getType,
    findUserById,
    archiveProduct,
    uploadImage,
    updateProductImage,
    getAvailableProductsSortedByRatings,
    addProduct,
    getAllAvailableProducts,
    getProductsByPriceRange,
    getProductById, // Export the new function
    updateProduct,
    getAvailableProductsSortedByRatings,
    searchByName,
    getType,
    findUserById,
    isPurchased,
    updateProductRating,
    updateProductReviews,
    addOrder,
    getAllOrders,
    getOrdersByTouristId,
    getOrderById,
    getProductById2,
    updateEventImage,
    createOrder
};
