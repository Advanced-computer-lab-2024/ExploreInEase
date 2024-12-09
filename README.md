# Project Title

ExploreInEase

## Motivation

Traveling is an enriching experience, but planning a trip can often feel overwhelming. The inspiration behind ExploreInEase was to simplify and enhance the travel experience for tourists and other stakeholders in the travel industry. Our goal was to create a platform that not only allows tourists to book hotels, flights, transportation, and activities with ease but also provides a comprehensive solution for tour guides, advertisers, sellers, and tourism governors to manage their services effectively.

By offering a user-friendly interface, robust features, and seamless payment options, we aim to bridge the gap between tourists and service providers. Whether you're a tourist looking for the perfect vacation itinerary, a tour guide managing your offerings, or an advertiser showcasing local activities, ExploreInEase is designed to cater to your needs and make every journey a memorable one.

## Build Status

(On going Project)
major problems :

1. Products deletion doesn't get deleted from a cart that it was put into earlier
2. Book flights and hotels by amadues apis is slow as the amadues servers is slow a lot of times.
3. The tourist is not able to view his transporatation tickets and it's a feature to be added
4. There is no mail verification, that when sending an email to the tourist if the mail doesn't exist it doesnt give the user an error

## Code Style

This project uses 2-space indentation for all JavaScript and JSON files. Formatting is enforced with Prettier to maintain consistency and uses the routes-controller-service-repository architecture to ensure separation of concerns

## Screenshots

## Tech/Framework Used

1. Frontend: React.js
2. Backend: Node.js, Express.js
3. Database: MongoDB
4. Other Tools: Postman

## Features

This is where you write what all extra features have been done in your project. Basically, this is where you try to make your project stand out from the rest.

### Tourist

1. Book Hotel
2. Book Flight
3. Book an Event (Activity/Itinerary/Historical Place)
4. Book Transportation
5. Purchase a Product
6. Pay through wallet/visa/cod
7. Submit Complaints
8. View Order History

### Tour Guide

1. Create/Read/Update/Delete an Itinerary
2. View Sales Report
3. View Number of Tourists Report

### Advertiser

1. Create/Read/Update/Delete an Activity
2. Create/Read/Update/Delete a Transportation
3. View Sales Report
4. View Number of Tourists Report

### Seller

1. Create/Read/Update/Delete a Product
2. Archive/Unarchive a Product
3. View Sales Report

### Tourism Governor

1. Create/Read/Update/Delete a Historical Place
2. Create/Read/Update/Delete a Historical Location Tag

### Admin

1. Create/Read/Update/Delete an Activity Category
2. Create/Read/Update/Delete a Preference Tag
3. Create/Read/Update/Delete a Product
4. Add User
5. Delete an Account

### Code Examples

#### Uploading Image for Products

**checkoutRoutes:**

```javascript
router.post('/product/uploadImage/:productId/:userId', upload.single('image'), checkoutController.uploadImage);
```

**checkoutController:**

```javascript
const uploadImage = async (req, res) => {
    const { productId, userId } = req.params;
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

        const result = await checkoutService.uploadImage(productId, file);
        return res.status(200).send(result);

    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).send({ error: 'Error uploading image.' });
    }
};
```

**checkoutService:**

```javascript
const uploadImage = async (productId, file) => {
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        throw new Error('Only image files are allowed (jpg, jpeg, png).');
    }

    const fileName = `${productId}-${Date.now()}${fileExtension}`;
    const fileBuffer = file.buffer;

    await checkoutRepository.uploadImage(productId, fileName, fileBuffer); 
    const imageUrl = `http://localhost:3030/images/${fileName}`;

    await checkoutRepository.updateProductImage(productId, fileName);

    return { message: 'Image uploaded successfully', imageUrl: imageUrl };
};
```

**checkoutRepository:**

```javascript
const getProductById = async (productId) => {
    try {
        const product = await Product.findOne({ _id: productId });
        return product;
    } catch (error) {
        throw new Error(`Error fetching product by ID: ${error.message}`);
    }
};

const uploadImage = async (productId, fileName, fileBuffer) => {
    try {
        const imagesDir = path.join(__dirname, '../images');
        
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        const filePath = path.join(imagesDir, fileName);
        await fs.promises.writeFile(filePath, fileBuffer);

        return { message: 'Image uploaded successfully', fileName: fileName };
    } catch (error) {
        throw new Error(`Error uploading image: ${error.message}`);
    }
};

const updateProductImage = async (productId, fileName) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        product.picture = fileName;
        await product.save();
    } catch (error) {
        throw new Error(`Error updating profile picture: ${error.message}`);
    }
};
```

#### Create Order by Card

**checkoutRoutes:**

```javascript
router.post('/createOrderCard', checkoutController.createOrderWithCard);
```

**checkoutController:**

```javascript
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

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
        !cvc ||
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
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            return res.status(404).json({
                success: false,
                message: 'Tourist not found.',
            });
        }
        if (promoCode) {
            const validPromo = tourist.promoCodes.includes(promoCode);
            if (validPromo) {
                tourist.promoCodes = tourist.promoCodes.filter((pc) => pc !== promoCode);
                await tourist.save();
            } else {
                throw new Error("Invalid promo code");
            }
        }
        if (promoCode) {
            price2 *= 0.7;
        }

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc: cvc,
            },
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(price2 * 100),
            currency: updatedCurrency,
            payment_method: paymentMethod.id,
            confirm: true,
            description: `Payment for order by Tourist with username: ${tourist.username}`,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        });

        const order = await checkoutService.createOrderWithCard({
            touristId,
            productsIdsQuantity,
            price: price2,
            addressToBeDelivered,
            paymentType: 'card',
        });

        for (let i = 0; i < productsIdsQuantity.length; i++) {
            const product = await checkoutRepository.getProductById(productsIdsQuantity[i].id);
            if (product.takenQuantity === product.originalQuantity) {
                const publisherId = product.sellerId.toString();
                const publisher = await userRepository.findSellerById(publisherId);

                const body = `Product ${product.name} is out of stock`;
                const notificationData = {
                    body,
                    user: {
                        user_id: publisher._id,
                        user_type: publisher.type
                    }
                };
                const notification = await checkoutRepository.addNotification(notificationData);

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL2_USER,
                        pass: process.env.EMAIL2_PASS
                    }
                });

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
            paymentStatus: paymentIntent.status,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Stripe Payment Failed: ${error.message}`,
        });
    }
};
```

**checkoutService:**

```javascript
const createOrderWithCard = async ({ touristId, productsIdsQuantity, price, addressToBeDelivered, paymentType }) => {
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
```

**checkoutRepository:**

```javascript
const createOrder = async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
};

const addNotification = async (notificationData) => {
    const notification = new Notification(notificationData);
    const newNotification = await notification.save();
    return newNotification;
};
```

**userRepository:**

```javascript
const findSellerById = async (id) => {
    try {
        const seller = await Users.findById({ _id: id });
        return seller;
    } catch (error) {
        console.error('Error fetching seller by ID:', error);
        throw error;
    }
};
```

#### Create Order by Wallet or COD

**checkoutRoutes:**

```javascript
router.post('/createOrderWalletOrCod', checkoutController.createOrderWalletOrCod);
```

**checkoutController:**

```javascript
const createOrderWalletOrCod = async (req, res) => {
    const { touristId, productsIdsQuantity, price, addressToBeDelivered, paymentType, promoCode, currency } = req.body;

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

    const validPaymentTypes = ['wallet', 'COD'];
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

        for (let i = 0; i < productsIdsQuantity.length; i++) {
            const product = await checkoutRepository.getProductById(productsIdsQuantity[i].id);
            if (product.takenQuantity === product.originalQuantity) {
                const publisherId = product.sellerId.toString();
                const publisher = await userRepository.findSellerById(publisherId);

                const body = `Product ${product.name} is out of stock`;
                const notificationData = {
                    body,
                    user: {
                        user_id: publisher._id,
                        user_type: publisher.type
                    }
                };
                const notification = await checkoutRepository.addNotification(notificationData);

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL2_USER,
                        pass: process.env.EMAIL2_PASS
                    }
                });

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
```

**checkoutService:**

```javascript
const createOrderWalletOrCod = async ({ touristId, productsIdsQuantity, price, addressToBeDelivered, paymentType, promoCode, currency }) => {
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
            const validPromo = tourist.promoCodes.includes(promoCode);
            if (validPromo) {
                tourist.promoCodes = tourist.promoCodes.filter((pc) => pc !== promoCode);
                await tourist.save();
            } else {
                throw new Error("Invalid promo code");
            }
        }
        if (promoCode) {
            price *= 0.7;
        }

        if (tourist.wallet < price) {
            throw new Error('Insufficient wallet balance.');
        }

        tourist.wallet -= price;
        await tourist.save();
    }

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
```

#### Getting Tourists Orders

**checkoutRoutes:**

```javascript
router.get('/myOrders/:touristId/:currency', checkoutController.viewMyOrders);
```

**checkoutController:**

```javascript
const viewMyOrders = async (req, res) => {
    const { touristId, currency } = req.params;

    if (!touristId) {
        return res.status(400).json({
            success: false,
            message: 'Tourist ID is required.',
        });
    }

    try {
        const orders = await checkoutService.getOrdersByStatusAndTouristId(touristId, currency);
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
```

**checkoutService:**

```javascript
const getOrdersByStatusAndTouristId = async (touristId, currency) => {
    const orders = await checkoutRepository.findOrdersByStatusAndTouristId(touristId, currency);
    return orders;
};
```

**checkoutRepository:**

```javascript
const findOrdersByStatusAndTouristId = async (touristId, currency) => {
    const orders = await Order.find({ touristId }).exec();
    const tourist = await Tourist.findById(touristId).exec();
    if (!tourist) {
        throw new Error("Tourist not found");
    }
    const customerName = tourist.username;

    const productIds = [
        ...new Set(
            orders.flatMap(order => order.productsIdsQuantity.map(product => product.id))
        )
    ];
    const products = await Product.find({ _id: { $in: productIds } }).exec();
    const productMap = Object.fromEntries(
        products.map(product => [product._id.toString(), product.name])
    );

    const convertedOrders = orders.map((order, index) => {
        let convertedPrice = order.price;
        switch (currency) {
            case "euro":
                convertedPrice = parseFloat((order.price / 55).toFixed(2));
                break;
            case "dollar":
                convertedPrice = parseFloat((order.price / 50).toFixed(2));
                break;
            case "EGP":
                break;
            default:
                throw new Error("Invalid currency specified");
        }

        return {
            id: index + 1,
            OrderId: order._id,
            orderDate: new Date(order.createdAt).toISOString().split("T")[0],
            status: order.status,
            products: order.productsIdsQuantity.map((product, idx) => ({
                id: idx + 1,
                name: productMap[product.id] || "Unknown Product",
                quantity: product.quantity,
                price: convertedPrice,
            })),
            customerName,
            shippingAddress: `${order.addressToBeDelivered.street}, ${order.addressToBeDelivered.city}, ${order.addressToBeDelivered.country}`,
            paymentType: order.paymentType,
        };
    });

    return convertedOrders;
};
```

#### Rating Products

**checkoutRoutes:**

```javascript
router.post('/rateProduct/:touristId', checkoutController.rateProduct);
```

**checkoutController:**

```javascript
const rateProduct = async (req, res) => {
    const { touristId } = req.params;
    const { productId, rating } = req.body;

    try {
        const result = await checkoutService.rateProduct(touristId, productId, rating);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
```

**checkoutService:**

```javascript
const rateProduct = async (touristId, productId, rating) => {
    try {
        const purchased = await checkoutRepository.isPurchased(touristId, productId);

        if (!purchased) {
            throw new Error("You cannot rate this product because you didn't purchase it yet.");
        }

        const product = await Product.findOne({ _id: productId });
        if (!product) {
            throw new Error("Product not found.");
        }

        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5 inclusive.");
        }

        product.ratingSum += rating;
        product.ratingCount += 1;
        product.ratings = product.ratingSum / product.ratingCount;

        await checkoutRepository.updateProductRating(productId, {
            ratings: product.ratings,
            ratingSum: product.ratingSum,
            ratingCount: product.ratingCount
        });

        return { message: "Rating added successfully", updatedProduct: product };
    } catch (error) {
        throw error;
    }
};
```

**checkoutRepository:**

```javascript
const updateProductRating = async (productId, updatedFields) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updatedFields },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            throw new Error("Product not found or could not be updated.");
        }

        return updatedProduct;
    } catch (error) {
        throw error;
    }
};
```

#### Reviewing Products

**checkoutRoutes:**

```javascript
router.post('/reviewProduct/:touristId', checkoutController.reviewProduct);
```

**checkoutController:**

```javascript
const reviewProduct = async (req, res) => {
    const { touristId } = req.params;
    const { productId, reviewText } = req.body;

    try {
        const result = await checkoutService.reviewProduct(touristId, productId, reviewText);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
```

**checkoutService:**

```javascript
const reviewProduct = async (touristId, productId, reviewText) => {
    try {
        const purchased = await checkoutRepository.isPurchased(touristId, productId);

        if (!purchased) {
            throw new Error("You cannot review this product because you didn't purchase it yet.");
        }

        const product = await Product.findOne({ _id: productId });
        if (!product) {
            throw new Error("Product not found.");
        }

        const newReview = {
            userId: touristId,
            comment: reviewText,
            createdAt: new Date(),
        };

        const updatedProduct = await checkoutRepository.updateProductReviews(productId, { $push: { reviews: newReview } });

        return { message: "Review added successfully", updatedProduct };
    } catch (error) {
        throw error;
    }
};
```

**checkoutRepository:**

```javascript
const updateProductReviews = async (productId, updatedFields) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updatedFields,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            throw new Error("Product not found or could not be updated.");
        }

        return updatedProduct;
    } catch (error) {
        throw error;
    }
};
```

#### Book Event By Card and Sending Confirmation by Mail and Notification on the System

**eventRoutes:**

```javascript
router.put('/bookEvent', eventController.bookEventWithCard);
```

**eventController:**

```javascript
const bookEventWithCard = async (req, res) => {
    const {
        userType,
        touristId,
        eventType,
        eventID,
        ticketType,
        currency,
        activityPrice,
        cardNumber,
        expMonth,
        expYear,
        cvc,
        promoCode
    } = req.body;

    try {
        if (userType !== "tourist") {
            throw new Error("User type must be tourist");
        }
        if (!touristId || !userType || !eventType || !eventID || !cardNumber || !expMonth || !expYear || !cvc) {
            return res.status(400).json({
                success: false,
                message: "All attributes are required in the request body",
            });
        }

        const result = await eventService.addEventToTouristWithCard(
            userType, touristId, eventType, eventID, ticketType, currency, activityPrice, cardNumber, expMonth, expYear, cvc, promoCode
        );

        const allTourists = await eventRepository.findTourists();

        allTourists.forEach(async tourist => {
            const isInterested = Array.isArray(tourist.interestedIn) &&
                tourist.interestedIn.some(interested =>
                    interested.id.toString() === eventID &&
                    interested.type === eventType
                );

            if (isInterested) {
                const event = await eventRepository.findEventById(eventID, eventType);
                const eventName = event.name;
                if (event && !event.isBooked) {
                    const body = `${eventType} with Name ${eventName} started its first booking`;
                    const notificationData = {
                        body,
                        user: {
                            user_id: tourist._id,
                            user_type: "tourist"
                        }
                    };
                    await checkoutRepository.addNotification(notificationData);

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL2_USER,
                            pass: process.env.EMAIL2_PASS
                        }
                    });

                    const mailOptions = {
                        from: process.env.EMAIL2_USER,
                        to: tourist.email,
                        subject: 'Event Booking',
                        text: `${eventType} with Name ${eventName} started its first booking.\n\nBest regards,\n${process.env.EMAIL2_USER}`
                    };

                    await transporter.sendMail(mailOptions);
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: "Event booked successfully, Payment successful and Email sent",
            data: result.tourist,
            paymentStatus: result.paymentStatus,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
```

**eventService:**

```javascript
const addEventToTouristWithCard = async (userType, touristId, eventType, eventID, ticketType, currency, activityPrice, cardNumber, expMonth, expYear, cvc, promoCode) => {
    return await eventRepository.bookEventWithCard(touristId, eventType, eventID, ticketType, currency, activityPrice, cardNumber, expMonth, expYear, cvc, promoCode);
};
```

**eventRepository:**

```javascript
const bookEventWithCard = async (touristId, eventType, eventID, ticketType, currency, activityPrice, cardNumber, expMonth, expYear, cvc, promoCode) => {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
        throw new Error("Tourist not found");
    }

    let eventPrice = 0;
    let eventName = "";

    if (promoCode) {
        const validPromo = tourist.promoCodes.includes(promoCode);
        if (validPromo) {
            tourist.promoCodes = tourist.promoCodes.filter((pc) => pc !== promoCode);
            await tourist.save();
        } else {
            throw new Error("Invalid promo code");
        }
    }

    switch (eventType) {
        case "itinerary":
            const itinerary = await Itinerary.findById(eventID);
            if (!itinerary) {
                throw new Error("Itinerary not found");
            }
            if (tourist.itineraryId.some((event) => event.id.toString() === eventID)) {
                throw new Error("This itinerary has already been booked.");
            }
            eventPrice = itinerary.price;
            eventName = itinerary.name;

            if (promoCode) {
                eventPrice *= 0.7;
            }
            break;

        case "activity":
            if (tourist.activityId.some((event) => event.id.toString() === eventID)) {
                throw new Error("This activity has already been booked.");
            }
            const activity = await Activity.findById(eventID);
            if (!activity) {
                throw new Error("Activity not found");
            }
            eventName = activity.name;

            switch (currency) {
                case "euro":
                    eventPrice = (activityPrice * 55).toFixed(2);
                    break;
                case "dollar":
                    eventPrice = (activityPrice * 50).toFixed(2);
                    break;
                case "EGP":
                    eventPrice = (activityPrice * 1).toFixed(2);
                    break;
                default:
                    throw new Error("Invalid currency");
            }

            if (promoCode) {
                eventPrice *= 0.7;
            }
            break;

        case "historicalPlace":
            const historicalPlace = await HistoricalPlace.findById(eventID);
            if (!historicalPlace) {
                throw new Error("Historical place not found");
            }
            if (tourist.historicalplaceId.some((event) => event.id.toString() === eventID)) {
                throw new Error("This historical place has already been booked.");
            }
            eventPrice = ticketType === "student" ? historicalPlace.ticketPrice.student : ticketType === "native" ? historicalPlace.ticketPrice.native : historicalPlace.ticketPrice.foreign;
            eventName = historicalPlace.name;

            if (promoCode) {
                eventPrice *= 0.7;
            }
            break;

        default:
            throw new Error("Invalid event type");
    }

    try {
        const paymentMethod = await stripe.paymentMethods.create({
            type: "card",
            card: {
                number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc: cvc,
            },
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(eventPrice * 100),
            currency: "EGP",
            payment_method: paymentMethod.id,
            confirm: true,
            description: `Payment for order by Tourist with username: ${tourist.username}`,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
        });

        const eventData = { id: eventID, pricePaid: eventPrice };
        switch (eventType) {
            case "itinerary":
                tourist.itineraryId.push(eventData);
                break;
            case "activity":
                tourist.activityId.push(eventData);
                break;
            case "historicalPlace":
                tourist.historicalplaceId.push(eventData);
                break;
        }

        await tourist.save();

        const lastFourDigits = paymentMethod.card.last4;
        await sendPaymentReceiptEmail(tourist.email, tourist.username, eventName, eventPrice, lastFourDigits);

        return {
            success: true,
            tourist,
            paymentStatus: paymentIntent.status,
        };
    } catch (error) {
        throw new Error(`Stripe Payment Failed: ${error.message}`);
    }
};

const sendPaymentReceiptEmail = async (touristEmail, username, eventName, pricePaid, lastFourDigits) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL2_USER,
            pass: process.env.EMAIL2_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL2_USER,
        to: touristEmail,
        subject: "Payment Receipt for Your Booking",
        text: `Hello ${username},\n\nThank you for your booking!\n\nEvent Name: ${eventName}\nAmount Paid: ${pricePaid} EGP\nPayment Method: Card ending in ****${lastFourDigits}\n\nWe hope you enjoy your event!\n\nBest regards,\nThe ExploreInEase Team`,
    };

    await transporter.sendMail(mailOptions);
};
```

**checkoutRepository:**

```javascript
const addNotification = async (notificationData) => {
    const notification = new Notification(notificationData);
    const newNotification = await notification.save();
    return newNotification;
};
```

#### Book Event By Wallet and Sending Confirmation by Mail and Notification on the System

**eventRoutes:**

```javascript
router.post('/bookEventWithCard', eventController.bookEventWithCard);
```

**eventController:**

```javascript
const bookEvent = async (req, res) => {
    const { userType, touristId, eventType, eventID, ticketType, currency, activityPrice, promoCode } = req.body;
    try {
        if (userType !== 'tourist') {
            throw new Error('User type must be tourist');
        }
        if (!touristId || !userType || !eventType || !eventID) {
            return res.status(400).json({ error: "All attributes are required in the request body" });
        }

        const updatedTourist = await eventService.addEventToTourist(userType, touristId, eventType, eventID, ticketType, currency, activityPrice, promoCode);

        const allTourists = await eventRepository.findTourists();
        
        allTourists.forEach(async tourist => {
            const isInterested = tourist.interestedIn.some(interested => 
                    interested.id.toString() === eventID && 
                    interested.type === eventType
            );
        
            if (isInterested) {
                    const event = await eventRepository.findEventById(eventID, eventType);
                    const eventName = event.name;
                    if (event && !event.isBooked) {
                            const body = `${eventType} with Name ${eventName} started its first booking`;
                            const notificationData = {
                                    body,
                                    user: {
                                            user_id: tourist._id,
                                            user_type: "tourist"
                                    }
                            };
                            await checkoutRepository.addNotification(notificationData);
                            
                            const transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                            user: process.env.EMAIL2_USER,
                                            pass: process.env.EMAIL2_PASS
                                    }
                            });
                            
                            const mailOptions = {
                                    from: process.env.EMAIL2_USER,
                                    to: tourist.email,
                                    subject: 'Event Booking',
                                    text: `${eventType} with Name ${eventName} started its first booking.\n\nBest regards,\n${process.env.EMAIL2_USER}`
                            };
                            
                            await transporter.sendMail(mailOptions); 
                    }
            }
        });
        
        return res.status(200).json({
            success: true,
            message: 'Event booked successfully',
            data: updatedTourist,
        });
    } catch (error) {
        if (error.message.includes('already been booked')) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
```

**eventService:**

```javascript
const addEventToTouristWithCard = async (userType, touristId, eventType, eventId, ticketType, currency, activityPrice, cardNumber, expMonth, expYear, cvc, promoCode) => {
    return await eventRepository.bookEventWithCard(
        touristId,
        eventType,
        eventId,
        ticketType,
        currency,
        activityPrice,
        cardNumber,
        expMonth,
        expYear,
        cvc, promoCode
    );
};
```

**checkoutRepository:**

```javascript
const addNotification = async (notificationData) => {
        const notification = new Notification(notificationData);
        const newNotification = await notification.save();
        return newNotification;
};
```

**eventRepository:**

```javascript
const bookEvent = async (
    touristId,
    eventType,
    eventId,
    ticketType,
    currency,
    activityPrice,
    promoCode
) => {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
        throw new Error("Tourist not found");
    }

    let eventPrice = 0;
    let eventName = ""; // Add this for email purposes

    if (promoCode) {
        const validPromo = tourist.promoCodes.includes(promoCode);
        if (validPromo) {
            tourist.promoCodes = tourist.promoCodes.filter((pc) => pc !== promoCode);
            await tourist.save();
        } else {
            throw new Error("Invalid promo code");
        }
    }

    switch (eventType) {
        case "itinerary":
            const itinerary = await Itinerary.findById(eventId);
            if (!itinerary) {
                throw new Error("Itinerary not found");
            }
            if (
                tourist.itineraryId.some((event) => event.id.toString() === eventId)
            ) {
                throw new Error("This itinerary has already been booked.");
            }
            eventPrice = itinerary.price;
            eventName = itinerary.name; // For email

            if (promoCode) {
                eventPrice *= 0.7; // Apply 30% discount
            }
            break;

        case "activity":
            if (tourist.activityId.some((event) => event.id.toString() === eventId)) {
                throw new Error("This activity has already been booked.");
            }
            const activity = await Activity.findById(eventId);
            if (!activity) {
                throw new Error("Activity not found");
            }
            eventName = activity.name; // For email

            switch (currency) {
                case "euro":
                    eventPrice = (activityPrice * 55).toFixed(2);
                    break;
                case "dollar":
                    eventPrice = (activityPrice * 50).toFixed(2);
                    break;
                case "EGP":
                    eventPrice = (activityPrice * 1).toFixed(2);
                    break;
                default:
                    throw new Error("Invalid currency");
            }

            if (promoCode) {
                eventPrice *= 0.7; // Apply 30% discount
            }
            break;

        case "historicalPlace":
            const historicalPlace = await HistoricalPlace.findById(eventId);
            if (!historicalPlace) {
                throw new Error("Historical place not found");
            }
            if (
                tourist.historicalplaceId.some(
                    (event) => event.id.toString() === eventId
                )
            ) {
                throw new Error("This historical place has already been booked.");
            }
            eventPrice =
                ticketType === "student"
                    ? historicalPlace.ticketPrice.student
                    : ticketType === "native"
                    ? historicalPlace.ticketPrice.native
                    : historicalPlace.ticketPrice.foreign;
            eventName = historicalPlace.name; // For email

            if (promoCode) {
                eventPrice *= 0.7; // Apply 30% discount
            }
            break;

        default:
            throw new Error("Invalid event type");
    }

    if (tourist.wallet < eventPrice) {
        throw new Error("Insufficient funds to book this event");
    }

    tourist.wallet -= eventPrice;

    const eventData = { id: eventId, pricePaid: eventPrice };
    switch (eventType) {
        case "itinerary":
            tourist.itineraryId.push(eventData);
            break;
        case "activity":
            tourist.activityId.push(eventData);
            break;
        case "historicalPlace":
            tourist.historicalplaceId.push(eventData);
            break;
    }

    await tourist.save();

    // Send a booking confirmation email
    await sendBookingConfirmationEmail(
        tourist.email,
        tourist.username,
        eventName,
        eventPrice
    );

    return tourist;
};

const sendBookingConfirmationEmail = async (
    touristEmail,
    username,
    eventName,
    pricePaid
) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "aclproject7@gmail.com",
            pass: "qodo imkr adxs jred", // Store securely in environment variables
        },
    });

    const mailOptions = {
        from: "aclproject7@gmail.com",
        to: touristEmail,
        subject: "Booking Confirmation for Your Event",
        text: `Hello ${username},\n\nThank you for your booking!\n\nEvent Name: ${eventName}\nAmount Paid by wallet: ${pricePaid} EGP\n\nWe hope you enjoy your event!\n\nBest regards,\nThe ExploreInEase Team`,
    };

    await transporter.sendMail(mailOptions);
};
```

#### Changing the User's Password

**userRoutes:**

```javascript
router.put('/changePassword/:userId', userController.changePassword);
```

**userController:**

```javascript
const changePassword = async (req, res) => {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!userId) {
                return res.status(400).json({ message: "Missing userId" });
        }
        if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: "Missing Input" });
        }

        try {
                const result = await userService.changePassword(userId, oldPassword, newPassword);
                res.status(result.status).json(result.response);
        } catch (error) {
                res.status(500).json({ message: error.message });
        }
};
```

**userService:**

```javascript
const changePassword = async (userId, oldPassword, newPassword) => {
        const user = await userRepository.findUserById(userId);
        const tourist = await userRepository.findTouristById(userId);

        if (user) {
                if(user.password !== oldPassword) {
                        return { status: 400, response: { message: "Incorrect password" } };
                }
                const newUser = await userRepository.updateUserPassword(user, newPassword);
                return { status: 200, response: { message: "Password updated successfully", user: newUser } };
        } else if (tourist) {
                if(tourist.password !== oldPassword) {
                        return { status: 400, response: { message: "Incorrect password" } };
                }
                const newUser = await userRepository.updateUserPassword(tourist, newPassword);
                return { status: 200, response: { message: "Password updated successfully", user: tourist } };
        } else {
                return { status: 400, response: { message: "User not found" } };
        }
};
```

**userRepository:**

```javascript
const updateUserPassword = async (user, password) => {
        try {
                user.password = password;
                const updatedUser = await user.save();
                return updatedUser;
        } catch (error) {
                throw new Error(`Error updating user password: ${error.message}`);
        }
};
```

#### Users Registering

**userRoutes:**

```javascript
router.post('/register/:type', userController.registerUser);
```

**userController:**

```javascript
const registerUser = async (req, res) => {
    const { type } = req.params;
    const { email, username, password, mobileNum, nation, dob, profession, currency } = req.body;
    if (!type) {
        return res.status(400).json({ message: "User type is required" });
    }
    if (!checkUsername(username)) {
        return res.status(400).json({ message: "Username can only contain letters and numbers" });
    }

    const usernameExists = await userRepository.checkUserExists(username);
    if (usernameExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    if (type == 'tourist') {
        if (!email || !username || !password || !mobileNum || !nation || !dob || !profession || !currency) {
            return res.status(400).json({ message: "Missing Input" });
        }
        try {
            const result = await userService.registerTourist(email, username, password, mobileNum, nation, dob, profession, currency);
            res.status(result.status).json(result.response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        if (type == 'tourGuide' || type == 'advertiser' || type == 'seller') {
            if (!email || !username || !password || !currency) {
                return res.status(400).json({ message: "Missing Input" });
            }
            try {
                const result = await userService.registerUser(type, email, username, password, currency);
                res.status(result.status).json(result.response);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        } else {
            res.status(400).json({ message: "Invalid usertype" });
        }
    }
};
```

**userService:**

```javascript
const registerTourist = async (email, username, password, mobileNum, nation, dob, profession, currency) => {
    const touristExists = await userRepository.checkTouristExists(username);
    if (touristExists) {
        return { status: 409, response: { message: "Tourist already exists" } };
    }

    const newTourist = {
        email: email,
        username: username,
        password: password,
        mobileNum: mobileNum,
        nation: nation,
        dob: dob,
        profession: profession,
        wallet: 1000000,
        currency
    };
    const tourist = await userRepository.saveTourist(newTourist);
    return { status: tourist.status, response: { message: "Tourist registered successfully", tourist: tourist.tourist, type: 'tourist' } };
};

const registerUser = async (type, email, username, password, currency) => {
    try {
        const existingUser = await userRepository.findUserByUsername(username);
        if (existingUser) {
            return { status: 400, response: { message: "User already exists" } };
        }

        const userData = {
            email,
            username,
            password: password,
            type,
            docStatus: 'pending',
            currency
        };

        const savedUser = await userRepository.saveUser(userData);
        return { status: 200, response: { message: "User registered successfully", User: savedUser } };
    } catch (error) {
        return { status: 500, response: { message: error.message } };
    }
};
```

**userRepository:**

```javascript
const checkUserExists = async (username) => {
    try {
        const existsUser = await Users.findOne({ username });
        const existsTourist = await Tourist.findOne({ username });
        if (existsUser || existsTourist) {
            return true;
        }
    } catch (error) {
        console.error(`Error checking if user exists: ${error.message}`);
        return false;
    }
};

const saveUser = async (userData) => {
    const newUser = new Users(userData);
    const savedUser = await newUser.save();
    return savedUser;
};

const saveTourist = async (tourist) => {
    try {
        const newTourist = new Tourist(tourist);
        const savedTourist = await newTourist.save();
        return { status: 201, tourist: savedTourist };
    } catch (error) {
        throw new Error(`Error saving tourist: ${error.message}`);
    }
};
```

#### Adding Delivery Addresses for Tourist

**userRoutes:**

```javascript
router.post('/addAddresses/:userId/:address', userController.addAddresses);
```

**userController:**

```javascript
const addAddresses = async (req, res) => {
    const { userId, address } = req.params;

    if (!userId || !address) {
        return res.status(400).json({ message: "Missing parameters" });
    }
    try {
        const result = await userService.addAddresses(userId, address);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
```

**userService:**

```javascript
const addAddresses = async (userId, address) => {
    const user = await userRepository.findTouristById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const updatedUser = await userRepository.addAddresses(user, address);
    return updatedUser;
};
```

**userRepository:**

```javascript
const addAddresses = async (user, address) => {
    try {
        user.addresses.push(address);
        const updatedUser = await user.save();
        return updatedUser;
    } catch (error) {
        throw new Error(`Error adding address: ${error.message}`);
    }
};
```

#### Getting Delivery Addresses of Tourist

**userRoutes:**

```javascript
router.get('/getAddresses/:userId', userController.getAddresses);
```

**userController:**

```javascript
const getAddresses = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "Missing parameters" });
    }
    try {
        const result = await userService.getAddresses(userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
```

**userService:**

```javascript
const getAddresses = async (userId) => {
    const user = await userRepository.findTouristById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const addresses = await userRepository.getAddresses(user);
    return addresses;
};
```

**userRepository:**

```javascript
const getAddresses = async (user) => {
    try {
        return user.addresses;
    } catch (error) {
        throw new Error(`Error fetching user addresses: ${error.message}`);
    }
};
```

#### Admin Viewing Complaints

**complaintRoutes:**

```javascript
router.get("/ViewComplaints", complaintController.AdminViewComplain);
```

**complaintController:**

```javascript
const AdminViewComplain = async (req, res) => {
    try {
        const { adminId } = req.query;
        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "Admin id needed",
            });
        }

        const complaints = await complaintService.ViewComplain(adminId);

        if (complaints.length === 0) {
            return res.status(404).json({ message: "No complaints found." });
        }
        return res.status(201).json({
            success: true,
            total: complaints.length,
            complaints,
        });
    } catch (error) {
        console.error(`Controller Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the complaint.",
            details: error.message,
        });
    }
};
```

**complaintService:**

```javascript
const ViewComplain = async (adminId) => {
    const admin = await User.findById(adminId);
    if (!admin || admin.type !== "admin") {
        throw new Error("Access denied. Admins only.");
    }

    try {
        const complaints = await complaintRepository.getAllComplaints();

        return complaints.map((complaint) => ({
            _id: complaint._id,
            title: complaint.title,
            touristId: complaint.touristId ? complaint.touristId._id : null,
            touristName: complaint.touristId ? complaint.touristId.username : "Unknown",
            touristEmail: complaint.touristId ? complaint.touristId.email : "Unknown",
            problem: complaint.problem,
            dateOfComplaint: complaint.dateOfComplaint,
            status: complaint.status,
            reply: complaint.reply,
        }));
    } catch (error) {
        console.error("Error in ViewComplain:", error);
        throw new Error("Failed to retrieve complaints.");
    }
};
```

**complaintRepository:**

```javascript
const getAllComplaints = async () => {
    try {
        const complaints = await Complaint.find()
            .populate("touristId", "username email")
            .sort({ dateOfComplaint: -1 });

        return complaints;
    } catch (error) {
        console.error("Error fetching complaints:", error);
        throw new Error("Could not retrieve complaints");
    }
};
```

#### Tourist Viewing His Complaints

**complaintRoutes:**

```javascript
router.get("/myComplaints/:touristId", complaintController.getMyComplaints);
```

**complaintController:**

```javascript
const getMyComplaints = async (req, res) => {
    try {
        const { touristId } = req.params;
        if (!touristId) {
            return res.status(400).json({
                success: false,
                message: "tourist Id and problem description is required.",
            });
        }

        const complaints = await complaintService.getTouristComplaints(touristId);

        if (complaints.length === 0) {
            return res.status(200).json({
                success: true,
                data: complaints.length,
            });
        }

        res.status(200).json({
            success: true,
            data: complaints,
        });
    } catch (error) {
        console.error(`Controller Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the complaints.",
            details: error.message,
        });
    }
};
```

**complaintService:**

```javascript
const getTouristComplaints = async (touristId) => {
    const touristExists = await Tourist.findById(touristId);
    if (!touristExists) {
        throw new Error("Invalid Tourist Id: No such tourist found.");
    }
    const complaints = await complaintRepository.findComplaintsByTourist(touristId);
    if (!complaints) {
        return [];
    }
    return complaints.map((complaint) => ({
        _id: complaint._id,
        title: complaint.title,
        problem: complaint.problem,
        dateOfComplaint: complaint.dateOfComplaint,
        status: complaint.status,
        reply: complaint.reply,
    }));
};
```

**complaintRepository:**

```javascript
const findComplaintsByTourist = async (touristId) => {
    const complaints = await Complaint.find({ touristId }).populate(
        "touristId",
        "username email"
    );
    return complaints;
};
```

#### Deleting Complaints by Admin

**complaintRoutes:**

```javascript
router.delete("/deleteAllComplaints", complaintController.deleteAllComplaints);
```

**complaintController:**

```javascript
const deleteAllComplaints = async (req, res) => {
    try {
        const { adminId } = req.query;
        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "Admin ID is required",
            });
        }

        const result = await complaintService.deleteAllComplaints(adminId);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        console.error(`Controller Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting complaints.",
            details: error.message,
        });
    }
};
```

**complaintService:**

```javascript
const deleteAllComplaints = async (adminId) => {
    const admin = await User.findById(adminId);
    if (!admin || admin.type !== "admin") {
        throw new Error("Access denied. Admins only.");
    }

    await complaintRepository.deleteAllComplaints();
    return { message: "All complaints have been deleted." };
};
```

**complaintRepository:**

```javascript
const deleteAllComplaints = async () => {
    try {
        await Complaint.deleteMany();
    } catch (error) {
        console.error("Repository Error deleting complaints:", error);
        throw new Error("Could not delete complaints");
    }
};
```

## Installation

This is the installation guidelines in order to be able to run the project normally.

### Prerequisites

Node.js (v16 or later recommended)
MongoDB (Installed locally or use a MongoDB cloud service like MongoDB Atlas)
npm (comes with Node.js)

### Backend Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Advanced-computer-lab-2024/ExploreInEase.git
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    npm install stripe
    npm install nodemailer
    npm install amadues
    npm install jsonwebtoken
    ```

3. Start the backend server:

    ```bash
    node main.js
    ```

### Frontend Installation

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    cd exploreinease
    ```

2. Install dependencies:

    ```bash
    npm install
    npm install recharts
    ```

3. Start the frontend server:

    ```bash
    npm run start
    ```

### .env Configuration

1. Create a `.env` file in the root directory of backend and frontend .
2. Add the necessary environment variables. For example:

    ```plaintext
    # Backend .env

    MONGO_URI =mongodb+srv://Mahmoudd2:2292003-Ma@acl.neyvc.mongodb.net/?retryWrites=true&w=majority&appName=ACL
    PORT=3030

    EMAIL_USER=aclproject7@gmail.com
    EMAIL_PASS=Buildo12
    RAPIDAPI_KEY=6710fd7b1ac0ed805eec0fce


    AMADEUS_CLIENT_ID= 0ZNDWQAtjqdGQcAMpVIl4zMR9IJwYgbR
    AMADEUS_CLIENT_SECRET= 986AX1xyZejDvN51

    AMADEUS_CLIENT_ID2= SmzXGDuf2RMIZDLllUYQZ29a0SWGsQvF
    AMADEUS_CLIENT_SECRET2= oM96OTLUtHWjKzpQ


    AMADEUS_CLIENT_ID3 = yzOW0nOROG5brSafY83NWEXUiudjmLdo
    AMADEUS_CLIENT_SECRET3 = p6wllMcKcTi84yGe

    AMADEUS_CLIENT_ID4= 6odeGdyTrngv1iK4MTGLV1ZA3e5DGpaQ
    AMADEUS_CLIENT_SECRET4=5C6yUMriUDBvwtdK

    STRIPE_SECRET_KEY=sk_test_51QOfrZP3C1ta6TKcaY6MeeVy0DTG00poVlhmfQkuSyCxqjzdqoy9fIlQmCuPpBCMVEgZxvWrPdfgVZooxmki6ATI00dNNo7CSy
    STRIPE_PUBLISHABLE_KEY =pk_test_51QOfrZP3C1ta6TKcd53VEcNm89cLxgcOaunbE5hVEIsHyBkHl7G36Gh3SnPErTfMgpUsT4RhmSf8mvpPDxjFgeuz00LJSztbXr

    EMAIL2_USER=saifahmedsalah11
    EMAIL2_PASS=lsssmezaheetgmld


    # Frontend .env
    URL=http://localhost:3000
    AMADEUS_CLIENT_ID4= 6odeGdyTrngv1iK4MTGLV1ZA3e5DGpaQ
    AMADEUS_CLIENT_SECRET4=5C6yUMriUDBvwtdK
    ```

3. Save the `.env` files.

## API Reference

### checkoutRoutes

#### Product Management

- **Add Product**

    ```http
    POST /addProduct/:userId

    ```

    Adds a new product for the specified user.

- **Get Available Products**

    ```http
    GET /getAvailableProducts/:userId
    ```

    Retrieves available products for the specified user.

- **Filter Products by Price Range**

    ```http

    GET /filterProducts/:userId

    ```

    Filters products by price range for the specified user.

- **Edit Product**

    ```http
    PUT /editProducts/:userId/:productId
    ```

    Updates a product for the specified user and product ID.

- **Sort Products by Ratings**

    ```http
    GET /sortProducts/:userId
    ```

    Retrieves available products sorted by ratings for the specified user.

- **Search Product by Name**

    ```http
    GET /searchProductByName/:userId
    ```

    Searches for a product by name for the specified user.

#### Product Reviews and Ratings

- **Rate Product**

    ```http
    POST /rateProduct/:touristId
    ```

    Rates a product by the specified tourist.

- **Review Product**

    ```http
    POST /reviewProduct/:touristId
    ```

    Reviews a product by the specified tourist.

#### Order Management

- **Add Order**

    ```http
    POST /addOrder
    ```

    Adds a new order.

- **Get Orders**

    ```http
    GET /getOrders/:userId
    ```

    Retrieves orders for the specified user.

- **Edit Order**

    ```http
    PUT /editOrder/:userId
    ```

    Updates an order for the specified user.

- **View Delivered Orders**

    ```http
    GET /myOrders/:touristId/:currency
    ```

    Retrieves delivered orders for the specified tourist.

- **Cancel Order**

    ```http
    DELETE /cancelOrders
    ```

    Cancels an order.

#### Product Image Management

- **Upload Product Image**

    ```http
    POST /product/uploadImage/:productId/:userId
    ```

    Uploads an image for a product.

#### Product Archiving

- **Get Archived Products**

    ```http
    GET /getArchivedProducts/:userId
    ```

    Retrieves archived products for the specified user.

- **Archive Product**

    ```http
    PUT /archiveProduct/:userId/:productId
    ```

    Archives a product for the specified user and product ID.

#### Product Quantity and Sales

- **Available Quantity and Sales**

    ```http
    GET /availableQuantityAndSales/:userType/:productId/:currency
    ```

    Retrieves available quantity and sales for the specified product.

#### Wishlist Management

- **Add to Wishlist**

    ```http
    POST /addWishlist/:userId
    ```

    Adds a product to the wishlist for the specified user.

- **Get Wishlist**

    ```http
    GET /getWishlist/:userId
    ```

    Retrieves the wishlist for the specified user.

- **Remove from Wishlist**

    ```http
    DELETE /removeWishlist/:userId/:productId
    ```

    Removes a product from the wishlist for the specified user.

#### Cart Management

- **Add to Cart**

    ```http
    POST /addCart/:userId
    ```

    Adds a product to the cart for the specified user.

- **Get Cart**

    ```http
    GET /getCart/:userId
    ```

    Retrieves the cart for the specified user.

- **Remove from Cart**

    ```http
    DELETE /removeCart/:userId/:cartItemId
    ```

    Removes a product from the cart for the specified user.

- **Edit Quantity in Cart**

    ```http
    PUT /editQuantityInCart/:userId/:cartItemId/:quantity
    ```

    Edits the quantity of a product in the cart for the specified user.

#### Order Creation

- **Create Order (Wallet or COD)**

    ```http
    POST /createOrderWalletOrCod
    ```

    Creates an order with wallet or cash on delivery payment.

- **Create Order with Card Payment**

    ```http
    POST /createOrderCard
    ```

    Creates an order with card payment.

### eventRoutes

    #### Event Management
    
    - **Flag Inappropriate Event**
        ```http
        PUT /inappropriate
        ```
        Flags an event as inappropriate.

    - **Get All Events**
        ```http
        GET /getAllEvents
        ```
        Retrieves all events.

    - **Get User Events**
        ```http
        GET /GetMyEvents/:_id/:userType
        ```
        Retrieves events for a specific user.

    #### Category Management
    - **Create Category**
        ```http
        POST /createCategory/:_id
        ```
        Creates a new category.

    - **Get All Categories**
        ```http
        GET /getAllCategories/:userType
        ```
        Retrieves all categories for a specific user type.

    - **Update Category**
        ```http
        PUT /updateCategoryById/:_id
        ```
        Updates a category by ID.

    - **Delete Category**
        ```http
        DELETE /deleteCategoryById/:_id
        ```
        Deletes a category by ID.

    #### Preference Tag Management
    - **Create Preference Tag**
        ```http
        POST /createPreferenceTag/:_id
        ```
        Creates a new preference tag.

    - **Get All Preference Tags**
        ```http
        GET /getAllPreferenceTags/:_id
        ```
        Retrieves all preference tags for a specific user.

    - **Update Preference Tag**
        ```http
        PUT /updatePreferenceTagById/:_id
        ```
        Updates a preference tag by ID.

    - **Delete Preference Tag**
        ```http
        DELETE /deletePreferenceTagById/:_id
        ```
        Deletes a preference tag by ID.

    #### Event Filtering
    - **Get Upcoming Events**
        ```http
        GET /upcomingEvents/:currency
        ```
        Retrieves upcoming events.

    - **Filter Upcoming Activities**
        ```http
        GET /filterUpcommingActivites
        ```
        Filters upcoming activities.

    - **Filter Itineraries**
        ```http
        GET /filteritineraries
        ```
        Filters itineraries.

    - **Filter Historical Places by Tags**
        ```http
        GET /historicalPlacesByTags/:_id
        ```
        Filters historical places by tags.

    #### Historical Tag Management
    - **Create Historical Tag**
        ```http
        POST /createHistoricalTag/:_id
        ```
        Creates a new historical tag.

    - **Get All Historical Tags**
        ```http
        GET /getAllHistoricalTags/:userId
        ```
        Retrieves all historical tags for a specific user.

    - **Get Historical Tag Details**
        ```http
        GET /getHistoricalTagDetails/:tagId
        ```
        Retrieves details of a specific historical tag.

    #### Activity Management
    - **Get Activity by ID**
        ```http
        GET /activity/:_id/:userId
        ```
        Retrieves an activity by ID.

    - **Get All Activities for User**
        ```http
        GET /activity/user/:userId/allActivities
        ```
        Retrieves all activities for a specific user.

    - **Get All Activities**
        ```http
        GET /getAllActivities
        ```
        Retrieves all activities in the database.

    - **Add Activity**
        ```http
        POST /activity
        ```
        Adds a new activity.

    - **Update Activity**
        ```http
        PUT /activity/:_id/:userId
        ```
        Updates an activity by ID.

    - **Delete Activity**
        ```http
        DELETE /activity/:_id/:userId
        ```
        Deletes an activity by ID.

    #### Itinerary Management
    - **Get Itinerary by ID**
        ```http
        GET /itinerary/:_id/:userId
        ```
        Retrieves an itinerary by ID.

    - **Get All Itineraries for User**
        ```http
        GET /itinerary/user/:userId/allItineraries
        ```
        Retrieves all itineraries for a specific user.

    - **Create Itinerary**
        ```http
        POST /itinerary
        ```
        Creates a new itinerary.

    - **Update Itinerary**
        ```http
        PUT /itinerary/:_id/:userId
        ```
        Updates an itinerary by ID.

    - **Delete Itinerary**
        ```http
        DELETE /itinerary/:_id/:userId
        ```
        Deletes an itinerary by ID.

    #### Historical Place Management
    - **Create Historical Place**
        ```http
        POST /historical-places
        ```
        Creates a new historical place.

    - **Get All Historical Places for User**
        ```http
        GET /historical-places/:userId/allHistoricalPlaces
        ```
        Retrieves all historical places for a specific user.

    - **Get Historical Place by ID**
        ```http
        GET /historical-places/:_id/:userId
        ```
        Retrieves a historical place by ID.

    - **Update Historical Place**
        ```http
        PUT /historical-places/:_id/:userId
        ```
        Updates a historical place by ID.

    - **Delete Historical Place**
        ```http
        DELETE /historical-places/:_id/:userId
        ```
        Deletes a historical place by ID.

    #### Event Booking
    - **Book Event**
        ```http
        PUT /bookEvent
        ```
        Books an event.

    - **Cancel Booking Event**
        ```http
        PUT /cancelBookingEvent
        ```
        Cancels a booked event.

    - **Notify Upcoming Events**
        ```http
        GET /notifyUpcomingEvents/:touristId
        ```
        Notifies tourists about upcoming events.

    #### Hotel Management
    - **Get City Code by City Name**
        ```http
        GET /city/:city
        ```
        Retrieves city code by city name.

    - **Get Hotels by City Code**
        ```http
        GET /hotels/:cityCode/:startDate/:endDate/:currency/:personCount
        ```
        Retrieves hotel IDs by city code.

    - **Book Hotel**
        ```http
        POST /bookHotel
        ```
        Books a hotel.

    #### Flight Management
    - **Get Flight Offers**
        ```http
        POST /flightOffers
        ```
        Retrieves flight offers.

    - **Book Flight**
        ```http
        POST /bookFlight
        ```
        Books a flight.

    #### Transportation Management
    - **Create Transportation**
        ```http
        POST /createTransportation
        ```
        Creates a new transportation route.

    - **Get Transportations**
        ```http
        GET /getTransportations/:currency
        ```
        Retrieves transportations.

    - **Book Transportation**
        ```http
        POST /bookTransportation
        ```
        Books transportation.

    #### Email Management
    - **Send Event Email**
        ```http
        POST /sendEventEmail/:touristId/:receiverEmail
        ```
        Sends an event email.

    #### Miscellaneous
    - **Booked Events**
        ```http
        GET /bookedEvents/:touristId
        ```
        Retrieves booked events for a specific tourist.

    - **Update Itinerary Activation**
        ```http
        PUT /updateItineraryActivation/:itineraryId/:isActivated/:userId/:userType
        ```
        Updates the activation status of an itinerary.


        ### userRoutes

        #### User Management
        - **Get Not Accepted Users**
            ```http
            GET /notAcceptedUsers
            ```
            Retrieves users who have not been accepted yet.

        - **Get Users for Deletion**
            ```http
            GET /deletionrequests
            ```
            Retrieves users who have requested deletion.

        - **Update User Status**
            ```http
            PUT /user/updatingStatus/:userId/:status
            ```
            Updates the status of a user.

        - **Delete User by ID and Type**
            ```http
            DELETE /deleteUserByIdAndType
            ```
            Deletes a user by ID and type.

        - **Add Governor or Admin**
            ```http
            POST /addGovernorOrAdmin
            ```
            Adds a new governor or admin.

        - **Fetch All Users and Tourists**
            ```http
            GET /fetchAllUsersAndTourists/:_id
            ```
            Fetches all users and tourists.

        #### Tour Guide Management
        - **Create Tour Guide**
            ```http
            POST /createTourGuide/:_id
            ```
            Creates a new tour guide.

        - **Get Tour Guide**
            ```http
            GET /getTourGuide/:_id
            ```
            Retrieves a tour guide by ID.

        - **Update Tour Guide**
            ```http
            PUT /updateTourGuide/:_id
            ```
            Updates a tour guide by ID.

        #### Advertiser Management
        - **Create Advertiser**
            ```http
            POST /createAdvertiser/:_id
            ```
            Creates a new advertiser.

        - **Get Advertiser**
            ```http
            GET /getAdvertiser/:_id
            ```
            Retrieves an advertiser by ID.

        - **Update Advertiser**
            ```http
            PUT /updateAdvertiser/:_id
            ```
            Updates an advertiser by ID.

        #### Seller Management
        - **Create Seller**
            ```http
            POST /createSeller/:_id
            ```
            Creates a new seller.

        - **Get Seller**
            ```http
            GET /getSeller/:_id
            ```
            Retrieves a seller by ID.

        - **Update Seller**
            ```http
            PUT /updateSeller/:_id
            ```
            Updates a seller by ID.

        #### Tourist Management
        - **Get Tourist**
            ```http
            GET /getTourist/:_id
            ```
            Retrieves a tourist by ID.

        - **Update Tourist**
            ```http
            PUT /updateTourist/:_id
            ```
            Updates a tourist by ID.

        #### Rating and Commenting
        - **Rate Tour Guide**
            ```http
            POST /rateTourGuide/:touristId
            ```
            Rates a tour guide.

        - **Comment on Tour Guide**
            ```http
            POST /commentTourGuide/:touristId
            ```
            Comments on a tour guide.

        - **Rate Itinerary**
            ```http
            POST /rateItinerary/:touristId
            ```
            Rates an itinerary.

        - **Comment on Itinerary**
            ```http
            POST /commentItinerary/:touristId
            ```
            Comments on an itinerary.

        - **Rate Activity**
            ```http
            POST /rateActivity/:touristId
            ```
            Rates an activity.

        - **Comment on Activity**
            ```http
            POST /commentActivity/:touristId
            ```
            Comments on an activity.

        - **Rate Historical Place**
            ```http
            POST /rateHistoricalPlace/:touristId
            ```
            Rates a historical place.

        - **Comment on Historical Place**
            ```http
            POST /commentHistoricalPlace/:touristId
            ```
            Comments on a historical place.

        #### Password Management
        - **Change Password**
            ```http
            PUT /changePassword/:userId
            ```
            Changes the password of a user.

        - **Forget Password**
            ```http
            POST /forgetPassword
            ```
            Initiates the forget password process.

        - **Verify OTP**
            ```http
            GET /verifyOTP/:userId/:otp
            ```
            Verifies the OTP for password reset.

        - **Change Password After OTP**
            ```http
            PUT /changePasswordAfterOTP/:userId
            ```
            Changes the password after OTP verification.

        #### Promo Code Management
        - **Create Promo Code**
            ```http
            POST /creatingPromoCode
            ```
            Creates a new promo code.

        - **Update Promo Code**
            ```http
            PUT /updatePromoCode
            ```
            Updates an existing promo code.

        #### Notification Management
        - **Get All Notifications**
            ```http
            GET /getAllNotifications/:userId
            ```
            Retrieves all notifications for a user.

        #### Address Management
        - **Add Address**
            ```http
            POST /addAddresses/:userId/:address
            ```
            Adds a new address for a user.

        - **Get Addresses**
            ```http
            GET /getAddresses/:userId
            ```
            Retrieves addresses for a user.

        #### Miscellaneous
        - **Upload Image**
            ```http
            POST /uploadImage/:userId
            ```
            Uploads an image for a user.

        - **Redeem Points**
            ```http
            GET /redeemPoints/:userId/:points
            ```
            Redeems points for a user.

        - **Points After Payment**
            ```http
            PUT /pointsAfterPayment/:userId/:amount
            ```
            Updates points after payment.

        - **Get Level**
            ```http
            GET /level/:userId
            ```
            Retrieves the level of a user.

        - **Accept Terms**
            ```http
            PUT /acceptTerms/:_id/:type
            ```
            Accepts terms for a user.

        - **Register User**
            ```http
            POST /register/:type
            ```
            Registers a new user.

        - **Login**
            ```http
            POST /login
            ```
            Logs in a user.

        - **Add Interested In**
            ```http
            PUT /addInterestedIn/:_id/:eventId/:eventType
            ```
            Adds an interest for a user.

        - **Request Deletion**
            ```http
            PUT /requestDeletion/:userId/:type
            ```
            Requests deletion of a user account.

        - **User Report**
            ```http
            GET /userReport/:userId
            ```
            Retrieves a user report.

        - **Admin Report**
            ```http
            GET /adminReport/:userId
            ```
            Retrieves an admin report.

        - **Fetch User Statistics**
            ```http
            GET /fetchUserStats/:adminid
            ```
            Fetches user statistics.

        - **Bookmark**
            ```http
            POST /bookmark/:touristId/:id/:type
            ```
            Adds a bookmark for a user.

        - **Fetch Bookmarks**
            ```http
            GET /fetchbookmark/:touristId
            ```
            Retrieves bookmarks for a user.

        ### complaintRoutes

        #### Complaint Management
        - **File Complaint**
            ```http
            POST /fileComplaint/:touristId/:problem/:title
            ```
            Files a complaint by a tourist.

        - **View Complaints**
            ```http
            GET /ViewComplaints
            ```
            Admin views all complaints.

        - **View Selected Complaint**
            ```http
            GET /ViewSelectedComplaint/:complaintId
            ```
            Admin views a selected complaint.

        - **Mark Complaint**
            ```http
            PATCH /markComplaint/:complaintId
            ```
            Marks a complaint as resolved.

        - **Reply to Complaint**
            ```http
            PATCH /replyComplaint/:complaintId
            ```
            Admin replies to a complaint.

        - **Get My Complaints**
            ```http
            GET /myComplaints/:touristId
            ```
            Retrieves complaints filed by a tourist.

        - **Delete All Complaints**
            ```http
            DELETE /deleteAllComplaints
            ```
            Deletes all complaints.

If your project is small, then we can add the reference docs in the readme. For larger projects, it is better to provide links to where the API reference documentation is documented.

## Tests

Here are some tests of the application apis from postman:

### Add Governor or Admin

![Add Governor or Admin](screenshots/addGovernorOrAdmin.png)

### Add Product

![Add Product](screenshots/AddProduct.png)

### Book Event With Card

![Book Event Card](screenshots/bookEventCard.png)

### Book Event By Wallet

![Book Event Wallet](screenshots/bookEventWallet.png)

### Create Transportation

![Create Transportation](screenshots/createtransportation.png)

### Create Order (Wallet or COD)

![Create Order Wallet or COD](screenshots/createOrderWalletOrCod.png)

### Delete User

![Delete User](screenshots/deleteuser.png)

### Deletion Requests

![Deletion Requests](screenshots/deletionrequestsfortheadmin.png)

### Email Sent for verifying Booking

![Email Sent for Booking](screenshots/emailsentforbooking.png)

### Flight Offers

![Flight Offers](screenshots/flightOffers.png)

### Get All Events Part 1

![Get All Events Part 1](screenshots/geAllEventspart1.png)

### Get All Events Part 2

![Get All Events Part 2](screenshots/getAllEventspart2.png)

### Get All Events Part 3

![Get All Events Part 3](screenshots/getAllEventspart3.png)

### Hotel Offers

![Hotel Offers](screenshots/hotelOffers.png)

### Login Page

![Login Page](screenshots/login.png)

### My Orders

![My Orders](screenshots/myOrders.png)

### Request Deletion

![Request Deletion](screenshots/requestDeletion.png)

### Stripe Payment

![Stripe Payment](screenshots/stripe.png)

## How to Use?

ExploreInEase is designed to provide a seamless travel planning experience for users of all roles, including tourists, tour guides, advertisers, sellers, and tourism governors. Here's a step-by-step guide on how to use the website:

### For Tourists

1. **Sign Up/Login**: Create an account or log in to your existing account.
2. **Browse Services**: Explore various travel services such as hotels, flights, events, and transportation from the homepage.
3. **Book Services**: Select a service, provide necessary details, and confirm your booking.
    - *Example*: Book a flight, choose your destination, select dates, and confirm your payment method (wallet, Visa, or COD).
4. **Manage Bookings**: View your order history and track your bookings from the "My Orders" section.
5. **Submit Complaints**: If you face any issues, use the complaint submission feature to report them.

### For Tour Guides

1. **Itinerary Management**: Log in as a tour guide and create, update, or delete itineraries for tourists.
2. **View Reports**: Check the number of tourists and sales reports to manage your services effectively.

### For Advertisers

1. **Manage Activities & Transportation**: Add, update, or delete activities and transportation options.
2. **View Reports**: Access reports to understand tourist engagement and sales.

### For Sellers

1. **Product Management**: Add new products or archive/unarchive existing ones.
2. **View Sales Data**: Monitor your sales reports to optimize inventory and pricing.

### For Tourism Governors

1. **Manage Historical Places**: Add or update historical places and location tags to promote tourism.
2. **View Reports**: Analyze the performance of tourism spots in your region.

### For Admins

1. **Manage Categories and Preferences**: Create or update activity categories and preference tags to keep the website updated.
2. **User Management**: Add new users or delete inactive accounts.

### General Notes

- All users can access their respective dashboards to view and manage their activities.
- Ensure that your profile information is up to date for a smooth experience.
- Use the provided payment options for a secure transaction process.

By following these steps, you can utilize all the features offered by ExploreInEase and make the most of your travel or business opportunities.

## Contribute

If you want to contribute to our project you can clone our repository and create your own branch to be able to contribute by following steps:

### Cloning the Repository and Creating a Branch

1. Clone the repository:

    ```bash
    git clone https://github.com/Advanced-computer-lab-2024/ExploreInEase.git
    ```

2. Create a new branch:

    ```bash
    git checkout -b your-branch-name
    ```

3. Make your changes and commit them:

    ```bash
    git add .
    git commit -m "Description of your changes"
    ```

4. Push your branch to the repository:

    ```bash
    git push origin your-branch-name
    ```

5. Create a pull request on GitHub to merge your changes into the main branch.

## Credits

### Node.js resources

1. [Node.js resource 1](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY)
2. [Node.js resource 2](https://youtu.be/3OOHC_UzrKA?si=6S-I2KhhBGqCn1vn)

### React.js resources

1. [React.js resource 1](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK)
2. [React.js resource 2](https://codedamn.com/news/reactjs/usestate-and-useeffect-hooks)

## License

### Nodemailer

- **License:** MIT
- **Source:** [Nodemailer GitHub Repository](https://github.com/nodemailer/nodemailer)
- **Details:** Nodemailer is licensed under the MIT License, which permits unrestricted use, modification, and distribution as long as the original copyright notice is included.

### Amadeus Node.js SDK

- **License:** MIT
- **Source:** [Amadeus Node.js SDK GitHub Repository](https://github.com/amadeus4dev/amadeus-node)
- **Details:** The Amadeus Node.js SDK is also licensed under the MIT License, allowing for unrestricted use, modification, and distribution with attribution.

### Stripe Node.js SDK

- **License:** Apache 2.0
- **Source:** [Stripe GitHub Repository](https://github.com/stripe/stripe-node)
- **Details:** Stripe Node.js SDK is licensed under the Apache License 2.0, which permits usage, modification, and distribution with attribution, provided you comply with the terms of the license, including providing a copy of the license in any distribution.
