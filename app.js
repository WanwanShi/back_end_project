const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topics_controllers")
const { getAllEndpoints } = require("./controllers/endpoints_controllers")
const { getArticleById, getAllArticles } = require("./controllers/articles_controllers")
const { getCommentsByArticleId,postCommentByArticleId } = require("./controllers/comments_controllers")

app.use(express.json());

app.get("/api",getAllEndpoints)

app.get("/api/topics", getAllTopics)

app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId )
app.post("/api/articles/:article_id/comments", postCommentByArticleId )


app.get("*",(req,res,next) => {
    res.status(404).send({ msg: "Route does not exist" })
})


app.use((err, req, res, next) => {
    if ( ["22P02","23502"].includes(err.code) ) {
        res.status(400).send({msg: "Bad request!"});
    } 
    if(err.code === "23503"){
        res.status(404).send({msg: "Not found"});
    }else {
        next(err);
    }
});
app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({msg: err.msg});
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app