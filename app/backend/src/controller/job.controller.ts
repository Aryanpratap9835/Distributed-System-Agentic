import { Request, Response, NextFunction } from "express";
import { getALLjobs, createNewJob } from "../services/job.services";
import { errorHandler } from "../middleware/error.middleware";

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobdata = await getALLjobs();
        res.json({
            jobdata
        });
    } catch (error) {
        next(error);
    }
};

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
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