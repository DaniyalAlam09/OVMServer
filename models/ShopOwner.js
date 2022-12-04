const mongoose = require("mongoose");

const shopOwnerSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: [true, "Please Enter a Email"],
    unique: [true, "Email already exists"],
  },
  image: {
    url: String,
  },
  password: {
    type: String,
    required: [true, "Please Enter a Password"],
    minLength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  shopName: { type: String, required: [true, "Please Enter a shop Name"] },
  shopNo: { type: String, required: [true, "Please Enter a shop Numner"] },
  floor: { type: Number, required: [true, "Please Enter a floor number"] },
  phone: { type: Number },
  catagorey: String,
  role: { type: String, default: "shopowner" },
  verified: { type: Boolean, default: false },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  shopImage: { type: String },
});
module.exports = mongoose.model("ShopOwner", shopOwnerSchema);
