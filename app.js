const express = require("express");
const app = express();
const {getAllTopics} = require("./controllers/topics_controllers")



app.use(express.json());

app.get("/api/topics", getAllTopics)

app.get("*",(req,res,next) => {
    res.status(404).send({ msg: "Route does not exist" })
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app