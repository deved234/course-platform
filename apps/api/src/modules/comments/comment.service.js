const Comment = require("./comment.model");
const Lesson = require("../lessons/lesson.model");
const Enrollment = require("../enrollments/enrollment.model");
const AppError = require("../../utils/AppError");

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

module.exports = {
  createComment,
  listCommentsByLesson,
};
