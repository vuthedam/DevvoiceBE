import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import { Product } from "./product.model.js";

export const createProduct = handleAsync(async (req, res) => {
  const product = await Product.create(req.body);
  res
    .status(201)
    .json(createResponse(true, 201, "Product created successfully", product));
});

export const getProducts = handleAsync(async (req, res) => {
  const products = await Product.find();
  res
    .status(200)
    .json(
      createResponse(true, 200, "Products retrieved successfully", products)
    );
});

export const getProductDetail = handleAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Product not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Product retrieved successfully", product));
});

export const updateProduct = handleAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json(createResponse(true, 200, "Product updated successfully", product));
});

export const deleteProduct = handleAsync(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(createResponse(true, 200, "Product deleted successfully"));
});

export const softDeleteProduct = handleAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { deletedAt: new Date() },
    { new: true }
  );
  res
    .status(200)
    .json(
      createResponse(true, 200, "Product soft deleted successfully", product)
    );
});

export const restoreProduct = handleAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { deletedAt: null },
    { new: true }
  );
  res
    .status(200)
    .json(createResponse(true, 200, "Product restored successfully", product));
});
