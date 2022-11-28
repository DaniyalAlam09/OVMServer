const Category = require("../models/Category");

exports.createCategory = async (req, res, next) => {
  try {
    const newCatData = {
      name: req.body.name,
      imageUrl: req.body.imageUrl,
    };
    const newCat = await Category.create(newCatData);
    return res.status(200).json({
      success: true,
      category: newCat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    // const search = req.query.search || "";
    // const page = Number(req.query.page) - 1 || 0;
    // const limit = Number(req.query.limit) || 10;
    const categories = await Category.find({});

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    // console.log(categories[0].name);
    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
