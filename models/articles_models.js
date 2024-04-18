const db = require("../db/connection")
const {fetchAllTopics} = require("../models/topics_models")
const {displayResultWithLimitAndPage} = require("./utils")

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

function fetchAllArticles(topic,sort_by="created_at",order="desc",limit,p){
    
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
        let articles = rows;

        if( topic && !topics.some((topicObj) => {return topicObj.slug === topic})){
            return Promise.reject({ status: 400, msg: "Bad request!"})
        }
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: "There is no article under this topic."})
        }

        let total_count = rows.length
        
        if(limit || p){
            if( (limit && isNaN(Number(limit))) || (p && isNaN(Number(p))) ){
                return Promise.reject({status:400, msg: "Bad request!"})
            }
            articles = displayResultWithLimitAndPage(rows,limit,p)
            if(articles.length === 0){
                return Promise.reject({status: 404, msg: "Not found"})
            }
            return ({total_count,articles})
        }

        return {articles} 
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

function addArticle(articleRequestObj){
    const {author, title, body, topic, article_img_url} = articleRequestObj;
    
    if(body === '' || title === ''){
        return Promise.reject({ status: 400, msg: "You can't post empty title or empty article!"})
    }
    const insertVal = [title,topic,author,body,article_img_url]
    if(article_img_url){
        sqlString = `INSERT INTO articles (title,topic,author,body ,article_img_url) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
        
    }else{
        sqlString = `INSERT INTO articles (title,topic,author,body) VALUES ($1,$2,$3,$4) RETURNING *;`
        insertVal.pop()
    }
    return db.query(sqlString,insertVal)
    .then(({rows})=>{
        const newArticle = rows[0];
        //Method 1---set comment_count as 0 since it is newly created article
        newArticle.comment_count = 0;
        return newArticle
        //Method 2 use this article_id and the function fetchArticleById()
        // return fetchArticleById(newArticle.article_id)
    })   
}

function removeArticleById(article_id){
    const articleSqlString = `DELETE FROM articles WHERE article_id=$1 RETURNING *;`;
    const commentSqlString = `DELETE FROM comments WHERE article_id=$1 RETURNING *;`
    return db.query(commentSqlString,[article_id])
    .then(({rows})=>{
        return db.query(articleSqlString,[article_id])
    })
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: "article_id not found"})
        }
    })
}


module.exports = { fetchArticleById, fetchAllArticles,checkArticleIDExists, updateArticleById, addArticle, removeArticleById }