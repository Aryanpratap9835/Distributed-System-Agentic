import { redis } from "../redis/client";

const EVENT_CHANNEL = "taskmesh:events";

export async function publishEvent(
    type: string,
    data: unknown
) {

    const message = JSON.stringify({

        type,

        data
    });


    await redis.publish(
        EVENT_CHANNEL,
        message
    );


    console.log(
        "Event published:",
        type
    );
}