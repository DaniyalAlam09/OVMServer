const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: [true, "Please Enter a Name"],
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
  role: String,
  
});
module.exports = mongoose.model("User", userSchema);