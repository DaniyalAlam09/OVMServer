const express = require("express");
const router = express.Router();
const {
  viewCustomers,
  viewShopOwners,
  deleteCustomer,
  deleteShopOwner,
} = require("../../controllers/Admins");

router.get("/viewcustomers", viewCustomers);
router.get("/viewshopowners", viewShopOwners);
router.get("/deleteuser/:id", deleteCustomer);
router.get("/deleteshopowner/:id", deleteShopOwner);

module.exports = router;
