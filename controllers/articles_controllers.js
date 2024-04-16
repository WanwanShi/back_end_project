const articles = require("../db/data/test-data/articles")
const {fetchArticleById,fetchAllArticles, updateArticleById} = require("../models/articles_models")

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

function patchArticleById(req, res, next){
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    updateArticleById(article_id, inc_votes).then((updatedArticle) => {
        res.status(200).send({updatedArticle})
    })
    .catch(next)
}


module.exports = {getArticleById, getAllArticles,patchArticleById}