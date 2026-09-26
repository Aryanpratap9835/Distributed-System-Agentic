import { setTimeout } from "node:timers/promises";
import { db } from "../db/client";
import { Temporal } from "temporal-polyfill";

import {
    connectRedis,
    redis,
} from "../redis/client";

import {
    JOB_STREAM,
    WORKER_GROUP,
} from "../queue/redisQueue";

import {
    publishEvent,
} from "../events/eventsPublisher";

const MAX_RETRIES = 3;

const WORKER_NAME =
    `worker-${process.pid}`;

let running = true;

async function registerWorker() {

    const worker =
        await db.orm.public.worker.create({
            name: WORKER_NAME,
            status: "healthy",
            lastHeartbeat:
                Temporal.Now.instant(),
        });

    console.log(
        "Worker registered:",
        worker
    );

    await publishEvent(
        "worker-registered",
        {
            workerId: worker.id,
            name: worker.name,
            status: "healthy",
        }
    );

    return worker;
} async function sendHeartbeat(
    workerId: string
) {
    try {

        await db.orm.public.worker
            .where({
                id: workerId,
            })
            .update({
                lastHeartbeat:
                    Temporal.Now.instant(),

                status: "healthy",
            });

    } catch (error) {

        console.error(
            "Heartbeat failed:",
            error
        );
    }
}