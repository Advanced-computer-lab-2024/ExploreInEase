const checkoutService = require('../checkouts/checkoutService');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const checkoutRepository = require('../checkouts/checkoutRepository');
const userRepository = require('../users/userRepository');
const nodemailer = require("nodemailer");
const Tourist = require('../../models/tourist');
require('dotenv').config();


const addProduct = async (req, res) => {
    const { price, description, originalQuantity, name } = req.body;
    console.log(req.body)
    const {userId} = req.params;

    if (!price || !originalQuantity || !name || !description) {
        return res.status(400).json({ message: "Products price, picture, original quantity, description, sellerId and name are required." });
    }

    const productData = {
        sellerId: userId,
        price,
        description,
        originalQuantity,
        name,
    };

    try {
        const newProduct = await checkoutService.addProduct(productData);
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getProductsByPriceRange = async (req, res) => {
    const {userId} = req.params;
    const type = await checkoutRepository.getType(userId);
    if (type !== 'admin' && type !== 'seller' && type !== 'tourist') 
        {
        return res.status(400).json({ message: 'Invalid type' });
    }
    
    try {
        // Extract minPrice and maxPrice from the query parameters
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

        // Call the service to fetch products within the price range
        const products = await checkoutService.getProductsByPriceRange(minPrice, maxPrice);

        // Send the filtered products as a response
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 
const updateProduct = async (req, res) => {
    const { userId, productId } = req.params; // Extract both parameters
    const updatedProductData = req.body;
    console.log(req.params, req.body);
    // Basic validation
    // if (!productId || !updatedProductData) {
    //     return res.status(400).json({ message: "Product ID and updated data are required." });
    // }

    // Fetch the user's type (admin or seller)
    const type = await checkoutRepository.getType(userId);
    
    // Validate user type
    if (type !== 'admin' && type !== 'seller') {
        return res.status(403).json({ message: 'Invalid user type. Only admins and sellers can update products.' });
    }

    try {
        // Fetch the current product using productId
        const currentProduct = await checkoutService.getProductById(productId);

        if (!currentProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Check if sellerId is being changed
        // if (updatedProductData.sellerId && updatedProductData.sellerId !== currentProduct.sellerId.toString()) {
        //     return res.status(403).json({ message: "You cannot change the sellerId of a product." });
        // }

        // Remove sellerId from the updated data if it exists
        delete updatedProductData.sellerId;

        const updatedProduct = await checkoutService.updateProduct(productId, updatedProductData);
        console.log("hello")
        if (updatedProduct) {
            return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
        } else {
            return res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchProductByName = async (req, res) => {
    const {userId} = req.params;
    const type = await checkoutRepository.getType(userId);
    if (type !== 'admin' && type !== 'seller' && type !== 'tourist') 
        {
        return res.status(400).json({ message: 'Invalid type' });
    }
    
    const { productName } = req.body;

    try {
        const products = await checkoutService.searchProductByName(productName);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rateProduct = async (req, res) => {
    const { touristId } = req.params; // Get the userId from the route
    console.log(touristId);
    
    const { productId, rating } = req.body;

    try {
        const result = await checkoutService.rateProduct(touristId,productId,rating);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        
        return res.status(400).json({ message: error.message });
    }
}

const reviewProduct = async (req, res) => {
    const { touristId } = req.params; // Get the userId from the route
    const { productId, reviewText } = req.body;

    try {
        const result = await checkoutService.reviewProduct(touristId,productId,reviewText);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const addOrder = async (req, res) => {
    const { touristId, productIds, quantities, totalPrice } = req.body;
    console.log("BODY: ",req.body);

    // Ensure all required fields are provided
    if (!touristId || !productIds || !quantities || productIds.length === 0 || quantities.length === 0) {
        console.log("touristId",touristId);
        console.log("productIds",productIds);
        console.log("quantities",quantities);

        
        return res.status(400).json({ message: "touristId, productIds, and quantities are required." });
    }

    // Check if the number of products matches the number of quantities
    if (productIds.length !== quantities.length) {
        return res.status(400).json({ message: "Each product must have a corresponding quantity." });
    }

    // Prepare order data
    const orderData = {
        touristId,
        productIds,
        quantities,
        status: 'delivered', // Default status
        dateDelivered: null // Initially null, can be updated later
    };

    const product = await checkoutRepository.getProductById(productIds[0]);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    console.log("PRODUCT: ",product);
    product.takenQuantity = product.takenQuantity + quantities[0];
    console.log("Quantity: ",product.takenQuantity);
    product.save();

    try {
        // Call the service function to add the order
        const newOrder = await checkoutService.addOrder(orderData);
        const tourist = await userRepository.findTouristById(touristId);
        tourist.wallet = tourist.wallet - totalPrice;
        tourist.save();
        res.status(201).json({ message: "Order added successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    const { userId } = req.params;
    const user = await checkoutRepository.findUserById(userId);

    // Check if the user is authorized to view orders
    if (user.type !== 'admin' && user.type !== 'tourist') {
        return res.status(400).json({ message: 'Invalid type' });
    }

    try {
        let orders;
        if (user.type === 'admin') {
            // Fetch all orders if the user is an admin
            orders = await checkoutService.getAllOrders();
        } else {
            // Fetch orders specific to the tourist
            orders = await checkoutService.getOrdersByTouristId(userId);
        }

        res.status(200).json({ message: "Orders fetched successfully", orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrder = async (req, res) => {
    const { userId } = req.params; // Extract userId from the URL params
    const { orderId, ...updatedOrderData } = req.body; // Extract orderId from the body and the rest as updated data

    // Fetch the user to check their type
    const user = await checkoutRepository.findUserById(userId);

    if (user.type !== 'admin') {
        return res.status(400).json({ message: 'Invalid type' });
    }

    try {
        // Fetch the current order using orderId
        const currentOrder = await checkoutRepository.getOrderById(orderId);

        if (!currentOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Ensure certain fields are not altered, e.g., `touristId` or `productIds`
        delete updatedOrderData.touristId;
        delete updatedOrderData.productIds;

        // If the status is being changed, ensure it's a valid value
        if (updatedOrderData.status && !["delivered", "pending", "canceled"].includes(updatedOrderData.status)) {
            return res.status(400).json({ message: "Invalid order status." });
        }

        // Apply the update to the order
        const updatedOrder = await checkoutService.updateOrder(orderId, updatedOrderData);

        if (updatedOrder) {
            return res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
        } else {
            return res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Saif, Tasim

const uploadImage = async (req, res) => {
    const { productId, userId } = req.params;
    console.log('Controller');
    console.log(req);
    const file = req.file;

    if (!productId) {
        return res.status(400).json({ message: 'Missing productId' });
    }

    const product = await checkoutRepository.getProductById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    try {
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        // Call service to upload image
        const result = await checkoutService.uploadImage(productId, file);
        return res.status(200).send(result);

    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).send({ error: 'Error uploading image.' });
    }
};

const archiveProduct = async (req, res) => {
    const { productId, userId } = req.params;
    const type = await checkoutRepository.getType(userId);
    if (type !== 'admin' && type !== 'seller') {
        return res.status(400).json({ message: 'Invalid user type' });
    }

    try {
        const product = await checkoutService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await checkoutService.archiveProduct(product);
        return res.status(200).json({message: "Product archived/unarchived"});
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const availableQuantityAndSales = async (req, res) => {
    const { userType, productId, currency } = req.params;
    console.log(req.params);

    if (!userType || !["admin", "seller"].includes(userType)) {
        return res.status(400).json({
            success: false,
            message: 'User type must be "admin" or "seller".',
        });
    }

    if (!productId || typeof productId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Product ID is required and must be a valid string.',
        });
    }

    const validCurrencies = ["euro", "dollar", "EGP"];
    if (!currency || !validCurrencies.includes(currency)) {
        return res.status(400).json({
            success: false,
            message: `Currency must be one of the following: ${validCurrencies.join(', ')}.`,
        });
    }

    try {
        const result = await checkoutService.calculateSalesAndAvailability(userType, productId, currency);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAvailableProducts = async (req, res) => {
    const {userId} = req.params;
    console.log(userId);
    const type = await checkoutRepository.getType(userId);
    console.log(type);
    if (type !== 'admin' && type !== 'seller' && type !== 'tourist') 
    {
        return res.status(400).json(type);
    }

    try {
        const products = await checkoutService.getAvailableProducts();
        console.log(products);
        const allActiveProducts = products.filter(product => product.isActive === true);
        let finalProducts = allActiveProducts;
        if(type === 'seller'){
            finalProducts = allActiveProducts.filter(product => product.sellerId.toString() === userId);
            console.log(finalProducts);
        }

        res.status(200).json({message: "Fetched successfully!",Products: finalProducts});
        } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getArchivedProducts = async (req, res) => {
    const {userId} = req.params;
    const type = await checkoutRepository.getType(userId);
    if (type !== 'admin' && type !== 'seller') 
    {
        return res.status(400).json(type);
    }

    try {
        const products = await checkoutService.getAvailableProducts();
        const allArchivedProducts = products.filter(product => product.isActive === false);
        const finalProducts = allArchivedProducts.filter(product => product.sellerId.toString() === userId);

        res.status(200).json({message: "Fetched Archived Products successfully!",Products: finalProducts});
        } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAvailableProductsSortedByRatings = async (req, res) => {
    const {userId} = req.params;
    const type = await checkoutRepository.getType(userId);
    if (type !== 'admin' && type !== 'seller' && type !== 'tourist') 
    {
        return res.status(400).json({ message: 'Invalid type' });
    }
    
    try {
        const products = await checkoutService.getAvailableProductsSortedByRatings();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Controller for viewing delivered orders associated with a tourist
const viewMyOrders = async (req, res) => {
    const { touristId,currency } = req.params;
    console.log(currency);

    if (!touristId) {
        return res.status(400).json({
            success: false,
            message: 'Tourist ID is required.',
        });
    }

    try {
        const orders = await checkoutService.getOrdersByStatusAndTouristId(touristId,currency);
        console.log(orders);
        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};






// Controller to cancel an order
const cancelOrder = async (req, res) => {
    const { orderId, touristId } = req.body;

    if (!orderId || !touristId) {
        return res.status(400).json({
            success: false,
            message: 'Order ID and Tourist ID are required.',
        });
    }

    try {
        await checkoutService.cancelOrder(orderId, touristId);
        return res.status(200).json({
            success: true,
            message: 'Order canceled successfully.',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const createOrderWithCard = async (req, res) => {
    const { 
        touristId, 
        productsIdsQuantity, 
        price, 
        addressToBeDelivered, 
        cardNumber, 
        expMonth, 
        expYear, 
        cvc,
        promoCode,
        currency 
    } = req.body;

    if (
        !touristId || 
        !Array.isArray(productsIdsQuantity) || 
        productsIdsQuantity.length === 0 || 
        !price || 
        !cardNumber || 
        !expMonth || 
        !expYear || 
        !cvc    ||
        !addressToBeDelivered ||
        !currency

    ) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields.',
        });
    }
    


    let updatedCurrency;
    let price2 = price;
    switch (currency) {
        case 'euro':
          updatedCurrency = "EUR";
          price2 = (price * 55).toFixed(2);

          break;
        case 'dollar':
            updatedCurrency = "USD";
            price2 = (price * 50).toFixed(2);
          break;
        case 'EGP':
            updatedCurrency = "EGP";
            price2 = price.toFixed(2);
          break;
        default:
          throw new Error('Invalid currency');
      }



    try {
        // Find tourist information
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            return res.status(404).json({
                success: false,
                message: 'Tourist not found.',
            });
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
            price2 *= 0.7; // Apply 30% discount
        }

        // Create a Payment Method
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc: cvc,
            },
        });

        // Create a Payment Intent with a custom description
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(price2 * 100), // Convert dollars to cents
            currency: updatedCurrency,
            payment_method: paymentMethod.id,
            confirm: true, // Automatically confirms the payment
            description: `Payment for order by Tourist with username: ${tourist.username}`, // Custom description
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never', // Disallow redirect-based payment methods
            },
        });

        // Payment successful, create the order
        const order = await checkoutService.createOrderWithCard({
            touristId,
            productsIdsQuantity,
            price:price2,
            addressToBeDelivered,
            paymentType: 'card',
        });


        for(let i = 0; i < productsIdsQuantity.length; i++){
            const product = await checkoutRepository.getProductById(productsIdsQuantity[i].id);
            console.log("PRODUCT: ",product);           
            if(product.takenQuantity === product.originalQuantity){
                const publisherId = product.sellerId.toString();
                const publisher = await userRepository.findSellerById(publisherId);
                console.log("PUBLISHER: ",publisher);
        
        
                const body = `Product ${product.name} is out of stock`;
                const notificationData = {
                    body,
                    user: {
                        user_id: publisher._id,     // Match the schema key
                        user_type: publisher.type   // Match the schema key
                    }
                };
                const notification = await checkoutRepository.addNotification(notificationData);
                console.log("NOTIFICATION: ",notification);
        
        
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL2_USER,
                        pass: process.env.EMAIL2_PASS
                    }
                });
            
                console.log("Transporter created");
                
                const mailOptions = {
                    from: process.env.EMAIL2_USER,
                    to: publisher.email,
                    subject: 'Product out of stock',
                    text:` Hello ${publisher.username},\n\nYour product ${product.name} is out of stock.\n\nBest regards,\n${process.env.EMAIL2_USER}`
                };
            
                await transporter.sendMail(mailOptions);
        
            }
        }

        return res.status(201).json({
            success: true,
            data: order,
            paymentStatus: paymentIntent.status,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Stripe Payment Failed: ${error.message}`,
        });
    }
};



const createOrderWalletOrCod = async (req, res) => {
    const { touristId, productsIdsQuantity, price, addressToBeDelivered, paymentType,promoCode,currency } = req.body;

    if (
        !touristId ||
        !Array.isArray(productsIdsQuantity) ||
        productsIdsQuantity.length === 0 ||
        price === undefined ||
        !paymentType
    ) {
        return res.status(400).json({
            success: false,
            message: 'Tourist ID, products, price, and payment type are required.',
        });
    }

    const validPaymentTypes = ['wallet', 'cash'];
    if (!validPaymentTypes.includes(paymentType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid payment type. Must be "wallet" or "COD".',
        });
    }

    try {
        const order = await checkoutService.createOrderWalletOrCod({
            touristId,
            productsIdsQuantity,
            price,
            addressToBeDelivered,
            paymentType,
            promoCode,
            currency
        });
        
        for(let i = 0; i < productsIdsQuantity.length; i++){
            const product = await checkoutRepository.getProductById(productsIdsQuantity[i].id);
            console.log("PRODUCT: ",product);           
            if(product.takenQuantity === product.originalQuantity){
                const publisherId = product.sellerId.toString();
                const publisher = await userRepository.findSellerById(publisherId);
                console.log("PUBLISHER: ",publisher);
        
        
                const body = `Product ${product.name} is out of stock`;
                const notificationData = {
                    body,
                    user: {
                        user_id: publisher._id,     // Match the schema key
                        user_type: publisher.type   // Match the schema key
                    }
                };
                const notification = await checkoutRepository.addNotification(notificationData);
                console.log("NOTIFICATION: ",notification);
        
        
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL2_USER,
                        pass: process.env.EMAIL2_PASS
                    }
                });
            
                console.log("Transporter created");
                
                const mailOptions = {
                    from: process.env.EMAIL2_USER,
                    to: publisher.email,
                    subject: 'Product out of stock',
                    text: `Hello ${publisher.username},\n\nYour product ${product.name} is out of stock.\n\nBest regards,\n${process.env.EMAIL2_USER}`
                };
            
                await transporter.sendMail(mailOptions);
        
            }
        }

        return res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const addWishlist = async (req, res) => {
    const {userId} = req.params;
    const { productId } = req.body;

    try {
        const result = await checkoutService.addWishlist(userId, productId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const getWishlist = async (req, res) => {
    const {userId} = req.params;

    try {
        const result = await checkoutService.getWishlist(userId);
        return res.status(200).json({message: "Fetched wishlist successfully!", wishlist: result});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const removeWishlist = async (req, res) => {
    const {userId, productId} = req.params;

    try {
        const result = await checkoutService.removeWishlist(userId, productId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const addCart = async (req, res) => {
    const {userId} = req.params;
    const { productId, quantity } = req.body;

    try {
        const result = await checkoutService.addCart(userId, productId, quantity);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }    
}

const getCart = async (req, res) => {
    const {userId} = req.params;

    try {
        const result = await checkoutService.getCart(userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const removeCart = async (req, res) => {
    const {userId, cartItemId} = req.params;

    try {
        const result = await checkoutService.removeCart(userId, cartItemId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const editQuantityInCart = async (req, res) => {
    const {userId, cartItemId, quantity} = req.params;

    console.log(req.params);
    console.log(quantity);

    try {
        const result = await checkoutService.editQuantityInCart(userId, cartItemId, quantity);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


module.exports = {
    uploadImage,
    availableQuantityAndSales,
    archiveProduct,
    getProductsByPriceRange,
    addProduct,
    getAvailableProducts,
    updateProduct,
    getArchivedProducts,
    getAvailableProductsSortedByRatings,
    searchProductByName,
    rateProduct,
    reviewProduct,
    addOrder,
    getOrders,
    updateOrder,
    viewMyOrders,
    cancelOrder,
    createOrderWithCard,
    createOrderWalletOrCod,
    addWishlist,
    getWishlist,
    removeWishlist,
    addCart,
    getCart,
    removeCart,
    editQuantityInCart
};
