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

app.use("/jobs", router);

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.use(errorHandler)
app.listen(3000, () => {
    console.log("Project is Running");
});