import { redis } from "../redis/client";

export const JOB_STREAM = "taskmesh:jobs";
export const WORKER_GROUP = "taskmesh-workers";

export async function createConsumerGroup() {
    try {
        await redis.xGroupCreate(
            JOB_STREAM,
            WORKER_GROUP,
            "0",
            {
                MKSTREAM: true,
            }
        );

        console.log(
            `Consumer group "${WORKER_GROUP}" created`
        );

    } catch (error: any) {

        if (
            error?.message?.includes("BUSYGROUP")
        ) {
            console.log(
                `Consumer group "${WORKER_GROUP}" already exists`
            );

            return;
        }

        throw error;
    }
}

export async function enqueueJob(
    jobId: string
) {
    const messageId = await redis.xAdd(
        JOB_STREAM,
        "*",
        {
            jobId,
        }
    );

    console.log(
        `Job ${jobId} queued -> ${messageId}`
    );

    return messageId;
}