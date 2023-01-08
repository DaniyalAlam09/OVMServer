const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  shopOwnerId: {
    type: String,
  },
  productName: {
    type: String,
  },
  items: [
    {
      productId: {
        type: String,
      },
      name: String,
      // quantity: {
      //   type: Number,
      //   required: true,
      //   min: [1, "Quantity can not be less then 1."],
      // },
      price: Number,
    },
  ],
  // firstName: {
  //   type: String,
  //   required: true,
  // },
  // lasttName: {
  //   type: String,
  //   required: true,
  // },
  // phone: {
  //   type: Number,
  //   required: true,
  // },
  // email: {
  //   type: String,
  // },
  // address: {
  //   type: String,
  //   required: true,
  // },
  // state: {
  //   type: String,
  // },
  // postalCode: {
  //   type: String,
  //   required: true,
  // },
  // address: {
  //   type: String,
  //   required: true,
  // },
  bill: {
    type: Number,
    required: true,
  },
  date_added: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending",
  },
});

module.exports = mongoose.model("Order", OrderSchema);
