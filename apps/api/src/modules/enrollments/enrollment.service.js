const mongoose = require("mongoose");
const Course = require("../courses/course.model");
const Enrollment = require("./enrollment.model");
const Lesson = require("../lessons/lesson.model");
const AppError = require("../../utils/AppError");

const buildEnrollmentProgress = (enrollment, lessons) => {
  const totalLessons = lessons.length;
  const completedLessonIds = (enrollment.completedLessons || []).map((lessonId) =>
    String(lessonId)
  );
  const completedLessonsCount = completedLessonIds.filter((lessonId) =>
    lessons.some((lesson) => String(lesson._id) === lessonId)
  ).length;
  const progressPercent =
    totalLessons > 0
      ? Number(((completedLessonsCount / totalLessons) * 100).toFixed(2))
      : 0;

  return {
    completedLessonIds,
    completedLessonsCount,
    totalLessons,
    progressPercent,
  };
};

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
    completedLessons: [],
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

const getMyCourseEnrollment = async (courseId, studentId) => {
  if (!mongoose.isValidObjectId(courseId)) {
    throw new AppError("Invalid course id", 400);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const enrollment = await Enrollment.findOne({
    course: courseId,
    student: studentId,
  });

  if (!enrollment) {
    return {
      isEnrolled: false,
      enrollment: null,
    };
  }

  const lessons = await Lesson.find({ course: courseId }).select("_id").lean();
  const progress = buildEnrollmentProgress(enrollment, lessons);

  if (enrollment.progressPercent !== progress.progressPercent) {
    enrollment.progressPercent = progress.progressPercent;
    await enrollment.save();
  }

  return {
    isEnrolled: true,
    enrollment: {
      ...enrollment.toObject(),
      ...progress,
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

const updateLessonCompletion = async (courseId, lessonId, studentId, completed) => {
  if (!mongoose.isValidObjectId(courseId)) {
    throw new AppError("Invalid course id", 400);
  }

  if (!mongoose.isValidObjectId(lessonId)) {
    throw new AppError("Invalid lesson id", 400);
  }

  const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
  if (!lesson) {
    throw new AppError("Lesson not found in this course", 404);
  }

  const enrollment = await Enrollment.findOne({
    course: courseId,
    student: studentId,
  });

  if (!enrollment) {
    throw new AppError("You are not enrolled in this course", 404);
  }

  const lessonIdString = String(lesson._id);
  const completedLessonsSet = new Set(
    (enrollment.completedLessons || []).map((id) => String(id))
  );

  if (completed) {
    completedLessonsSet.add(lessonIdString);
  } else {
    completedLessonsSet.delete(lessonIdString);
  }

  enrollment.completedLessons = Array.from(completedLessonsSet);

  const lessons = await Lesson.find({ course: courseId }).select("_id").lean();
  const progress = buildEnrollmentProgress(enrollment, lessons);
  enrollment.progressPercent = progress.progressPercent;
  await enrollment.save();

  return {
    ...enrollment.toObject(),
    ...progress,
  };
};

module.exports = {
  enrollInCourse,
  listMyEnrollments,
  updateProgress,
  getMyCourseEnrollment,
  updateLessonCompletion,
};
