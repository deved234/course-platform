const Course = require("../courses/course.model");
const Lesson = require("./lesson.model");
const AppError = require("../../utils/AppError");

const createLesson = async (courseId, payload, instructorId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (course.instructor.toString() !== instructorId.toString()) {
    throw new AppError("You can only add lessons to your courses", 403);
  }

  const lesson = await Lesson.create({
    ...payload,
    course: courseId,
  });

  return lesson;
};

const listLessonsByCourse = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return Lesson.find({ course: courseId }).sort({ order: 1, createdAt: 1 });
};

module.exports = {
  createLesson,
  listLessonsByCourse,
};
