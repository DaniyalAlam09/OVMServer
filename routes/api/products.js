const express = require("express");
const router = express.Router();
const { addProduct } = require("../../controllers/Products");
const { isAuthenticated } = require("../../middlewares/auth");
const { isShopOwner } = require("../../middlewares/isShopOwner");

router.post("/add-product", isAuthenticated, isShopOwner, addProduct);

module.exports = router;
