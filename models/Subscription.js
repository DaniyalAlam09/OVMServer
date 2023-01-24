const mongoose = require("mongoose");
const subscriptionSchema = mongoose.Schema({
  email: {
    type: String,
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
