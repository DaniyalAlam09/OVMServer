const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
    select: false, // not select on select query
  },
  address: {
    type: String,
  },
  phoneNo: {
    type: Number,
    required: [true, "Please Enter a Phone No"],
  },
  profession: {
    type: String,
  },

  role: { type: String, default: "user" },
});
module.exports = mongoose.model("User", userSchema);
