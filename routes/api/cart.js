const express = require("express");
const {
  getCartProducts,
  addToCart,
  deleteFromCart,
  deleteCart,
} = require("../../controllers/Cart");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/auth");

router.get("/cart", isAuthenticated, getCartProducts);
router.post("/cart", isAuthenticated, addToCart);
router.delete("/cart/delete", isAuthenticated, deleteCart);
router.delete("/cart/:productId", isAuthenticated, deleteFromCart);
// router.delete("/cart/:userId/:itemId", cartController.delete_item);

module.exports = router;
