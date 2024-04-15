const articles = require("../db/data/test-data/articles")
const {fetchArticleById,fetchAllArticles} = require("../models/articles_models")

function getArticleById(req,res,next){
    const{ article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

function getAllArticles(req, res, next){
    fetchAllArticles().then((articles) => {
        res.status(200).send(articles)
    })
}

module.exports = {getArticleById, getAllArticles}