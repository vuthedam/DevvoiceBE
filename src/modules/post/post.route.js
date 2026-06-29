import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import verifyToken from "../../common/middlewares/verifyToken.js";
import isActiveUser from "../../common/middlewares/isActiveUser.js";
import { createPostSchema, updatePostSchema } from "./post.schema.js";
import {
  createPost,
  getPublicPosts,
  getMyPosts,
  getPostDetail,
  updatePost,
  resubmitPost,
  softDeletePost,
} from "./post.controller.js";

const postRouter = Router();

// ── Public ────────────────────────────────────────────────────────────────────
postRouter.get("/", getPublicPosts);
postRouter.get("/:id", getPostDetail);

// ── User ──────────────────────────────────────────────────────────────────────
postRouter.post("/", verifyToken, isActiveUser, validBodyRequest(createPostSchema), createPost);
postRouter.get("/my/posts", verifyToken, isActiveUser, getMyPosts);
postRouter.put("/:id", verifyToken, isActiveUser, validBodyRequest(updatePostSchema), updatePost);
postRouter.patch("/:id/resubmit", verifyToken, isActiveUser, resubmitPost);
postRouter.delete("/:id", verifyToken, isActiveUser, softDeletePost);

export default postRouter;
