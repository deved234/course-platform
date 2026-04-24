const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const protect = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");
const controller = require("./course.controller");
const {
  createCourseSchema,
  updateCourseSchema,
  deleteCourseSchema,
  getCourseSchema,
  rateCourseSchema,
  listCoursesSchema,
} = require("./course.validation");

const router = express.Router();

router.get("/", validate(listCoursesSchema), controller.listCourses);
router.get("/:courseId", validate(getCourseSchema), controller.getCourse);
router.post(
  "/",
  protect,
  restrictTo("instructor"),
  validate(createCourseSchema),
  controller.createCourse
);
router.patch(
  "/:courseId",
  protect,
  restrictTo("instructor"),
  validate(updateCourseSchema),
  controller.updateCourse
);
router.delete(
  "/:courseId",
  protect,
  restrictTo("instructor"),
  validate(deleteCourseSchema),
  controller.deleteCourse
);
router.post(
  "/:courseId/rating",
  protect,
  restrictTo("student"),
  validate(rateCourseSchema),
  controller.rateCourse
);

module.exports = router;
