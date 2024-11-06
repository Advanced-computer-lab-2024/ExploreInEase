import React, { useState, useEffect, useRef } from 'react';
import NetworkService from '../../../NetworkService';
import axios from 'axios';
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
import RateReviewIcon from '@mui/icons-material/RateReview'; // Import review icon
import ArchiveIcon from '@mui/icons-material/Unarchive';



const UnarchiveProduct = () => {
  const location = useLocation();
  const { Product, User } = location.state || {};
  const userId = User ? User._id : null;
  
  const [products, setProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [ratingFilter, setRatingFilter] = useState([0, 5]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [selectedProductId, setSelectedProductId] = useState(null);


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
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (Product && Array.isArray(Product)) {
      const loadedProducts = Product.map(product => {
        const savedImageUrl = localStorage.getItem(`product-image-${product._id}`);
        return {
          ...product,
          picture: savedImageUrl || product.picture || 'http://localhost:3030/images/changePassword.jpg',
        };
      });
      setProducts(loadedProducts);
      const maxProductPrice = Math.max(...Product.map(item => Number(item.price) || 0));
      setMaxPrice(maxProductPrice);
      setPriceRange([0, maxProductPrice]);
    }
  }, [Product]);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handlePriceChange = (event, newValue) => setPriceRange(newValue);
  const handleRatingMinChange = (event) => setRatingFilter([Number(event.target.value), ratingFilter[1]]);
  const handleRatingMaxChange = (event) => setRatingFilter([ratingFilter[0], Number(event.target.value)]);
  const handleOpenFilterDialog = () => setFilterDialogOpen(true);
  const handleCloseFilterDialog = () => setFilterDialogOpen(false);
  const handleOpenArchiveDialog = () => setArchiveDialogOpen(true);
  const handleCloseArchiveDialog = () => setArchiveDialogOpen(false);

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
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      handleCloseArchiveDialog();
    } catch (error) {
      console.error('Failed to UnArchive product:', error);
    }
  };
  const handleViewReviews = () => {
    setDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
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

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.price >= priceRange[0] && product.price <= priceRange[1] &&
      product.ratings >= ratingFilter[0] && product.ratings <= ratingFilter[1]
    );

  return (
    <Box display="flex" flexDirection="column" alignItems="center" py={3}>
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
            endAdornment: (
              <InputAdornment position="end">
              <Tooltip title="Filter" placement="top" arrow>
                <IconButton onClick={handleOpenFilterDialog}>
                  <FilterListIcon />
                </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2 }}
        />
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
  {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
          <Card elevation={3} sx={{ borderRadius: 2, position: 'relative' }}>
            <Box sx={{ position: 'relative', height: 140 }}>
              <CardMedia
                component="img"
                height="140"
                image={product.picture || 'http://localhost:3030/images/changePassword.jpg'}
                alt={product.name}
              />
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
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>Price: ${product.price}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>Description: {product.description}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>Quantity: {product.originalQuantity}</Typography>
              <Typography variant="body2" color="text.secondary">Ratings: {product.ratings}</Typography>
            </CardContent>
    
            {/* Icon Buttons at the bottom-right corner */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                display: 'flex',
                gap: 1, // Space between icons
              }}
            >
              <Tooltip title="Reviews" placement="top" arrow>
                <IconButton onClick={handleViewReviews} sx={{ color: '#1976d2' }}>
                  <RateReviewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Unarchive" placement="top" arrow>
                <IconButton 
                  onClick={() => { 
                    setSelectedProductId(product._id); 
                    handleOpenArchiveDialog(); 
                  }} 
                  sx={{ color: 'red' }}
                >
                  <ArchiveIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Card>
        </Grid>
  ))}
</Grid>

          {/* Reviews Dialog */}
          <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
            <DialogTitle>Reviews</DialogTitle>
            <DialogContent>
              {/* Empty Content - Placeholder for future review data */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          {/* Archive Confirmation Dialog */}
          <Dialog open={isArchiveDialogOpen} onClose={handleCloseArchiveDialog} fullWidth maxWidth="xs">
  <DialogTitle>Confirm Unarchive</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to Unarchive this product?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseArchiveDialog} color="primary">Cancel</Button>
    <Button onClick={() => handleArchiveProduct(selectedProductId)} color="error">Yes, Unarchive</Button>
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

    </Box>
  );
};

export default UnarchiveProduct;