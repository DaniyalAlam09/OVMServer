const mongoose = require("mongoose");
const subscriptionSchema = mongoose.Schema({
  email: {
    type: String,
  },
  date_added: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
