const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const protect = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");
const controller = require("./lesson.controller");
const {
  createLessonSchema,
  deleteLessonSchema,
  getLessonSchema,
  listLessonsSchema,
  updateLessonSchema,
} = require("./lesson.validation");

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
router.get("/lessons/:lessonId", validate(getLessonSchema), controller.getLesson);
router.patch(
  "/lessons/:lessonId",
  protect,
  restrictTo("instructor"),
  validate(updateLessonSchema),
  controller.updateLesson
);
router.delete(
  "/lessons/:lessonId",
  protect,
  restrictTo("instructor"),
  validate(deleteLessonSchema),
  controller.deleteLesson
);

module.exports = router;
