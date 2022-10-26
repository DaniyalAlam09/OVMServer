const express = require("express");
const router = express.Router();
const { register } = require("../../controllers/ShopOwners");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/registration", register);

module.exports = router;
