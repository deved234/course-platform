const { z } = require("zod");

const createCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1).max(1000),
  }),
  params: z.object({
    lessonId: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

const getCommentSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    commentId: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1).max(1000),
  }),
  params: z.object({
    commentId: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

const deleteCommentSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    commentId: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

const listCommentsSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    lessonId: z.string().trim().min(1),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});

module.exports = {
  createCommentSchema,
  getCommentSchema,
  updateCommentSchema,
  deleteCommentSchema,
  listCommentsSchema,
};
