import { db } from "../db/client";
type CreateJobInput = {
    name: string;
};
export async function createNewJob(jobdata: CreateJobInput) {
    const newJob = await db.orm.public.Job.create({
        name: jobdata.name,
        status: "queued",
        priority: "medium",
    });

    return newJob;
}
export async function getALLjobs() {
    const jobs = await db.orm.public.Job.all();

    return jobs;
}