import z from "zod";
import { REPORT_REASON } from "../../common/constants/enums.js";

const reasonEnum = z.enum(
  /** @type {[string, ...string[]]} */ (Object.values(REPORT_REASON)),
  { errorMap: () => ({ message: "Invalid reason" }) }
);

const baseReportSchema = z.object({
  reason: reasonEnum,
  description: z.string().max(1000).optional().nullable(),
});

export const reportPostSchema = baseReportSchema;
export const reportCommentSchema = baseReportSchema;
