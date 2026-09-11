
import express from "express"
import router from "./routes/job.routes";
const app = express();
app.use(express.json());
app.use("/jobs", router)
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});
app.get("/", (req, res) => {
    res.send("IT IS RUNNING");
})
app.listen(3000, () => {
    console.log("Project is Running");
})