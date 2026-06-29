import z from "zod";
import { objectIdSchema } from "../../common/utils/zodHelpers.js";
import { CONTENT_STATUS } from "../../common/constants/enums.js";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required").max(10000),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).max(10000).optional(),
  status: z.enum([CONTENT_STATUS.ACTIVE, CONTENT_STATUS.HIDDEN, CONTENT_STATUS.DELETED]).optional(),
});
