const express = require("express");
const multer = require("multer");
const {
  userLogin,
  userRegister,
  getUsers,
} = require("../controllers/usersController");

const upload = multer({ dest: "images/" });

const usersRouter = express.Router();

usersRouter.post("/login", userLogin);
usersRouter.post("/register", upload.single("image"), userRegister);
usersRouter.get("/list", getUsers);

module.exports = usersRouter;
