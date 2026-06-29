import z from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required").max(10000),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).max(10000).optional(),
});

export const rejectPostSchema = z.object({
  rejectReason: z.string().min(1, "Reject reason is required").max(1000),
});

export const hidePostSchema = z.object({
  hiddenReason: z.string().max(500).optional().nullable(),
});
