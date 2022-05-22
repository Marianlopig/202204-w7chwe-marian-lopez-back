require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const User = require("../database/models/User");

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      const rightPassword = await bcrypt.compare(password, user.password);
      if (rightPassword) {
        const token = jwt.sign(
          // eslint-disable-next-line no-underscore-dangle
          { id: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "2d" }
        );
        res.status(200).json({ token });
      } else {
        res.status(401).json({ msg: "bad request" });
      }
    } else {
      res.status(401).json({ msg: "bad request" });
    }
  } catch (e) {
    res.status(500).json({ error: "error" });
  }
};

const userRegister = async (req, res, next) => {
  const { username, password, name } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    const error = new Error();
    error.code = 409;
    error.message = "user already exists";
    next(error);
    return;
  }

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      username,
      password: encryptedPassword,
    };
    debugger;
    const { file } = req;
    if (file) {
      const newFileName = `${Date.now()}-${file.originalname}`;
      fs.rename(
        path.join("tmp_images", file.filename),
        path.join("images", newFileName),
        (error) => {
          if (error) {
            next(error);
          }
        }
      );
      newUser.image = path.join(newFileName);
    }

    const savedUser = await User.create(newUser);

    // eslint-disable-next-line no-underscore-dangle
    res.status(201).json({ username: savedUser.username, id: savedUser._id });
  } catch (error) {
    error.statusCode = 400;
    error.customMessage = "wrong user data";

    next(error);
  }
};

module.exports = { userLogin, userRegister };
