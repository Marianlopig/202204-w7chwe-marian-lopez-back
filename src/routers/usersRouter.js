const express = require("express");
const multer = require("multer");
const { userLogin, userRegister } = require("../controllers/usersController");

const upload = multer({ dest: "tmp_images/" });

const usersRouter = express.Router();

usersRouter.post("/login", userLogin);
usersRouter.post("/register", upload.single("image"), userRegister);

module.exports = usersRouter;
