const Course = require("../courses/course.model");
const Enrollment = require("./enrollment.model");
const AppError = require("../../utils/AppError");

const enrollInCourse = async (courseId, studentId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const enrollment = await Enrollment.findOne({ course: courseId, student: studentId });
  if (enrollment) {
    throw new AppError("You are already enrolled in this course", 409);
  }

  return Enrollment.create({
    course: courseId,
    student: studentId,
  });
};

const listMyEnrollments = async (studentId, query) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name email role" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Enrollment.countDocuments({ student: studentId }),
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

const updateProgress = async (courseId, studentId, progressPercent) => {
  const enrollment = await Enrollment.findOne({
    course: courseId,
    student: studentId,
  });

  if (!enrollment) {
    throw new AppError("You are not enrolled in this course", 404);
  }

  enrollment.progressPercent = progressPercent;
  await enrollment.save();

  return enrollment;
};

module.exports = {
  enrollInCourse,
  listMyEnrollments,
  updateProgress,
};
