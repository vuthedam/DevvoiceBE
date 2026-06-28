import mongoose, { Schema } from "mongoose";
import { CONTENT_STATUS } from "../../common/constants/enums.js";

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
    status: {
      type: String,
      enum: {
        values: Object.values(CONTENT_STATUS),
        message: "Status must be either active or deleted",
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

postSchema.index({ userId: 1, status: 1, createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
