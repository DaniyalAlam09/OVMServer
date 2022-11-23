const express = require("express");

const router = express.Router();
const {
  register,
  login,
  viewProducts,
  myProfile,
  getMyProducts,
  deleteProduct,
  updateProfile,
  getSigleShopOwner,
} = require("../../controllers/ShopOwners");
const { isAuthenticated } = require("../../middlewares/auth");
const { isShopOwner } = require("../../middlewares/isShopOwner");

router.post("/registration", register);
router.post("/login", login);
router.get("/viewproducts", viewProducts);
router.get("/shopowner", isAuthenticated, isShopOwner, myProfile);
router.get("/myproducts", isAuthenticated, isShopOwner, getMyProducts);
router.get("/deleteproduct/:id", deleteProduct);

router.get("/:id", getSigleShopOwner);
router.put("/updateprofile/:id", isAuthenticated, isShopOwner, updateProfile);

module.exports = router;
