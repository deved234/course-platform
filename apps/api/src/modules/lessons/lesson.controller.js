const asyncHandler = require("../../utils/asyncHandler");
const lessonService = require("./lesson.service");

const getLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.getLessonById(req.params.lessonId);

  res.status(200).json({
    success: true,
    message: "Lesson fetched successfully",
    data: lesson,
  });
});

const createLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.createLesson(
    req.params.courseId,
    req.body,
    req.user._id
  );

  res.status(201).json({
    success: true,
    message: "Lesson created successfully",
    data: lesson,
  });
});

const listLessonsByCourse = asyncHandler(async (req, res) => {
  const lessons = await lessonService.listLessonsByCourse(req.params.courseId);

  res.status(200).json({
    success: true,
    message: "Lessons fetched successfully",
    data: lessons,
  });
});

const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.updateLesson(
    req.params.lessonId,
    req.body,
    req.user._id
  );

  res.status(200).json({
    success: true,
    message: "Lesson updated successfully",
    data: lesson,
  });
});

const deleteLesson = asyncHandler(async (req, res) => {
  await lessonService.deleteLesson(req.params.lessonId, req.user._id);

  res.status(200).json({
    success: true,
    message: "Lesson deleted successfully",
    data: null,
  });
});

module.exports = {
  getLesson,
  createLesson,
  listLessonsByCourse,
  updateLesson,
  deleteLesson,
};
