const { z } = require("zod");

const enrollInCourseSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    courseId: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

const listMyEnrollmentsSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});

const updateProgressSchema = z.object({
  body: z.object({
    progressPercent: z.coerce.number().min(0).max(100),
  }),
  params: z.object({
    courseId: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

module.exports = {
  enrollInCourseSchema,
  listMyEnrollmentsSchema,
  updateProgressSchema,
};
