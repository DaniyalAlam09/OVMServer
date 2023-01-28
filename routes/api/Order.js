const express = require("express");
const {
  createOrder,
  getOrderProducts,
  createPayment,
} = require("../../controllers/Order");
const { updateOrder } = require("../../controllers/ShopOwners");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/auth");

router.get("/order", isAuthenticated, getOrderProducts);
router.post("/", isAuthenticated, createOrder);

router.post("/payment/create", isAuthenticated, createPayment);

module.exports = router;
