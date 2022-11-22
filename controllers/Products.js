const Product = require("../models/Product");
const ShopOwner = require("../models/ShopOwner");

exports.addProduct = async (req, res, next) => {
  try {
    console.log(req.body);

    let product = new Product(req.body);
    if (req.file) product.image = req.file.filename;
    // res.send(product);
    await product.save();
    //
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

exports.getSigleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.createReview = async (req, res, next) => {
  try {
    let alreadyReviewed = false;
    let owner = false;
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "Comment and Rating is Required" });
    }
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }
    if (product.owner.toString() === req.user._id.toString()) {
      return res.json({
        success: false,
        message: "You Can't Review your Own Product",
      });
    }

    if (product) {
      alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );
    }
    if (alreadyReviewed) {
      return res.json({ success: false, message: "Already Reviewed" });
    }
    const review = {
      name: req.user.firstName + " " + req.user.lastName,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: "Review added" });
  } catch (error) {
    console.log("in cTXH");
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res, next) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  const newproduct = await Product.findById(req.params.id);

  return res.send(newproduct);
};
