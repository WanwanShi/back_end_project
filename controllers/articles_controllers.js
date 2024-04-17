
const {fetchArticleById,fetchAllArticles, updateArticleById,addArticle} = require("../models/articles_models")

function getArticleById(req,res,next){
    const{ article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

function getAllArticles(req, res, next){
    const { topic,sort_by,order}  = req.query
    fetchAllArticles(topic,sort_by,order).then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

function patchArticleById(req, res, next){
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    updateArticleById(article_id, inc_votes).then((updatedArticle) => {
        res.status(200).send({updatedArticle})
    })
    .catch(next)
}

function postArticle(req, res, next){
    const articleRequestObj = req.body
    addArticle(articleRequestObj).then((article) => {
        res.status(201).send({article})
    })
    .catch(next)
}


module.exports = {getArticleById, getAllArticles,patchArticleById, postArticle}