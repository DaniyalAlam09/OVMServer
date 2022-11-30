const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
module.exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });

    let id = cart.items[0].productId;
    const pro = await Product.findById(id);
    const order = await Order.create({
      userId,
      shopOwnerId: pro.owner,
      items: pro,
      bill: cart.bill,
    });

    console.log(order);

    return res.status(201).send(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports.getOrderProducts = async (req, res) => {
  const userId = req.user._id;
  console.log(req.user._id);
  try {
    let order = await Order.findOne({ userId });
    if (order && order.items.length > 0) {
      res.send(order);
    } else {
      res.send(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  } 
};
