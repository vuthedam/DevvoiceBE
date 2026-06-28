import z from "zod";
import { objectIdSchema } from "../../common/utils/zodHelpers.js";
import { COMMENT_REACTION_TYPE } from "../../common/constants/enums.js";

export const createCommentReactionSchema = z.object({
  commentId: objectIdSchema,
  userId: objectIdSchema,
  type: z.enum([COMMENT_REACTION_TYPE.LIKE, COMMENT_REACTION_TYPE.DISLIKE]),
});

export const updateCommentReactionSchema = z.object({
  type: z.enum([COMMENT_REACTION_TYPE.LIKE, COMMENT_REACTION_TYPE.DISLIKE]),
});
