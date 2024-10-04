require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/components/users/userRoutes');
const eventRoutes = require('./src/components/events/eventRoutes');
const checkoutRoutes = require('./src/components/checkouts/checkoutsRoutes') 
const setupSwaggerDocs = require('../backend/src/swagger/swagger');
 

// Express app
const ACLapp = express();

// Middleware to parse JSON
ACLapp.use(express.json());

ACLapp.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Routes
ACLapp.use(userRoutes);
ACLapp.use(eventRoutes);
ACLapp.use(checkoutRoutes);
// Setup Swagger
setupSwaggerDocs(ACLapp); 

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
