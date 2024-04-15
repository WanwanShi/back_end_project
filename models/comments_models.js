const db = require("../db/connection");
const { at } = require("../db/data/test-data/articles");


function fetchCommentsByArticleId(article_id){
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status:404, msg: "Not found"})
        }
        return rows;
    })
}

function updateCommentByArticleId(article_id, commentObject){
    const {username, body} = commentObject
    if(body === ""){
        return Promise.reject({status: 400, msg: "Bad request-The comment is empty"})
    }
    return db.query(`INSERT into comments (body, article_id,author) VALUES ($1,$2,$3) RETURNING *`, [body,article_id,username])
    .then(({rows}) => {
        const {author, body} = rows[0]
        const comment = {author, body}
        return comment;
    })
}
module.exports = { fetchCommentsByArticleId, updateCommentByArticleId }