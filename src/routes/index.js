import { Router } from "express";
import productRouter from "../modules/product/product.route.js";
import authRouter from "../modules/auth/auth.route.js";
import userRouter from "../modules/user/user.route.js";
import postRouter from "../modules/post/post.route.js";
import adminPostRouter from "../modules/post/admin.post.route.js";
import commentRouter from "../modules/comment/comment.route.js";
import postReactionRouter from "../modules/post-reaction/post-reaction.route.js";
import commentReactionRouter from "../modules/comment-reaction/comment-reaction.route.js";
import reportRouter from "../modules/report/report.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);
router.use("/post-reactions", postReactionRouter);
router.use("/comment-reactions", commentReactionRouter);
// User: POST /reports/post/:postId, POST /reports/comment/:commentId
router.use("/reports", reportRouter);
// Admin
router.use("/admin/posts", adminPostRouter);
router.use("/admin/reports", reportRouter);

export default router;
