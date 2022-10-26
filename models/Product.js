const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  product_name: {
    type: String,
    required: [true, "Must Enter Product Name"],
  },
  product_description: {
    type: String,
  },
  product_price: {
    type: Number,
    required: [true, "Must Enter Product Price"],
  },
  product_brand: {
    type: String,
  },
  category: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Product", productSchema);
