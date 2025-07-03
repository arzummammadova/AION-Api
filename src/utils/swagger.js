import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AION - timer API',
      version: '1.0.0',
      description: 'muasir timer  üçün API sənədi',
    },
    servers: [
        { url: 'http://localhost:5000' },
        { url: 'https://aion-api.onrender.com' }
      ],
      
  },
  apis: ['./src/routers/*.js'], // Swagger üçün hansı faylları oxusun
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
