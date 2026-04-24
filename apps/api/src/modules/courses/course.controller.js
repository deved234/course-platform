const asyncHandler = require("../../utils/asyncHandler");
const courseService = require("./course.service");

const createCourse = asyncHandler(async (req, res) => {
  const createdCourse = await courseService.createCourse(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: createdCourse,
  });
});

const getCourse = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.courseId);

  res.status(200).json({
    success: true,
    message: "Course fetched successfully",
    data: course,
  });
});

const listCourses = asyncHandler(async (req, res) => {
  const data = await courseService.listCourses(req.query);

  res.status(200).json({
    success: true,
    message: "Courses fetched successfully",
    data,
  });
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(
    req.params.courseId,
    req.body,
    req.user._id
  );

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    data: course,
  });
});

const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.courseId, req.user._id);

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
    data: null,
  });
});

const rateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.rateCourse(
    req.params.courseId,
    req.user._id,
    req.body.rating
  );

  res.status(200).json({
    success: true,
    message: "Course rating updated successfully",
    data: course,
  });
});

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourse,
  listCourses,
  rateCourse,
};
