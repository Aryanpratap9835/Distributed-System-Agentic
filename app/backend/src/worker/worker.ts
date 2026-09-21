import { setTimeout } from "node:timers/promises";
import { db } from "../db/client";
import { Temporal } from "temporal-polyfill";

const MAX_RETRIES = 3;
async function registerWorker() {
    const worker = await db.orm.public.worker.create({
        name: `worker-${process.pid}`,
        status: "healthy",
        lastHeartbeat: Temporal.Now.instant()

    });
    console.log("Worker Register :", worker);
    return worker;
}
async function sendheartbeat(workerId: string) {
    await db.orm.public.worker.where({
        id: workerId
    })
        .update({
            lastHeartbeat: Temporal.Now.instant(),
            status: "healthy"
        });
    console.log("HeartBeat sent ", workerId)

}
async function worker() {
    const workerData = await registerWorker();
    setInterval(() => {
        sendheartbeat(workerData.id)
    }, 5000)
    while (true) {
        // 1. Find a queued job
        const jobs = await db.orm.public.Job
            .where({
                status: "queued"
            })
            .all();
        const job = jobs[0];

        if (!job) {
            await setTimeout(1000);
            continue;
        }

        // TEMPORARY: deliberately create a race

        console.log("Picked job:", job.name);

        // 2. Atomically claim the job
        // Only succeeds if the job is STILL queued
        const result = await db.orm.public.Job
            .where({
                id: job.id,
                status: "queued"
            })
            .update({
                status: "running",
                workerId: workerData.id
            });

        console.log("CLAIM RESULT:", result);

        // 3. If another worker already claimed it,
        // don't process the job.
        if (!result) {
            console.log("Failed to claim job:", job.name);
            continue;
        }

        console.log("Claimed job:", job.name);

        try {
            // 4. Process the job
            await setTimeout(30000);

            // Temporary failure test:
            // throw new Error("Job processing failed");

            // 5. Job completed
            await db.orm.public.Job
                .where({
                    id: job.id
                })
                .update({
                    status: "completed"
                });

            console.log("Job completed:", job.name);

        } catch (error) {

            // 6. Retry
            if (job.retryCount < MAX_RETRIES) {

                await db.orm.public.Job
                    .where({
                        id: job.id
                    })
                    .update({
                        retryCount: job.retryCount + 1,
                        status: "queued"
                    });

                console.log("Retrying job:", job.name);

            } else {

                // 7. Move to DLQ
                await db.orm.public.Job
                    .where({
                        id: job.id
                    })
                    .update({
                        status: "dead_letter"
                    });

                console.log("Job moved to DLQ:", job.name);
            }
        }
    }
}

worker();
