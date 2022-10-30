const Product = require("../models/Product");
const ShopOwner = require("../models/ShopOwner");

exports.addProduct = async (req, res, next) => {
  try {
    const product = {
      product_name: req.body.product_name,
      product_description: req.body.product_description,
      product_price: req.body.product_price,
      product_brand: req.body.product_brand,
      category: req.body.category,
      owner: req.user._id,
    };
    const newProduct = await Product.create(product);
    const shopOwner = await ShopOwner.findById(req.user._id);
    shopOwner.products.push(newProduct._id);
    await shopOwner.save();
    return res
      .status(201)
      .json({ success: true, newProduct, message: "success" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
