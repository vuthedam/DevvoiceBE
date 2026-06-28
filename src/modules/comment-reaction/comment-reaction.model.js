import mongoose, { Schema } from "mongoose";
import { COMMENT_REACTION_TYPE } from "../../common/constants/enums.js";

const commentReactionSchema = new Schema(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: [true, "Comment ID is required"],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: Object.values(COMMENT_REACTION_TYPE),
        message: "Reaction type must be either like or dislike",
      },
      required: [true, "Reaction type is required"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

commentReactionSchema.index({ commentId: 1, userId: 1 }, { unique: true });
commentReactionSchema.index({ userId: 1, createdAt: -1 });

export const CommentReaction = mongoose.model(
  "CommentReaction",
  commentReactionSchema
);
