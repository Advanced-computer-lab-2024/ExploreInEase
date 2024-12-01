import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  Box,
  Paper
} from '@mui/material';
import {
  Check as CheckIcon,
  AccessTime as ClockIcon,
  Cancel as XCircleIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


const OrdersDashboard = () => {

  const location = useLocation();
  const { Orders ,User } = location.state || {};
  const [currentTab, setCurrentTab] = useState(0);
  const [orders, setOrders] = useState(Orders);
  console.log(orders)

  const calculateOrderTotal = (products) => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      ));
    }
  };

  const getStatusChip = (status) => {
    const statusProps = {
      delivered: { color: 'success', icon: <CheckIcon />, label: 'Delivered' },
      pending: { color: 'warning', icon: <ClockIcon />, label: 'Pending' },
      cancelled: { color: 'error', icon: <XCircleIcon />, label: 'Cancelled' }
    }[status] || {};

    return (
      <Chip
        icon={statusProps.icon}
        label={statusProps.label}
        color={statusProps.color}
        size="small"
      />
    );
  };

  const OrderCard = ({ order }) => (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.3s' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>Order #{order.id}</Typography>
            <Typography color="text.secondary">Customer: {order.customerName}</Typography>
            <Typography color="text.secondary" variant="body2">{order.shippingAddress}</Typography>
          </Box>
          {getStatusChip(order.status)}
        </Box>

        <Paper sx={{ mb: 2, p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">{product.quantity}</TableCell>
                  <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                  <TableCell align="right">${(product.price * product.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>Total:</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  ${calculateOrderTotal(order.products).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <CalendarIcon sx={{ mr: 1, fontSize: 'small' }} />
            {new Date(order.orderDate).toLocaleDateString()}
          </Box>

          {order.status === 'pending' && (
            <Button 
              variant="contained"
              color="error"
              onClick={() => handleCancelOrder(order.id)}
            >
              Cancel Order
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const filterOrders = () => {
    const filters = ['all', 'pending', 'delivered', 'cancelled'];
    const currentFilter = filters[currentTab];
    return currentFilter === 'all' 
      ? orders 
      : orders.filter(order => order.status === currentFilter);
  };

  return (
    <Box sx={{ maxWidth: '4xl', mx: 'auto', p: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4 }}>
        Orders Dashboard
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="All Orders" />
          <Tab label="Pending" />
          <Tab label="Delivered" />
          <Tab label="Cancelled" />
        </Tabs>
      </Paper>

      {filterOrders().map(order => (
        <OrderCard key={order.id} order={order} />
      ))}

      {orders.length === 0 && (
        <Alert severity="info">
          No orders found.
        </Alert>
      )}
    </Box>
  );
};

export default OrdersDashboard;