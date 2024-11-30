// checkoutRepository.js
const Products = require('../../models/product'); // Adjust the path as necessary
const Order = require('../../models/order'); // Adjust the path as necessary
const Tourist = require('../../models/tourist'); // Adjust the path as necessary
const Notification = require('../../models/notification'); // Adjust the path as necessary

const getProductById = async (productId) => {
    
    return await Products.findOne({ _id :productId }).exec();
};



//New ElNew code 

const createOrder = async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
};


const findOrdersByStatusAndTouristId = async (touristId, currency) => {
  // Fetch orders for the given touristId
  const orders = await Order.find({ touristId }).exec();

  // Fetch tourist information for the given touristId
  const tourist = await Tourist.findById(touristId).exec();
  if (!tourist) {
      throw new Error("Tourist not found");
  }
  const customerName = tourist.username;

  // Create a map of product IDs to their names for efficient lookup
  const productIds = [
      ...new Set(
          orders.flatMap(order => order.productsIdsQuantity.map(product => product.id))
      )
  ];
  const products = await Products.find({ _id: { $in: productIds } }).exec();
  const productMap = Object.fromEntries(
      products.map(product => [product._id.toString(), product.name])
  );

  // Map orders to the desired structure
  const convertedOrders = orders.map((order, index) => {
      // Convert price based on the specified currency
      let convertedPrice = order.price;
      switch (currency) {
          case "euro":
              convertedPrice = parseFloat((order.price / 55).toFixed(2));
              break;
          case "dollar":
              convertedPrice = parseFloat((order.price / 50).toFixed(2));
              break;
          case "EGP":
              // No conversion needed for EGP
              break;
          default:
              throw new Error("Invalid currency specified");
      }

      return {
          id: index + 1, // Generate a unique ID starting from 1
          orderDate: new Date(order.createdAt).toISOString().split("T")[0], // Format date as YYYY-MM-DD
          status: order.status,
          products: order.productsIdsQuantity.map((product, idx) => ({
              id: idx + 1, // Product index in sequence
              name: productMap[product.id] || "Unknown Product", // Fetch name from productMap
              quantity: product.quantity,
              price: convertedPrice, // Total price of the order
          })),
          customerName, // Fetched from the Tourist table
          shippingAddress: `${order.addressToBeDelivered.street}, ${order.addressToBeDelivered.city}, ${order.addressToBeDelivered.country}`,
          paymentType: order.paymentType,
      };
  });

  return convertedOrders;
};




// Fetch order by ID
const getOrderById = async (orderId) => {
    return await Order.findById(orderId).exec();
};

// Fetch tourist by ID
const getTouristById = async (touristId) => {
    return await Tourist.findById(touristId).exec();
};

// Delete order by ID
const deleteOrderById = async (orderId) => {
    return await Order.findByIdAndDelete(orderId).exec();
};



// saif functions


const addNotification = async (notificationData) => {
    const notification = new Notification(notificationData);
    const newNotification = await notification.save();
    return newNotification;
};


module.exports = {
    getProductById,
    createOrder,
    findOrdersByStatusAndTouristId,
    getOrderById,
    getTouristById,
    deleteOrderById,
    addNotification,
    
};
