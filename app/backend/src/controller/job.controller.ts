
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
        const jobs = await createNewJob(req.body);

        res.status(201).json({
            message: "job Created",
            jobs
        });
    } catch (error) {
        next(error);
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

