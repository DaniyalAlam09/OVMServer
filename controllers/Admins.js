const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");

const User = require("../models/User");
const ShopOwner = require("../models/ShopOwner");

exports.viewCustomers = async (req, res) => {
  try {
    User.find((err, doc) => {
      if (err) return console.log(err);
      res.json(doc);
    });
  } catch (err) {}
};
exports.viewShopOwners = async (req, res) => {
  try {
    ShopOwner.find((err, doc) => {
      if (err) return console.log(err);
      res.json(doc);
    });
  } catch (err) {}
};

exports.deleteCustomer = async (req, res, next) => {
  User.findByIdAndRemove(req.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
};
