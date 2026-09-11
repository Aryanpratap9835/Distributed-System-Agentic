import { Request, Response } from "express";
import { getALLjobs, createNewJob } from "../services/job.services";

export const getJobs = (req: Request, res: Response) => {
    const jobdata = getALLjobs();
    res.json({
        jobdata
    })
}
export const createJob = (req: Request, res: Response) => {
    const jobs = createNewJob(req.body);
    res.status(201).json({
        message: "job Created",
        jobs
    })
}