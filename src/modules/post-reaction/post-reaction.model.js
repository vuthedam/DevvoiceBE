import mongoose, { Schema } from "mongoose";
import { POST_REACTION_TYPE } from "../../common/constants/enums.js";

const postReactionSchema = new Schema(
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
    type: {
      type: String,
      enum: {
        values: Object.values(POST_REACTION_TYPE),
        message: "Reaction type must be like",
      },
      default: POST_REACTION_TYPE.LIKE,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

postReactionSchema.index({ postId: 1, userId: 1 }, { unique: true });
postReactionSchema.index({ userId: 1, createdAt: -1 });

export const PostReaction = mongoose.model("PostReaction", postReactionSchema);
