const mongoose = require("mongoose");
const Course = require("./course.model");
const pickFields = require("../../utils/pickFields");
const AppError = require("../../utils/AppError");

const createCourse = async (payload, instructorId) => {
  return Course.create({
    ...payload,
    instructor: instructorId,
  });
};

const getCourseById = async (courseId) => {
  if (!mongoose.isValidObjectId(courseId)) {
    throw new AppError("Invalid course id", 400);
  }

  const course = await Course.findById(courseId).populate("instructor", "name email role");
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return course;
};

const listCourses = async (query) => {
  const filters = pickFields(query, ["category", "instructor"]);

  if (query.search) {
    filters.$text = { $search: query.search };
  }

  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  let sort = { createdAt: -1 };
  if (query.sortBy === "oldest") sort = { createdAt: 1 };
  if (query.sortBy === "rating") sort = { averageRating: -1, createdAt: -1 };

  const [items, total] = await Promise.all([
    Course.find(filters)
      .populate("instructor", "name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Course.countDocuments(filters),
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

const rateCourse = async (courseId, studentId, ratingValue) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const existingRatingIndex = course.ratings.findIndex(
    (entry) => entry.student.toString() === studentId.toString()
  );

  if (existingRatingIndex >= 0) {
    course.ratings[existingRatingIndex].rating = ratingValue;
  } else {
    course.ratings.push({
      student: studentId,
      rating: ratingValue,
    });
  }

  const totalRatings = course.ratings.reduce((sum, entry) => sum + entry.rating, 0);
  course.averageRating = Number((totalRatings / course.ratings.length).toFixed(2));

  await course.save();

  return course;
};

module.exports = {
  createCourse,
  getCourseById,
  listCourses,
  rateCourse,
};
