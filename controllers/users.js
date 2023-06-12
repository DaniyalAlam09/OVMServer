const User = require("../models/User");
const Subscription = require("../models/Subscription");
const ContactUS = require("../models/ContactUS");
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

    if (!email) {
      return res.status(400).json({
        message: "Please Enter Email",
      });
    } else if (!email || !password) {
      return res.status(400).json({
        message: "Please Enter Password",
      });
    } else if (!user) {
      return res.status(400).json({
        message: "User not exist",
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
    let { email, password, firstName, lastName, address, phoneNo, city } =
      req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "user Already exist",
      });
    } else if (!email || !password || !phoneNo) {
      return res.status(400).json({
        message: "All required Feild must be filled",
      });
    } else if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Email is not valid",
      });
    } else if (phoneNo.length < 10 || phoneNo.length > 10) {
      return res.status(400).json({
        message: "Phone No is not valid",
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
        address,
        phoneNo,
        city,
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

exports.updateProfile = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, req.body);
  const newuser = await User.findById(req.user._id);
  return res.send(newuser);
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
    const link = `https://red-gorgeous-bandicoot.cyclic.app/users/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "onlinevirtualmall09@gmail.com",
        pass: "wlgkftaccqrmplxr",
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
        res.json({ status: `Email Sent to ${email} for Reset Your Password` });
      }
    });
    console.log(link);
  } catch (error) {}
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
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

exports.getSigleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.subscription = async (req, res, next) => {
  try {
    const subscriptionData = {
      email: req.body.email,
    };
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Please Enter Email To Get latest News",
      });
    } else {
      const newsuscription = await Subscription.create(subscriptionData);
      return res.status(200).json({
        success: true,
        subscriptions: newsuscription,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.contactUs = async (req, res, next) => {
  try {
    const contactForm = {
      email: req.body.email,
      firstName: req.body.firstName,
      message: req.body.message,
      subject: req.body.subject,
      lastName: req.body.lastName,
    };
    const { email, firstName, message } = req.body;
    if ((!email, !firstName, !message)) {
      return res.status(400).json({
        message: "Please Fill the Data",
      });
    } else if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Email is not valid",
      });
    } else {
      const newContactForm = await ContactUS.create(contactForm);
      return res.status(200).json({
        success: true,
        contacts: newContactForm,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
