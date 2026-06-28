import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import {
  createComment,
  deleteComment,
  getCommentDetail,
  getComments,
  restoreComment,
  softDeleteComment,
  updateComment,
} from "./comment.controller.js";
import { createCommentSchema, updateCommentSchema } from "./comment.schema.js";

const commentRouter = Router();

commentRouter.post("/", validBodyRequest(createCommentSchema), createComment);
commentRouter.get("/", getComments);
commentRouter.get("/:id", getCommentDetail);
commentRouter.patch("/:id", validBodyRequest(updateCommentSchema), updateComment);
commentRouter.delete("/:id", deleteComment);
commentRouter.delete("/soft-delete/:id", softDeleteComment);
commentRouter.patch("/restore/:id", restoreComment);

export default commentRouter;
