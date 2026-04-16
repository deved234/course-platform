const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const protect = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");
const controller = require("./lesson.controller");
const { createLessonSchema, listLessonsSchema } = require("./lesson.validation");

const router = express.Router();

router.get(
  "/courses/:courseId/lessons",
  validate(listLessonsSchema),
  controller.listLessonsByCourse
);
router.post(
  "/courses/:courseId/lessons",
  protect,
  restrictTo("instructor"),
  validate(createLessonSchema),
  controller.createLesson
);

module.exports = router;
