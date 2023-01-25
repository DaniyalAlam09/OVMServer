const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const stripe = require("stripe")(
  "sk_test_51MNbzESG2rFLRrIMPgFYpbyi2tirlvIgwjfzhb3dALWOEjIRIcijdS6mA3A29Mn134GWCqh19IYqfd0CL6z5vaGZ00pgawt77c"
);
module.exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });
    let { fname, lname, email, phoneNo, address, postalCode } = req.body;
    console.log(cart);

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
        productName: pro.product_name,
        productImg: pro.product_image,
        items: pro,
        bill: cart.bill,
      });
    });

    let id = cart.items[0].productId;

    // const pro = await Product.findById(id);
    // const order = await Order.create({
    //   fname,
    //   lname,
    //   email,
    //   phoneNo,
    //   address,
    //   postalCode,
    //   userId,
    //   shopOwnerId: pro.owner,
    //   productName: pro.product_name,
    //   productImg: pro.product_image,
    //   items: pro,
    //   bill: cart.bill,
    // });

    return res.status(201).send("ok");
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
    return res.status(200).json(order);
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
      console.log("Payment Request recieved for this ruppess", total);

      const payment = await stripe.paymentIntents.create({
        amount: total * 100,
        currency: "pkr",
      });

      return res.status(201).send({
        clientSecret: payment.client_secret,
      });
    } else {
      res.send(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
