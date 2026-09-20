import { db } from "../db/client"
import { Temporal } from "temporal-polyfill"
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

            console.log("Worker marked Dead:", worker.name);
        }
    }
}
setInterval(() => {
    deadworkerDetector();
}, 5000);