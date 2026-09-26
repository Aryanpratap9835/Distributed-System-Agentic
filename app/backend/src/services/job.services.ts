import { db } from "../db/client";
import { enqueueJob } from "../queue/redisQueue";
import { publishEvent } from "../events/eventsPublisher";

type CreateJobInput = {
    name: string;
};

export async function createNewJob(jobdata: CreateJobInput) {
    const newJob = await db.orm.public.Job.create({
        name: jobdata.name,
        status: "queued",
        priority: "medium",
        retryCount: 0,
        workerId: null,
    });

    // Put job into the real execution queue
    await enqueueJob(newJob.id);

    await publishEvent("job-created", {
        jobId: newJob.id,
        name: newJob.name,
        status: newJob.status,
    });

    return newJob;
}

export async function getALLjobs() {
    return await db.orm.public.Job.all();
}

export async function retryJobService(id: string) {
    const jobs = await db.orm.public.Job
        .where({ id })
        .all();

    const job = jobs[0];

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.status !== "dead_letter") {
        throw new Error(
            "Only dead letter jobs can be manually retried"
        );
    }

    /*
     * Reset the job first.
     */
    const updatedJob = await db.orm.public.Job
        .where({
            id,
            status: "dead_letter",
        })
        .update({
            status: "queued",
            retryCount: 0,
            workerId: null,
        });

    if (!updatedJob) {
        throw new Error(
            "Job could not be moved back to queue"
        );
    }

    /*
     * Put it back into the real execution queue.
     */
    await enqueueJob(id);

    await publishEvent("job-retried", {
        jobId: id,
        retryCount: 0,
        status: "queued",
    });

    return updatedJob;
}