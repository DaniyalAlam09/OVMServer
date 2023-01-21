const express = require("express");

const router = express.Router();
const {
  addProduct,
  getSigleProduct,
  createReview,
  updateProduct,
  viewProducts,
  commentProduct,
  badProducts,
} = require("../../controllers/Products");
const { isAuthenticated } = require("../../middlewares/auth");
const { isShopOwner } = require("../../middlewares/isShopOwner");

const multer = require("multer");
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
  isAuthenticated,
  isShopOwner,
  upload.single("product"),
  addProduct
);
router.get("/:id", getSigleProduct);
router.get("/", viewProducts);
router.put("/updateProduct/:id", updateProduct);
router.post("/review/:id", isAuthenticated, createReview);
router.post("/sentiment", commentProduct);
router.post("/bad", badProducts);

module.exports = router;
