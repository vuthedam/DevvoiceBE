import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import verifyToken from "../../common/middlewares/verifyToken.js";
import isAdmin from "../../common/middlewares/isAdmin.js";
import isActiveUser from "../../common/middlewares/isActiveUser.js";
import { createCommentSchema, updateCommentSchema } from "./comment.schema.js";
import {
  createComment,
  getActiveComments,
  getAllComments,
  getCommentDetail,
  updateComment,
  softDeleteComment,
  hideComment,
  restoreComment,
  deleteComment,
} from "./comment.controller.js";

const commentRouter = Router();

// Public
commentRouter.get("/", getActiveComments);
commentRouter.get("/:id", getCommentDetail);

// User
commentRouter.post("/", verifyToken, isActiveUser, validBodyRequest(createCommentSchema), createComment);
commentRouter.patch("/:id", verifyToken, isActiveUser, validBodyRequest(updateCommentSchema), updateComment);
commentRouter.delete("/soft-delete/:id", verifyToken, isActiveUser, softDeleteComment);

// Admin
commentRouter.get("/admin/all", verifyToken, isAdmin, getAllComments);
commentRouter.patch("/admin/:id/hide", verifyToken, isAdmin, hideComment);
commentRouter.patch("/admin/:id/restore", verifyToken, isAdmin, restoreComment);
commentRouter.delete("/admin/:id", verifyToken, isAdmin, deleteComment);

export default commentRouter;
