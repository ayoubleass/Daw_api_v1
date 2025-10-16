
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
	  openapi: '3.0.0',
	  info: {
		      title: 'DAW API',
		      version: '1.0.0',
		      description: 'Digital Audio Workstation Project Management API',
		      contact: {
			            name: 'API Support',
			            email: '',
			          },
		    },
	  servers: [
		      {
			            url: 'http://localhost:3000',
			            description: 'Development server',
			          },
		    ],
	  components: {
		      schemas: {
			    User: {
				    type: 'object',
				    required: ['email', 'password'],
				    properties: {
					      _id: {
								  type: 'string',
								  description: 'Auto-generated user ID',
								},
					      email: {
								  type: 'string',
								  description: 'User email',
								},
					      password: {
								  type: 'string',
								  description: 'User password',
								},
					    },
			  },
			  },
		    },
};

const options = {
	  swaggerDefinition,
	  apis: ['./controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
