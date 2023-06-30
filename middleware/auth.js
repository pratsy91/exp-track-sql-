const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const userId = jwt.verify(token, process.env.TOKEN_SECRET);

    User.findByPk(userId.id).then((user) => {
      req.user = user;
      console.log("authbody>>>>>", req.user);
      next();
    });
  } catch (error) {
    return res.status(401).json({ success: false });
  }
};

module.exports = {
  authenticate,
};
