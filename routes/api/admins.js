const express = require("express");
const router = express.Router();
const {
  viewCustomers,
  viewShopOwners,
  deleteCustomer,
  deleteShopOwner,
  blockShopOwner,
  unBlockShopOwner,
} = require("../../controllers/Admins");

router.get("/viewcustomers", viewCustomers);
router.get("/viewshopowners", viewShopOwners);
router.delete("/deleteuser/:id", deleteCustomer);
router.get("/deleteshopowner/:id", deleteShopOwner);
router.post("/block/:id", blockShopOwner);
router.post("/unblock/:id", unBlockShopOwner);

module.exports = router;
