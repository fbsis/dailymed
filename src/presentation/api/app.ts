import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import drugRoutes from "./routes/drugRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/drugs", drugRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use(notFoundHandler);

export default app;
