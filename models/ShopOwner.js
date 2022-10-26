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
  shopNo: { type: Number, required: [true, "Please Enter a shop Numner"] },
  floor: { type: Number, required: [true, "Please Enter a floor number"] },
  phone: { type: Number, required: [true, "Please Enter a phone number"] },
  catagorey: String,
  role: { type: String, default: "shopowner" },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});
module.exports = mongoose.model("ShopOwner", shopOwnerSchema);
