const db = require("../db/connection");
const { checkArticleIDExists } = require("./articles_models");


function fetchCommentsByArticleId(article_id){
    
    return Promise.all([db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id]),checkArticleIDExists(article_id)])
    .then(([{rows}]) => {
            if(rows.length === 0){
                return Promise.reject({ status:200, msg: "There is no comment for this article"})
            }
            return rows;
        })  
}

function addCommentByArticleId(article_id, commentObject){
    const {username, body} = commentObject
    if(body === ""){
        return Promise.reject({status: 400, msg: "Bad request-The comment is empty"})
    }
    return db.query(`INSERT into comments (body, article_id,author) VALUES ($1,$2,$3) RETURNING *`, [body,article_id,username])
    .then(({rows}) => {
        return rows[0];
    })
}

function removeCommentById(comment_id){
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "comment_id not found"})
        }
    })
}

module.exports = { fetchCommentsByArticleId, addCommentByArticleId,removeCommentById }