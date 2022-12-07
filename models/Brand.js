const mongoose = require("mongoose");
const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Brand", brandSchema);
