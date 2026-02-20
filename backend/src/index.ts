import express, { Request, Response } from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest/index";
import { functions as inngestFunctions } from "./inngest/functions";
import { logger } from "./utils/logger";
import { connectDB } from "./utils/db";


import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Routes
import authRoutes from "./routes/auth";
import chatRouter from "./routes/chat";
import moodRouter from "./routes/mood";
import activityRouter from "./routes/activity";
import periodRouter from "./routes/period"; 
import journalRouter from "./routes/journal";


dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ================= ROUTES =================
app.use("/auth", authRoutes);
app.use("/chat", chatRouter);
app.use("/api/mood", moodRouter);
app.use("/api/activity", activityRouter);
app.use("/api/period", periodRouter); 
app.use("/api/journals", journalRouter);

// ================= INNGEST =================
app.use(
  "/api/inngest",
  serve({ client: inngest, functions: inngestFunctions })
);

// ================= HEALTH CHECK =================
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/api/chat", (req: Request, res: Response) => {
  res.send("Chat endpoint");
});

// ================= START SERVER =================
const startServer = async () => {
  try {
    // Connect DB first
    await connectDB();

    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(
        `Inngest endpoint: http://localhost:${PORT}/api/inngest`
      );
    });
  } catch (error) {
    logger.error(" Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
