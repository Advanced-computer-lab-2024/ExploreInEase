const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/components/users/userRoutes');
const eventRoutes = require('./src/components/events/eventRoutes');
const checkoutRoutes = require('./src/components/checkouts/checkoutsRoutes')

require('dotenv').config({ path: ".env" });

// Express app
const ACLapp = express();

// Middleware to parse JSON
ACLapp.use(express.json());

// Logging middleware (optional, just for debugging)
ACLapp.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Routes
ACLapp.use('/', userRoutes);
ACLapp.use('/', eventRoutes);
ACLapp.use('/', checkoutRoutes);

// Connect to MongoDB
console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Start listening for requests
        ACLapp.listen(process.env.PORT, () => {
            console.log(`Connected to DB & listening on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
    });