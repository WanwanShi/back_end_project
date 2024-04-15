const db = require("../db/connection")

function fetchArticleById(article_id){
    return db.query(`SELECT * FROM articles
                    WHERE article_id = $1; 
                    `,[article_id])
            .then(({rows}) => {
                if(rows.length === 0){
                    return Promise.reject({ status: 404, msg: "Not found"})
                }
                return rows[0]
            })
}

function fetchAllArticles(){
    return db.query(`SELECT  articles.article_id, articles.title, articles.author,articles.topic, articles.created_at,articles.votes,articles.article_img_url, COUNT(*)::INT AS  comment_count
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`)
    .then(({rows} )=> {
        return rows
    })
}

module.exports = { fetchArticleById, fetchAllArticles }