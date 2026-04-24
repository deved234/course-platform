const { z } = require("zod");

const getInstructorDashboardSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

module.exports = {
  getInstructorDashboardSchema,
};
