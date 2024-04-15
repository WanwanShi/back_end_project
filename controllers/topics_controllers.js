const {fetchAllTopics} = require("../models/topics_models")

function getAllTopics (req,res,next) {
    fetchAllTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next)
}

module.exports = {getAllTopics}