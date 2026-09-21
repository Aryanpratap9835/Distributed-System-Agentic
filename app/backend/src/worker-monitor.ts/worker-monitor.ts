
import { db } from "../db/client"
import { Temporal } from "temporal-polyfill"
const MAX_RETRIES = 3;
async function deadworkerDetector() {
    const workers = await db.orm.public.worker.all();
    const now = Temporal.Now.instant();

    for (const worker of workers) {
        const heartbeatAge =
            now.epochMilliseconds -
            worker.lastHeartbeat.epochMilliseconds;

        console.log(
            "Checking:",
            worker.id,
            worker.name,
            worker.status,
            heartbeatAge
        );
        if (heartbeatAge > 15000 && worker.status === "healthy") {
            await db.orm.public.worker
                .where({
                    id: worker.id
                })
                .update({
                    status: "Dead"
                });

            const jobs = await db.orm.public.Job
                .where({
                    status: "running",
                    workerId: worker.id
                })
                .all();
            for (const job of jobs) {
                if (job.retryCount < MAX_RETRIES) {
                    await db.orm.public.Job.where({ id: job.id, status: "running", workerId: worker.id }).update({ status: "queued", workerId: null, retryCount: job.retryCount + 1 })
                } else {
                    await db.orm.public.Job.where({ id: job.id, status: "running", workerId: worker.id }).update({ status: "dead_letter", workerId: null })
                }
                console.log("Worker marked Dead:", worker.name);
            }
        }
    }
}
setInterval(() => {
    deadworkerDetector();
}, 5000);