import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import {
  createPost,
  deletePost,
  getPostDetail,
  getPosts,
  restorePost,
  softDeletePost,
  updatePost,
} from "./post.controller.js";
import { createPostSchema, updatePostSchema } from "./post.schema.js";

const postRouter = Router();

postRouter.post("/", validBodyRequest(createPostSchema), createPost);
postRouter.get("/", getPosts);
postRouter.get("/:id", getPostDetail);
postRouter.patch("/:id", validBodyRequest(updatePostSchema), updatePost);
postRouter.delete("/:id", deletePost);
postRouter.delete("/soft-delete/:id", softDeletePost);
postRouter.patch("/restore/:id", restorePost);

export default postRouter;
