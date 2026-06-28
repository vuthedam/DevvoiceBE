import z from "zod";
import { objectIdSchema } from "../../common/utils/zodHelpers.js";
import { CONTENT_STATUS } from "../../common/constants/enums.js";

export const createCommentSchema = z.object({
  postId: objectIdSchema,
  userId: objectIdSchema,
  parentId: objectIdSchema.optional().nullable(),
  content: z.string().min(1, "Content is required").max(2000),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000).optional(),
  status: z.enum([CONTENT_STATUS.ACTIVE, CONTENT_STATUS.DELETED]).optional(),
});
