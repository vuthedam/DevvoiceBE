import z from "zod";
import { USER_ROLE, USER_STATUS } from "../../common/constants/enums.js";

export const createUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(255),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50)
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers and underscore"
    ),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.string().max(500).optional().nullable(),
  role: z.enum([USER_ROLE.ADMIN, USER_ROLE.USER]).optional(),
  status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.BANNED]).optional(),
});

export const updateUserSchema = z.object({
  fullName: z.string().min(2).max(255).optional(),
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9_]+$/)
    .optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  avatar: z.string().max(500).optional().nullable(),
  role: z.enum([USER_ROLE.ADMIN, USER_ROLE.USER]).optional(),
  status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.BANNED]).optional(),
});
