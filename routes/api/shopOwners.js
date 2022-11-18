const express = require("express");

const router = express.Router();
const {
  register,
  login,
  viewProducts,
  myProfile,
} = require("../../controllers/ShopOwners");
const { isAuthenticated } = require("../../middlewares/auth");
const { isShopOwner } = require("../../middlewares/isShopOwner");

router.post("/registration", register);
router.post("/login", login);
router.get("/viewproducts", viewProducts);
router.get("/shopowner", isAuthenticated, isShopOwner, myProfile);

module.exports = router;
