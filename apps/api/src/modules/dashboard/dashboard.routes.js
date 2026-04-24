const express = require("express");
const protect = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const controller = require("./dashboard.controller");
const { getInstructorDashboardSchema } = require("./dashboard.validation");

const router = express.Router();

router.get(
  "/instructor/dashboard",
  protect,
  restrictTo("instructor"),
  validate(getInstructorDashboardSchema),
  controller.getInstructorDashboard
);

module.exports = router;
