import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import verifyToken from "../../common/middlewares/verifyToken.js";
import isAdmin from "../../common/middlewares/isAdmin.js";
import isActiveUser from "../../common/middlewares/isActiveUser.js";
import { createPostSchema, updatePostSchema } from "./post.schema.js";
import {
  createPost,
  getActivePosts,
  getAllPosts,
  getPostDetail,
  updatePost,
  softDeletePost,
  hidePost,
  restorePost,
  deletePost,
} from "./post.controller.js";

const postRouter = Router();

// Public
postRouter.get("/", getActivePosts);
postRouter.get("/:id", getPostDetail);

// User
postRouter.post("/", verifyToken, isActiveUser, validBodyRequest(createPostSchema), createPost);
postRouter.patch("/:id", verifyToken, isActiveUser, validBodyRequest(updatePostSchema), updatePost);
postRouter.delete("/soft-delete/:id", verifyToken, isActiveUser, softDeletePost);

// Admin
postRouter.get("/admin/all", verifyToken, isAdmin, getAllPosts);
postRouter.patch("/admin/:id/hide", verifyToken, isAdmin, hidePost);
postRouter.patch("/admin/:id/restore", verifyToken, isAdmin, restorePost);
postRouter.delete("/admin/:id", verifyToken, isAdmin, deletePost);

export default postRouter;
