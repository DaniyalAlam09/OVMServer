const mongoose = require("mongoose");
const contactUSSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  subject: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model("ContactUS", contactUSSchema);
