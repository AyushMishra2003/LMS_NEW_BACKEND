import { model, Schema } from "mongoose";

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productPhoto: {
    public_id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  productPrice: {
    type: Number,
  },
  productDiscount: {
    type: Number,
  },
  productCategory: {
    type: String,
    required: true,
    enum: ["Women", "Men", "Child"],
  },
  productSize: {
    type: String,
    required: true,
    enum: ["S", "M", "XL", "L", "XXL"],
  },
  productColor: {
    type: String,
    required: true,
    enum: ["Red", "Green", "Black", "Blue"],
  },
});

const Product = model("AdmazierProducts", productSchema);

export default Product;
