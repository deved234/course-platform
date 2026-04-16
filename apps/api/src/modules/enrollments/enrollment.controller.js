const asyncHandler = require("../../utils/asyncHandler");
const enrollmentService = require("./enrollment.service");

const enrollInCourse = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.enrollInCourse(
    req.params.courseId,
    req.user._id
  );

  res.status(201).json({
    success: true,
    message: "Enrolled in course successfully",
    data: enrollment,
  });
});

const listMyEnrollments = asyncHandler(async (req, res) => {
  const data = await enrollmentService.listMyEnrollments(req.user._id, req.query);

  res.status(200).json({
    success: true,
    message: "Enrollments fetched successfully",
    data,
  });
});

const updateProgress = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.updateProgress(
    req.params.courseId,
    req.user._id,
    req.body.progressPercent
  );

  res.status(200).json({
    success: true,
    message: "Progress updated successfully",
    data: enrollment,
  });
});

module.exports = {
  enrollInCourse,
  listMyEnrollments,
  updateProgress,
};
