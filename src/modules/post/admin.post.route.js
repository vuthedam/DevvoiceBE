import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import verifyToken from "../../common/middlewares/verifyToken.js";
import isAdmin from "../../common/middlewares/isAdmin.js";
import { rejectPostSchema, hidePostSchema } from "./post.schema.js";
import {
  getAllPosts,
  getPendingPosts,
  getRejectedPosts,
  approvePost,
  rejectPost,
  hidePost,
  restorePost,
  deletePost,
  getPostStats,
} from "./post.controller.js";

const adminPostRouter = Router();

// Tất cả routes đều yêu cầu verifyToken + isAdmin
adminPostRouter.use(verifyToken, isAdmin);

// ── Danh sách ─────────────────────────────────────────────────────────────────
// /stats phải đứng trước /:id
adminPostRouter.get("/stats", getPostStats);
adminPostRouter.get("/pending", getPendingPosts);
adminPostRouter.get("/rejected", getRejectedPosts);
adminPostRouter.get("/", getAllPosts);

// ── Hành động ─────────────────────────────────────────────────────────────────
adminPostRouter.patch("/:id/approve", approvePost);
adminPostRouter.patch("/:id/reject", validBodyRequest(rejectPostSchema), rejectPost);
adminPostRouter.patch("/:id/hide", validBodyRequest(hidePostSchema), hidePost);
adminPostRouter.patch("/:id/restore", restorePost);
adminPostRouter.delete("/:id", deletePost);

export default adminPostRouter;
