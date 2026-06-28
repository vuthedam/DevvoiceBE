import { Router } from "express";
import productRouter from "../modules/product/product.route.js";
import authRouter from "../modules/auth/auth.route.js";
import userRouter from "../modules/user/user.route.js";
import postRouter from "../modules/post/post.route.js";
import commentRouter from "../modules/comment/comment.route.js";
import postReactionRouter from "../modules/post-reaction/post-reaction.route.js";
import commentReactionRouter from "../modules/comment-reaction/comment-reaction.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);
router.use("/post-reactions", postReactionRouter);
router.use("/comment-reactions", commentReactionRouter);

export default router;
