import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../controller/productController/productController.js";
import upload from "../middleware/multer.middleware.js";

const productRoute = Router();

productRoute.post("/", upload.single("productPhoto"), addProduct);
productRoute.get("/", getProduct);
productRoute.put("/:id", upload.single("productPhoto"), updateProduct);
productRoute.delete("/:id", deleteProduct);

export default productRoute;
