import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import { CONTENT_STATUS } from "../../common/constants/enums.js";
import { Comment } from "./comment.model.js";
import { Post } from "../post/post.model.js";

export const createComment = handleAsync(async (req, res) => {
  const comment = await Comment.create(req.body);
  await Post.findByIdAndUpdate(req.body.postId, {
    $inc: { commentsCount: 1 },
  });
  res
    .status(201)
    .json(createResponse(true, 201, "Comment created successfully", comment));
});

export const getComments = handleAsync(async (req, res) => {
  const filter = {};
  if (req.query.postId) filter.postId = req.query.postId;
  if (req.query.userId) filter.userId = req.query.userId;
  if (req.query.parentId) filter.parentId = req.query.parentId;
  if (req.query.status) filter.status = req.query.status;

  const comments = await Comment.find(filter)
    .populate("userId", "fullName username avatar")
    .populate("postId", "title")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      createResponse(true, 200, "Comments retrieved successfully", comments)
    );
});

export const getCommentDetail = handleAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.id)
    .populate("userId", "fullName username avatar")
    .populate("postId", "title");
  if (!comment) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Comment not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Comment retrieved successfully", comment));
});

export const updateComment = handleAsync(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json(createResponse(true, 200, "Comment updated successfully", comment));
});

export const deleteComment = handleAsync(async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (comment) {
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentsCount: -1 },
    });
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Comment deleted successfully"));
});

export const softDeleteComment = handleAsync(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { status: CONTENT_STATUS.DELETED },
    { new: true }
  );
  res
    .status(200)
    .json(
      createResponse(true, 200, "Comment soft deleted successfully", comment)
    );
});

export const restoreComment = handleAsync(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { status: CONTENT_STATUS.ACTIVE },
    { new: true }
  );
  res
    .status(200)
    .json(createResponse(true, 200, "Comment restored successfully", comment));
});
