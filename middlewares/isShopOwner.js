const jwt = require("jsonwebtoken");
const config = require("config");

exports.isShopOwner = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    let user = await jwt.verify(token, config.get("jwtPrivateKey")); //when we sign token we give it user values now decode that values
    if (user.role !== "shopowner") {
      return res.status(401).send("unAthorized");
    }
  } catch (err) {
    return res.status(401).send(err.message);
  }
  next();
};
