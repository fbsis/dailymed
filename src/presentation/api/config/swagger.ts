import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Drug API",
      version: "1.0.0",
      description: "API for managing drug information",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { 
              type: "string",
              enum: ["admin", "normal"]
            }
          }
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                role: { type: "string" }
              }
            }
          }
        },
        Drug: {
          type: "object",
          properties: {
            name: { type: "string" },
            identificationCode: { type: "string", format: "uuid" },
            indications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
            dosage: {
              type: "object",
              properties: {
                value: { type: "string" },
                unit: { type: "string" },
              },
            },
          },
        },
        CreateDrugRequest: {
          type: "object",
          required: ["name", "identificationCode", "indications", "dosage"],
          properties: {
            name: { type: "string" },
            identificationCode: { type: "string", format: "uuid" },
            indications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
            dosage: {
              type: "object",
              properties: {
                value: { type: "string" },
                unit: { type: "string" },
              },
            },
          },
        },
        UpdateDrugRequest: {
          type: "object",
          properties: {
            name: { type: "string" },
            identificationCode: { type: "string", format: "uuid" },
            indications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
            dosage: {
              type: "object",
              properties: {
                value: { type: "string" },
                unit: { type: "string" },
              },
            },
          },
        },
      },
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ["./src/presentation/api/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
