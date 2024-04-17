const commentsRouter = require("express").Router();
const { deleteCommentById, patchVotesByCommentId } = require("../controllers/comments_controllers")

commentsRouter
.route("/:comment_id")
.patch(patchVotesByCommentId)
.delete(deleteCommentById);

module.exports = commentsRouter;