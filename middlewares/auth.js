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
    let user = await jwt.verify(token, config.get("jwtPrivateKey")); //when we sign token we give it user values now decode that values
    if (user.role === "user") {
      req.user = await User.findById(user._id);
    }
    req.user = await ShopOwner.findById(user._id);
  } catch (err) {
    return res.status(401).send(err.message);
  }
  next();
};
