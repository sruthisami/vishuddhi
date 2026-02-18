import { Request, Response } from 'express';
import { serve } from "inngest/express";
import { inngest } from "./inngest/index";
import { functions as inngestFunctions} from "./inngest/functions";
import { logger } from "./utils/logger";
import { connectDB } from './utils/db';
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import chatRouter from "./routes/chat";
import moodRouter from "./routes/mood";
import activityRouter from "./routes/activity";

dotenv.config();

const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet()); //security middleware
app.use(morgan("dev")); //logging middleware
app.use("/auth", authRoutes); //auth routes
app.use("/chat", chatRouter); //chat routes
app.use("/api/mood", moodRouter); //mood routes
app.use("/api/activity", activityRouter); //activity routes


const PORT = process.env.PORT || 3001;


app.use("/api/inngest", serve({ client: inngest, functions : inngestFunctions }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.get("/api/chat", (req: Request, res: Response) => { 
    res.send("Chat endpoint");
})

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Then start the server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(
        `Inngest endpoint available at http://localhost:${PORT}/api/inngest`
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });