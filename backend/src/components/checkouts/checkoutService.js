// checkoutService.js
//All New Codeeee
const checkoutRepository = require('../checkouts/checkoutRepository');

// Function to calculate sales and available quantity based on userType, productId, and currency
const calculateSalesAndAvailability = async (userType, productId, currency) => {

    const product = await checkoutRepository.getProductById(productId);
    

    if (!product) {
        throw new Error('Product not found'); 
    }

    const { price, originalQuantity, takenQuantity } = product;
    const availableQuantity = originalQuantity - takenQuantity; 

    
    let sales = price * takenQuantity;

    switch (currency) {
        case 'euro':
            sales = (sales / 55).toFixed(2); // Adjust sales for Euro and round to 2 decimal places
            break;
        case 'dollar':
            sales = (sales / 50).toFixed(2); // Adjust sales for Dollar and round to 2 decimal places
            break;
        case 'EGP':
            sales = sales.toFixed(2); // No change needed for EGP, but round to 2 decimal places
            break;
        default:
            throw new Error('Invalid currency'); // Handle invalid currency
    }
    
    
    sales = parseFloat(sales);

    return {
        sales,
        availableQuantity,
    };
};

module.exports = {
    calculateSalesAndAvailability,
};
