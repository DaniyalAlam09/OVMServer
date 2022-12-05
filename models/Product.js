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
  product_color: {
    type: String,
  },
  product_stoke: {
    type: Number,
    required: [true, "Must Enter Product Stoke"],
  },
  category: {
    type: String,
    required: [true, "Must Enter Product Catagorey"],
  },
  product_image: {
    type: String,
    required: [true, "Must Enter Product Image"],
  },
  product_sku: {
    type: String,
    required: [true, "Must Enter Product SKU"],
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        // required: true,
      },
    },
    { timestamps: true },
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Product", productSchema);
