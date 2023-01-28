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
  singleShopProducts,
  verifyLink,
  forgetPassword,
  resetPassword,
  resetPasswordSet,
  getMyOrders,
  updateOrder,
} = require("../../controllers/ShopOwners");
const { isAuthenticated } = require("../../middlewares/auth");
const { isShopOwner } = require("../../middlewares/isShopOwner");

router.post("/registration", register);
router.get("/:id/verify/:token/", verifyLink);
router.post("/forgot-password", forgetPassword);
router.get("/reset-password/:id/:token", resetPassword);
router.post("/reset-password/:id/:token", resetPasswordSet);
router.post("/login", login);
router.get("/viewproducts", viewProducts);
router.get("/shopowner", isAuthenticated, isShopOwner, myProfile);
router.get("/getshoporder", isAuthenticated, isShopOwner, getMyOrders);
router.get("/myproducts", isAuthenticated, isShopOwner, getMyProducts);
router.get("/shopproducts/:id", singleShopProducts);
router.get("/deleteproduct/:id", isAuthenticated, isShopOwner, deleteProduct);

router.get("/:id", getSigleShopOwner);
router.put("/updateprofile/:id", isAuthenticated, isShopOwner, updateProfile);
router.put("/update/:id", updateOrder);

module.exports = router;
