const express = require("express");
const { getCartProducts, addToCart } = require("../../controllers/Cart");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/auth");

router.get("/cart", isAuthenticated, getCartProducts);
router.post("/cart", isAuthenticated, addToCart);
// router.delete("/cart/:userId/:itemId", cartController.delete_item);

module.exports = router;
