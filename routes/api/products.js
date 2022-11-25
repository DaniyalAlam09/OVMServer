const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  addProduct,
  getSigleProduct,
  createReview,
  updateProduct,
} = require("../../controllers/Products");
const { isAuthenticated } = require("../../middlewares/auth");
const { isShopOwner } = require("../../middlewares/isShopOwner");

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public/images/uploaded/products");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${Date.now() + file.originalname.split(" ").join("-")}`);
  },
});
let upload = multer({ storage });

router.post(
  "/add-product",
  upload.single("productImage"),
  isAuthenticated,
  isShopOwner,
  addProduct
);
router.get("/:id", getSigleProduct);
router.put("/updateProduct/:id", updateProduct);
router.post("/review/:id", isAuthenticated, createReview);

module.exports = router;
