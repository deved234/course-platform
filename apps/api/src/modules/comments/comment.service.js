const mongoose = require("mongoose");
const Comment = require("./comment.model");
const Lesson = require("../lessons/lesson.model");
const Course = require("../courses/course.model");
const Enrollment = require("../enrollments/enrollment.model");
const AppError = require("../../utils/AppError");

const getCommentById = async (commentId) => {
  if (!mongoose.isValidObjectId(commentId)) {
    throw new AppError("Invalid comment id", 400);
  }

  const comment = await Comment.findById(commentId)
    .populate("student", "name email role")
    .populate("lesson", "title course");

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  return comment;
};

const createComment = async (lessonId, studentId, content) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }

  const enrollment = await Enrollment.findOne({
    course: lesson.course,
    student: studentId,
  });

  if (!enrollment) {
    throw new AppError("You must enroll before commenting on lessons", 403);
  }

  return Comment.create({
    lesson: lessonId,
    student: studentId,
    content,
  });
};

const listCommentsByLesson = async (lessonId, query) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }

  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Comment.find({ lesson: lessonId })
      .populate("student", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments({ lesson: lessonId }),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateComment = async (commentId, user, content) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.student.toString() !== user._id.toString()) {
    throw new AppError("You can only update your own comments", 403);
  }

  comment.content = content;
  await comment.save();

  return comment.populate("student", "name email role");
};

const deleteComment = async (commentId, user) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  const isCommentOwner = comment.student.toString() === user._id.toString();

  if (!isCommentOwner) {
    if (user.role !== "instructor") {
      throw new AppError("You do not have permission to delete this comment", 403);
    }

    const lesson = await Lesson.findById(comment.lesson);
    if (!lesson) {
      throw new AppError("Lesson not found", 404);
    }

    const course = await Course.findById(lesson.course);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    if (course.instructor.toString() !== user._id.toString()) {
      throw new AppError("You can only delete comments from your courses", 403);
    }
  }

  await comment.deleteOne();
};

module.exports = {
  getCommentById,
  createComment,
  listCommentsByLesson,
  updateComment,
  deleteComment,
};
