import { db } from "../db/client";
import { RoundRobin } from "./roundrobin";

export class Dispatcher {
    private roundRobin: RoundRobin;

    constructor() {
        this.roundRobin = new RoundRobin([]);
    }

    async dispatcher() {
        // 1. Get healthy workers
        const workers = await db.orm.public.worker
            .where({ status: "healthy" })
            .all();

        // 2. Extract worker IDs
        const workerIds = workers.map(worker => worker.id);

        // 3. Create Round Robin using healthy workers
        this.roundRobin.setWorker(workerIds);

        // 4. Get queued jobs
        const jobs = await db.orm.public.Job
            .where({ status: "queued" })
            .all();

        // 5. Assign each queued job
        for (const job of jobs) {

            // Ask Round Robin for next worker
            const workerId = this.roundRobin.next();

            // No healthy worker available
            if (!workerId) {
                console.log("No worker available");
                break;
            }

            // IMPORTANT:
            // Update ONLY this particular job
            await db.orm.public.Job
                .where({
                    id: job.id,
                    status: "queued"
                })
                .update({
                    status: "assigned",
                    workerId: workerId
                });

            console.log(
                `Job ${job.name} assigned to worker ${workerId}`
            );
        }
    }
}

const dispatcher = new Dispatcher();

setInterval(() => {
    dispatcher.dispatcher();
}, 3000);