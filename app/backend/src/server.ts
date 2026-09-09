import express from 'express';

const app = express();
app.get("/", (req, res) => {
    res.send("TaskMesh API IS RUNNING");
});
app.listen(3000, () => {
    console.log("TaskMesh backend is running at 3000");
})
