import mongoose, { Schema } from "mongoose";
import { CONTENT_STATUS } from "../../common/constants/enums.js";

const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post ID is required"],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [2000, "Content cannot exceed 2000 characters"],
    },
    likesCount: {
      type: Number,
      default: 0,
      min: [0, "Likes count cannot be negative"],
    },
    dislikesCount: {
      type: Number,
      default: 0,
      min: [0, "Dislikes count cannot be negative"],
    },
    reportsCount: {
      type: Number,
      default: 0,
      min: [0, "Reports count cannot be negative"],
    },
    hiddenBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    hiddenReason: {
      type: String,
      default: null,
      trim: true,
      maxlength: [500, "Hidden reason cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(CONTENT_STATUS),
        message: "Status must be active, hidden or deleted",
      },
      default: CONTENT_STATUS.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

commentSchema.index({ postId: 1, status: 1, createdAt: -1 });
commentSchema.index({ postId: 1, parentId: 1, status: 1 });
commentSchema.index({ userId: 1, createdAt: -1 });

export const Comment = mongoose.model("Comment", commentSchema);
