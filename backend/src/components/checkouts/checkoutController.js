const checkoutService = require('../checkouts/checkoutService');
const checkoutRepository = require('../checkouts/checkoutRepository');
const addProduct = async (req, res) => {
    const { productId, price, description, originalQuantity, name } = req.body;
    console.log(req.body)
    const {userId} = req.params;

    if (!price || !originalQuantity || !name || !description) {
        return res.status(400).json({ message: "ProductId, price, picture, original quantity, description, sellerId and name are required." });
    }

    const productData = {
        productId,
        sellerId: userId,
        price,
        description,
        originalQuantity,
        name
    };

    try {
        const newProduct = await checkoutService.addProduct(productData);
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAvailableProducts = async (req, res) => {
    const {userId} = req.params;
    const user = await checkoutRepository.findUserById(userId);
    // console.log(type);
    if (user.type !== 'admin' && user.type !== 'seller' && user.tourist !== 'tourist') 
    {
        return res.status(400).json({ message: 'Invalid type' });
    }

    try {
        const products = await checkoutService.getAvailableProducts();
        res.status(200).json({message: "Fetched successfully!",Products: products});
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getProductsByPriceRange = async (req, res) => {
    const {userId} = req.params;
    const user = await checkoutRepository.findUserById(userId);
    if (user.type !== 'admin' && user.type !== 'seller' && user.tourist !== 'tourist') 
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
    const user = await checkoutRepository.findUserById(userId);
    if (user.type !== 'admin' && user.type !== 'seller') 
    {
        return res.status(400).json({ message: 'Invalid type' });
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



const getAvailableProductsSortedByRatings = async (req, res) => {
    const {userId} = req.params;
    const user = await checkoutRepository.findUserById(userId);
    if (user.type !== 'admin' && user.type !== 'seller' && user.tourist !== 'tourist') 
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

const searchProductByName = async (req, res) => {
    const {userId} = req.params;
    if (user.type !== 'admin' || user.type !== 'seller' || user.tourist !== 'tourist') 
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



module.exports = {
    addProduct,
    getAvailableProducts,
    getProductsByPriceRange,
    updateProduct,
    getAvailableProductsSortedByRatings,
    searchProductByName
};
