import { redis } from "../redis/client";
import { eventBus } from "./eventBus";

const EVENT_CHANNEL = "taskmesh:events";

export async function startEventSubscriber() {
    const subscriber = redis.duplicate();

    subscriber.on("error", (error) => {
        console.error("Redis subscriber error:", error);
    });

    await subscriber.connect();

    await subscriber.subscribe(
        EVENT_CHANNEL,
        (message) => {
            try {
                const event = JSON.parse(message);

                console.log(
                    "Received Redis event:",
                    event
                );

                eventBus.emit("event", event);
            } catch (error) {
                console.error(
                    "Invalid Redis event:",
                    error
                );
            }
        }
    );

    console.log(
        `Subscribed to Redis channel: ${EVENT_CHANNEL}`
    );
}