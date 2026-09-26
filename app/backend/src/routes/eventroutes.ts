import express from "express";
import { eventBus } from "../events/eventBus";

const router = express.Router();

router.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    console.log("SSE client connected");

    const sendEvent = (event: {
        type: string;
        data: unknown;
    }) => {
        res.write(`event: ${event.type}\n`);
        res.write(`data: ${JSON.stringify(event.data)}\n\n`);
    };

    eventBus.on("event", sendEvent);

    req.on("close", () => {
        console.log("SSE client disconnected");

        eventBus.off("event", sendEvent);
    });
});

export default router;