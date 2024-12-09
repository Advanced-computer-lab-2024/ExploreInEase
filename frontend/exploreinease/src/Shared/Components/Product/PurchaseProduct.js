import React, { useState , useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NetworkService from '../../../NetworkService';
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Alert } from '@mui/material'; 
import TouristNavbar from '../../../Tourist/TouristNavbar';

const ProductPurchased = () => {
  const location = useLocation();
  const { Product, userId } = location.state || {};
  const [initialProductList] = useState(Product);
  const [openRate, setOpenRate] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [rating, setRating] = useState('');
  const [review,setReview]=useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState([]);
  
 

//   useEffect(() => {
//     // console.log("Current products state:", products);
//   }, [products]);
//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };
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
    console.log("selectedProduct",selectedProduct,selectedProduct.productIds[0]._id);
    console.log("UserId",userId);
        
    const options = { 
      apiPath: `/rateProduct/${userId}`,
      body:
      {
        productId:selectedProduct.productIds[0]._id,
       rating:rating
      }
     };
    const response = await NetworkService.post(options);
    setSuccessMessage("Save Rating Successfully!");
    setShowSuccessMessage(true);
      console.log(response);
  } catch (error) {
    setErrorMessage('An error occurred');
    setShowErrorMessage(true);
    console.log('Error fetching historical places:', error);
  }
  handleClose();
}
const handleSaveReview =async(review)=>{
  try {
    // productId, reviewText    
    const options = { 
      apiPath: `/reviewProduct/${userId}`,
      body:
      {
        productId:selectedProduct.productIds[0]._id,
        reviewText:review
      }
     };
     
    const response = await NetworkService.post(options);
    setSuccessMessage("Review added Successfully!");
    setShowSuccessMessage(true);
      console.log(response);
      
  } catch (error) {
    setErrorMessage( 'An error occurred');
    setShowErrorMessage(true);
    console.log('Error fetching historical places:', error);
  }
  handleClose();

}

// const 

  return (
    <div>
      <TouristNavbar/>
      <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    flexDirection: "column",
                }}
                >
                <Typography variant="h4" gutterBottom>  Purchased Products </Typography>
                </div>
    <Box display="flex" flexDirection="row" py={3} px={2} justifyContent="center">
   
      <Box width="80%" px={2}>
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
    <Button onClick={() => handleSaveReview(review)} color="primary">
      Save
    </Button>
    <Button onClick={handleClose} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
{showSuccessMessage && (
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
      )}
    </Box>
    </div>
  );
};
export default ProductPurchased;