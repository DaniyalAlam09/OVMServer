const Cart = require("../models/Cart");
const Products = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const config = require("config");
const stripe = require("stripe")(config.get("StripeAPIKey"));

module.exports.getCartProducts = async (req, res) => {
  const userId = req.user._id;
  console.log(req.user._id);
  try {
    let cart = await Cart.findOne({ userId });
    if (cart && cart.items.length > 0) {
      res.send(cart);
    } else {
      res.send(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId });
    let item = await Products.findOne({ _id: productId });
    if (!item) {
      res.status(404).send("Item not found!");
    }
    if (!userId) {
      res.status(404).send("Please Login First");
    }

    const price = item.product_price;
    const name = item.product_name;

    if (cart) {
      // if cart exists for the user
      let itemIndex = cart.items.findIndex((p) => p.productId == productId);

      // Check if product exists or not
      if (itemIndex > -1) {
        let productItem = cart.items[itemIndex];
        productItem.quantity += quantity;
        cart.items[itemIndex] = productItem;
      } else {
        cart.items.push({ productId, name, quantity, price });
      }
      cart.bill += quantity * price;
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      // no cart exists, create one
      const pr = quantity * price;
      const newCart = await Cart.create({
        userId,
        items: [{ productId, name, quantity, price }],
        bill: pr,
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports.deleteFromCart = async (req, res) => {
  const userId = req.user._id;
  console.log("djh");
  const productId = req.params.productId;
  try {
    let cart = await Cart.findOne({ userId: userId });
    console.log(cart);
    let itemIndex = cart.items.findIndex((p) => p.productId === productId);

    if (itemIndex > -1) {
      console.log(itemIndex);
      let productItem = cart.items[itemIndex];
      cart.bill -= productItem.quantity * productItem.price;
      cart.items.splice(itemIndex, 1);
    }
    cart = await cart.save();
    return res.status(201).send(cart);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Something went wrong");
  }
};

module.exports.getOrders = async (req, res) => {
  const userId = req.params.id;
  Order.find({ userId })
    .sort({ date: -1 })
    .then((orders) => res.json(orders));
};

module.exports.Checkout = async (req, res) => {
  try {
    const userId = req.params.id;
    const { source } = req.body;
    let cart = await Cart.findOne({ userId });
    let user = await User.findOne({ _id: userId });
    const email = user.email;
    if (cart) {
      const charge = await stripe.charges.create({
        amount: cart.bill,
        currency: "inr",
        source: source,
        receipt_email: email,
      });
      if (!charge) throw Error("Payment failed");
      if (charge) {
        const order = await Order.create({
          userId,
          items: cart.items,
          bill: cart.bill,
        });
        const data = await Cart.findByIdAndDelete({ _id: cart.id });
        return res.status(201).send(order);
      }
    } else {
      res.status(500).send("You do not have items in cart");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
