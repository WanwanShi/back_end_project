const db = require("../db/connection");
const { checkArticleIDExists } = require("./articles_models");

function fetchCommentsByArticleId(article_id, limit, p){
    let sqlString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;
    let queryVal = [article_id];
    
    if(limit){
        sqlString += ` LIMIT $2`;
        queryVal.push(limit);
        if(p){
            sqlString += ` OFFSET $3`;
            queryVal.push(p*limit-limit)
        }
    }else if(p) {
        sqlString += ` LIMIT 10 OFFSET $2`
        queryVal.push(p*10-10)
    }
    
    return Promise.all([db.query(sqlString, queryVal),checkArticleIDExists(article_id)])
    .then(([{rows}]) => {
        let comments = rows;
            if(rows.length === 0){
                if(!p){
                    return Promise.reject({ status:200, msg: "There is no comment for this article"})
                }else{
                    return Promise.reject({ status:200, msg: "There is no more comment for this article"})
                }
                
            }
        return comments;
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

function updateVotesByCommentId(comment_id, inc_votes){
    let sqlString = `UPDATE comments SET votes= votes+ $1 WHERE comment_id=$2 RETURNING *;`
    return db.query(sqlString, [inc_votes,comment_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: 'Comment_id not found'})
        }
        return rows[0]
    })
}

module.exports = { fetchCommentsByArticleId, addCommentByArticleId,removeCommentById, updateVotesByCommentId }