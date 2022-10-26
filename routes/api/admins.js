const express = require("express");
const router = express.Router();
const {
  viewCustomers,
  viewShopOwners,
  deleteCustomer,
} = require("../../controllers/Admins");

router.get("/viewcustomers", viewCustomers);
router.get("/viewshopowners", viewShopOwners);
router.delete("'/delete-customer/:id'", deleteCustomer);

module.exports = router;
