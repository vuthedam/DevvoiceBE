import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import {
  createCommentReaction,
  deleteCommentReaction,
  getCommentReactionDetail,
  getCommentReactions,
  updateCommentReaction,
} from "./comment-reaction.controller.js";
import {
  createCommentReactionSchema,
  updateCommentReactionSchema,
} from "./comment-reaction.schema.js";

const commentReactionRouter = Router();

commentReactionRouter.post(
  "/",
  validBodyRequest(createCommentReactionSchema),
  createCommentReaction
);
commentReactionRouter.get("/", getCommentReactions);
commentReactionRouter.get("/:id", getCommentReactionDetail);
commentReactionRouter.patch(
  "/:id",
  validBodyRequest(updateCommentReactionSchema),
  updateCommentReaction
);
commentReactionRouter.delete("/:id", deleteCommentReaction);

export default commentReactionRouter;
