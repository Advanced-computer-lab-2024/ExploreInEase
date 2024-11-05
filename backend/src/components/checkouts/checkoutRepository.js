const Product = require('../../models/product');
const User=require("../../models/user");

const updateProductStatus = async (requestorID, productId, status) => {
    
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error("Product not found.");
    }
  
    const user = await User.findById(requestorID);
    
    if (!user || user.type !== "admin" || user._id.toString() !== product.sellerId.toString()) {
      throw new Error("Access denied. Only admins or the seller can perform this action.");
    }
  
    product.status = status;
    await product.save(); 
  
    return product; 
  };
  
  
  module.exports = {
    updateProductStatus,
  };