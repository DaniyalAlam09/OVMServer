const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  addProduct,
  getSigleProduct,
  createReview,
} = require("../../controllers/Products");
const { isAuthenticated } = require("../../middlewares/auth");
const { isShopOwner } = require("../../middlewares/isShopOwner");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

let upload = multer({ storage: storage });

router.post(
  "/add-product",
  upload.single("productImage"),
  isAuthenticated,
  isShopOwner,
  addProduct
);
router.get("/:id", getSigleProduct);
router.post("/review/:id", isAuthenticated, createReview);

module.exports = router;
