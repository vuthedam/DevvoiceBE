import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import { CONTENT_STATUS } from "../../common/constants/enums.js";
import { Post } from "./post.model.js";

export const createPost = handleAsync(async (req, res) => {
  const post = await Post.create(req.body);
  res
    .status(201)
    .json(createResponse(true, 201, "Post created successfully", post));
});

export const getPosts = handleAsync(async (req, res) => {
  const filter = {};
  if (req.query.userId) filter.userId = req.query.userId;
  if (req.query.status) filter.status = req.query.status;

  const posts = await Post.find(filter)
    .populate("userId", "fullName username avatar")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(createResponse(true, 200, "Posts retrieved successfully", posts));
});

export const getPostDetail = handleAsync(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "userId",
    "fullName username avatar"
  );
  if (!post) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Post not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Post retrieved successfully", post));
});

export const updatePost = handleAsync(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json(createResponse(true, 200, "Post updated successfully", post));
});

export const deletePost = handleAsync(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(createResponse(true, 200, "Post deleted successfully"));
});

export const softDeletePost = handleAsync(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { status: CONTENT_STATUS.DELETED },
    { new: true }
  );
  res
    .status(200)
    .json(createResponse(true, 200, "Post soft deleted successfully", post));
});

export const restorePost = handleAsync(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { status: CONTENT_STATUS.ACTIVE },
    { new: true }
  );
  res
    .status(200)
    .json(createResponse(true, 200, "Post restored successfully", post));
});
