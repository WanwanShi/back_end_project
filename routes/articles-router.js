const articlesRouter = require("express").Router();
const { getAllArticles, getArticleById, patchArticleById,postArticle, deleteArticleById } = require("../controllers/articles_controllers")
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments_controllers")

articlesRouter
.route("/")
.get(getAllArticles)
.post(postArticle);

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById)
.delete(deleteArticleById);

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentByArticleId);





module.exports = articlesRouter;