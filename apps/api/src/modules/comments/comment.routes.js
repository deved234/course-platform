const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const protect = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");
const controller = require("./comment.controller");
const {
  createCommentSchema,
  deleteCommentSchema,
  getCommentSchema,
  listCommentsSchema,
  updateCommentSchema,
} = require("./comment.validation");

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
router.get("/comments/:commentId", validate(getCommentSchema), controller.getComment);
router.patch(
  "/comments/:commentId",
  protect,
  restrictTo("student"),
  validate(updateCommentSchema),
  controller.updateComment
);
router.delete(
  "/comments/:commentId",
  protect,
  validate(deleteCommentSchema),
  controller.deleteComment
);

module.exports = router;
