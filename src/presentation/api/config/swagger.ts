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
      schemas: {
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
  },
  apis: ["./src/presentation/api/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
