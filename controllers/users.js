const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
exports.login = async (req, res,next) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email: email }).select("+password");
      // because select:false for password to select password we use select(+password)
  
      if (!user) {
        return res.status(400).json({
          message: "user not exist",
        });
      } else {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(400).json({
            message: "Incorrect Password",
          });
        } else {
          const token = jwt.sign(
            {
              _id: user._id,
              name: user.name,
              email: user.email,
            },
            config.get("hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe")
          );
          return res
            .status(200)
            .cookie("token", token, {
              expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
              httpOnly: true,
            })
            .json({
              user,
              token,
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

  exports.registration = async (req, res, next) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
          });
    }
  }