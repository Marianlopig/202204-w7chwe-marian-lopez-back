require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../database/models/User");

const userLogin = async (req, res) => {
  const { username, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await User.findOne({ username, password: encryptedPassword });
  if (user) {
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
};

module.exports = { userLogin };
