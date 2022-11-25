const express = require("express");
const { Checkout, getOrders } = require("../../controllers/Cart");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/auth");

router.get("/order/:id", isAuthenticated, getOrders);
router.post("/order/:id", Checkout);

module.exports = router;
