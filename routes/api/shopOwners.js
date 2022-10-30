const express = require("express");
const router = express.Router();
const {
  register,
  login,
  viewProducts,
} = require("../../controllers/ShopOwners");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/registration", register);
router.post("/login", login);
router.get("/viewproducts", viewProducts);

module.exports = router;
