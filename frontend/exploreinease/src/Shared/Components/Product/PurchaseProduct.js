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
  const isSellerOrAdmin = Type === 'seller' || Type === 'admin';
  const [initialProductList, setInitialProductList] = useState(Product);
  const [maxPrice, setMaxPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [sortOption, setSortOption] = useState('');
  const [openRate, setOpenRate] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [rating, setRating] = useState('');
  const [review,setReview]=useState('');
  const [productData, setProductData] = useState({
    productIds: [
     { description: '',
      price: '',
      name:'',
      _id:''}
    ],
    status:'',
    _id:''
  });
  const [errors, setErrors] = useState({});
  const [nextId, setNextId] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState([]);
  
 

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
  const handleClickOpenReview=(Product)=>{
    setSelectedProduct(Product); // Set the reviews of the selected product
    setOpenReview(true);
  }
  const handleClose = () => {
    setOpenRate(false); // Close the reviews dialog
    setOpenReview(false);
    setReview('');
    setRating('');
  };
  const handleRatingValuesChange=(event)=>{
    setRating(event.target.value);
}
const handleReviewChange=(event)=>{
  setReview(event.target.value);
}
const handleSaveRating =async(Product,rating)=>{
  try {
    // touristId, productIds, quantities
    console.log("selectedProduct",selectedProduct);
    
    const options = { 
      apiPath: `/rateProduct/${User._id}`,
      body:
      {
       productId:selectedProduct.productIds[0]._id,
       rating:rating
      }
     };
     
    const response = await NetworkService.post(options);
      console.log(response);
      
  } catch (error) {
    console.log('Error fetching historical places:', error);
  }
}
const handleSaveReview =async(Product,review)=>{
  try {
    // productId, reviewText    
    const options = { 
      apiPath: `/reviewProduct/${User._id}`,
      body:
      {
        productId:selectedProduct.productIds[0]._id,
        reviewText:review
      }
     };
     
    const response = await NetworkService.post(options);
      console.log(response);
      
  } catch (error) {
    console.log('Error fetching historical places:', error);
  }
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
          {initialProductList.map((product,index) => (
            <Grid item xs={12} sm={6} md={4} >
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.productIds[0].name}
                  </Typography>
                  <Typography>Price: ${product.productIds[0].price}</Typography>
                  <Typography>Status: {product.status}</Typography>
                  <Typography>Description: {product.productIds[0].description}</Typography>
                 <div style={{  display:'flex',justifyContent: 'center', marginTop: '10px' }}>
                        <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleClickOpenRate(product)} // Open reviews dialog
                                  style={{ marginTop: '10px', justifyContent: 'center',alignContent:'center',marginRight:'15px' }}
                                >
                                      Rate
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleClickOpenReview(product)} // Open reviews dialog
                                  style={{ marginTop: '10px', justifyContent: 'center',alignContent:'center' }}
                                >
                                      Review
                                </Button>
                     </div>
                
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
    <Button onClick={handleSaveRating} color="primary">
      Save
    </Button>
    <Button onClick={handleClose} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>


<Dialog  open={openReview}
onClose={handleClose}>
 <DialogTitle>Product Review </DialogTitle>
  <DialogContent>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
        Enter your Review:
      </Typography>
      <TextField
        label="Review"
        type="text"
        variant="standard"
        value={review}
        onChange={handleReviewChange}
        style={{ marginBottom:'12px' }}
        required
      />
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleSaveReview} color="primary">
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