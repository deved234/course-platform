const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const courseRoutes = require("../modules/courses/course.routes");
const lessonRoutes = require("../modules/lessons/lesson.routes");
const enrollmentRoutes = require("../modules/enrollments/enrollment.routes");
const commentRoutes = require("../modules/comments/comment.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/", lessonRoutes);
router.use("/", enrollmentRoutes);
router.use("/", commentRoutes);

module.exports = router;
