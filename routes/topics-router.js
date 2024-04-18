const topicsRouter = require("express").Router();
const {getAllTopics, postTopic} = require("../controllers/topics_controllers")

topicsRouter
.route("/")
.get(getAllTopics)
.post(postTopic);

module.exports = topicsRouter