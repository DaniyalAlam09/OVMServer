const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategory,
} = require("../../controllers/Categories");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/", isAuthenticated, createCategory);
router.get("/", getCategories);
router.get("/:categoryId", getCategory);

module.exports = router;
