import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import createError from "../../common/utils/createError.js";
import { CONTENT_STATUS, REPORT_STATUS } from "../../common/constants/enums.js";
import { Report } from "./report.model.js";
import { Post } from "../post/post.model.js";
import { Comment } from "../comment/comment.model.js";

const userSelect = "fullName username avatar";

const fullPopulate = [
  { path: "reporterId", select: userSelect },
  { path: "handledBy", select: userSelect },
  {
    path: "postId",
    select: "title status reportsCount userId createdAt",
    populate: { path: "userId", select: userSelect },
  },
  {
    path: "commentId",
    select: "content status reportsCount userId createdAt",
    populate: { path: "userId", select: userSelect },
  },
];

// POST /reports/post/:postId
export const reportPost = handleAsync(async (req, res, next) => {
  const { postId } = req.params;
  const reporterId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) return next(createError(404, "Post not found"));
  if (post.status !== CONTENT_STATUS.ACTIVE) {
    return next(createError(400, "Cannot report a post that is hidden or deleted"));
  }
  if (String(post.userId) === String(reporterId)) {
    return next(createError(400, "You cannot report your own post"));
  }

  const duplicate = await Report.findOne({ reporterId, postId });
  if (duplicate) return next(createError(409, "You have already reported this post"));

  const report = await Report.create({
    reporterId,
    postId,
    reason: req.body.reason,
    description: req.body.description ?? null,
  });

  await Post.findByIdAndUpdate(postId, { $inc: { reportsCount: 1 } });

  res.status(201).json(createResponse(true, 201, "Report submitted successfully", report));
});

// POST /reports/comment/:commentId
export const reportComment = handleAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const reporterId = req.user._id;

  const comment = await Comment.findById(commentId);
  if (!comment) return next(createError(404, "Comment not found"));
  if (comment.status !== CONTENT_STATUS.ACTIVE) {
    return next(createError(400, "Cannot report a comment that is hidden or deleted"));
  }
  if (String(comment.userId) === String(reporterId)) {
    return next(createError(400, "You cannot report your own comment"));
  }

  const duplicate = await Report.findOne({ reporterId, commentId });
  if (duplicate) return next(createError(409, "You have already reported this comment"));

  const report = await Report.create({
    reporterId,
    commentId,
    reason: req.body.reason,
    description: req.body.description ?? null,
  });

  await Comment.findByIdAndUpdate(commentId, { $inc: { reportsCount: 1 } });

  res.status(201).json(createResponse(true, 201, "Report submitted successfully", report));
});

// GET /admin/reports
export const getAllReports = handleAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const reports = await Report.find(filter)
    .populate(fullPopulate)
    .sort({ createdAt: -1 });

  res.status(200).json(createResponse(true, 200, "Reports retrieved successfully", reports));
});

// GET /admin/reports/:id
export const getReportDetail = handleAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id).populate(fullPopulate);
  if (!report) return next(createError(404, "Report not found"));
  res.status(200).json(createResponse(true, 200, "Report retrieved successfully", report));
});

// PATCH /admin/reports/:id/resolve
export const resolveReport = handleAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);
  if (!report) return next(createError(404, "Report not found"));
  if (report.status !== REPORT_STATUS.PENDING) {
    return next(createError(400, "Report has already been handled"));
  }

  report.status = REPORT_STATUS.RESOLVED;
  report.handledBy = req.user._id;
  await report.save();

  res.status(200).json(createResponse(true, 200, "Report resolved successfully", report));
});

// PATCH /admin/reports/:id/reject
export const rejectReport = handleAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);
  if (!report) return next(createError(404, "Report not found"));
  if (report.status !== REPORT_STATUS.PENDING) {
    return next(createError(400, "Report has already been handled"));
  }

  report.status = REPORT_STATUS.REJECTED;
  report.handledBy = req.user._id;
  await report.save();

  res.status(200).json(createResponse(true, 200, "Report rejected successfully", report));
});

// GET /admin/reports/stats
export const getReportStats = handleAsync(async (req, res) => {
  const [statusCounts, topPosts, topComments] = await Promise.all([
    Report.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    Report.aggregate([
      { $match: { postId: { $ne: null } } },
      { $group: { _id: "$postId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: "$post" },
      {
        $lookup: {
          from: "users",
          localField: "post.userId",
          foreignField: "_id",
          as: "post.author",
        },
      },
      { $unwind: { path: "$post.author", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          count: 1,
          "post._id": 1,
          "post.title": 1,
          "post.status": 1,
          "post.reportsCount": 1,
          "post.author._id": 1,
          "post.author.fullName": 1,
          "post.author.username": 1,
          "post.author.avatar": 1,
        },
      },
    ]),

    Report.aggregate([
      { $match: { commentId: { $ne: null } } },
      { $group: { _id: "$commentId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "_id",
          as: "comment",
        },
      },
      { $unwind: "$comment" },
      {
        $lookup: {
          from: "users",
          localField: "comment.userId",
          foreignField: "_id",
          as: "comment.author",
        },
      },
      { $unwind: { path: "$comment.author", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          count: 1,
          "comment._id": 1,
          "comment.content": 1,
          "comment.status": 1,
          "comment.reportsCount": 1,
          "comment.author._id": 1,
          "comment.author.fullName": 1,
          "comment.author.username": 1,
          "comment.author.avatar": 1,
        },
      },
    ]),
  ]);

  // Chuẩn hóa statusCounts thành object
  const counts = { total: 0, pending: 0, resolved: 0, rejected: 0 };
  for (const { _id, count } of statusCounts) {
    counts[_id] = count;
    counts.total += count;
  }

  res.status(200).json(
    createResponse(true, 200, "Report stats retrieved successfully", {
      counts,
      topPosts,
      topComments,
    })
  );
});
