const apiRouter = require("express").Router();
const { getAllEndpoints } = require("../controllers/endpoints_controllers")
const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router")
const commentsRouter = require("./comments-router")
const usersRouter = require("./users-router")

apiRouter.get("/", getAllEndpoints);

apiRouter.use("/articles", articlesRouter)
apiRouter.use("/topics", topicsRouter)
apiRouter.use("/comments", commentsRouter)
apiRouter.use("/users", usersRouter)


module.exports = apiRouter