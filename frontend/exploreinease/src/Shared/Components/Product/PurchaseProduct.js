import React, { useState , useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NetworkService from '../../../NetworkService';
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

const ProductPurchased = () => {
  const location = useLocation();
  const { Product,Type, User } = location.state || {};
  console.log("User:",User);
  const userId = User._id;
  console.log("admin id",userId);
  
  console.log(Product);
  const productId = Product._id;
  const isSellerOrAdmin = Type === 'seller' || Type === 'admin';
  const [initialProductList, setInitialProductList] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [sortOption, setSortOption] = useState('');
  const [openRate, setOpenRate] = useState(false);
  const [rating, setRating] = useState('');
  const [productData, setProductData] = useState({
    productId: null,
    name: '',
    price: '',
    description: '',
    sellerType: User.sellerType,
    ratings: 0,
    originalQuantity: '',
    reviews: [],
    picture: '',
  });
  console.log(products);
  const [errors, setErrors] = useState({});
  const [nextId, setNextId] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState([]);
  
  useEffect(() => {
    if (Product && Array.isArray(Product)) {
      // console.log("Received Product data:", Product);
      setInitialProductList(Product);
      setProducts(Product);
      const maxProductPrice = Math.max(...Product.map(item => Number(item.price) || 0));
      setMaxPrice(maxProductPrice);
      setPriceRange([0, maxProductPrice]);
      setNextId(Product.length + 1);
    } else {
      // console.log("No Product data received or it's not an array");
    }
  }, [Product]);

//   useEffect(() => {
//     // console.log("Current products state:", products);
//   }, [products]);
//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

  const handleClickOpenRate = (Product) => {
    setSelectedProduct(Product); // Set the reviews of the selected product
    setOpenRate(true);
  };

  const handleClose = () => {
    setOpenRate(false); // Close the reviews dialog
    setRating('');
  };
  const handleRatingValuesChange=(event)=>{
    setRating(event.target.value);
}

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
           
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClickOpenRate(product)} // Open reviews dialog
                    style={{ marginTop: '10px', justifyContent: 'center',alignContent:'center',marginLeft:"115px" }}
                  >
                        Rate
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog open={openRate} onClose={handleClose}>
  <DialogTitle>Product Rating </DialogTitle>
  <DialogContent>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
        Enter rating for your product(out of 5):
      </Typography>
      <TextField
        label="Rate"
        type="number"
        inputProps={{ min: 1, max: 5 }}
        variant="standard"
        value={rating}
        onChange={handleRatingValuesChange}
        style={{ width: '60px',marginBottom:'12px' }}
        required
      />
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Save
    </Button>
    <Button onClick={handleClose} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};
export default ProductPurchased;