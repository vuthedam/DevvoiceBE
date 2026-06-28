import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import { COMMENT_REACTION_TYPE } from "../../common/constants/enums.js";
import { Comment } from "../comment/comment.model.js";
import { CommentReaction } from "./comment-reaction.model.js";

const adjustCommentReactionCount = async (commentId, type, delta) => {
  const field =
    type === COMMENT_REACTION_TYPE.LIKE ? "likesCount" : "dislikesCount";
  await Comment.findByIdAndUpdate(commentId, { $inc: { [field]: delta } });
};

export const createCommentReaction = handleAsync(async (req, res) => {
  const { commentId, userId, type } = req.body;
  const existing = await CommentReaction.findOne({ commentId, userId });
  if (existing) {
    return res
      .status(400)
      .json(
        createResponse(false, 400, "User already reacted to this comment")
      );
  }

  const reaction = await CommentReaction.create(req.body);
  await adjustCommentReactionCount(commentId, type, 1);
  res
    .status(201)
    .json(
      createResponse(
        true,
        201,
        "Comment reaction created successfully",
        reaction
      )
    );
});

export const getCommentReactions = handleAsync(async (req, res) => {
  const filter = {};
  if (req.query.commentId) filter.commentId = req.query.commentId;
  if (req.query.userId) filter.userId = req.query.userId;
  if (req.query.type) filter.type = req.query.type;

  const reactions = await CommentReaction.find(filter)
    .populate("userId", "fullName username avatar")
    .populate("commentId", "content")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Comment reactions retrieved successfully",
        reactions
      )
    );
});

export const getCommentReactionDetail = handleAsync(async (req, res) => {
  const reaction = await CommentReaction.findById(req.params.id)
    .populate("userId", "fullName username avatar")
    .populate("commentId", "content");
  if (!reaction) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Comment reaction not found"));
  }
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Comment reaction retrieved successfully",
        reaction
      )
    );
});

export const updateCommentReaction = handleAsync(async (req, res) => {
  const reaction = await CommentReaction.findById(req.params.id);
  if (!reaction) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Comment reaction not found"));
  }

  const oldType = reaction.type;
  const newType = req.body.type;
  if (oldType !== newType) {
    await adjustCommentReactionCount(reaction.commentId, oldType, -1);
    await adjustCommentReactionCount(reaction.commentId, newType, 1);
    reaction.type = newType;
    await reaction.save();
  }

  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Comment reaction updated successfully",
        reaction
      )
    );
});

export const deleteCommentReaction = handleAsync(async (req, res) => {
  const reaction = await CommentReaction.findByIdAndDelete(req.params.id);
  if (!reaction) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Comment reaction not found"));
  }
  await adjustCommentReactionCount(reaction.commentId, reaction.type, -1);
  res
    .status(200)
    .json(createResponse(true, 200, "Comment reaction deleted successfully"));
});
