import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import createError from "../../common/utils/createError.js";
import { CONTENT_STATUS } from "../../common/constants/enums.js";
import { Comment } from "./comment.model.js";
import { Post } from "../post/post.model.js";

const populateUser = { path: "userId", select: "fullName username avatar" };
const populateParent = { path: "parentId", select: "content userId", populate: populateUser };

export const createComment = handleAsync(async (req, res) => {
  const comment = await Comment.create({ ...req.body, userId: req.user._id });
  await Post.findByIdAndUpdate(req.body.postId, { $inc: { commentsCount: 1 } });
  res.status(201).json(createResponse(true, 201, "Comment created successfully", comment));
});

// Admin: lấy tất cả comments (mọi status)
export const getAllComments = handleAsync(async (req, res) => {
  const filter = {};
  if (req.query.postId) filter.postId = req.query.postId;
  if (req.query.userId) filter.userId = req.query.userId;
  if (req.query.status) filter.status = req.query.status;

  const comments = await Comment.find(filter)
    .populate(populateUser)
    .populate(populateParent)
    .sort({ createdAt: -1 });
  res.status(200).json(createResponse(true, 200, "Comments retrieved successfully", comments));
});

// User: chỉ lấy comments active
export const getActiveComments = handleAsync(async (req, res) => {
  const filter = { status: CONTENT_STATUS.ACTIVE };
  if (req.query.postId) filter.postId = req.query.postId;
  if (req.query.userId) filter.userId = req.query.userId;
  if (req.query.parentId) filter.parentId = req.query.parentId;

  const comments = await Comment.find(filter)
    .populate(populateUser)
    .populate(populateParent)
    .sort({ createdAt: -1 });
  res.status(200).json(createResponse(true, 200, "Comments retrieved successfully", comments));
});

// Backward compat alias
export const getComments = getActiveComments;

export const getCommentDetail = handleAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id)
    .populate(populateUser)
    .populate(populateParent);
  if (!comment) return next(createError(404, "Comment not found"));
  res.status(200).json(createResponse(true, 200, "Comment retrieved successfully", comment));
});

export const updateComment = handleAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(createError(404, "Comment not found"));

  if (String(comment.userId) !== String(req.user._id)) {
    return next(createError(403, "Forbidden: Not your comment"));
  }

  const updated = await Comment.findByIdAndUpdate(
    req.params.id,
    { content: req.body.content },
    { new: true }
  );
  res.status(200).json(createResponse(true, 200, "Comment updated successfully", updated));
});

// Admin: hide comment
export const hideComment = handleAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(createError(404, "Comment not found"));
  if (comment.status === CONTENT_STATUS.DELETED) {
    return next(createError(400, "Comment is already deleted"));
  }

  const updated = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      status: CONTENT_STATUS.HIDDEN,
      hiddenBy: req.user._id,
      hiddenReason: req.body.hiddenReason ?? null,
    },
    { new: true }
  ).populate(populateUser);
  res.status(200).json(createResponse(true, 200, "Comment hidden successfully", updated));
});

// Admin: restore comment
export const restoreComment = handleAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(createError(404, "Comment not found"));

  const updated = await Comment.findByIdAndUpdate(
    req.params.id,
    { status: CONTENT_STATUS.ACTIVE, hiddenBy: null, hiddenReason: null },
    { new: true }
  ).populate(populateUser);
  res.status(200).json(createResponse(true, 200, "Comment restored successfully", updated));
});

// Admin: hard delete comment
export const deleteComment = handleAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) return next(createError(404, "Comment not found"));
  await Post.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });
  res.status(200).json(createResponse(true, 200, "Comment deleted successfully"));
});

// User: soft delete (chỉ comment của mình)
export const softDeleteComment = handleAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(createError(404, "Comment not found"));

  if (String(comment.userId) !== String(req.user._id)) {
    return next(createError(403, "Forbidden: Not your comment"));
  }

  const updated = await Comment.findByIdAndUpdate(
    req.params.id,
    { status: CONTENT_STATUS.DELETED },
    { new: true }
  );
  res.status(200).json(createResponse(true, 200, "Comment deleted successfully", updated));
});
