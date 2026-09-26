
import "temporal-polyfill/full/global";
import { startEventSubscriber } from "./events/eventSubscriber";
import dotenv from "dotenv";
import path from "path";

import express from "express";

import { connectRedis } from "./redis/client";
import { createConsumerGroup } from "./queue/redisQueue";

import router from "./routes/job.routes";
import eventRouter from "./routes/eventroutes";

import { errorHandler } from "./middleware/error.middleware";

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

dotenv.config();

const app = express();

app.use(express.json());

// Job routes
app.use("/jobs", router);

// SSE events
app.use("/events", eventRouter);

// Test route
app.post("/test", (req, res) => {
    res.json({
        message: "TEST POST WORKS",
    });
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
    });
});

// Error handler must be last
app.use(errorHandler);

async function startServer() {
    await connectRedis();

    await createConsumerGroup();

    await startEventSubscriber();

    app.listen(3000, () => {
        console.log(
            "Project is Running on http://localhost:3000"
        );
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
