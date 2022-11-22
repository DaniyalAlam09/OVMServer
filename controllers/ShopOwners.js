const ShopOwner = require("../models/ShopOwner");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
const validator = require("validator");
const Products = require("../models/Product");

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
          role: "shopowner",
        },
        config.get("jwtPrivateKey")
      );

      return res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          httpOnly: true,
          secure: false,
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

exports.login = async (req, res, next) => {
  try {
    console.log("ldsli");
    const { email, password } = req.body;

    const shopowner = await ShopOwner.findOne({ email: email }).select(
      "+password"
    );
    // because select:false for password to select password we use select(+password)

    if (!shopowner) {
      return res.status(400).json({
        message: "shopowner not exist",
      });
    } else {
      const validPassword = await bcrypt.compare(password, shopowner.password);
      if (!validPassword) {
        return res.status(400).json({
          message: "Incorrect Password",
        });
      } else {
        const token = jwt.sign(
          {
            _id: shopowner._id,
            name: shopowner.name,
            email: shopowner.email,
            role: "shopowner",
          },
          config.get("jwtPrivateKey")
        );
        console.log(token);
        return res
          .status(200)
          .cookie("token", token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          })
          .json({
            message: "success",
            token,
            shopowner,
          });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.viewProducts = async (req, res) => {
  try {
    Products.find((err, doc) => {
      if (err) return console.log(err);
      res.json(doc);
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.myProfile = async (req, res) => {
  try {
    const user = await ShopOwner.findById(req.user._id);
    return res.status(200).json({
      user,
    });
  } catch (err) {}
};

exports.getMyProducts = async (req, res, next) => {
  try {
    const user = await ShopOwner.findById(req.user._id);
    const products = [];

    for (let i = 0; i < user.products.length; i++) {
      const product = await Products.findById(user.products[i]);
      products.push(product);
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = (req, res) => {
  Products.findByIdAndRemove({ _id: req.params.id }, function (err, user) {
    if (err) res.json(err);
    else res.json("Product Deleted Successfully");
  });
};
