import React, { useState, useEffect } from 'react';
import NetworkService from '../../../NetworkService';
import axios from 'axios';
import { Alert } from '@mui/material'; 
import { useLocation } from 'react-router-dom';
import {
  TextField, InputAdornment, IconButton, Grid, Card, CardMedia, CardContent,
  DialogContentText, Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Slider, Box,Tooltip 
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { AddShoppingCart } from "@mui/icons-material";
import RateReviewIcon from '@mui/icons-material/RateReview'; // Import review icon
import ArchiveIcon from '@mui/icons-material/Archive';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingBasket from '@mui/icons-material/ShoppingBasket';
import SwapVert from '@mui/icons-material/SwapVert'; // Import the Sort icon
import Avatar from '@mui/material/Avatar';
import HomePage from '../../../Seller/SellerNavbar';
import TouristNavbar from '../../../Tourist/TouristNavbar';
import NodataFound from '../../../No data Found.avif';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProductCard = () => {
  const Userr=localStorage.getItem('User');
   const adminIdd = localStorage.getItem('UserId');
   const userType= localStorage.getItem('UserType');
  const location = useLocation();
  const { User } = location.state || Userr||{};
  const userId = User ? User._id : adminIdd;
  const [products, setProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [ratingFilter, setRatingFilter] = useState([0, 5]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isSalesDialogOpen, setSalesDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // Initial sort order
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedProductPrice, setSelectedProductPrice] = useState('');
  const [selectedProductSales, setSelectedProductSales] = useState('');
  const [checkProductAdd,setCheckProductAdd]=useState(true);
  const [selectedProductQuantity, setSelectedProductQuantity] = useState('');
  const [selectedProductReviews, setSelectedProductReviews] = useState([]);
  const [productInterval]=useState([]);
  const  Product = location.state?.Product || productInterval||[];
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState({}); // Track wishlist status for each product

  const [productData, setProductData] = useState({
    _id: null,
    name: '',
    price: '',
    description: '',
    sellerType: '',
    ratings: '',
    originalQuantity: '',
    picture: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(()=>{
    handleGetAllProduct();
  },[]);

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);
  
  useEffect(() => {
    if (showErrorMessage) {
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorMessage]);
  useEffect(() => {
    console.log("Fetching products...");
    handleGetAllProduct();
  }, []);
  useEffect(() => {
    console.log("Fetching products...");
    handleGetAllInWishlist();
  }, []);


  const handleGetAllInWishlist = async () => {
    try {
      const options = { apiPath: `/getWishlist/${userId}`, urlParam: userId };
      const response = await NetworkService.get(options);
      console.log(response);

      if (response && response.wishlist) {
        const wishlistStatus = response.wishlist.reduce((acc, product) => {
          acc[product._id] = true;
          return acc;
        }, {});
        setWishlistStatus(wishlistStatus);
      } else {
        console.warn('Wishlist data is not available in the response');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
      }
// Replace setProductData with setProducts in handleGetAllProduct
const handleGetAllProduct = async () => {
  try {
    const options = { apiPath: `/getAvailableProducts/${userId}`, urlParam: userId };
    const response = await NetworkService.get(options);
    console.log(response);
    
    if (response && response.Products) {
      const adjustedProducts = response.Products.map((product) => ({
        ...product,
        originalQuantity: product.originalQuantity - product.takenQuantity || 0,
        picture: localStorage.getItem(`product-image-${product._id}`) || product.picture || 'http://localhost:3030/images/changePassword.jpg',
      }));
  
      // Use setProducts instead of setProductData
      setProducts(adjustedProducts);
      console.log("Adjusted Products", adjustedProducts);
      
      // Set max price and price range based on the adjusted products
      const maxProductPrice = Math.max(...adjustedProducts.map(item => Number(item.price) || 0));
      setMaxPrice(maxProductPrice);
      setPriceRange([0, maxProductPrice]);
    } else {
      console.warn('Product data is not available in the response');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
  const handleAddToCart = async (productId) => {

    const reqbody = {
        productId: productId,
        quantity:1
    }

    const userId = localStorage.getItem("UserId");

    await axios.post(`http://localhost:3030/addCart/${userId}`,reqbody).then((res) => {
        console.log(res.data);
        console.log("Added to cart", productId);
        }).catch((err) => {
        console.log(err);
        }
    );
};
const handleAddToWishList = async (productId) => {

  const reqbody = {
      productId: productId
  }

  const userId = localStorage.getItem("UserId");

  await axios.post(`http://localhost:3030/addWishlist/${userId}`,reqbody).then((res) => {
      console.log(res.data);
      console.log("Added to Wishlist", productId);
      setIsAddedToWishlist(true);

            // Update state for this specific product
      setWishlistStatus((prevState) => ({
        ...prevState,
        [productId]: true, // Mark this product as added
      }));

      }).catch((err) => {
      console.log(err);
      }
  );
};
const handleClickPurchase = async (product, selectedQuantity) => {
  try {
    const options = { 
      apiPath: `/addOrder`,
      body: {
        touristId: userId,
        productIds: [product._id],
        quantities: [selectedQuantity],
        totalPrice: product.price * selectedQuantity,
      }
    };

    const response = await NetworkService.post(options);
    console.log(response);
    setSuccessMessage("Successfully purchased!");
    setShowSuccessMessage(true);

    setProducts((prevProducts) =>
      prevProducts.map((p) => 
        p._id === product._id ? { ...p, originalQuantity: p.originalQuantity - selectedQuantity } : p
      )
    );

    const options2 = { 
      apiPath: `/pointsAfterPayment/{userId}/{amount}`,
      urlParam: { userId, amount: product.price * selectedQuantity },
    };
    const response2 = await NetworkService.put(options2);
    console.log(response2);
  } 
  catch (error) {
    setErrorMessage(error.message || 'An error occurred');
    setShowErrorMessage(true);
    console.error('Error:', error);
  } finally {
    setOpenDialog(false); // Close dialog after purchase
  }
};
  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handlePriceChange = (event, newValue) => setPriceRange(newValue);
  const handleRatingMinChange = (event) => setRatingFilter([Number(event.target.value), ratingFilter[1]]);
  const handleRatingMaxChange = (event) => setRatingFilter([ratingFilter[0], Number(event.target.value)]);
  const handleOpenFilterDialog = () => setFilterDialogOpen(true);
  const handleCloseFilterDialog = () => setFilterDialogOpen(false);
  const handleOpenCreateDialog = () => setCreateDialogOpen(true);
  const handleOpenArchiveDialog = () => setArchiveDialogOpen(true);
  const handleCloseArchiveDialog = () => setArchiveDialogOpen(false);
  const handleOpenSalesDialog = () => setSalesDialogOpen(true);
  const handleCloseSalesDialog = () => setSalesDialogOpen(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);


  const handleSalesDetails = async (productId) => {
    try {
    //   console.log(User.type);
      // Replace with your API endpoint
      
      const options = {
        apiPath: '/availableQuantityAndSales/{userType}/{productId}/{currency}',
        urlParam: { userType: userType , productId: productId, currency: User.currency},
      }
      const response = await NetworkService.get(options);
      console.log(response);
      const product = products.find((product) => product._id === productId);
      if (!product) {
        throw new Error('Product not found');
      }
      setSelectedProductName(product.name);
      setSelectedProductPrice(product.price);
      setSelectedProductSales(response.data.sales);
      setSelectedProductQuantity(response.data.availableQuantity);
      setSalesDialogOpen(true);
    } catch (error) {
      console.error('Failed to get product details:', error);
    }
  };
  const handleArchiveProduct = async (productId) => {
    try {
      // Replace with your API endpoint
      const options = {
        apiPath: '/archiveProduct/{userId}/{productId}',
        urlParam: {
          userId: userId,
          productId: productId,
        },
      }
      const response = await NetworkService.put(options);
      console.log(response);
      setSuccessMessage("Successfully!");
      setShowSuccessMessage(true);

      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      handleCloseArchiveDialog();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred');
      setShowErrorMessage(true);
      console.error('Failed to archive product:', error);
    }
  };
  const handleViewReviews = async (productId) => {
    console.log('Viewing reviews for product:', productId);
    const product = products.find((product) => product._id === productId);
      if (!product) {
        throw new Error('Product not found');
      }
      setSelectedProductName(product.name);
      setSelectedProductPrice(product.price);
      setSelectedProductSales(product.sales);
      setSelectedProductQuantity(product.availableQuantity);
      setSelectedProductReviews(product.reviews);
    setDialogOpen(true);
  };

  const handleSortByRating = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      return sortOrder === 'desc' ? b.ratings - a.ratings : a.ratings - b.ratings;
    });
    setProducts(sortedProducts);
  
    // Toggle sort order
    setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };
  

  // Function to close the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenEditDialog = (product) => {
    setProductData(product);
    setEditDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setProductData({
      _id: null,
      name: '',
      price: '',
      description: '',
      sellerType: '',
      ratings: '',
      originalQuantity: '',
      picture: null,
    });
    setErrors({});
  };

  const validateForm = () => {
    let formErrors = {};
    if (!productData.name) formErrors.name = 'Name is required';
    if (!productData.price) formErrors.price = 'Price is required';
    else if (productData.price < 0) formErrors.price = 'Price must be a positive number';
    if (!productData.description) formErrors.description = 'Description is required';
    if (!productData.originalQuantity) formErrors.originalQuantity = 'Quantity is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreateSubmit = async () => {
    setCheckProductAdd(false);
    if (validateForm()) {
      try {
        const productDataToSend = {
          price: productData.price,
          description: productData.description,
          originalQuantity: productData.originalQuantity,
          name: productData.name,
        };
        const options = {
          apiPath: '/addProduct/{userId}',
          urlParam: { userId },
          body: productDataToSend,
        };
        const response = await NetworkService.post(options);
        console.log(response);

        const newProduct = { ...productData, _id: response.product._id, picture: productData.picture ? URL.createObjectURL(productData.picture) : '' };
        setProducts([...products, newProduct]);
        setSuccessMessage("Successfully!");
        setShowSuccessMessage(true);
        handleCloseDialogs();
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setShowErrorMessage(true);
        console.error("Error during API request:", error);
       
      } finally {
        setMessageDialogOpen(true);
      }
    }
  };

  const handleEditSubmit = async () => {
    if (validateForm()) {
      try {
        const productDataToSend = {
          price: productData.price,
          description: productData.description,
          originalQuantity: productData.originalQuantity,
          name: productData.name,
        };

        const options = {
          apiPath: '/editProducts/{userId}/{_id}',
          urlParam: { userId, _id: productData._id },
          body: productDataToSend,
        };
        const response = await NetworkService.put(options);
        console.log(response);
        const updatedProducts = products.map(product =>
          product._id === productData._id
            ? { ...productData }
            : product
        );
        setProducts(updatedProducts);
        setMessageContent('Product updated successfully!');
        setMessageType('success');
        handleCloseDialogs();
      } catch (error) {
        console.error("Error during API request:", error);
        setMessageContent('Error occurred while updating product.');
        setMessageType('error');
      } finally {
        setMessageDialogOpen(true);
      }
    }
  };

  const handleInputChange = async (e, productId) => {
    const { files } = e.target;
    if (files && files[0]) {
      setProductData((prevData) => ({
        ...prevData,
        picture: files[0],
      }));
      await handleUploadImage(productId, files[0]); // Upload the image with productId
    }
  };

  const handleCreateChange = async (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  
  const handleUploadImage = async (_id, file) => {
    console.log('Product ID:', _id);
    console.log('File:', file);
    if (!file) {
      console.log('No image selected');
      setMessageContent('Please select an image to upload.');
      setMessageType('error');
      setMessageDialogOpen(true);
      return;
    }
    console.log('Uploading image...');
    const formData = new FormData();
    formData.append('image', file);
    console.log('formData:', formData);
    try {
      // Make the request to upload the image
      const response = await axios.post(`http://localhost:3030/product/uploadImage/${_id}/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
      console.log(response);
      const uploadedImageUrl = response.data.imageUrl;
      localStorage.setItem(`product-image-${_id}`, uploadedImageUrl);
      console.log('Image uploaded successfully:', uploadedImageUrl);

      // Update the product image URL in the state
      const updatedProducts = products.map((product) =>
        product._id === _id ? { ...product, picture: uploadedImageUrl } : product
      );
      setProducts(updatedProducts);
      setMessageContent('Image uploaded successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessageContent('Failed to upload image.');
      setMessageType('error');
    } finally {
      setMessageDialogOpen(true);
    }
  };

  const handleQuantity = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity
    setOpenDialog(true); // Open dialog
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.price >= priceRange[0] && product.price <= priceRange[1] &&
      product.ratings >= ratingFilter[0] && product.ratings <= ratingFilter[1]
    );

  return (

    <div>
      <div>
        {User.type==='seller' ?(
            <HomePage/>
        ):(
          <TouristNavbar/>
        )}
      </div>
    
    <Box display="flex" flexDirection="column" alignItems="center" py={3}>
      <Box display="flex" alignItems="center" mb={3} width="100%" maxWidth={600}   
      sx={{
         gap: 1,  }}>
  <TextField
    label="Search Products"
    variant="outlined"
    value={searchTerm}
    onChange={handleSearchChange}
    fullWidth
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          <Tooltip title="Filter" placement="top" arrow >
            <IconButton onClick={handleOpenFilterDialog} >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </InputAdornment>
      ),
    }}
    sx={{ mr: 2 }}
  />
  
  {/* Tooltip for sorting by rating */}
  <Tooltip title="Sort by Rating" placement="top" sx={{width:'15px'}} arrow>
    <IconButton onClick={handleSortByRating}>
      <SwapVert />
    </IconButton>
  </Tooltip>
  <Tooltip title="Reset" placement="top" sx={{width:'15px'}} arrow>
  <button 
  onClick={handleGetAllProduct} 
  style={{
    width: '120px',         // Makes width auto to fit content
    height:'40px',
    padding: '5px 10px',   // Adjusts padding for smaller button
    fontSize: '12px',      // Reduces font size for a smaller button
    border: '1px solid',   // Optional: adds a border for visibility
    borderRadius: '4px',   // Optional: gives rounded corners
    cursor: 'pointer'      // Optional: adds a pointer cursor on hover
  }}
>
  Reset filter
</button>
  </Tooltip>
</Box>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={handleCloseFilterDialog} fullWidth>
        <DialogTitle>Filter Products</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            min={0}
            max={maxPrice}
            valueLabelDisplay="auto"
          />
          <TextField
            label="Min Rating"
            type="number"
            value={ratingFilter[0]}
            onChange={handleRatingMinChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0, max: 5 }}
          />
          <TextField
            label="Max Rating"
            type="number"
            value={ratingFilter[1]}
            onChange={handleRatingMaxChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0, max: 5 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFilterDialog} color="secondary">Close</Button>
          <Button onClick={() => { setFilterDialogOpen(false); }} color="primary">Apply</Button>
        </DialogActions>
      </Dialog>




<Grid container spacing={2}>
{
  filteredProducts.length>0 ?(
    filteredProducts.map((product) => (
      <Grid item xs={12} sm={6} md={3} key={product._id}>
      <Card elevation={3} sx={{ borderRadius: 2, position: 'relative' }}>
        <Box sx={{ position: 'relative', height: 140 }}>
          <CardMedia
            component="img"
            height="140"
            image={product.picture || 'http://localhost:3030/images/changePassword.jpg'}
            alt={product.name}
          />
          {User.type==='Seller' &&(
                <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  cursor: 'pointer',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
                onClick={() => document.getElementById(`file-input-${product._id}`).click()}
                >
                Upload an Image
              </Box>
          )}
       
        </Box>

        <input
      type="file"
      id={`file-input-${product._id}`}  // Unique ID for each product
      accept="image/*"
      style={{ display: 'none' }}
      onChange={(e) => handleInputChange(e, product._id)}  // Pass the specific product ID
    />

<CardContent>
<Typography variant="h6" gutterBottom>{product.name}</Typography>
<Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>Description: {product.description}</Typography>
<Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>Price: ${product.price}</Typography>

</CardContent>

<Box
sx={{
position: 'absolute',
top: 140,
right: 8,
display: 'flex',
gap: 1, // Space between icons
}}
>
{(User?.type === 'seller' || User?.type === 'admin') && (
      <Tooltip title="Details" placement="top" arrow>
      <IconButton 
        onClick={() => { 
          setSelectedProductId(product._id); 
          handleOpenSalesDialog(); 
          handleSalesDetails(product._id);
        }} 
        sx={{ color: 'black' }}
      >
        <InfoIcon />
      </IconButton>
    </Tooltip>
)}

</Box>

<Box
sx={{
position: 'absolute',
bottom: 8,
right: 8,
display: 'flex',
gap: 2, // Space between icons
}}
>
{userType==='seller'||userType==='admin' || User?.type === 'seller' || User?.type === 'admin'  ? (
<>
  <Tooltip title="Reviews" placement="top" arrow>
    <IconButton onClick={
      () => { 
      setSelectedProductId(product._id); 
      handleViewReviews(product._id);
      }} sx={{ color: '#1976d2',width:'3px' }}>
      <RateReviewIcon />
    </IconButton>
  </Tooltip>
  <Tooltip title="Edit" placement="top" arrow>
    <IconButton onClick={() => handleOpenEditDialog(product)} sx={{ color: '#1976d2',width:'3px' }}>
      <EditIcon />
    </IconButton>
  </Tooltip>
  <Tooltip title="Archive" placement="top" arrow>
    <IconButton 
      onClick={() => { 
        setSelectedProductId(product._id); 
        handleOpenArchiveDialog(); 
      }} 
      sx={{ color: 'red',width:'3px' }}
    >
      <ArchiveIcon />
    </IconButton>
  </Tooltip>
</>
) : ( 
<>
   <Tooltip title="add to Cart" placement="top" arrow>
    <IconButton onClick={() => handleAddToCart(product._id)} sx={{ color: '#1976d2',width:'30px' }}>
      <AddShoppingCart />
    </IconButton>
  </Tooltip>
  <Tooltip
      title="WishList"
      placement="top"
      sx={{
        "& .MuiTooltip-tooltip": {
          backgroundColor: wishlistStatus[product._id] ? "red" : undefined, // Change color only for this card
        },
      }}
    >
      <IconButton
        onClick={() => {
          handleAddToWishList(product._id);
        }}
      >
        <FavoriteIcon color={wishlistStatus[product._id] ? "error" : "inherit"} />
      </IconButton>
    </Tooltip>
  <Tooltip title="Reviews" placement="top" arrow>
    <IconButton onClick={() => handleViewReviews(product._id)} sx={{ color: '#1976d2',width:'30px' }}>
      <RateReviewIcon />
    </IconButton>
  </Tooltip>

  {/* <Tooltip title="Purchase" placement="top" arrow>
    <IconButton onClick={() => handleQuantity(product)} sx={{ color: '#1976d2',width:'30px' }}>
      <ShoppingBasket />
    </IconButton>
  </Tooltip> */}
</>
)}
</Box>
<div>
{/* {showSuccessMessage && (
    <Alert severity="success" 
    sx={{
      position: 'fixed',
      top: 80, // You can adjust this value to provide space between success and error alerts
      right: 20,
      width: 'auto',
      fontSize: '1.2rem', // Adjust the size
      padding: '16px',
      zIndex: 9999, // Ensure it's visible above other content
    }}>
      {successMessage}
    </Alert>
  )}
  {showErrorMessage && (
    <Alert severity="error" 
    sx={{
      position: 'fixed',
      top: 60, // You can adjust this value to provide space between success and error alerts
      right: 20,
      width: 'auto',
      fontSize: '1.2rem', // Adjust the size
      padding: '16px',
      zIndex: 9999, // Ensure it's visible above other content
    }}>
      {errorMessage}
    </Alert>
  )} */}
</div>
      </Card>
      {/* Archive Confirmation Dialog */}
    <Dialog open={isArchiveDialogOpen} onClose={handleCloseArchiveDialog} fullWidth maxWidth="xs">
      <DialogTitle>Confirm Archive</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to archive this product?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseArchiveDialog} color="primary">Cancel</Button>
        <Button onClick={() => handleArchiveProduct(selectedProductId)} color="error">Yes, Archive</Button>
        </DialogActions>
    </Dialog>

    </Grid>
))
  ):(
    <div
    style={{
      width: "400px", // Set a fixed width for the GIF
      height: "400px", // Set a fixed height to match the width
      position: "relative",
      marginLeft:'600px',
      marginTop:'100px',
      alignContent:'center',
      alignItems:'center'
    }}
  >
    <img
      src={NodataFound}
      width="100%"
      height="100%"

    ></img>
  </div>
  )
}
</Grid>
      {/* Create Product Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCloseDialogs} fullWidth>
        <DialogTitle>Create Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill out the form to add a new product.
          </DialogContentText>
          <TextField
            label="Name"
            name="name"
            value={productData.name}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={productData.price}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.price)}
            helperText={errors.price}
          />
          <TextField
            label="Description"
            name="description"
            value={productData.description}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.description)}
            helperText={errors.description}
          />
          <TextField
            label="Quantity"
            name="originalQuantity"
            type="number"
            value={productData.originalQuantity}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.originalQuantity)}
            helperText={errors.originalQuantity}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} color="secondary">Cancel</Button>
          <Button onClick={handleCreateSubmit} color="primary">Add Product</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseDialogs} fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modify the fields to update product details.
          </DialogContentText>
          <TextField
            label="Name"
            name="name"
            value={productData.name}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={productData.price}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.price)}
            helperText={errors.price}
          />
          <TextField
            label="Description"
            name="description"
            value={productData.description}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.description)}
            helperText={errors.description}
          />
          <TextField
            label="Quantity"
            name="originalQuantity"
            type="number"
            value={productData.originalQuantity}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.originalQuantity)}
            helperText={errors.originalQuantity}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} color="secondary">Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)}>
        <DialogTitle>{messageType === 'success' ? 'Success' : 'Error'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{messageContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Select Quantity</DialogTitle>
        <DialogContent>
          <div>
          <TextField
          sx={{
              margin:'9px'
          }}
            label="Quantity"
            variant="outlined"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(Math.max(1, e.target.value), selectedProduct?.originalQuantity))}
            
          />
          </div>
  
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handleClickPurchase(selectedProduct, quantity)}
            disabled={!quantity || quantity > selectedProduct?.originalQuantity}
          >
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>
      
    {/* Sales Details Dialog */}
    <Dialog open={isSalesDialogOpen} onClose={handleCloseSalesDialog} fullWidth maxWidth="xs">
          <DialogTitle>Product Details</DialogTitle>
          <DialogContent>
          <Typography><strong>Product Name:</strong> {selectedProductName}</Typography>
          <Typography><strong>Product Price:</strong> ${selectedProductPrice}</Typography>
          <Typography><strong>Product Sales:</strong> {selectedProductSales}</Typography>
          <Typography><strong>Product Quantity:</strong> {selectedProductQuantity}</Typography>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSalesDialog} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    
          {/* Reviews Dialog */}
          <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
  <DialogTitle>
    <Typography variant="h5" fontWeight="bold" gutterBottom>
      Product Reviews
    </Typography>
  </DialogTitle>
  
  <DialogContent dividers>
    <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>
      {selectedProductName}
    </Typography>

    <Box sx={{ maxHeight: '400px', overflowY: 'auto', paddingRight: 1 }}>
      {selectedProductReviews.length > 0 ? (
        selectedProductReviews.map((review, index) => (
          <Box 
            key={review._id} 
            sx={{ display: 'flex', gap: 2, padding: 2, borderBottom: '1px solid #eee' }}
          >
            <Avatar sx={{ bgcolor: '#1976d2' }}>
              {review.userId?.username.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                Review {index + 1}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
                <strong>Comment:</strong> {review.comment}
              </Typography>
              
              <Typography variant="caption" color="text.secondary">
                <strong>Created At:</strong> {new Date(review.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          No reviews available.
        </Typography>
      )}
    </Box>
  </DialogContent>
  
  <DialogActions>
    <Button onClick={handleCloseDialog} color="primary" variant="contained">
      Close
    </Button>
  </DialogActions>
</Dialog>

      {(userType ==='seller'||userType==='admin'|| User?.type === 'seller' || User?.type === 'admin') && (
  <Tooltip title="Create" placement="top" arrow>
    <Fab
      color="primary"
      aria-label="add"
      onClick={handleOpenCreateDialog}
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
    >
      <AddIcon />
    </Fab>
  </Tooltip>
)}
    </Box>
    </div>
  );
};

export default ProductCard;