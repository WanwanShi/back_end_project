const usersRouter = require("express").Router();
const { getAllUsers } = require("../controllers/users_controllers")

usersRouter
.route("/")
.get(getAllUsers);



module.exports = usersRouter;