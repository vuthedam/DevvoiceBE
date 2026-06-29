import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import createError from "../../common/utils/createError.js";
import { CONTENT_STATUS } from "../../common/constants/enums.js";
import { Post } from "./post.model.js";

const populateUser = { path: "userId", select: "fullName username avatar" };

export const createPost = handleAsync(async (req, res) => {
  const post = await Post.create({ ...req.body, userId: req.user._id });
  res.status(201).json(createResponse(true, 201, "Post created successfully", post));
});

// Admin: lấy tất cả posts (mọi status)
export const getAllPosts = handleAsync(async (req, res) => {
  const filter = {};
  if (req.query.userId) filter.userId = req.query.userId;
  if (req.query.status) filter.status = req.query.status;

  const posts = await Post.find(filter)
    .populate(populateUser)
    .sort({ createdAt: -1 });
  res.status(200).json(createResponse(true, 200, "Posts retrieved successfully", posts));
});

// User: chỉ lấy posts active
export const getActivePosts = handleAsync(async (req, res) => {
  const filter = { status: CONTENT_STATUS.ACTIVE };
  if (req.query.userId) filter.userId = req.query.userId;

  const posts = await Post.find(filter)
    .populate(populateUser)
    .sort({ createdAt: -1 });
  res.status(200).json(createResponse(true, 200, "Posts retrieved successfully", posts));
});

// Backward compat alias (dùng cho các route cũ không có auth)
export const getPosts = getActivePosts;

export const getPostDetail = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate(populateUser);
  if (!post) return next(createError(404, "Post not found"));
  res.status(200).json(createResponse(true, 200, "Post retrieved successfully", post));
});

export const updatePost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found"));

  if (String(post.userId) !== String(req.user._id)) {
    return next(createError(403, "Forbidden: Not your post"));
  }

  const updated = await Post.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, content: req.body.content },
    { new: true }
  );
  res.status(200).json(createResponse(true, 200, "Post updated successfully", updated));
});

// Admin: hide post
export const hidePost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found"));
  if (post.status === CONTENT_STATUS.DELETED) {
    return next(createError(400, "Post is already deleted"));
  }

  const updated = await Post.findByIdAndUpdate(
    req.params.id,
    {
      status: CONTENT_STATUS.HIDDEN,
      hiddenBy: req.user._id,
      hiddenReason: req.body.hiddenReason ?? null,
    },
    { new: true }
  ).populate(populateUser);
  res.status(200).json(createResponse(true, 200, "Post hidden successfully", updated));
});

// Admin: restore post
export const restorePost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found"));

  const updated = await Post.findByIdAndUpdate(
    req.params.id,
    { status: CONTENT_STATUS.ACTIVE, hiddenBy: null, hiddenReason: null },
    { new: true }
  ).populate(populateUser);
  res.status(200).json(createResponse(true, 200, "Post restored successfully", updated));
});

// Admin: hard delete post
export const deletePost = handleAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return next(createError(404, "Post not found"));
  res.status(200).json(createResponse(true, 200, "Post deleted successfully"));
});

// User: soft delete (chỉ bài của mình)
export const softDeletePost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found"));

  if (String(post.userId) !== String(req.user._id)) {
    return next(createError(403, "Forbidden: Not your post"));
  }

  const updated = await Post.findByIdAndUpdate(
    req.params.id,
    { status: CONTENT_STATUS.DELETED },
    { new: true }
  );
  res.status(200).json(createResponse(true, 200, "Post deleted successfully", updated));
});
