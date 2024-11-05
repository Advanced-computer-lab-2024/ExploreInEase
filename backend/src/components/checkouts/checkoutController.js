const checkoutService = require("../checkouts/checkoutService");

const archiveOrUnarchiveProduct = async (req, res) => {
  try {
    const { requestorID } = req.query;
    const { productId } = req.params;
    const { status } = req.body;

    if (!requestorID) {
      return res.status(400).json({
        success: false,
        message: "id needed ",
      });
    }
    if (!status || (status !== "archive" && status !== "unarchive")) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. It must be either 'archive' or 'unarchive'.",
      });
    }
    // Call the service to mark the complaint
    const updatedProduct = await checkoutService.changeProductStatus(
      requestorID,
      productId,
      status
    );

    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "An error occurred while marking the product.",
      details: error.message,
    });
  }
};

module.exports = {
  archiveOrUnarchiveProduct,
};
