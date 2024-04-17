const topicsRouter = require("express").Router();
const {getAllTopics} = require("../controllers/topics_controllers")

topicsRouter
.route("/")
.get(getAllTopics);

module.exports = topicsRouter