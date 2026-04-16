const asyncHandler = require("../../utils/asyncHandler");
const lessonService = require("./lesson.service");

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

module.exports = {
  createLesson,
  listLessonsByCourse,
};
