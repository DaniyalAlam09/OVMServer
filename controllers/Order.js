const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const stripe = require("stripe")(
  "sk_test_51MO12UBGAZ3oqEpyKVSteBr2g3ph1vvysCc3gTkdjJPxnyeuABNzT4dU2WjJ00pp0fcXqNhyokloM2kwiNJ5cAj50001EakTUy"
);
module.exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });
    let { fname, lname, email, phoneNo, address, postalCode } = req.body;

    cart.items.map(async (item) => {
      const pro = await Product.findById(item.productId);
      await Order.create({
        fname,
        lname,
        email,
        phoneNo,
        address,
        postalCode,
        userId,
        shopOwnerId: pro.owner,
        productId: pro._id,
        productName: pro.product_name,
        productImg: pro.product_image,
        items: pro,
        bill: cart.bill,
      });
    });

    return res.status(201).send("Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.getOrderProducts = async (req, res) => {
  const userId = req.user._id;
  try {
    let order = await Order.find({ userId: userId });

    if (!order) {
      return res.send("No Order");
    }
    return res.status(200).json(order.reverse());
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports.createPayment = async (req, res) => {
  const userId = req.user._id;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart && cart.items.length > 0) {
      // res.send(cart);
      const total = cart.bill;
      var newPayment = {
        amount: req.body.bill,
      };
      console.log("Payment Request recieved for this ruppess", total);
      await Order.findByIdAndUpdate(req.body._id, { payment: true });

      const payment = await stripe.paymentIntents.create({
        amount: total * 100,
        currency: "usd",
      });

      return res.status(201).send({
        clientSecret: payment.client_secret,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
