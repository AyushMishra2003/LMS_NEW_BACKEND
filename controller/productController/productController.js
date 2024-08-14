import Product from "../../model/product.model.js";
import AppError from "../../utils/error.utlis.js";

const addProduct = async (req, res, next) => {
  try {
    const {
      productName,
      productPrice,
      productDiscount,
      productCategory,
      productSize,
      productColor,
    } = req.body;

    const product = await Product.create({
      productName,
      productPrice,
      productDiscount,
      productCategory,
      productSize,
      productColor,
    });

    if (!product) {
      return next(new AppError("Product Not Found", 500));
    }

    if (req.file) {
      console.log(req.file);
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });
      if (result) {
        (product.photo.public_id = result.public_id),
          (product.photo.secure_url = result.secure_url);
      }
      fs.rm(`uploads/${req.file.filename}`);
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product Added Succesfully",
      data: product,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.find({});

    if (!product) {
      return next(new AppError("Product Not Found", 400));
    }

    res.status(200).json({
      success: true,
      message: "Product Are:-",
      data: product,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return next(new AppError("Product Not Found", 400));
    }

    const updatedCourse = await Product.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });
      if (result) {
        (product.photo.public_id = result.public_id),
          (product.photo.secure_url = result.secure_url);
      }
      fs.rm(`uploads/${req.file.filename}`);
    }

    //   await updateBasicInfo.save()

    res.status(200).json({
      success: true,
      message: "Product Updated Succesfully",
      data: product,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return next(new AppError("Product Not Found", 400));
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product delete Succesfuly",
    });
  } catch (error) {}
};

export { addProduct, getProduct, updateProduct, deleteProduct };
