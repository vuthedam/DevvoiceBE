import mongoose, { Schema } from "mongoose";
import { POST_STATUS } from "../../common/constants/enums.js";

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [255, "Title cannot exceed 255 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [10000, "Content cannot exceed 10000 characters"],
    },
    likesCount: {
      type: Number,
      default: 0,
      min: [0, "Likes count cannot be negative"],
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: [0, "Comments count cannot be negative"],
    },
    reportsCount: {
      type: Number,
      default: 0,
      min: [0, "Reports count cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(POST_STATUS),
        message: "Invalid status",
      },
      default: POST_STATUS.PENDING,
      index: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectReason: {
      type: String,
      default: null,
      trim: true,
      maxlength: [1000, "Reject reason cannot exceed 1000 characters"],
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

postSchema.index({ userId: 1, status: 1, createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
