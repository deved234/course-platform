const mongoose = require("mongoose");
const Course = require("../courses/course.model");
const Comment = require("../comments/comment.model");
const Lesson = require("./lesson.model");
const AppError = require("../../utils/AppError");

const getLessonById = async (lessonId) => {
  if (!mongoose.isValidObjectId(lessonId)) {
    throw new AppError("Invalid lesson id", 400);
  }

  const lesson = await Lesson.findById(lessonId).populate("course", "title instructor");
  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }

  return lesson;
};

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

const updateLesson = async (lessonId, payload, instructorId) => {
  const lesson = await Lesson.findById(lessonId).populate("course");
  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }

  if (lesson.course.instructor.toString() !== instructorId.toString()) {
    throw new AppError("You can only update lessons in your courses", 403);
  }

  Object.assign(lesson, payload);
  await lesson.save();

  return lesson;
};

const deleteLesson = async (lessonId, instructorId) => {
  const lesson = await Lesson.findById(lessonId).populate("course");
  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }

  if (lesson.course.instructor.toString() !== instructorId.toString()) {
    throw new AppError("You can only delete lessons in your courses", 403);
  }

  await Comment.deleteMany({ lesson: lesson._id });
  await lesson.deleteOne();
};

module.exports = {
  getLessonById,
  createLesson,
  listLessonsByCourse,
  updateLesson,
  deleteLesson,
};
