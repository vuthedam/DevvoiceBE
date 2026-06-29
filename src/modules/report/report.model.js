import mongoose, { Schema } from "mongoose";
import { REPORT_STATUS, REPORT_REASON } from "../../common/constants/enums.js";

const reportSchema = new Schema(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reporter ID is required"],
      index: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    reason: {
      type: String,
      enum: { values: Object.values(REPORT_REASON), message: "Invalid reason" },
      required: [true, "Reason is required"],
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(REPORT_STATUS),
        message: "Status must be pending, resolved or rejected",
      },
      default: REPORT_STATUS.PENDING,
      index: true,
    },
    handledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

// Chặn 1 user report cùng 1 post hoặc comment 2 lần
reportSchema.index(
  { reporterId: 1, postId: 1 },
  { unique: true, partialFilterExpression: { postId: { $ne: null } } }
);
reportSchema.index(
  { reporterId: 1, commentId: 1 },
  { unique: true, partialFilterExpression: { commentId: { $ne: null } } }
);
reportSchema.index({ status: 1, createdAt: -1 });

export const Report = mongoose.model("Report", reportSchema);
