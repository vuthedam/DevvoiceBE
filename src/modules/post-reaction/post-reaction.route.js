import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import {
  createPostReaction,
  deletePostReaction,
  getPostReactionDetail,
  getPostReactions,
} from "./post-reaction.controller.js";
import { createPostReactionSchema } from "./post-reaction.schema.js";

const postReactionRouter = Router();

postReactionRouter.post(
  "/",
  validBodyRequest(createPostReactionSchema),
  createPostReaction
);
postReactionRouter.get("/", getPostReactions);
postReactionRouter.get("/:id", getPostReactionDetail);
postReactionRouter.delete("/:id", deletePostReaction);

export default postReactionRouter;
