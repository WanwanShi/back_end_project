const {fetchAllTopics, addTopic} = require("../models/topics_models")

function getAllTopics (req,res,next) {
    fetchAllTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next)
}

function postTopic(req, res, next){
    const newTopicObj = req.body;
    addTopic(newTopicObj).then((topic)=> {
        res.status(201).send({topic})
    })
    .catch(next)
}

module.exports = {getAllTopics, postTopic}