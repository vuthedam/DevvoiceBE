import z from "zod";
import { objectIdSchema } from "../../common/utils/zodHelpers.js";
import { POST_REACTION_TYPE } from "../../common/constants/enums.js";

export const createPostReactionSchema = z.object({
  postId: objectIdSchema,
  userId: objectIdSchema,
  type: z.enum([POST_REACTION_TYPE.LIKE]).optional(),
});
