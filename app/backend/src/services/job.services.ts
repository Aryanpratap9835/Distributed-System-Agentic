type Job = {
    id: string,
    name: string,
    status: string
}
type CreateJobInput = {
    name: string
}
let jobCount = 3
let jobs: Job[] = [
    {
        id: "job-1",
        name: "Data-Processing",
        status: "queued"
    },
    {
        id: "job-2",
        name: "Debugger",
        status: "running",
    }

]
export const getALLjobs = (): Job[] => {

    return jobs;
};
export const createNewJob = (jobdata: CreateJobInput): Job => {
    console.log(jobdata);

    const newJob = {
        id: `job-${jobCount}`,
        name: jobdata.name,
        status: "queued"
    }
    jobCount++;


    jobs.push(newJob)
    return newJob;
}