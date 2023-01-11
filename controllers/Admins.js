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

exports.deleteCustomer = (req, res) => {
  User.findByIdAndRemove({ _id: req.params.id }, function (err, user) {
    if (err) res.json(err);
    else res.json("User Deleted Successfully");
  });
};

exports.deleteShopOwner = (req, res) => {
  ShopOwner.findByIdAndRemove({ _id: req.params.id }, function (err, user) {
    if (err) res.json(err);
    else res.json("User Deleted Successfully");
  });
};
exports.blockShopOwner = async (req, res) => {
  const user = ShopOwner.findOne({ _id: req.params.id });
  try {
    await user.updateOne({ $set: { verified: false } });
    res.status(200).send({ message: "block succesfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log(error.message);
  }
};

exports.unBlockShopOwner = async (req, res) => {
  const user = ShopOwner.findOne({ _id: req.params.id });
  try {
    await user.updateOne({ $set: { verified: true } });
    res.status(200).send({ message: "unblock succesfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log(error.message);
  }
};
