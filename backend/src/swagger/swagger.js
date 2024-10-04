const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ACL API Documentation',
      version: '1.0.0',
      description: 'API Documentation for the ACL Node.js project',
      contact: {
        name: 'Your Name',
        email: 'youremail@example.com',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT}/api`,
          description: 'Development server',
        },
      ],
    },
  },
  apis: ['./src/components/users/userRoutes.js', './src/components/events/eventRoutes.js', './src/components/checkouts/checkoutsRoutes.js'], // Specify paths to files where routes are defined
};

// Swagger documentation setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwaggerDocs;
