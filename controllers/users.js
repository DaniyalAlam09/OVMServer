const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
const validator = require("validator");

var nodemailer = require("nodemailer");

exports.login = async (req, res, next) => {
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
            role: "user",
          },
          config.get("jwtPrivateKey")
        );
        console.log(token);
        return res
          .status(200)
          .cookie("token", token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
          })
          .json({
            message: "success",
            token,
            user,
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

exports.register = async (req, res, next) => {
  try {
    let { email, password, firstName, lastName } = req.body;
    console.log(firstName);
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "user Already exist",
      });
    } else if (!email || !password) {
      return res.status(400).json({
        message: "All Feild must be filled",
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
      user = await User.create({
        email,
        password,
        firstName,
        lastName,
      });
      // user will automatacally login after registration

      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          role: "user",
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
          user,
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

exports.logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        message: "User logged Out",
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
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      user,
    });
  } catch (err) {}
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = config.get("jwtPrivateKey") + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:4000/users/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dannyalalam09@gmail.com",
        pass: "fvmultatpzjvmeqm",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.json({ status: `Email Sent to ${email} for verification` });
      }
    });
    console.log(link);
  } catch (error) {}
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = config.get("jwtPrivateKey") + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
};

exports.resetPasswordSet = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = config.get("jwtPrivateKey") + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
};
