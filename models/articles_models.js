const db = require("../db/connection")
const {fetchAllTopics} = require("../models/topics_models")

function fetchArticleById(article_id){
    const sqlString = `SELECT  articles.article_id, articles.title, articles.author,articles.topic,articles.body, articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.body)::INT AS  comment_count
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`

    return db.query(sqlString 
                    ,[article_id])
            .then(({rows}) => {
                if(rows.length === 0){
                    return Promise.reject({ status: 404, msg: "Not found"})
                }
                return rows[0]
            })
}

function fetchAllArticles(topic,sort_by="created_at",order="desc"){
    
    const sortByGreenList = ["article_id", "title", "topic", "author","created_at","votes","body"];
    const orderGreenList = ["desc", "asc"];

    if(!sortByGreenList.includes(sort_by)){
        return Promise.reject({status: 400, msg: "Bad request-Invalid sort_by query!" })
    }

    if(!orderGreenList.includes(order)){
        return Promise.reject({status: 400, msg: "Bad request-Invalid order query!" })
    }
    
    let sqlString = `SELECT  articles.article_id, articles.title, articles.author,articles.topic, articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.body)::INT AS  comment_count
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id`;

    let queryVal = [];
    if(topic){
        sqlString += ` WHERE topic= $1`;
        queryVal.push(topic);
    }

    sqlString += ` GROUP BY articles.article_id`
    

    sqlString += ` ORDER BY articles.${sort_by} ${order};`
    
    return Promise.all([db.query(sqlString,queryVal),fetchAllTopics()])
    .then(([{rows},topics])=> {
        
        if( topic && !topics.some((topicObj) => {return topicObj.slug === topic})){
            return Promise.reject({ status: 400, msg: "Bad request!"})
        }
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: "There is no article under this topic."})
        }
        return rows
    })
}

function checkArticleIDExists(article_id){
    return db.query(`SELECT * FROM articles
    WHERE article_id = $1; 
    `,[article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article_id not found"})
        }
    })
}

function updateArticleById(article_id, inc_votes){
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes,article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: 'Article_id not found'})
        }
        const updatedArticle = rows[0];
        if(updatedArticle.votes < 0){
            updatedArticle.votes = 0
        }
        return updatedArticle
    })
}
module.exports = { fetchArticleById, fetchAllArticles,checkArticleIDExists, updateArticleById }