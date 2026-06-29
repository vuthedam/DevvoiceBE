import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import createError from "../../common/utils/createError.js";

import { POST_STATUS, USER_ROLE } from "../../common/constants/enums.js";
import { Post } from "./post.model.js";

const populateAuthor = { path: "userId", select: "fullName username avatar" };
const populateApprovedBy = { path: "approvedBy", select: "fullName username" };

const withPopulate = (query) =>
  query.populate(populateAuthor).populate(populateApprovedBy);

// ── Public ────────────────────────────────────────────────────────────────────

// GET /posts — chỉ trả về approved
export const getPublicPosts = handleAsync(async (req, res) => {
  const filter = { status: POST_STATUS.APPROVED };
  if (req.query.userId) filter.userId = req.query.userId;

  const posts = await withPopulate(Post.find(filter).sort({ createdAt: -1 }));
  res
    .status(200)
    .json(createResponse(true, 200, "Posts retrieved successfully", posts));
});

// Backward compat alias
export const getActivePosts = getPublicPosts;
export const getPosts = getPublicPosts;

// GET /posts/:id — approved cho public, mọi status cho owner/admin
export const getPostDetail = handleAsync(async (req, res, next) => {
  const post = await withPopulate(Post.findById(req.params.id));
  if (!post) return next(createError(404, "Post not found"));

  const isOwner = req.user && String(post.userId._id) === String(req.user._id);
  const isAdmin = req.user?.role === USER_ROLE.ADMIN;

  if (post.status !== POST_STATUS.APPROVED && !isOwner && !isAdmin) {
    return next(createError(404, "Post not found"));
  }

  res
    .status(200)
    .json(createResponse(true, 200, "Post retrieved successfully", post));
});

// ── User ──────────────────────────────────────────────────────────────────────

// POST /posts — tạo bài, status mặc định pending
export const createPost = handleAsync(async (req, res) => {
  const post = await Post.create({ ...req.body, userId: req.user._id });
  res
    .status(201)
    .json(
      createResponse(
        true,
        201,
        "Post created successfully. Waiting for approval.",
        post,
      ),
    );
});

// GET /posts/my-posts — xem tất cả bài của chính mình
export const getMyPosts = handleAsync(async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const posts = await withPopulate(Post.find(filter).sort({ createdAt: -1 }));
  res
    .status(200)
    .json(createResponse(true, 200, "Posts retrieved successfully", posts));
});

// PUT /posts/:id — chỉ sửa khi pending hoặc rejected
export const updatePost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found"));

  if (String(post.userId) !== String(req.user._id)) {
    return next(createError(403, "Forbidden: Not your post"));
  }

  const editableStatuses = [POST_STATUS.PENDING, POST_STATUS.REJECTED];
  if (!editableStatuses.includes(post.status)) {
    return next(
      createError(400, `Cannot edit a post with status "${post.status}"`),
    );
  }

  const updated = await withPopulate(
    Post.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true },
    ),
  );
  res
    .status(200)
    .json(createResponse(true, 200, "Post updated successfully", updated));
});

// PATCH /posts/:id/resubmit — gửi lại để duyệt
export const resubmitPost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found"));

  if (String(post.userId) !== String(req.user._id)) {
    return next(createError(403, "Forbidden: Not your post"));
  }

  if (post.status !== POST_STATUS.REJECTED) {
    return next(createError(400, "Only rejected posts can be resubmitted"));
  }

  const updated = await withPopulate(
    Post.findByIdAndUpdate(
      req.params.id,
      {
        status: POST_STATUS.PENDING,
        rejectReason: null,
        approvedBy: null,
        approvedAt: null,
      },
      { new: true },
    ),
  );
  res
    .status(200)
    .json(createResponse(true, 200, "Post resubmitted successfully", updated));
});

// User soft delete — chỉ bài của mình
export const softDeletePost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found"));

  if (String(post.userId) !== String(req.user._id)) {
    return next(createError(403, "Forbidden: Not your post"));
  }

  const updated = await Post.findByIdAndUpdate(
    req.params.id,
    { status: POST_STATUS.DELETED },
    { new: true },
  );
  res
    .status(200)
    .json(createResponse(true, 200, "Post deleted successfully", updated));
});

// ── Admin ─────────────────────────────────────────────────────────────────────

// GET /admin/posts — tất cả posts, có filter theo status
export const getAllPosts = handleAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.userId) filter.userId = req.query.userId;

  const posts = await withPopulate(Post.find(filter).sort({ createdAt: -1 }));
  res
    .status(200)
    .json(createResponse(true, 200, "Posts retrieved successfully", posts));
});

// GET /admin/posts/pending
export const getPendingPosts = handleAsync(async (req, res) => {
  const posts = await withPopulate(
    Post.find({ status: POST_STATUS.PENDING }).sort({ createdAt: -1 }),
  );
  res
    .status(200)
    .json(
      createResponse(true, 200, "Pending posts retrieved successfully", posts),
    );
});

// GET /admin/posts/rejected
export const getRejectedPosts = handleAsync(async (req, res) => {
  const posts = await withPopulate(
    Post.find({ status: POST_STATUS.REJECTED }).sort({ createdAt: -1 }),
  );
  res
    .status(200)
    .json(
      createResponse(true, 200, "Rejected posts retrieved successfully", posts),
    );
});

// PATCH /admin/posts/:id/approve
export const approvePost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found"));

  if (post.status === POST_STATUS.APPROVED) {
    return next(createError(400, "Post is already approved"));
  }
  if (post.status === POST_STATUS.DELETED) {
    return next(createError(400, "Cannot approve a deleted post"));
  }

  const updated = await withPopulate(
    Post.findByIdAndUpdate(
      req.params.id,
      {
        status: POST_STATUS.APPROVED,
        approvedBy: req.user._id,
        approvedAt: new Date(),
        rejectReason: null,
      },
      { new: true },
    ),
  );
  res
    .status(200)
    .json(createResponse(true, 200, "Post approved successfully", updated));
});

// PATCH /admin/posts/:id/reject
export const rejectPost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found"));

  if (post.status === POST_STATUS.REJECTED) {
    return next(createError(400, "Post is already rejected"));
  }
  if (post.status === POST_STATUS.DELETED) {
    return next(createError(400, "Cannot reject a deleted post"));
  }

  const updated = await withPopulate(
    Post.findByIdAndUpdate(
      req.params.id,
      {
        status: POST_STATUS.REJECTED,
        rejectReason: req.body.rejectReason,
        approvedBy: null,
        approvedAt: null,
      },
      { new: true },
    ),
  );
  res
    .status(200)
    .json(createResponse(true, 200, "Post rejected successfully", updated));
});

// PATCH /admin/posts/:id/hide
export const hidePost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found"));

  if (post.status === POST_STATUS.DELETED) {
    return next(createError(400, "Post is already deleted"));
  }
  if (post.status === POST_STATUS.HIDDEN) {
    return next(createError(400, "Post is already hidden"));
  }

  const updated = await withPopulate(
    Post.findByIdAndUpdate(
      req.params.id,
      {
        status: POST_STATUS.HIDDEN,
        hiddenBy: req.user._id,
        hiddenReason: req.body.hiddenReason ?? null,
      },
      { new: true },
    ),
  );
  res
    .status(200)
    .json(createResponse(true, 200, "Post hidden successfully", updated));
});

// PATCH /admin/posts/:id/restore — từ hidden trở về approved
export const restorePost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found"));

  if (post.status !== POST_STATUS.HIDDEN) {
    return next(createError(400, "Only hidden posts can be restored"));
  }

  const updated = await withPopulate(
    Post.findByIdAndUpdate(
      req.params.id,
      { status: POST_STATUS.APPROVED, hiddenBy: null, hiddenReason: null },
      { new: true },
    ),
  );
  res
    .status(200)
    .json(createResponse(true, 200, "Post restored successfully", updated));
});

// DELETE /admin/posts/:id — hard delete
export const deletePost = handleAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return next(createError(404, "Post not found"));
  res.status(200).json(createResponse(true, 200, "Post deleted successfully"));
});

// GET /admin/posts/stats
export const getPostStats = handleAsync(async (req, res) => {
  const stats = await Post.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const counts = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    hidden: 0,
    deleted: 0,
  };

  for (const { _id, count } of stats) {
    if (_id in counts) counts[_id] = count;
    counts.total += count;
  }

  res
    .status(200)
    .json(
      createResponse(true, 200, "Post stats retrieved successfully", counts),
    );
});
