import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import { Post } from "../post/post.model.js";
import { PostReaction } from "./post-reaction.model.js";

export const createPostReaction = handleAsync(async (req, res) => {
  const { postId, userId } = req.body;
  const existing = await PostReaction.findOne({ postId, userId });
  if (existing) {
    return res
      .status(400)
      .json(createResponse(false, 400, "User already reacted to this post"));
  }

  const reaction = await PostReaction.create(req.body);
  await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
  res
    .status(201)
    .json(
      createResponse(true, 201, "Post reaction created successfully", reaction)
    );
});

export const getPostReactions = handleAsync(async (req, res) => {
  const filter = {};
  if (req.query.postId) filter.postId = req.query.postId;
  if (req.query.userId) filter.userId = req.query.userId;

  const reactions = await PostReaction.find(filter)
    .populate("userId", "fullName username avatar")
    .populate("postId", "title")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Post reactions retrieved successfully",
        reactions
      )
    );
});

export const getPostReactionDetail = handleAsync(async (req, res) => {
  const reaction = await PostReaction.findById(req.params.id)
    .populate("userId", "fullName username avatar")
    .populate("postId", "title");
  if (!reaction) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Post reaction not found"));
  }
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Post reaction retrieved successfully",
        reaction
      )
    );
});

export const deletePostReaction = handleAsync(async (req, res) => {
  const reaction = await PostReaction.findByIdAndDelete(req.params.id);
  if (!reaction) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Post reaction not found"));
  }
  await Post.findByIdAndUpdate(reaction.postId, { $inc: { likesCount: -1 } });
  res
    .status(200)
    .json(createResponse(true, 200, "Post reaction deleted successfully"));
});
