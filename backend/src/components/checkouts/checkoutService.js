const checkoutRepository=require("../checkouts/checkoutRepository")
const User = require("../../models/user");
const Product=require("../../models/product");



const changeProductStatus = async (requestorID, productId, status) => {
    const requestor = await User.findById(requestorID);
  if (!requestor || requestor.type !== "admin"||requestor.type !== "seller") {
    throw new Error("Access denied. Admins or sellers only.");
  }
    const updatedProduct = await checkoutRepository.updateProductStatus(requestorID, productId, status);
    return updatedProduct; // Return the updated product
  };

module.exports={
    changeProductStatus,

};