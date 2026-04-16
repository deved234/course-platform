const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const protect = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");
const controller = require("./comment.controller");
const { createCommentSchema, listCommentsSchema } = require("./comment.validation");

const router = express.Router();

router.get(
  "/lessons/:lessonId/comments",
  validate(listCommentsSchema),
  controller.listCommentsByLesson
);
router.post(
  "/lessons/:lessonId/comments",
  protect,
  restrictTo("student"),
  validate(createCommentSchema),
  controller.createComment
);

module.exports = router;
