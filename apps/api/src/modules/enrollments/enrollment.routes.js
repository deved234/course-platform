const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const protect = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");
const controller = require("./enrollment.controller");
const {
  enrollInCourseSchema,
  getMyCourseEnrollmentSchema,
  listMyEnrollmentsSchema,
  updateLessonCompletionSchema,
  updateProgressSchema,
} = require("./enrollment.validation");

const router = express.Router();

router.post(
  "/courses/:courseId/enroll",
  protect,
  restrictTo("student"),
  validate(enrollInCourseSchema),
  controller.enrollInCourse
);
router.get(
  "/enrollments/me",
  protect,
  restrictTo("student"),
  validate(listMyEnrollmentsSchema),
  controller.listMyEnrollments
);
router.get(
  "/courses/:courseId/enrollment",
  protect,
  restrictTo("student"),
  validate(getMyCourseEnrollmentSchema),
  controller.getMyCourseEnrollment
);
router.patch(
  "/courses/:courseId/progress",
  protect,
  restrictTo("student"),
  validate(updateProgressSchema),
  controller.updateProgress
);
router.patch(
  "/courses/:courseId/lessons/:lessonId/completion",
  protect,
  restrictTo("student"),
  validate(updateLessonCompletionSchema),
  controller.updateLessonCompletion
);

module.exports = router;
