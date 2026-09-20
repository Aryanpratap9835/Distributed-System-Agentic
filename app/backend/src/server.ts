import "temporal-polyfill/full/global";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import express from "express";
import { errorHandler } from "./middleware/error.middleware";
import router from "./routes/job.routes";

const app = express();

app.use(express.json());
router.post("/:id/retry", (req, res) => {
    res.json({
        message: "Retry route works",
        id: req.params.id
    });
});
app.use("/jobs", router);
app.post("/test", (req, res) => {
    res.json({ message: "TEST POST WORKS" });
});
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});
router.post("/test", (req, res) => {
    res.json({ message: "JOB ROUTER WORKS" });
});

app.use(errorHandler)
app.listen(3000, () => {
    console.log("Project is Running");
});