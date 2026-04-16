const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const protect = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");
const controller = require("./enrollment.controller");
const {
  enrollInCourseSchema,
  listMyEnrollmentsSchema,
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
router.patch(
  "/courses/:courseId/progress",
  protect,
  restrictTo("student"),
  validate(updateProgressSchema),
  controller.updateProgress
);

module.exports = router;
