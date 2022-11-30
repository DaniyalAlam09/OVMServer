const express = require("express");
const { createOrder, getOrderProducts } = require("../../controllers/Order");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/auth");

router.get("/order", isAuthenticated, getOrderProducts);
router.post("/", isAuthenticated, createOrder);

module.exports = router;
