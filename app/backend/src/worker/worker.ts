import { setTimeout } from "node:timers/promises";
import { db } from "../db/client";

const MAX_RETRIES = 3;

async function worker() {
    while (true) {
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

        console.log("Picked job:", job.name);

        // queued → running
        await db.orm.public.Job
            .where({
                id: job.id
            })
            .update({
                status: "running"
            });

        console.log("Job is running:", job.name);

        try {
            // Temporary job processing
            await setTimeout(3000);

            // Temporary failure test
            throw new Error("Job processing failed");

            // This won't execute during failure testing
            await db.orm.public.Job
                .where({
                    id: job.id
                })
                .update({
                    status: "completed"
                });

            console.log("Job completed:", job.name);

        } catch (error) {
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