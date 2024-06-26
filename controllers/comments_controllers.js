const {fetchCommentsByArticleId, addCommentByArticleId, removeCommentById, updateVotesByCommentId} = require("../models/comments_models")

function getCommentsByArticleId(req, res, next){
    const {article_id} = req.params;
    const {limit,p} = req.query
    fetchCommentsByArticleId(article_id,limit,p).then((comments) => {
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

function patchVotesByCommentId(req, res, next){
    const {inc_votes } = req.body;
    const {comment_id} = req.params;
    updateVotesByCommentId(comment_id, inc_votes).then((updatedComment) => {
        res.status(200).send({updatedComment})
    })
    .catch(next)
}

module.exports = {getCommentsByArticleId, postCommentByArticleId,deleteCommentById, patchVotesByCommentId}