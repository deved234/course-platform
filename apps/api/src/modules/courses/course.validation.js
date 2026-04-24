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

const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150).optional(),
    description: z.string().min(10).max(2000).optional(),
    category: z.string().min(2).max(100).optional(),
  }).refine(
    (body) =>
      body.title !== undefined ||
      body.description !== undefined ||
      body.category !== undefined,
    {
      message: "At least one field is required to update the course",
    }
  ),
  params: z.object({
    courseId: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

const deleteCourseSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    courseId: z.string().trim().min(1),
  }),
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

const getCourseSchema = z.object({
  body: z.object({}).default({}),
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
  updateCourseSchema,
  deleteCourseSchema,
  getCourseSchema,
  rateCourseSchema,
  listCoursesSchema,
};
