const {fetchCommentsByArticleId,addCommentByArticleId,removeCommentById} = require("../models/comments_models")

function getCommentsByArticleId(req, res, next){
    const {article_id} = req.params;
    fetchCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

function postCommentByArticleId(req, res, next){
    const { article_id } = req.params;
    const commentObject = req.body
    addCommentByArticleId(article_id,commentObject).then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

function deleteCommentById(req, res, next){
    const { comment_id } = req.params
    removeCommentById(comment_id).then(()=> {
        res.status(204).send()
    })
    .catch(next)
}

module.exports = {getCommentsByArticleId, postCommentByArticleId,deleteCommentById}