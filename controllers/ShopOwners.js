const ShopOwner = require("../models/ShopOwner");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
const validator = require("validator");

exports.register = async (req, res, next) => {
  try {
    let {
      firstName,
      lastName,
      email,
      password,
      shopName,
      shopNo,
      floor,
      phone,
      catagorey,
      image,
    } = req.body;
    let shopOwner = await ShopOwner.findOne({ email });

    if (shopOwner) {
      return res.status(400).json({
        message: "shopOwner Already exist",
      });
    } else if (!email || !password || !shopName || !shopNo || !phone) {
      return res.status(400).json({
        message: "Mandatory Feilds must be filled",
      });
    } else if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Email is not valid",
      });
    } else if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message: "password is not strong enough",
      });
    } else {
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      shopOwner = await ShopOwner.create({
        firstName,
        lastName,
        email,
        password,
        shopName,
        shopNo,
        floor,
        phone,
        catagorey,
        image,
      });
      // shopOwner will automatacally login after registration

      const token = jwt.sign(
        {
          _id: shopOwner._id,
          email: shopOwner.email,
        },
        config.get("jwtPrivateKey")
      );

      return res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .json({
          shopOwner,
          token,
          message: "success",
        });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
