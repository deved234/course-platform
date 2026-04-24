const Comment = require("../comments/comment.model");
const Course = require("../courses/course.model");
const Enrollment = require("../enrollments/enrollment.model");
const Lesson = require("../lessons/lesson.model");

const getInstructorDashboard = async (instructorId) => {
  const courses = await Course.find({ instructor: instructorId })
    .sort({ createdAt: -1 })
    .populate("instructor", "name email role")
    .lean();

  const courseIds = courses.map((course) => course._id);
  const lessons = courseIds.length
    ? await Lesson.find({ course: { $in: courseIds } }).select("_id course").lean()
    : [];
  const lessonIds = lessons.map((lesson) => lesson._id);
  const enrollments = courseIds.length
    ? await Enrollment.find({ course: { $in: courseIds } })
        .select("course student progressPercent completedLessons")
        .lean()
    : [];
  const comments = lessonIds.length
    ? await Comment.find({ lesson: { $in: lessonIds } }).select("_id lesson").lean()
    : [];

  const lessonCountByCourse = new Map();
  lessons.forEach((lesson) => {
    const key = String(lesson.course);
    lessonCountByCourse.set(key, (lessonCountByCourse.get(key) || 0) + 1);
  });

  const enrollmentCountByCourse = new Map();
  const avgStudentProgressByCourse = new Map();
  enrollments.forEach((enrollment) => {
    const key = String(enrollment.course);
    enrollmentCountByCourse.set(key, (enrollmentCountByCourse.get(key) || 0) + 1);

    const current = avgStudentProgressByCourse.get(key) || {
      total: 0,
      count: 0,
    };
    current.total += enrollment.progressPercent || 0;
    current.count += 1;
    avgStudentProgressByCourse.set(key, current);
  });

  const lessonCourseMap = new Map();
  lessons.forEach((lesson) => {
    lessonCourseMap.set(String(lesson._id), String(lesson.course));
  });

  const commentCountByCourse = new Map();
  comments.forEach((comment) => {
    const courseKey = lessonCourseMap.get(String(comment.lesson));
    if (!courseKey) return;
    commentCountByCourse.set(courseKey, (commentCountByCourse.get(courseKey) || 0) + 1);
  });

  const items = courses.map((course) => {
    const courseKey = String(course._id);
    const lessonCount = lessonCountByCourse.get(courseKey) || 0;
    const enrollmentCount = enrollmentCountByCourse.get(courseKey) || 0;
    const commentCount = commentCountByCourse.get(courseKey) || 0;
    const progressMeta = avgStudentProgressByCourse.get(courseKey) || {
      total: 0,
      count: 0,
    };

    return {
      ...course,
      lessonCount,
      enrollmentCount,
      commentCount,
      averageStudentProgress:
        progressMeta.count > 0
          ? Number((progressMeta.total / progressMeta.count).toFixed(2))
          : 0,
    };
  });

  const totalCourses = items.length;
  const totalLessons = lessons.length;
  const totalEnrollments = enrollments.length;
  const totalComments = comments.length;
  const averageCourseRating =
    totalCourses > 0
      ? Number(
          (
            items.reduce((sum, item) => sum + (item.averageRating || 0), 0) / totalCourses
          ).toFixed(2)
        )
      : 0;

  return {
    summary: {
      totalCourses,
      totalLessons,
      totalEnrollments,
      totalComments,
      averageCourseRating,
    },
    items,
  };
};

module.exports = {
  getInstructorDashboard,
};
