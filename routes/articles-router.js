const articlesRouter = require("express").Router();
const { getAllArticles, getArticleById, patchArticleById } = require("../controllers/articles_controllers")
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments_controllers")

articlesRouter
.route("/")
.get(getAllArticles);

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById);

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentByArticleId);





module.exports = articlesRouter;