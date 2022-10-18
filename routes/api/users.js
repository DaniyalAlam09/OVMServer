const express = require("express");
const router = express.Router();
const {
  login,
  register,
  logout,
  myProfile,
} = require("../../controllers/users");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/login", login);
router.post("/registration", register);
router.get("/logout", logout);
router.get("/user", isAuthenticated, myProfile);

module.exports = router;
