
import { Request, Response, NextFunction } from "express";
import {
    getALLjobs,
    createNewJob,
    retryJobService
} from "../services/job.services";

export const getJobs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const jobdata = await getALLjobs();

        res.json({
            jobdata
        });
    } catch (error) {
        next(error);
    }
};

export const createJob = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log("1. createJob called");
        console.log("BODY:", req.body);

        const jobs = await createNewJob(req.body);

        console.log("2. Job created:", jobs);

        res.status(201).json({
            message: "job Created",
            jobs
        });
    } catch (error) {
        console.error("CREATE JOB ERROR:", error);

        res.status(500).json({
            message: "Create job failed",
            error: error instanceof Error
                ? error.message
                : String(error)
        });
    }
};
export const retryJob = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        const job = await retryJobService(id);

        res.json({
            message: "Job queued for retry",
            job
        });
    } catch (error) {
        next(error);
    }
};

