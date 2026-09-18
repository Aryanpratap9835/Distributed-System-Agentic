
import { db } from "../db/client";
import { jobQueue } from "../queue/queue";

type CreateJobInput = {
    name: string;
};

export async function createNewJob(jobdata: CreateJobInput) {
    const newJob = await db.orm.public.Job.create({
        name: jobdata.name,
        status: "queued",
        priority: "medium",
    });

    jobQueue.enqueue(newJob);

    return newJob;
}

export async function getALLjobs() {
    const jobs = await db.orm.public.Job.all();

    return jobs;
}

export async function retryJobService(id: string) {
    const jobs = await db.orm.public.Job
        .where({
            id: id
        })
        .all();

    const job = jobs[0];

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.status !== "dead_letter") {
        throw new Error("Only dead letter jobs can be retried");
    }

    const updatedJob = await db.orm.public.Job
        .where({
            id: id
        })
        .update({
            status: "queued",
            retryCount: 0
        });

    return updatedJob;
}

