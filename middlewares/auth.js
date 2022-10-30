const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const ShopOwner = require("../models/ShopOwner");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("please Login First");
    }
    let user = await jwt.verify(token, config.get("jwtPrivateKey"));
    if (user.role === "user") {
      req.user = await User.findById(user._id);
      // return token;
    } else {
      req.user = await ShopOwner.findById(user._id);
    }
  } catch (err) {
    return res.status(401).send(err.message);
  }
  next();
};
