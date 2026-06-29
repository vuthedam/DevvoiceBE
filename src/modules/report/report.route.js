import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import verifyToken from "../../common/middlewares/verifyToken.js";
import isAdmin from "../../common/middlewares/isAdmin.js";
import isActiveUser from "../../common/middlewares/isActiveUser.js";
import { reportPostSchema, reportCommentSchema } from "./report.schema.js";
import {
  reportPost,
  reportComment,
  getAllReports,
  getReportDetail,
  resolveReport,
  rejectReport,
  getReportStats,
} from "./report.controller.js";

const reportRouter = Router();

// ── User ──────────────────────────────────────────────────────────────────────
reportRouter.post(
  "/post/:postId",
  verifyToken,
  isActiveUser,
  validBodyRequest(reportPostSchema),
  reportPost
);

reportRouter.post(
  "/comment/:commentId",
  verifyToken,
  isActiveUser,
  validBodyRequest(reportCommentSchema),
  reportComment
);

// ── Admin ─────────────────────────────────────────────────────────────────────
// /stats phải đứng trước /:id để Express không nhầm "stats" là một :id
reportRouter.get("/stats", verifyToken, isAdmin, getReportStats);
reportRouter.get("/", verifyToken, isAdmin, getAllReports);
reportRouter.get("/:id", verifyToken, isAdmin, getReportDetail);
reportRouter.patch("/:id/resolve", verifyToken, isAdmin, resolveReport);
reportRouter.patch("/:id/reject", verifyToken, isAdmin, rejectReport);

export default reportRouter;
