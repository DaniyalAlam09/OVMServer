const express = require("express");
const router = express.Router();
const {
  login,
  register,
  logout,
  myProfile,
  forgetPassword,
  resetPassword,
  resetPasswordSet,
  updateProfile,
  getSigleUser,
} = require("../../controllers/users");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/login", login);
router.post("/registration", register);
router.get("/user", isAuthenticated, myProfile);
router.get("/logout", logout);
router.post("/forgot-password", forgetPassword);
router.get("/reset-password/:id/:token", resetPassword);
router.post("/reset-password/:id/:token", resetPasswordSet);
router.put("/updateprofile/:id", isAuthenticated, updateProfile);
router.get("/:id", getSigleUser);

module.exports = router;
