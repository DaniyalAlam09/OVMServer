const express = require("express");
const router = express.Router();
const { createBrand, getBrands, getBrand } = require("../../controllers/Brand");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/", isAuthenticated, createBrand);
router.get("/", getBrands);
router.get("/:categoryId", getBrand);

module.exports = router;
