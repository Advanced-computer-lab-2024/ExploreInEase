const checkoutRepository = require('../checkouts/checkoutRepository');
const Product = require('../../models/product'); 
const Order = require('../../models/order');
const path = require('path');
const Tourist = require('../../models/tourist');

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

const rateProduct = async (touristId, productId, rating) => {
    try {
        // Check if the tourist has completed the itinerary with the specified tour guide
        const purchased = await checkoutRepository.isPurchased(touristId, productId);

        if (!purchased) {
            console.log("error in purchase");
            
            throw new Error("You cannot rate this product because you didnt purchase it yet.");
        }

        const product = await Product.findOne({ _id: productId });
        if (!product) {
            console.log("error in product found");

            throw new Error("activity not found.");
        }

        // Validate the rating value to ensure it's between 1 and 5 inclusive
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5 inclusive.");
        }

        // Update the rating sum and count
        product.ratingSum += rating; // Add the new rating to the sum
        product.ratingCount += 1;     // Increment the count of ratings
        
        // Calculate the new average rating
        product.ratings = product.ratingSum / product.ratingCount; // Update the average rating

        // Update the activity with the new rating values
        await checkoutRepository.updateProductRating(productId, {
            ratings: product.ratings,
            ratingSum: product.ratingSum,
            ratingCount: product.ratingCount
        });

        return { message: "Rating added successfully", updatedProduct: product };
    } catch (error) {
        console.error("Error adding rating to product:", error);
        throw error;
    }
};


//Saif, Tasnim

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

const uploadEventImage = async (eventId, file, type) => {
    console.log('Service');
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        throw new Error('Only image files are allowed (jpg, jpeg, png).');
    }

    const fileName = `${eventId}-${Date.now()}${fileExtension}`;
    const fileBuffer = file.buffer;

    await checkoutRepository.uploadImage(eventId, fileName, fileBuffer); 
    const imageUrl = `http://localhost:3030/images/${fileName}`; // Adjust to match how you access images

    await checkoutRepository.updateEventImage(eventId, fileName, type);

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

const reviewProduct = async (touristId, productId, reviewText) => {
    try {
        // Check if the tourist has completed the itinerary with the specified tour guide
        const purchased = await checkoutRepository.isPurchased(touristId, productId);
        
        if (!purchased) {
            throw new Error("You cannot review this product because you didnt purchase it yet.");
        }

        // Retrieve the tour guide directly by querying the user repository
        const product = await Product.findOne({ _id: productId});
        if (!product) {
            throw new Error("product not found.");
        }
        console.log("ReviewText",reviewText);
           
        // Create the new comment
        const newReview = {
            userId: touristId,
            comment: reviewText,
            createdAt: new Date(),
        };

        // Use the repository method to push the new comment to the comments array
        const updatedProduct = await checkoutRepository.updateProductReviews(productId, { $push: { reviews: newReview } });


        return { message: "Comment added successfully", updatedProduct };
    } catch (error) {
        console.error("Error adding review to product:", error);
        throw error;
    }
};

const addOrder = async (orderData) => {
    return await checkoutRepository.addOrder(orderData);
};

const getAllOrders = async () => {
    return await checkoutRepository.getAllOrders();
}

const getOrdersByTouristId = async (touristId) => {
    return await checkoutRepository.getOrdersByTouristId(touristId);
}

const updateOrder = async (orderId, updatedOrderData) => {
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId }, // Find by orderId
            { $set: updatedOrderData }, // Apply the updates
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        return updatedOrder;
    } catch (error) {
        throw new Error(`Error updating order: ${error.message}`);
    }
};



// Service for retrieving orders by status and touristId
const getOrdersByStatusAndTouristId = async (touristId,currency) => {
    const orders = await checkoutRepository.findOrdersByStatusAndTouristId(touristId,currency);
    console.log(orders);
    return orders;
};





// Service to cancel an order
const cancelOrder = async (orderId, touristId) => {
    // Fetch the order details
    const order = await checkoutRepository.getOrderById(orderId);

    if (!order) {
        throw new Error('Order not found');
    }

    if (order.touristId.toString() !== touristId) {
        throw new Error('Order does not belong to the provided tourist.');
    }

    // Fetch the tourist
    const tourist = await checkoutRepository.getTouristById(touristId);

    if (!tourist) {
        throw new Error('Tourist not found');
    }
    if (order.paymentType === 'wallet' || order.paymentType === 'card') {
        // Refund the tourist wallet
        tourist.wallet += order.price;
        await tourist.save();
    }
    

    // Delete the order
    await checkoutRepository.deleteOrderById(orderId);
};



//Buildo+saif apis


// Service to create an order with wallet or COD payment
const createOrderWalletOrCod = async ({ touristId, productsIdsQuantity, price, addressToBeDelivered, paymentType,promoCode,currency }) => {
    if (paymentType === 'wallet') {
        const tourist = await Tourist.findById(touristId);

        if (!tourist) {
            throw new Error('Tourist not found.');
        }
        switch (currency) {
            case 'euro':
                price = (price * 55).toFixed(2); 
                break;
            case 'dollar':
                price = (price * 50).toFixed(2); 
                break;
            case 'EGP':
                price = price.toFixed(2); 
                break;
            default:
                throw new Error('Invalid currency'); 
        }
        
        if (promoCode) {
            const validPromo = tourist.promoCodes.includes(promoCode); // Correct validation
            if (validPromo) {
              // Remove the promo code from the array
              tourist.promoCodes = tourist.promoCodes.filter((pc) => pc !== promoCode);
              await tourist.save(); // Save the updated promo codes
            } else {
              throw new Error("Invalid promo code");
            }
        }
        // Apply discount if promo code was valid
        if (promoCode) {
            price *= 0.7; // Apply 30% discount
        } 
        
        if (tourist.wallet < price) {
            throw new Error('Insufficient wallet balance.');
        }



        // Deduct the amount from the tourist's wallet
        tourist.wallet -= price;
        await tourist.save();
    }

    // Create the order
    const order = await checkoutRepository.createOrder({
        touristId,
        productIds: productsIdsQuantity.map(product => product.id),
        productsIdsQuantity,
        price,
        addressToBeDelivered,
        paymentType,
    });

    return order;
};







// Service to create an order with card payment
const createOrderWithCard = async ({ touristId, productsIdsQuantity, price, addressToBeDelivered, paymentType }) => {
    // Create the order
    const order = await checkoutRepository.createOrder({
        touristId,
        productIds: productsIdsQuantity.map(product => product.id),
        productsIdsQuantity,
        price,
        addressToBeDelivered,
        paymentType,
    });

    return order;
};



module.exports = {
    uploadImage,
    archiveProduct,
    calculateSalesAndAvailability,
    addProduct,
    getAvailableProducts,
    getProductsByPriceRange,
    getProductById, // Export the new function
    updateProduct,
    getAvailableProductsSortedByRatings,
    searchProductByName,
    rateProduct,
    reviewProduct,
    addOrder,
    getAllOrders,
    getOrdersByTouristId,
    updateOrder,
    getOrdersByStatusAndTouristId,
    cancelOrder,
    createOrderWalletOrCod,
    createOrderWithCard,
    uploadEventImage

};
