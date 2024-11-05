import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { useLocation } from 'react-router-dom';
import {TextField,InputAdornment,IconButton,Grid,Card,CardMedia,CardContent,DialogContentText,Fab,Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography,Slider,Divider,Box} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const ProductCard = () => {
  const location = useLocation();
  const { Product, User } = location.state || {};
  const userId = User ? User._id : null;
  console.log("UserId:", userId);
  const [products, setProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [ratingFilter, setRatingFilter] = useState([0, 5]); // Default rating range
  const [sortOption, setSortOption] = useState('');
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
const [messageContent, setMessageContent] = useState('');
const [messageType, setMessageType] = useState('success'); // 'success' or 'error'
  const [productData, setProductData] = useState({
    productId: null,
    name: '',
    price: '',
    description: '',
    sellerType: '',
    ratings: '',
    originalQuantity: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (Product && Array.isArray(Product)) {
      setProducts(Product);
      const maxProductPrice = Math.max(...Product.map(item => Number(item.price) || 0));
      setMaxPrice(maxProductPrice);
      setPriceRange([0, maxProductPrice]);
    }
  }, [Product]);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handlePriceChange = (event, newValue) => setPriceRange(newValue);
  const handleRatingInputChange = (index) => (event) => {
    const newValue = Number(event.target.value);
    if (newValue >= 0 && newValue <= 5) {
      setRatingFilter((prev) => {
        const newRatings = [...prev];
        newRatings[index] = newValue;
        return newRatings;
      });
    }
  };  const handleClickOpenFilterDialog = () => setOpenFilterDialog(true);
  const handleCloseFilterDialog = () => setOpenFilterDialog(false);
  const handleClickOpenProductDialog = () => setOpenProductDialog(true);
  const handleFilterSubmit = () => {
    console.log("Filters submitted");
    handleCloseFilterDialog();
  };
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setProductData({
      productId: 0,
      name: '',
      price: '',
      description: '',
      sellerType: '',
      ratings: '',
      originalQuantity: '',
      image: null,
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
      image: files ? files[0] : prevData.image,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!productData.name) formErrors.name = 'Name is required';
    if (!productData.price) formErrors.price = 'Price is required';
    else if (productData.price < 0) formErrors.price = 'Price must be a positive number';
    if (!productData.description) formErrors.description = 'Description is required';
    if (!productData.ratings || productData.ratings < 0 || productData.ratings > 5)
      formErrors.ratings = 'Ratings must be between 0 and 5';
    if (!productData.originalQuantity) formErrors.originalQuantity = 'Quantity is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  useEffect(() => {
    if (Product && Array.isArray(Product)) {
      setProducts(Product);
      const maxProductPrice = Math.max(...Product.map(item => Number(item.price) || 0));
      setMaxPrice(maxProductPrice);
      setPriceRange([0, maxProductPrice]);
    }
  }, [Product]);


  // Function to handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const productDataToSend = {
          price: productData.price,
          description: productData.description,
          originalQuantity: productData.originalQuantity,
          name: productData.name,
        };

        if (productData.productId) {
          // Update existing product
          const response = await axios.put(`/editProducts/${userId}/${productData.productId}`, productDataToSend);
          const updatedProducts = products.map(product =>
            product.productId === productData.productId
              ? { ...productData, image: productData.image ? URL.createObjectURL(productData.image) : product.image }
              : product
          );
          setProducts(updatedProducts);
          setMessageContent('Product updated successfully!');
          setMessageType('success');
        } else {
          // Add new product
          const newProductId = products.length > 0 ? Math.max(products.map(p => p.productId)) + 1 : 1; // Auto-generate the product ID
          const response = await axios.post(`/addProduct/${userId}`, productDataToSend);
          const newProduct = { ...productData, productId: newProductId, image: productData.image ? URL.createObjectURL(productData.image) : '' };
          setProducts([...products, newProduct]);
          setMessageContent('Product added successfully!');
          setMessageType('success');
        }

        handleCloseProductDialog();
      } catch (error) {
        console.error("Error during API request:", error);
        setMessageContent('Error occurred while processing your request.');
        setMessageType('error');
      } finally {
        setMessageDialogOpen(true); // Show the message dialog at the end
      }
    }
  };
  
  

  const handleEditProduct = (productId) => {
    const productToEdit = products.find(product => product.productId === productId);
    setProductData(productToEdit);
    handleClickOpenProductDialog();
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.price >= priceRange[0] && product.price <= priceRange[1] &&
      product.ratings >= ratingFilter[0] && product.ratings <= ratingFilter[1]
    )
    .sort((a, b) => {
      if (sortOption === 'ratingsAsc') return a.ratings - b.ratings;
      if (sortOption === 'ratingsDesc') return b.ratings - a.ratings;
      return 0;
    });

  return (
    <Box display="flex" flexDirection="column" alignItems="center" py={3}>
      {/* Search Section */}
      <Box display="flex" alignItems="center" mb={3} width="100%" maxWidth={600}>
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
          }}
          sx={{ mr: 2 }}
        />
        <IconButton color="primary" onClick={handleClickOpenFilterDialog}>
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Product Listing Section */}
      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.productId}>
            <Card elevation={3} sx={{ borderRadius: 2, position: 'relative' }}>
              <CardMedia
                component="img"
                height="140"
                image={product.image || 'http://localhost:3030/images/changePassword.jpg'}
                alt={product.name}
                sx={{
                  objectFit: 'cover',
                }}
              />
              {/* Overlay for Upload Image */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 180,
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
                  '&:hover > div': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <Typography variant="h6">Upload an Image</Typography>
              </Box>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleInputChange}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {product.originalQuantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {product.rating}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Description: {product.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Original Quantity: {product.originalQuantity}
                </Typography>
                <IconButton
                  color="primary"
                  onClick={() => handleEditProduct(product.productId)}
                  sx={{ position: 'absolute', bottom: 8, right: 8 }}
                >
                  <EditIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

{/* Product Dialog */}
<Dialog open={openProductDialog} onClose={handleCloseProductDialog}>
        <DialogTitle>{productData.productId ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the product details.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Product Name"
            type="text"
            fullWidth
            value={productData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={productData.price}
            onChange={handleInputChange}
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={productData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            margin="dense"
            name="originalQuantity"
            label="Original Quantity"
            type="number"
            fullWidth
            value={productData.originalQuantity}
            onChange={handleInputChange}
            error={!!errors.originalQuantity}
            helperText={errors.originalQuantity}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>{productData.productId ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <div>
      <Dialog open={openFilterDialog} onClose={handleCloseFilterDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Filter Products
          <Button onClick={handleCloseFilterDialog} color="inherit">
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Price Range
          </Typography>
          <Box sx={{ width: '100%', mx: 2 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              max={1000} // example max value
              min={0}
              sx={{ width: '80%', mx: 'auto' }}
            />
          </Box>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="h6" gutterBottom>
            Rating Range
          </Typography>
          <Box display="flex" justifyContent="space-between" sx={{ width: '100%', mx: 2 }}>
            <TextField
              type="number"
              label="Min Rating"
              value={ratingFilter[0]}
              onChange={handleRatingInputChange(0)}
              inputProps={{ min: 0, max: 5 }}
              sx={{ width: '45%' }}
            />
            <TextField
              type="number"
              label="Max Rating"
              value={ratingFilter[1]}
              onChange={handleRatingInputChange(1)}
              inputProps={{ min: 0, max: 5 }}
              sx={{ width: '45%' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFilterDialog}>Cancel</Button>
          <Button onClick={handleFilterSubmit}>Apply</Button>
        </DialogActions>
      </Dialog>
    </div>

    <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)}>
  <DialogTitle>{messageType === 'success' ? 'Success' : 'Error'}</DialogTitle>
  <DialogContent>
    <DialogContentText>
      {messageContent}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setMessageDialogOpen(false)} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        onClick={handleClickOpenProductDialog}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );

};

export default ProductCard;
