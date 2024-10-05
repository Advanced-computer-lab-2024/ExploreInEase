const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/components/users/userRoutes');
const eventRoutes = require('./src/components/events/eventRoutes');
const checkoutRoutes = require('./src/components/checkouts/checkoutsRoutes');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const fs = require('fs'); // Import filesystem module
require('dotenv').config({ path: "src/.env" });

// Express app
const ACLapp = express();

// Middleware to parse JSON
ACLapp.use(express.json());

// Logging middleware (optional, just for debugging)
ACLapp.use((req, res, next) => {
    next();
});

// Routes
ACLapp.use(userRoutes);
ACLapp.use(eventRoutes);
ACLapp.use(checkoutRoutes)

// Connect to MongoDB
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

    const swaggerOptions = {
        swaggerDefinition: {
            openapi: "3.0.0", // OpenAPI version
            info: {
                title: "User Registration API",
                version: "1.0.0",
                description: "API for ACL Project",
            },
            servers: [
                {
                    url: "http://localhost:3030", // Update to your server URL
                },
            ],
        },
        apis: ['./src/components/users/userRoutes.js', './src/components/events/eventRoutes.js', './src/components/checkouts/checkoutsRoutes.js'], // Path to the API docs
    };
    const swaggerDocs = swaggerJsDoc(swaggerOptions);

    // Serve swagger documentation
    ACLapp.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // fs.writeFileSync('./swagger.json', JSON.stringify(swaggerDocs, null, 2), (err) => {
    //     if (err) {
    //         console.error('Error writing swagger.json:', err);
    //     } else {
    //         console.log('swagger.json has been saved!');
    //     }
    // });