import express from "express";
import { validationHandler } from "../middleware/validation.middleware";
import { getJobs, createJob, retryJob } from "../controller/job.controller";
import { ratelimit } from "../middleware/ratelimiter.middleware";
const router = express.Router();

router.get("/", getJobs);
router.post("/", ratelimit, validationHandler, createJob);
router.post("/:id/retry", retryJob);

export default router;