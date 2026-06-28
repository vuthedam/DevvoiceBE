import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import {
  createProduct,
  deleteProduct,
  getProductDetail,
  getProducts,
  restoreProduct,
  softDeleteProduct,
  updateProduct,
} from "./product.controller.js";
import { createProductSchema, updateProductSchema } from "./product.schema.js";

const productRouter = Router();

productRouter.post("/", validBodyRequest(createProductSchema), createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductDetail);
productRouter.patch("/:id", validBodyRequest(updateProductSchema), updateProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.delete("/soft-delete/:id", softDeleteProduct);
productRouter.patch("/restore/:id", restoreProduct);

export default productRouter;
