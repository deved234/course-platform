const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const protect = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");
const controller = require("./course.controller");
const {
  createCourseSchema,
  rateCourseSchema,
  listCoursesSchema,
} = require("./course.validation");

const router = express.Router();

router.get("/", validate(listCoursesSchema), controller.listCourses);
router.post(
  "/",
  protect,
  restrictTo("instructor"),
  validate(createCourseSchema),
  controller.createCourse
);
router.post(
  "/:courseId/rating",
  protect,
  restrictTo("student"),
  validate(rateCourseSchema),
  controller.rateCourse
);

module.exports = router;
