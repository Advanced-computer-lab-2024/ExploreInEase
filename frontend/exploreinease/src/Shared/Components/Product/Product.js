import React, { useState , useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Slider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Box,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,Divider,
} from '@mui/material';

const ProductCard = () => {
  const location = useLocation();
  const { Product,Type } = location.state || {};
 
  
  const [initialProductList, setInitialProductList] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [sortOption, setSortOption] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openReviews, setOpenReviews] = useState(false);
  const [productData, setProductData] = useState({
    productId: null,
    name: '',
    price: '',
    description: '',
    sellerType: '',
    ratings: '',
    originalQuantity: '',
    reviews: [],
    picture: '',
  });
  const [errors, setErrors] = useState({});
  const [nextId, setNextId] = useState(0);
  const [selectedReviews, setSelectedReviews] = useState([]);

  useEffect(() => {
    if (Product && Array.isArray(Product)) {
      console.log("Received Product data:", Product);
      setInitialProductList(Product);
      setProducts(Product);
      const maxProductPrice = Math.max(...Product.map(item => Number(item.price) || 0));
      setMaxPrice(maxProductPrice);
      setPriceRange([0, maxProductPrice]);
      setNextId(Product.length + 1);
    } else {
      console.log("No Product data received or it's not an array");
    }
  }, [Product]);

  useEffect(() => {
    console.log("Current products state:", products);
  }, [products]);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleReset = () => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    setSortOption('');
  };

  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleClickOpenUpdate = (product) => {
    setProductData(product); // Set the current product data
    setOpenUpdate(true);
  };

  const handleClickOpenReviews = (reviews) => {
    setSelectedReviews(reviews); // Set the reviews of the selected product
    setOpenReviews(true);
  };

  const handleClose = () => {
    setOpenCreate(false);
    setOpenUpdate(false);
    setOpenReviews(false); // Close the reviews dialog

    setProductData({
      productId: null,
      name: '',
      price: '',
      description: '',
      sellerType: '',
      ratings: '',
      originalQuantity: '',
      picture:'',
      reviews: [],
    });
    setErrors({});
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };
console.log(Product.ratings)
  const validateForm = () => {
    let formErrors = {};

    if (!productData.name) {
      formErrors.name = 'Name is required';
    }
    if (!productData.price) {
      formErrors.price = 'Price is required';
    } else if (productData.price < 0) {
      formErrors.price = 'Price must be a positive number';
    }
    if (!productData.description) {
      formErrors.description = 'Description is required';
    }
    if (!productData.sellerType) {
      formErrors.sellerType = 'Seller is required';
    }
    if (!productData.ratings || productData.ratings < 0 || productData.ratings > 5) {
      formErrors.ratings = 'ratings must be between 0 and 5';
    }
    if (!productData.originalQuantity) {
      formErrors.originalQuantity = 'Quantity is required';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmitCreate = () => {
    if (validateForm()) {
      const newProduct = {
        productId: nextId,
        name: productData.name,
        price: parseFloat(productData.price),
        ratings: parseFloat(productData.ratings),
      };
      setProducts((prev) => [...prev, newProduct]);
      setNextId((prev) => prev + 1);
      handleClose();
    }
  };

  const handleSubmitUpdate = () => {
    if (validateForm()) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productData.id
            ? { ...product, name: productData.name, price: parseFloat(productData.price), ratings: parseFloat(productData.ratings) }
            : product
        )
      );
      handleClose();
    }
  };

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return nameMatch && priceMatch;
  }).sort((a, b) => {
    if (sortOption === 'ratingsAsc') return a.ratings - b.ratings;
    if (sortOption === 'ratingsDesc') return b.ratings - a.ratings;
    return 0;
  });

// const 

  return (
    <Box display="flex" flexDirection="row" py={3} px={2} justifyContent="center">
      <Box width="30%" px={2}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom align="center">
            Filter Products
          </Typography>

          <TextField
            label="Search by name"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            style={{ marginBottom: '20px' }}
          />

          <Typography gutterBottom>Filter by price</Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={maxPrice}
            step={10}
            style={{ marginBottom: '20px' }}
          />
          <Typography align="center">
            Price range: ${priceRange[0]} - ${priceRange[1]}
          </Typography>

          <FormControl fullWidth style={{ marginBottom: '20px', marginTop: '20px' }}>
            <InputLabel>Sort by ratings</InputLabel>
            <Select value={sortOption} onChange={handleSortChange}>
              <MenuItem value="ratingsAsc">ratings: Low to High</MenuItem>
              <MenuItem value="ratingsDesc">ratings: High to Low</MenuItem>
            </Select>
          </FormControl>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={() => { /* handleFilter */ }}>
              Confirm
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleReset}>
              Reset
            </Button>
            {!Type && (
              <Button variant="contained" color="success" onClick={handleClickOpenCreate}>
                Create
              </Button>)}
          </Box>
        </Paper>
      </Box>

      <Box width="70%" px={2}>
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.productId}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography>Price: ${product.price}</Typography>
                  <Typography>Ratings: {product.ratings}</Typography>
                  <Typography>Description: {product.description}</Typography>
                  <Typography>Quantity: {product.originalQuantity}</Typography>
                  <Typography>Seller: {product.sellerType}</Typography>
                  {!Type && (
                    <Button variant="contained" color="primary" onClick={() => handleClickOpenUpdate(product)}>
                      Update
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClickOpenReviews(product.reviews)} // Open reviews dialog
                    style={{ marginTop: '10px' }}
                  >
                    View Reviews
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Create Product Dialog */}
      <Dialog open={openCreate} onClose={handleClose}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details to create a new product.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={productData.name || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            type="number"
            value={productData.price || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={productData.description || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            margin="dense"
            label="Seller"
            name="seller"
            value={productData.sellerType || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.sellerType}
            helperText={errors.sellerType}
          />
          <TextField
            margin="dense"
            label="ratings"
            name="ratings"
            type="number"
            value={productData.ratings || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.ratings}
            helperText={errors.ratings}
          />
          <TextField
            margin="dense"
            label="Quantity"
            name="quantity"
            type="number"
            value={productData.originalQuantity || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.originalQuantity}
            helperText={errors.originalQuantity}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Product Dialog */}
      <Dialog open={openUpdate} onClose={handleClose}>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the details for the product.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={productData.name || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            type="number"
            value={productData.price || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={productData.description || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            margin="dense"
            label="Seller"
            name="seller"
            value={productData.sellerType || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.sellerType}
            helperText={errors.sellerType}
          />
          <TextField
            margin="dense"
            label="Ratings"
            name="ratings"
            type="number"
            value={productData.ratings || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.ratings}
            helperText={errors.ratings}
          />
          <TextField
            margin="dense"
            label="Quantity"
            name="quantity"
            type="number"
            value={productData.originalQuantity || ''}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.originalQuantity}
            helperText={errors.originalQuantity}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      {/* Reviews Dialog */}
      <Dialog open={openReviews} onClose={handleClose}>
        <DialogTitle>Product Reviews</DialogTitle>
        <DialogContent>
          <List>
            {selectedReviews.length > 0 ? (
              selectedReviews.map((review, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Review ${index + 1}: ${review.comment}`}
                    secondary={`ratings: ${review.ratings}`}
                  />
                  <Divider />
                </ListItem>
              ))
            ) : (
              <Typography>No reviews available for this product.</Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
};

export default ProductCard;