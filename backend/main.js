// Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { router: userRoutes, setDBConnection } = require('./src/components/users/userRoutes');
const checkoutRoutes = require('./src/components/checkouts/checkoutsRoutes');

const complaintRoutes = require('./src/components/complaints/complaintRoutes');


const fs = require('fs'); // Import filesystem module

// const cors = require('cors');

const eventRoutes = require('./src/components/events/eventRoutes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config({ path: 'src/.env' });
const { GridFSBucket, ObjectId } = require('mongodb'); // Ensure ObjectId is imported
const multer = require('multer'); // Import multer for file uploads
const Users = require('./src/models/user'); // Import Users model
const path = require('path');



// Initialize Express app
const ACLapp = express();

// Middleware to enable CORS and handle JSON requests
ACLapp.use(cors());
ACLapp.use(express.json());



// Routes
ACLapp.use(userRoutes);
ACLapp.use(eventRoutes);
ACLapp.use(checkoutRoutes);
ACLapp.use(complaintRoutes);


// MongoDB connection string from environment variables
const mongoURI = process.env.MONGO_URI;

// Variables to store MongoDB connection and GridFS bucket
let db;
let bucket;


// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Connect to MongoDB and initialize GridFS
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        db = mongoose.connection.db;
        bucket = new GridFSBucket(db, { bucketName: 'documents' });
        setDBConnection(db); // Pass DB to other modules if needed
        console.log('MongoDB connected and GridFS initialized');

        ACLapp.listen(process.env.PORT || 3030, () => {
            console.log(`Server running on port ${process.env.PORT || 3030}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Upload Document Endpoint
ACLapp.post('/uploadDocument/:userId', upload.single('file'), async (req, res) => {
    try {
        const { userId } = req.params;
        const { docType } = req.body; // Document type from request body
        const file = req.file; // File from Multer
        console.log(req.body);
        console.log(docType, file)
        // Validate that both 'docType' and 'file' are provided
        if (!docType || !file) {
            return res.status(400).json({ error: 'Both docType and file are required' });
        }

        // Find user by ID
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!bucket) {
            return res.status(500).json({ error: 'GridFSBucket not initialized' });
        }

        // Upload the file using the buffer from Multer
        const uploadStream = bucket.openUploadStream(file.originalname);
        uploadStream.end(file.buffer);

        uploadStream
            .on('error', (error) => {
                return res.status(500).json({ error: 'Error uploading file' });
            })
            .on('finish', async () => {
                // Save the file reference in the user's document based on docType
                switch (docType) {
                    case 'nationalId':
                        user.documents.nationalId = uploadStream.id;
                        break;
                    case 'certificate':
                        user.documents.certificate = uploadStream.id;
                        break;
                    case 'taxRegistry':
                        user.documents.taxation = uploadStream.id;
                        break;
                    default:
                        return res.status(400).json({ error: 'Invalid document type' });
                }

                await user.save();
                return res.status(201).json({ message: 'File uploaded successfully', fileId: uploadStream.id });
            });
    } catch (error) {
        console.error('Error in uploadDocument:', error);
        return res.status(500).json({ error: 'Error uploading document' });
    }
});



// Download Document Endpoint
ACLapp.get('/viewDocument/:fileId', (req, res) => {
    const fileId = req.params.fileId; // Get the fileId from the URL

    // Ensure fileId is a valid MongoDB ObjectId
    if (!ObjectId.isValid(fileId)) {
        return res.status(400).json({ message: 'Invalid file ID' });
    }

    // Create a download stream
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId)); // Use new ObjectId()

    downloadStream.on('error', (error) => {
        console.error('Download error:', error);
        return res.status(404).json({ message: 'File not found' });
    });

    downloadStream.on('data', (chunk) => {
        res.write(chunk); // Write chunks of data to the response
    });

    downloadStream.on('end', () => {
        res.end(); // End the response when the download is complete
    });
});

ACLapp.use('/images', express.static(path.join(__dirname, 'src', 'components', 'images')));

ACLapp.use(userRoutes);
ACLapp.use(eventRoutes);
ACLapp.use(checkoutRoutes);

// Swagger configuration options
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'ACL Project API',
            version: '1.0.0',
            description: 'API documentation for the ACL project',
        },
        servers: [
            {
                url: 'http://localhost:3030',
            },
        ],
    },
    apis: ['./src/swagger/swagger.js'], // Path to Swagger docs
};

// Initialize Swagger docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);
ACLapp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Export ACLapp and bucket for use in other modules
module.exports = { ACLapp, bucket };
