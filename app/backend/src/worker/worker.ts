import { setTimeout } from "node:timers/promises";
import { db } from "../db/client";
import { Temporal } from "temporal-polyfill";

import { connectRedis } from "../redis/client";
import { publishEvent } from "../events/eventsPublisher";

const MAX_RETRIES = 3;


// =====================================================
// 1. REGISTER WORKER
// =====================================================

async function registerWorker() {

    const worker = await db.orm.public.worker.create({
        name: `worker-${process.pid}`,
        status: "healthy",
        lastHeartbeat: Temporal.Now.instant()
    });

    console.log("Worker Registered:", worker);

    // Notify the system that a worker has joined
    await publishEvent("worker-registered", {
        workerId: worker.id,
        name: worker.name,
        status: "healthy"
    });

    return worker;
}


// =====================================================
// 2. SEND HEARTBEAT
// =====================================================

async function sendheartbeat(workerId: string) {

    await db.orm.public.worker
        .where({
            id: workerId
        })
        .update({
            lastHeartbeat: Temporal.Now.instant(),
            status: "healthy"
        });

    console.log(
        "Heartbeat sent:",
        workerId
    );
}


// =====================================================
// 3. WORKER
// =====================================================

async function worker() {

    // ---------------------------------------------
    // Register worker
    // ---------------------------------------------

    const workerData = await registerWorker();


    // ---------------------------------------------
    // Heartbeat every 5 seconds
    // ---------------------------------------------

    setInterval(() => {

        sendheartbeat(workerData.id)
            .catch((error) => {

                console.error(
                    "Heartbeat failed:",
                    error
                );

            });

    }, 5000);


    // ---------------------------------------------
    // Continuously look for jobs
    // ---------------------------------------------

    while (true) {

        // =========================================
        // 4. FIND ASSIGNED JOB
        // =========================================

        const jobs =
            await db.orm.public.Job
                .where({
                    status: "assigned",
                    workerId: workerData.id
                })
                .all();


        const job = jobs[0];


        // No job available
        if (!job) {

            await setTimeout(1000);

            continue;
        }


        console.log(
            "Picked job:",
            job.name
        );


        // =========================================
        // 5. ATOMICALLY CLAIM JOB
        // =========================================

        const result =
            await db.orm.public.Job
                .where({
                    id: job.id,
                    status: "assigned",
                    workerId: workerData.id
                })
                .update({
                    status: "running"
                });


        console.log(
            "CLAIM RESULT:",
            result
        );


        // Another worker may have claimed it
        if (!result) {

            console.log(
                "Failed to claim job:",
                job.name
            );

            continue;
        }


        console.log(
            "Claimed job:",
            job.name
        );


        // =========================================
        // 6. JOB RUNNING EVENT
        // =========================================

        await publishEvent(
            "job-running",
            {
                jobId: job.id,
                workerId: workerData.id,
                status: "running"
            }
        );


        try {

            // =====================================
            // 7. PROCESS JOB
            // =====================================

            // Normal testing
            await setTimeout(3000);


            // -------------------------------------
            // TEMPORARY FAILURE TEST
            // -------------------------------------

            // Uncomment this line when you want
            // to test retry / DLQ:
            //
            // throw new Error("Job processing failed");


            // =====================================
            // 8. MARK JOB COMPLETED
            // =====================================

            await db.orm.public.Job
                .where({
                    id: job.id,
                    status: "running"
                })
                .update({
                    status: "completed"
                });


            console.log(
                "Job completed:",
                job.name
            );


            // =====================================
            // 9. JOB COMPLETED EVENT
            // =====================================

            await publishEvent(
                "job-completed",
                {
                    jobId: job.id,
                    workerId: workerData.id,
                    status: "completed"
                }
            );


        } catch (error) {

            console.error(
                "Job failed:",
                job.name,
                error
            );


            // =====================================
            // 10. RETRY
            // =====================================

            if (job.retryCount < MAX_RETRIES) {

                const newRetryCount =
                    job.retryCount + 1;


                await db.orm.public.Job
                    .where({
                        id: job.id
                    })
                    .update({
                        retryCount: newRetryCount,
                        status: "queued",
                        workerId: null
                    });


                console.log(
                    "Retrying job:",
                    job.name,
                    "Retry:",
                    newRetryCount
                );


                // Retry event
                await publishEvent(
                    "job-retried",
                    {
                        jobId: job.id,
                        workerId: workerData.id,
                        retryCount: newRetryCount,
                        status: "queued"
                    }
                );


            } else {

                // =================================
                // 11. DEAD LETTER QUEUE
                // =================================

                await db.orm.public.Job
                    .where({
                        id: job.id
                    })
                    .update({
                        status: "dead_letter",
                        workerId: null
                    });


                console.log(
                    "Job moved to DLQ:",
                    job.name
                );


                // DLQ event
                await publishEvent(
                    "job-dead-letter",
                    {
                        jobId: job.id,
                        workerId: workerData.id,
                        status: "dead_letter"
                    }
                );
            }
        }
    }
}


// =====================================================
// 12. START WORKER
// =====================================================

async function startWorker() {

    // VERY IMPORTANT:
    // Worker is a separate Node process from Express.
    // Therefore it must create its own Redis connection.

    await connectRedis();

    console.log(
        "Worker Redis connection established"
    );


    await worker();
}


// =====================================================
// 13. START
// =====================================================

startWorker().catch((error) => {

    console.error(
        "Worker crashed:",
        error
    );

    process.exit(1);
});