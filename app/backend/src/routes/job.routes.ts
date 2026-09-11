import express from "express"
import { getJobs, createJob } from "../controller/job.controller";
const router = express.Router();
router.get("/", getJobs);
router.post("/", createJob);
export default router