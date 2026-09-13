import express from "express"
import { getJobs, createJob } from "../controller/job.controller";
import { validationHandler } from "../middleware/validation.middleware";
const router = express.Router();
router.get("/", getJobs);
router.post("/", validationHandler, createJob);
export default router