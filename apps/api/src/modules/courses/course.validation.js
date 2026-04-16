const { z } = require("zod");

const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150),
    description: z.string().min(10).max(2000),
    category: z.string().min(2).max(100),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

const rateCourseSchema = z.object({
  body: z.object({
    rating: z.coerce.number().min(1).max(5),
  }),
  params: z.object({
    courseId: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

const listCoursesSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    instructor: z.string().trim().optional(),
    sortBy: z.enum(["newest", "oldest", "rating"]).default("newest"),
  }),
});

module.exports = {
  createCourseSchema,
  rateCourseSchema,
  listCoursesSchema,
};
