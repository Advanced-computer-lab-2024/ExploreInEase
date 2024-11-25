require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/components/users/userRoutes');
const eventRoutes = require('./src/components/events/eventRoutes');
const checkoutRoutes = require('./src/components/checkouts/checkoutsRoutes');
const setupSwaggerDocs = require('../backend/src/swagger/swagger');
const { authenticateToken } = require('../backend/src/middlewares/authenticateToken');
 

// Express app
const ACLapp = express();

// Middleware to parse JSON
ACLapp.use(express.json());

// Logging middleware (optional, just for debugging)
ACLapp.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});


// ACLapp.use(authenticateToken);


// Routes
ACLapp.use('/api', userRoutes);
ACLapp.use('/api', eventRoutes);
ACLapp.use('/api', checkoutRoutes);

// Setup Swagger
setupSwaggerDocs(ACLapp); // Add Swagger setup here

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Start listening for requests
        ACLapp.listen(process.env.PORT, () => {
            console.log(`Connected to DB & listening on port ${process.env.PORT}`);
            console.log(`Swagger docs available at http://localhost:${process.env.PORT}/api-docs`); // Log Swagger docs URL
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
    });
