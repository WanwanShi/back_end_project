const db = require("../db/connection")

function fetchAllTopics(){
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}

function addTopic(newTopicObj){
    const {slug, description} = newTopicObj;
    if(slug === ''){
        return Promise.reject({ status: 400, msg: "Bad request-topic name can not be empty"})
    }
    return db.query(`INSERT into topics (slug, description) VALUES ($1, $2) RETURNING *;`,[slug,description])
    .then(({rows}) => {
        return rows[0]
    })
}

module.exports = {fetchAllTopics,addTopic}