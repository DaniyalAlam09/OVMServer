const Brand = require("../models/Brand");

exports.createBrand = async (req, res, next) => {
  try {
    const newBrandData = {
      name: req.body.name,
    };
    const newBrand = await Brand.create(newBrandData);
    return res.status(200).json({
      success: true,
      brands: newBrand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBrands = async (req, res, next) => {
  try {
    // const search = req.query.search || "";
    // const page = Number(req.query.page) - 1 || 0;
    // const limit = Number(req.query.limit) || 10;
    const brand = await Brand.find({});

    return res.status(200).json({
      success: true,
      brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getBrand = async (req, res, next) => {
  try {
    const brands = await Brand.findById(req.params.brandsId);
    // console.log(brand[0].name);
    return res.status(200).json({
      success: true,
      brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
