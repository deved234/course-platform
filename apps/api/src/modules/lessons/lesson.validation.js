const { z } = require("zod");

const createLessonSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150),
    content: z.string().min(10),
    order: z.coerce.number().int().min(1),
  }),
  params: z.object({
    courseId: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

const listLessonsSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    courseId: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

module.exports = {
  createLessonSchema,
  listLessonsSchema,
};
